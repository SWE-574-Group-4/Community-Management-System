from asyncio import constants
import json
from rest_framework import serializers
from .models import Badge, Notification, Report, Template, User, Community, JoinRequest, CommunityUser, TemplateCommunity, Posts, PComment, Invitation, Tag, UserBadge, UserFollowing, CommunityBadge, UserCommunityBadge, UserInterest

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'label']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'username', 'email', 'dob', 'country', 'phone', 'short_bio', 'password']

class TemplateSerializer(serializers.ModelSerializer):
    community = serializers.SerializerMethodField()

    class Meta:
        model = Template
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'fields', 'community']

    def get_community(self, obj):
        template_community = TemplateCommunity.objects.filter(template=obj).first()
        return CommunitySerializer(template_community.community).data if template_community else None

class TemplateCommunitySerializer(serializers.ModelSerializer):
    template = TemplateSerializer()

    class Meta:
        model = TemplateCommunity
        fields = '__all__'  # This will include all fields in the model

class CommunitySerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    is_member = serializers.SerializerMethodField()
    has_user_requested = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    number_of_posts = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'rules', 'created_at', 'updated_at', 'is_public', 'reputation_rating', 'templates', 'members', 'is_member', 'has_user_requested', 'is_owner', 'number_of_posts', 'tags']

    def get_is_member(self, obj):
        user_id = self.context.get('request').query_params.get('user_id') if self.context.get('request') else None
        return obj.members.filter(id=user_id).exists()

    def get_has_user_requested(self, obj):
        user_id = self.context.get('request').query_params.get('user_id') if self.context.get('request') else None
        community_id = obj.id
        return obj.joinrequest_set.filter(user_id=user_id, community_id=community_id).exists()

    def get_is_owner(self, obj):
        user_id = self.context.get('request').query_params.get('user_id') if self.context.get('request') else None
        return str(obj.owner_id) == str(user_id)

    def get_number_of_posts(self, obj):
        return Posts.objects.filter(community=obj).count()
    
    def get_tags(self, obj):
        return [tag.label for tag in obj.tags.all()]
    

class CommunityUserSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CommunityUser
        fields = ['user', 'role']

class DataTypeSerializer(serializers.Serializer):
    data_types = serializers.SerializerMethodField()

    class Meta:
        fields = ['data_types']

    def get_data_types(self, obj):
        return [data_type for data_type in constants.DATA_TYPES]

class JoinRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    firstname = serializers.CharField(source='user.firstname')
    lastname = serializers.CharField(source='user.lastname')

    class Meta:
        model = JoinRequest
        fields = ['id', 'community', 'created_at', 'updated_at', 'status', 'username', 'firstname', 'lastname']

class InvitationSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name')

    class Meta:
        model = Invitation
        fields = ['id', 'community', 'community_name', 'created_at', 'updated_at', 'status']

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    community = CommunitySerializer()
    content = serializers.SerializerMethodField()
    # comments = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Posts
        fields = ['id', 'community', 'content', 'created_at', 'updated_at', 'user', 'likes', 'tags']

    # def get_comments(self, obj):
    #     return PostCommentSerializer(obj.post_comments.all(), many=True).data

    def get_likes(self, obj):
        return obj.likes.count()

    def get_content(self, obj):
        try:
            return json.loads(obj.content)
        except json.JSONDecodeError:
            return None  # or return some default value
    
    def get_tags(self, obj):
        return [tag.label for tag in obj.tags.all()]

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    community = serializers.SerializerMethodField()

    class Meta:
        model = PComment
        fields = ['id', 'post', 'content', 'created_at', 'updated_at', 'user', 'community']

    def get_community(self, obj):
        # Assuming the post has a foreign key to community
        community = obj.post.community
        return CommunitySerializer(community).data

class ReportSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    comment = CommentSerializer()
    post = PostSerializer()

    class Meta:
        model = Report
        fields = ['id', 'user', 'post', 'comment', 'community', 'reason', 'comment_text' ,'created_at', 'status']

    def get_comment(self, obj):
        if obj.comment:
            return CommentSerializer(obj.comment).data
        return None 
    def get_post(self, obj):
        if obj.post:
            return PostSerializer(obj.post).data
        return None
    def get_user(self, obj):
        if obj.user:
            return UserSerializer(obj.user).data
        return None

class UserFollowingSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source='follower.username')
    following = serializers.ReadOnlyField(source='following.username')
    follower_id = serializers.ReadOnlyField(source='follower.id')
    following_id = serializers.ReadOnlyField(source='following.id')

    class Meta:
        model = UserFollowing
        fields = ['id', 'follower', 'following', 'following_id', 'follower_id', 'created_at']
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'is_read', 'created_at']

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'tier']

class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBadge
        fields = ['id', 'earned_at', 'badge']

class UserBadgeDetailedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='badge.name')
    description = serializers.CharField(source='badge.description')
    tier = serializers.CharField(source='badge.tier')
    icon = serializers.ImageField(source='badge.icon')
    earned_at = serializers.DateTimeField()
    is_owned = serializers.SerializerMethodField()

    class Meta:
        model = UserBadge
        fields = ['name', 'description', 'tier', 'icon', 'earned_at', 'is_owned']

    def get_is_owned(self, obj):
        user_id = self.context.get('request').query_params.get('user_id') if self.context.get('request') else None
        return str(obj.user_id) == str(user_id)

class UserInterestSerializer(serializers.ModelSerializer):
    tag_label = serializers.CharField(source='tag.label', read_only=True)
    tag_qid = serializers.CharField(source='tag.qid', read_only=True)

    class Meta:
        model = UserInterest
        fields = ['id', 'user', 'tag', 'tag_label', 'tag_qid']
class CommunityBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityBadge
        fields = ['id', 'name', 'description', 'icon', 'background_color']

class UserCommunityBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCommunityBadge
        fields = ['id', 'earned_at', 'badge']

class UserCommunityBadgeDetailedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='communitybadge.name')
    description = serializers.CharField(source='communitybadge.description')
    icon = serializers.CharField(source='communitybadge.icon')
    background_color = serializers.CharField(source='communitybadge.background_color')
    earned_at = serializers.DateTimeField()
    is_owned = serializers.SerializerMethodField()

    class Meta:
        model = UserCommunityBadge
        fields = ['name', 'description', 'icon', 'background_color', 'earned_at', 'is_owned']

    def get_is_owned(self, obj):
        user_id = self.context.get('request').query_params.get('user_id') if self.context.get('request') else None
        return str(obj.user_id) == str(user_id)
