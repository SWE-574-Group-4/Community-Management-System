from django.http import JsonResponse
from django.db.models import Q
from .models import Template, User, Posts
from .serializers import TemplateSerializer, UserSerializer, CommunitySerializer, JoinRequestSerializer, TemplateCommunitySerializer, PostSerializer, InvitationSerializer, CommentSerializer 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
import jwt
from datetime import datetime, timedelta
from .models import Community, JoinRequest, CommunityUser, Invitation, PComment
from django.http import JsonResponse
from . import constants
from datetime import datetime, timedelta
from .models import Community, TemplateCommunity
from django.utils import timezone

@api_view(['GET', 'POST'])
def user_list(request):
    # get all the users
    # serialize them
    # return json

    if request.method == 'GET':
        query = request.query_params.get('query', '')
        users = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query) | Q(firstname__icontains=query) | Q(lastname__icontains=query))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def user_detail(request, id):
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        user_data = serializer.data
        
        # Get the communities that the user is a member of
        community_users = CommunityUser.objects.filter(user=user)
        communities = [community_user.community for community_user in community_users]
        community_data = [{'id': community.id, 'name': community.name} for community in communities]
        user_data['communities'] = community_data
        
        # Get the posts that the user has posted
        posts = Posts.objects.filter(user=user).values('id', 'content')
        user_data['posts'] = list(posts)
        
        return Response(user_data)
    

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response('No content', status=status.HTTP_204_NO_CONTENT)
    
@api_view(['POST'])
def signup(request):
    data = request.data.copy()
    username = data.get('username')
    email = data.get('email')
    
    # Check if username or email is already registered
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already registered'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)
    
    data['password'] = make_password(data['password'])
    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    data = request.data.copy()
    username = data.get('username')
    password = data.get('password')
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(password):
        return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializer(user)
    # Exclude the password field from the serialized data
    serialized_data = serializer.data.copy()
    serialized_data.pop('password', None)
    
    # Generate JWT token
    token = jwt.encode({'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)}, 'secret_key')
    
    return Response({'token': token, 'user': serialized_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def logout(request):
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def communities(request):
    if request.method == 'GET':
        communities = Community.objects.all().order_by('-updated_at')
        serializer = CommunitySerializer(communities, context = {'request': request}, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def user_communities(request):
    
    user_id = request.query_params.get('user_id')
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Get all communities that the user is a member of
    community_users = CommunityUser.objects.filter(user=user)
    communities = [community_user.community for community_user in community_users]

    serializer = CommunitySerializer(communities, context={'request': request}, many=True)
    
    # Add number of posts under each community
    for community in serializer.data:
        number_of_posts = Posts.objects.filter(community=community['id']).count()
        community['number_of_posts'] = number_of_posts

    return Response(serializer.data)

@api_view(['POST'])
def add_community(request):
    if request.method == 'POST':
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            user_id = request.data.get('user_id')
            serializer.save(owner_id=user_id)
            
            # Add owner to communityuser table with role -1
            community = serializer.instance
            owner = User.objects.get(pk=user_id)
            community_user = CommunityUser.objects.create(community=community, user=owner, role=-1)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def transfer_ownership(request, community_id, owner_id, new_owner_id):
    if request.method == 'POST':
        # Get the community
        community = Community.objects.get(pk=community_id)

        # Check if the current user is the owner of the community
        current_owner = User.objects.get(pk=owner_id)

        # Get the new owner
        new_owner = User.objects.get(pk=new_owner_id)

        # Transfer ownership
        community.owner = new_owner
        community.save()

        # Check if the new owner is a member of the community
        if not CommunityUser.objects.filter(community=community, user=new_owner).exists():
            return Response("New owner is not a member of the community.", status=status.HTTP_400_BAD_REQUEST)

        # Update the role of the new owner to -1
        community_user = CommunityUser.objects.get(community=community, user=new_owner)
        community_user.role = -1

        # Update the role of the current owner to 0
        current_owner_community_user = CommunityUser.objects.get(community=community, user=current_owner)
        current_owner_community_user.role = 0

        return Response({"message": "Ownership transferred successfully."}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def community_detail(request, id):
    try:
        community = Community.objects.get(pk=id)
    except Community.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommunitySerializer(community)
        community_data = serializer.data
        user_id = request.query_params.get('user_id')

        if user_id:
            user = User.objects.get(pk=user_id)
            community_data['is_owner'] = str(community.owner_id) == str(user_id)
            community_data['has_user_requested'] = JoinRequest.objects.filter(community=community, user=user).exists()
            community_data['is_member'] = user in community.members.all()
        
        community_data['num_members'] = community.members.count()

        # community_data.pop('members', None)  # Remove the 'members' field
        return Response(community_data)
    

    elif request.method == 'PUT':
        serializer = CommunitySerializer(community, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        community.delete()
        return Response('Delete successfull', status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def templates(request):
    if request.method == 'GET':
        templates = Template.objects.all()
        serializer = TemplateSerializer(templates, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def add_template(request, community_id):
    if request.method == 'POST':
        serializer = TemplateSerializer(data=request.data)
        if serializer.is_valid():
            template = serializer.save()
            community = Community.objects.get(id=community_id)
            template_community = TemplateCommunity.objects.create(template=template, community=community)
            return Response(TemplateCommunitySerializer(template_community).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def default_template(request):
    if request.method == 'GET':
        default_template = Template.objects.filter(name='Default Template').first()
        if default_template:
            serializer = TemplateSerializer(default_template)
            return Response(serializer.data)
        else:
            return Response({"detail": "Default template not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def template_detail(request, id):
    try:
        template = Template.objects.get(pk=id)
    except Template.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TemplateSerializer(template)
        return Response(serializer.data)
    

    elif request.method == 'PUT':
        serializer = TemplateSerializer(template, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        serializer = TemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        template.delete()

@api_view(['GET'])
def data_types(request):
    data_types = constants.DATA_TYPES
    return JsonResponse([data_type[1] for data_type in data_types], safe=False)

@api_view(['POST'])
def join_community(request, community_id, user_id):
    try:
        community = Community.objects.get(pk=community_id)
        user = User.objects.get(pk=user_id)
    except (Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not community.is_public:
        # Check if join request already exists for the user and community
        join_request = JoinRequest.objects.filter(community=community, user=user).first()
        if join_request:
            return Response({'detail': 'Join request already exists for the user and community'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Register join request
        join_request = JoinRequest(community=community, user=user)
        join_request.save()
        return Response(status=status.HTTP_200_OK)
    else:
        community.members.add(user)
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def leave_community(request, community_id, user_id):
    try:
        community = Community.objects.get(pk=community_id)
        user = User.objects.get(pk=user_id)
    except (Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    if user in community.members.all():
        community.members.remove(user)

        invitation = Invitation.objects.filter(community=community, user=user).first()
        if invitation:
            invitation.delete()

        return Response(status=status.HTTP_200_OK)
    
    join_request = JoinRequest.objects.filter(community=community, user=user).first()
    if join_request:
        join_request.delete()
        return Response(status=status.HTTP_200_OK)
    
    return Response({'detail': 'User is not a member of the community'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def is_user_in_community(request, community_id, user_id):
    try:
        user = User.objects.get(id=user_id)
        community = Community.objects.get(id=community_id)

        if user in community.members.all():
            return JsonResponse({'is_member': True})
        else:
            return JsonResponse({'is_member': False})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Community.DoesNotExist:
        return JsonResponse({'error': 'Community not found'}, status=404)

@api_view(['GET'])
def user_role(request, community_id):
    try:
        user_id = request.query_params.get('user_id')
        community = Community.objects.get(pk=community_id)
        user = User.objects.get(pk=user_id)
    except (Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    community_user = community.communityuser_set.filter(user=user).first()
    if community_user:
        return JsonResponse({'role': community_user.role})
    return JsonResponse({'role': 0})

@api_view(['POST'])
def change_user_role(request, community_id, user_id):
    try:
        community = Community.objects.get(pk=community_id)
        user = User.objects.get(pk=user_id)
    except (Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    role = request.data.get('role')
    community_user = community.communityuser_set.filter(user=user).first()
    if community_user:
        community_user.role = role
        community_user.save()
        return Response(status=status.HTTP_200_OK)
    return Response({'message': 'User is not a member of the community'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def community_members(request, community_id):
    community = Community.objects.get(pk=community_id)
    members = community.members.all()
    serializer = UserSerializer(members, many=True)
    
    # Add role information to each member
    for member in serializer.data:
        user_id = member['id']
        community_user = CommunityUser.objects.filter(user_id=user_id, community_id=community_id).first()
        if community_user:
            member['role'] = community_user.role
            member['joined_at'] = community_user.joined_at
        else:
            member['role'] = None
            member['joined_at'] = None
    
    return Response(serializer.data)

@api_view(['GET'])
def community_non_members(request, community_id):
    community = Community.objects.get(pk=community_id)
    members = community.members.all()

    query = request.query_params.get('query', '')

    # Get all users who are not members of the community and not invited
    non_members = User.objects.filter(~Q(id__in=members))
    non_members = non_members.filter(Q(username__icontains=query) | Q(email__icontains=query) | Q(firstname__icontains=query) | Q(lastname__icontains=query))
    serializer = UserSerializer(non_members, many=True)
    
    # Add is_invited field to each member
    for member in serializer.data:
        user_id = member['id']
        is_invited = Invitation.objects.filter(community=community, user_id=user_id).exists()
        member['is_invited'] = is_invited
    
    return Response(serializer.data)

    serializer = UserSerializer(non_members, many=True)

    return Response(serializer.data)

# TODO: Check this later 
@api_view(['GET'])
def join_requests(request, community_id):
    community = Community.objects.get(pk=community_id)
    
    # Get pending requests
    pending_requests = JoinRequest.objects.filter(community=community, status=0)
    pending_serializer = JoinRequestSerializer(pending_requests, many=True)
    
    # Get accepted or rejected requests that are less than 30 days old
    thirty_days_ago = datetime.now() - timedelta(days=30)
    accepted_or_rejected_requests = JoinRequest.objects.filter(community=community, status__in=[1, -1], created_at__gte=thirty_days_ago)
    accepted_or_rejected_serializer = JoinRequestSerializer(accepted_or_rejected_requests, many=True)
    
    combined_requests = pending_serializer.data + accepted_or_rejected_serializer.data
    return Response(combined_requests)

def auto_accept_old_requests():
    # Get the date a week ago
    one_week_ago = timezone.now() - timezone.timedelta(weeks=1)

    # Get pending requests that are older than a week
    old_requests = JoinRequest.objects.filter(status=0, created_at__lte=one_week_ago)

    # Loop through the old requests and accept them
    for join_request in old_requests:
        join_request.status = 1  # 1 is the status for accepted requests
        join_request.save()

        # Add the user to the community
        community = join_request.community
        community.members.add(join_request.user)

@api_view(['POST'])
def accept_reject_join_request(request, request_id):
    try:
        join_request = JoinRequest.objects.get(pk=request_id)
        community = join_request.community
        user = join_request.user
    except (JoinRequest.DoesNotExist, Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    action = int(request.data.get('action'))
    if action == 1:
        # Update join request status to accepted
        join_request.status = 1
        join_request.save()

        # Add user to communityuser table
        community_user = CommunityUser(user=user, community=community)
        community_user.save()

        return Response(status=status.HTTP_200_OK)
    elif action == -1:
        # Update join request status to rejected
        join_request.status = -1
        join_request.save()

        return Response(status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status

@api_view(['POST'])
def accept_reject_invitation(request, invitation_id):
    try:
        invitation = Invitation.objects.get(pk=invitation_id)
        community = invitation.community
        user = invitation.user
    except (Invitation.DoesNotExist, Community.DoesNotExist, User.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)

    action = int(request.data.get('action'))
    if action == 1:
        # Update invitation status to accepted
        invitation.status = 1
        invitation.save()

        # Add user to communityuser table
        community_user = CommunityUser(user=user, community=community)
        community_user.save()

        return Response(status=status.HTTP_200_OK)
    elif action == -1:
        # Update invitation status to rejected
        invitation.status = -1
        invitation.save()

        return Response(status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def community_templates(request, community_id):
    community = Community.objects.get(pk=community_id)
    templates = TemplateCommunity.objects.filter(community=community)
    serializer = TemplateCommunitySerializer(templates, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def post(request):
    data = request.data.copy()
    user_id = data.get('user_id')
    community_id = data.get('community_id')
    content = data.get('content')
    
    try:
        user = User.objects.get(pk=user_id)
        community = Community.objects.get(pk=community_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Community.DoesNotExist:
        return Response({'error': 'Community not found'}, status=status.HTTP_404_NOT_FOUND)
    
    post = Posts(user=user, community=community, content=content)
    post.save()
    
    # Update the community's updated_at field
    community.updated_at = datetime.now()
    community.save()
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def delete_post(request, post_id):
    try:
        post = Posts.objects.get(pk=post_id)
    except Posts.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    post.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def posts(request):
    posts = Posts.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def search(request):
    query = request.query_params.get('query', '')

    communities = Community.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
    posts = Posts.objects.filter(content__icontains=query)

    community_serializer = CommunitySerializer(communities, many=True)
    post_serializer = PostSerializer(posts, many=True)

    return Response({
        'communities': community_serializer.data,
        'posts': post_serializer.data,
    })

@api_view(['POST'])
def send_invitation(request, community_id, user_id):
    # Get community and user
    community = Community.objects.get(pk=community_id)
    user = User.objects.get(pk=user_id)

    # Create invitation
    invitation = Invitation(community=community, user=user)
    invitation.save()

    return Response(status=status.HTTP_200_OK)

from rest_framework import status

@api_view(['GET'])
def check_invitation(request, community_id, user_id):
    # Check if invitation exists for the user and community
    is_invited = Invitation.objects.filter(community_id=community_id, user_id=user_id).exists()

    return Response(is_invited, status=status.HTTP_200_OK)

@api_view(['GET'])
def invitations (request, user_id):
    # Get all invitations for the user
    invitations = Invitation.objects.filter(user_id=user_id)
    serializer = InvitationSerializer(invitations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def community_posts(request, community_id):
    community = Community.objects.get(pk=community_id)
    posts = Posts.objects.filter(community=community).order_by('-updated_at')
    serializer = PostSerializer(posts, many=True)
    data = serializer.data
    for post in data:
        post.pop('community', None)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
def post_detail(request, post_id):
    post = Posts.objects.get(pk=post_id)
    serializer = PostSerializer(post)
    data = serializer.data

    user = request.data.get('user_id')
    user = User.objects.get(pk=user) if user else None
    if user:
        data['is_liked'] = user in post.likes.all()
    else:
        data['is_liked'] = False
    # data.pop('community', None)
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
def like_post(request, user_id, post_id):
    post = Posts.objects.get(pk=post_id)
    user = User.objects.get(pk=user_id)
    if user in post.likes.all():
        post.likes.remove(user)
        return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
    else:
        post.likes.add(user)
        return Response({'message': 'Post liked'}, status=status.HTTP_200_OK)

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Posts, User, CommunityUser
from . import constants
from .models import Community
from .serializers import CommunitySerializer

@api_view(['DELETE'])
def remove_post(request, post_id):
    post = Posts.objects.get(pk=post_id)
    user_id = request.data.get('user_id')
    user = User.objects.get(pk=user_id)

    # Check if the user is the creator of the post
    if post.user == user:
        post.delete()
        return Response(status=status.HTTP_200_OK)

    # Check if the user is the owner or an admin of the community
    community = post.community
    community_user = community.communityuser_set.filter(user=user).first()
    if community_user and (community_user.role == -1 or community_user.role == 1):
        post.delete()
        return Response(status=status.HTTP_200_OK)

    return Response({'message': 'User is not authorized to delete this post'}, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def comment(request, post_id):
    post = Posts.objects.get(pk=post_id)
    user = User.objects.get(pk=request.data.get('user_id'))
    content = request.data.get('content')
    p_comment = PComment(user=user, post=post, content=content)
    p_comment.save()
    
    return Response(status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
def remove_comment(request, comment_id):
    comment = PComment.objects.get(pk=comment_id)
    comment.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['PUT'])
def edit_comment(request, comment_id):
    comment = PComment.objects.get(pk=comment_id)
    comment.content = request.data.get('content')
    comment.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def comments(request, post_id):
    post = Posts.objects.get(pk=post_id)
    comments = PComment.objects.filter(post=post).order_by('-created_at')
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def advance_search(request):
    search_type = 0
    query = request.data.get('query', '')
    data = request.data.copy()

    params = {
        'query': request.data.get('query', ''),
        'dataTypes': request.data.getlist('dataTypes[]'),
        'searchType': request.data.get('searchType', ''),
        'date_range': request.data.getlist('range[]')
    }

    fields = params['dataTypes']

    # Construct a Q object for each field
    q_objects = Q()
    for field in fields:
        q_objects |= Q(content__icontains=field)

    # Filter posts that contain any of the fields in their content
    date_range = params['date_range']
    start_date, end_date = date_range if len(date_range) == 2 else (None, None)
    # print(start_date, end_date)
    posts = Posts.objects.filter(q_objects, content__icontains=query)
    post_serializer = PostSerializer(posts, many=True)

    communities = Community.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
    community_serializer = CommunitySerializer(communities, many=True)

    users = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query) | Q(firstname__icontains=query) | Q(lastname__icontains=query))
    user_serializer = UserSerializer(users, many=True)

    if(params['searchType'] == 'community'):
        return Response({
            'search_type': 'community',
            'data': community_serializer.data,
            'total': len(community_serializer.data)
        })
    elif params['searchType'] == 'post':
        return Response({
            'search_type': 'post',
            'data': post_serializer.data,
            'total': len(post_serializer.data)
        })
    else:
        return Response({
            'search_type': 'user',
            'data': user_serializer.data,
            'total': len(user_serializer.data)
        })
