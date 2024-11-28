import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from communiche.models import (
    User,
    Community,
    CommunityUser,
    Posts,
    PComment,
    Template,
    Invitation,
    JoinRequest,
    TemplateCommunity,
    Report,
)
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.http import QueryDict
from datetime import datetime, timedelta
import json


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_user_list(api_client):
    # Create mock users
    User.objects.create(
        username="testuser1", firstname="Test", lastname="User", password="password123"
    )
    User.objects.create(
        username="testuser2",
        firstname="Another",
        lastname="User",
        password="password123",
    )

    # Call the API
    url = reverse("user_list")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    assert len(response.data) == 2  # Ensure both users are returned


@pytest.mark.django_db
def test_add_community(api_client):
    # Create a mock user
    user = User.objects.create(
        username="community_owner",
        firstname="Owner",
        lastname="User",
        password="password123",
    )

    # Payload for creating a community
    payload = {
        "name": "Test Community",
        "description": "A test community for unit testing.",
        "user_id": user.id,
        "templates": [],
    }

    # Call the API
    url = reverse("add_community")
    response = api_client.post(url, payload, format="json")

    # Assertions
    assert response.status_code == 201, f"Response: {response.data}"
    assert Community.objects.count() == 1
    assert Community.objects.first().owner == user


@pytest.mark.django_db
def test_join_community(api_client):
    # Create a mock user and community
    user = User.objects.create(
        username="testuser", firstname="Test", lastname="User", password="password123"
    )
    community = Community.objects.create(
        name="Public Community", description="A public community", is_public=True
    )

    # Call the API
    url = reverse(
        "join_community", kwargs={"community_id": community.id, "user_id": user.id}
    )
    response = api_client.post(url)

    # Assertions
    assert response.status_code == 200
    assert community.members.count() == 1
    assert CommunityUser.objects.filter(community=community, user=user).exists()


@pytest.mark.django_db
def test_signup(api_client):
    # Payload for signup
    payload = {
        "username": "newuser",
        "firstname": "New",
        "lastname": "User",
        "password": "securepassword",
        "email": "newuser@example.com",
    }

    # Call the signup endpoint
    url = "/signup/"
    response = api_client.post(url, payload, format="json")

    # Assertions
    assert response.status_code == 201
    assert response.data["username"] == payload["username"]
    assert User.objects.filter(username="newuser").exists()


from django.contrib.auth.hashers import make_password


@pytest.mark.django_db
def test_login(api_client):
    # Create a user for login
    user = User.objects.create(
        username="loginuser",
        firstname="Login",
        lastname="User",
        email="loginuser@example.com",
        password=make_password("securepassword"),
    )

    # Payload for valid login
    valid_payload = {
        "username": user.username,
        "password": "securepassword",
    }

    # Call the login endpoint with valid credentials
    url = "/login/"
    valid_response = api_client.post(url, valid_payload, format="json")

    # Assertions for valid credentials
    assert valid_response.status_code == 200
    assert "token" in valid_response.data
    assert valid_response.data["user"]["username"] == user.username

    # Payload for invalid login
    invalid_payload = {
        "username": user.username,
        "password": "wrongpassword",
    }

    # Call the login endpoint with invalid credentials
    invalid_response = api_client.post(url, invalid_payload, format="json")

    # Assertions for invalid credentials
    assert invalid_response.status_code == 400
    assert "error" in invalid_response.data
    assert "Invalid password" in invalid_response.data["error"]


@pytest.mark.django_db
def test_community_detail(api_client):
    # Create a user and a community
    user = User.objects.create(
        username="communitymember",
        firstname="Community",
        lastname="Member",
        password="password123",
    )
    community = Community.objects.create(
        name="Test Community",
        description="A test community for detail retrieval.",
        owner=user,
    )

    # Call the community detail endpoint
    url = reverse("community-detail", args=[community.id])
    response = api_client.get(url, format="json")

    # Assertions
    assert response.status_code == 200
    assert response.data["name"] == community.name
    assert response.data["description"] == community.description
    assert response.data["id"] == community.id


@pytest.mark.django_db
def test_user_detail(api_client):
    # Create a user
    user = User.objects.create(
        username="testuser",
        firstname="Test",
        lastname="User",
        password="password123",
    )

    # Create a community and link it to the user
    community = Community.objects.create(
        name="Test Community", description="A test community"
    )
    CommunityUser.objects.create(community=community, user=user)

    # Create a post linked to the user
    Posts.objects.create(user=user, community=community, content="Test Post")

    # Call the API
    url = reverse("user-detail", args=[user.id])
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["id"] == user.id
    assert response_data["communities"][0]["id"] == community.id
    assert response_data["posts"][0]["content"] == "Test Post"


@pytest.mark.django_db
def test_post_create(api_client):
    # Create a user and a community
    user = User.objects.create(
        username="testposter",
        firstname="Test",
        lastname="Poster",
        password="password123",
    )
    community = Community.objects.create(
        name="Test Community", description="A test community"
    )

    # Payload for creating a post
    payload = {
        "user_id": user.id,
        "community_id": community.id,
        "content": "This is a test post",
    }

    # Call the API
    url = reverse("post")
    response = api_client.post(url, payload, format="json")

    # Assertions
    assert response.status_code == 201
    assert Posts.objects.filter(user=user, community=community).exists()


@pytest.mark.django_db
def test_communities_list(api_client):
    # Create communities with specific updated_at timestamps
    Community.objects.create(
        name="Community A",
        description="Description A",
        updated_at="2024-01-01T12:00:00Z",
    )
    Community.objects.create(
        name="Community B",
        description="Description B",
        updated_at="2024-01-02T12:00:00Z",
    )

    # Call the API
    url = reverse("communities")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    assert response_data[0]["name"] == "Community B"
    assert response_data[1]["name"] == "Community A"


@pytest.mark.django_db
def test_is_user_in_community(api_client):
    # Create a user and a community, and add the user to the community
    user = User.objects.create(
        username="member_user",
        firstname="Member",
        lastname="Test",
        password="password123",
    )
    community = Community.objects.create(
        name="Test Community",
        description="A community for checking membership.",
    )
    community.members.add(user)

    # Call the API directly using its path
    url = f"/is_user_in_community/{community.id}/{user.id}/"
    response = api_client.get(url)

    # Assertions
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["is_member"] is True

    # Call the API for a user not in the community
    non_member = User.objects.create(
        username="non_member_user",
        firstname="NonMember",
        lastname="Test",
        password="password123",
    )
    url = f"/is_user_in_community/{community.id}/{non_member.id}/"
    response = api_client.get(url)

    # Assertions for non-member
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["is_member"] is False


@pytest.mark.django_db
def test_template_detail(api_client):
    # Create a template
    user = User.objects.create(username="template_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )
    template = Template.objects.create(
        name="Test Template", description="Template for testing", community=community
    )

    # Test GET template detail
    url = reverse("template-detail", args=[template.id])
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["name"] == "Test Template"


@pytest.mark.django_db
def test_post_like(api_client):
    # Create a user and a post
    user = User.objects.create(username="like_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )
    post = Posts.objects.create(user=user, community=community, content="Sample Post")

    # Test liking a post
    url = reverse("like-post", args=[user.id, post.id])
    response = api_client.post(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Post liked"


@pytest.mark.django_db
def test_remove_comment(api_client):
    # Create a user, post, and comment
    user = User.objects.create(username="comment_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )
    post = Posts.objects.create(user=user, community=community, content="Sample Post")
    comment = PComment.objects.create(user=user, post=post, content="Sample Comment")

    # Test removing a comment
    url = reverse("remove-comment", args=[comment.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_post_detail(api_client):
    # Create a user and a post
    user = User.objects.create(username="post_detail_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )
    post = Posts.objects.create(
        user=user, community=community, content='{"text": "Sample Post"}'
    )

    # Test GET post detail
    url = reverse("post-detail", args=[post.id])
    response = api_client.post(url, {"user_id": user.id}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["content"]["text"] == "Sample Post"


@pytest.mark.django_db
def test_leave_community(api_client):
    # Create a user and a community
    user = User.objects.create(username="leave_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )
    community.members.add(user)

    # Test leaving a community
    url = reverse("leave_community", args=[community.id, user.id])
    response = api_client.post(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_user_role(api_client):
    # Create a user and a community
    user = User.objects.create(username="role_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )

    # Assign the user a role in the community
    community_user = community.communityuser_set.create(user=user, role=1)

    # Test user role endpoint
    url = reverse("user-role", args=[community.id])
    response = api_client.get(url, {"user_id": user.id})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["role"] == 1


@pytest.mark.django_db
def test_send_invitation(api_client):
    # Create a user and a community
    user = User.objects.create(username="invite_user", password="password123")
    community = Community.objects.create(
        name="Test Community", description="Community for testing"
    )

    # Test sending an invitation
    url = reverse("send_invitation", args=[community.id, user.id])
    response = api_client.post(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_community_posts(api_client):
    # Create mock community and user
    community = Community.objects.create(
        name="Community A", description="Sample description"
    )
    user = User.objects.create(
        username="testuser", firstname="Test", lastname="User", password="password123"
    )

    # Ensure the content field is valid JSON and set explicit updated_at timestamps
    Posts.objects.create(
        community=community,
        user=user,
        content=json.dumps("Post 1"),
        updated_at=datetime.now() - timedelta(days=1),  # Older post
    )
    Posts.objects.create(
        community=community,
        user=user,
        content=json.dumps("Post 2"),
        updated_at=datetime.now(),  # Newer post
    )

    # Make the GET request
    url = reverse("community-posts", kwargs={"community_id": community.id})
    response = api_client.get(url)

    # Assertions
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()

    # Check content and order
    assert len(response_data) == 2
    assert response_data[0]["content"] == "Post 2"  # Newest post first
    assert response_data[1]["content"] == "Post 1"  # Oldest post second
    assert (
        "community" not in response_data[0]
    )  # Ensure 'community' is not in the response


@pytest.mark.django_db
def test_community_templates(api_client):
    # Clear any existing TemplateCommunity entries to ensure no interference
    TemplateCommunity.objects.all().delete()

    # Create a community
    community = Community.objects.create(
        name="Community Templates", description="Community with templates"
    )

    # Create templates
    template_1 = Template.objects.create(
        name="Template 1", description="First template"
    )
    template_2 = Template.objects.create(
        name="Template 2", description="Second template"
    )

    # Link templates to the community via TemplateCommunity
    TemplateCommunity.objects.create(template=template_1, community=community)
    TemplateCommunity.objects.create(template=template_2, community=community)

    # API request to get templates of the community
    url = reverse("community-templates", kwargs={"community_id": community.id})
    response = api_client.get(url)

    # Assertions
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert (
        len(response_data) == 3
    )  # Expect exactly 3 templates linked to the community - (2 templates created + 1 default template)
    assert response_data[0]["template"]["name"] == "Default Template"
    assert response_data[1]["template"]["name"] == "Template 1"
    assert response_data[2]["template"]["name"] == "Template 2"


@pytest.mark.django_db
def test_join_requests(api_client):
    # Create a user and a community
    user = User.objects.create(
        username="joinuser", firstname="Join", lastname="User", password="password123"
    )
    community = Community.objects.create(
        name="Join Requests Community", description="Community for join requests"
    )

    # Create pending and accepted join requests
    JoinRequest.objects.create(user=user, community=community, status=0)  # Pending
    JoinRequest.objects.create(
        user=user, community=community, status=1, created_at=datetime.now()
    )  # Accepted

    # API request to get join requests
    url = reverse("join_requests", kwargs={"community_id": community.id})
    response = api_client.get(url)

    # Assertions
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == 2
    assert response_data[0]["status"] == 0  # Pending
    assert response_data[1]["status"] == 1  # Accepted


@pytest.mark.django_db
def test_advance_search(api_client):
    # Create test data
    user = User.objects.create(
        username="testuser", firstname="Test", lastname="User", password="testpassword"
    )
    community = Community.objects.create(
        name="Search Community", description="Test Community", owner=user
    )
    community.members.add(user)

    # Payload using QueryDict to mimic Django's request object behavior
    payload = QueryDict(mutable=True)
    payload.update(
        {
            "query": "Search",
            "searchType": "community",
            "dataTypes[]": ["Text"],
            "range[]": ["2024-01-01", "2024-12-31"],
        }
    )

    # Call the endpoint
    url = reverse("advance-search")
    response = api_client.post(
        url, data=payload, format="multipart"
    )  # Use multipart for QueryDict compatibility

    # Assertions
    assert response.status_code == 200
    assert response.data["search_type"] == "community"
    assert len(response.data["data"]) == 1
    assert response.data["data"][0]["name"] == "Search Community"


# @pytest.mark.django_db
# def test_default_template(api_client):
#     # Create default template
#     Template.objects.create(name="Default Template", description="Default template")

#     url = reverse("default_template")
#     response = api_client.get(url)

#     assert response.status_code == status.HTTP_200_OK
#     assert response.data["name"] == "Default Template"


@pytest.mark.django_db
def test_check_invitation(api_client):
    # Create community and user
    community = Community.objects.create(name="Invite Community")
    user = User.objects.create(username="invitee", password="password")

    # Create invitation
    Invitation.objects.create(community=community, user=user)

    # Use correct reverse name
    url = reverse(
        "chek_invitation",
        kwargs={
            "community_id": community.id,
            "user_id": user.id,
        },  ### THIS IS A TYPO IN URLS.PY
    )
    response = api_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data is True


@pytest.mark.django_db
def test_remove_post(api_client):
    # Create user, community, and post
    user = User.objects.create(username="postcreator", password="password")
    community = Community.objects.create(name="Post Community", owner=user)
    post = Posts.objects.create(
        content="Post to remove", user=user, community=community
    )

    # Payload for post removal
    payload = {"user_id": user.id}
    url = reverse("remove-post", kwargs={"post_id": post.id})
    response = api_client.delete(url, payload, format="json")

    assert response.status_code == status.HTTP_200_OK
    assert not Posts.objects.filter(id=post.id).exists()


@pytest.mark.django_db
def test_default_template(api_client):
    # Create the default template
    template = Template.objects.create(name="Default Template", description="Default")

    # Call the endpoint
    url = reverse("default_template")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    print(response.data)
    assert response.data["name"] == "Default Template"
    assert response.data["description"] == "Default template for all communities."


@pytest.mark.django_db
def test_post_comments(api_client):
    # Create test data
    user = User.objects.create(username="testuser", password="testpassword")
    community = Community.objects.create(
        name="Test Community", description="Testing", owner=user
    )
    post = Posts.objects.create(user=user, community=community, content="Test Post")
    PComment.objects.create(user=user, post=post, content="Comment 1")
    PComment.objects.create(user=user, post=post, content="Comment 2")

    # Call the endpoint
    url = reverse("comments", args=[post.id])
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["content"] == "Comment 2"
    assert response.data[1]["content"] == "Comment 1"


@pytest.mark.django_db
def test_like_post(api_client):
    # Create a mock user
    user = User.objects.create(
        username="testuser",
        firstname="Test",
        lastname="User",
        password="password123",
    )

    # Create a mock community
    community = Community.objects.create(
        name="Test Community",
        description="A community for testing.",
        owner=user,
    )

    # Create a post in the community
    post = Posts.objects.create(user=user, community=community, content="Sample Post")

    # Like the post
    url = reverse("like-post", args=[user.id, post.id])
    response = api_client.post(url)

    # Assertions
    assert response.status_code == 200
    assert response.data["message"] == "Post liked"
    assert post.likes.filter(id=user.id).exists()

    # Unlike the post
    response = api_client.post(url)

    # Assertions
    assert response.status_code == 200
    assert response.data["message"] == "Post unliked"
    assert not post.likes.filter(id=user.id).exists()


@pytest.mark.django_db
def test_invitations(api_client):
    # Create a user and associated invitations
    user = User.objects.create(username="testuser", password="password")
    community = Community.objects.create(name="Test Community", owner=user)
    Invitation.objects.create(user=user, community=community)

    # Test the endpoint
    url = reverse("invitations", kwargs={"user_id": user.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["community"] == community.id


@pytest.mark.django_db
def test_logout(api_client):
    url = reverse("logout")
    response = api_client.post(url)

    assert response.status_code == 200


@pytest.mark.django_db
def test_community_members(api_client):
    owner = User.objects.create(username="owner", password="password")
    community = Community.objects.create(name="Community A", owner=owner)

    url = reverse("community-members", kwargs={"community_id": community.id})
    response = api_client.get(url)

    print(response.data)
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["username"] == "owner"


@pytest.mark.django_db
def test_community_non_members(api_client):
    owner = User.objects.create(username="owner", password="password")
    community = Community.objects.create(name="Community A", owner=owner)
    member = User.objects.create(username="member1", password="password")
    CommunityUser.objects.create(community=community, user=member)
    non_member = User.objects.create(username="non_member", password="password")

    url = reverse("community-members", kwargs={"community_id": community.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["username"] == "owner"
    assert response.data[1]["username"] == "non_member"


@pytest.mark.django_db
def test_change_user_role(api_client):
    owner = User.objects.create(username="owner", password="password")
    community = Community.objects.create(name="Community A", owner=owner)
    member = User.objects.create(username="member1", password="password")
    CommunityUser.objects.create(community=community, user=member, role=0)

    url = reverse(
        "change_user_role", kwargs={"community_id": community.id, "user_id": member.id}
    )
    response = api_client.post(url, {"role": 1}, format="json")

    assert response.status_code == 200
    community_user = CommunityUser.objects.get(user=member, community=community)
    assert community_user.role == 1


@pytest.mark.django_db
def test_delete_post(api_client):
    user = User.objects.create(username="post_creator", password="password")
    community = Community.objects.create(name="Community A", owner=user)
    post = Posts.objects.create(user=user, community=community, content="Test Post")

    url = reverse("delete-post", kwargs={"post_id": post.id})
    response = api_client.delete(url)

    assert response.status_code == 200
    assert not Posts.objects.filter(id=post.id).exists()


@pytest.mark.django_db
def test_edit_comment(api_client):
    user = User.objects.create(username="comment_creator", password="password")
    community = Community.objects.create(name="Community A", owner=user)
    post = Posts.objects.create(user=user, community=community, content="Test Post")
    comment = PComment.objects.create(user=user, post=post, content="Initial Comment")

    url = reverse("edit-comment", kwargs={"comment_id": comment.id})
    response = api_client.put(url, {"content": "Updated Comment"}, format="json")

    assert response.status_code == 200
    comment.refresh_from_db()
    assert comment.content == "Updated Comment"


@pytest.mark.django_db
def test_report_create(api_client):
    # Create required objects
    user = User.objects.create(
        username="reporter", firstname="John", lastname="Doe", password="password"
    )
    community_owner = User.objects.create(
        username="owner", firstname="Owner", lastname="Doe", password="password"
    )
    community = Community.objects.create(name="Community A", owner=community_owner)
    post = Posts.objects.create(
        user=community_owner, community=community, content="Reportable Content"
    )

    # Authenticate as the user creating the report
    api_client.force_authenticate(user=user)

    # API call to create a report
    url = reverse("report-create", kwargs={"community_id": community.id})
    payload = {
        "post_id": post.id,
        "reason": "SPAM",
        "comment_text": "This is spam",
        "user_id": user.id,
    }
    response = api_client.post(url, payload, format="json")

    # Assertions
    assert response.status_code == 201
    assert Report.objects.count() == 1
    report = Report.objects.first()
    assert report.reason == "SPAM"
    assert report.comment_text == "This is spam"
    assert report.post == post
    assert report.community == community
    assert report.user == user


@pytest.mark.django_db
def test_report_list(api_client):
    user = User.objects.create(username="reporter", password="password")
    community = Community.objects.create(name="Community A", owner=user)
    Report.objects.create(community=community, reason="SPAM", user=user)

    url = reverse("community-report-list", kwargs={"community_id": community.id})
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["reason"] == "SPAM"


@pytest.mark.django_db
def test_transfer_ownership(api_client):
    # Create mock users
    current_owner = User.objects.create(
        username="current_owner",
        firstname="Current",
        lastname="Owner",
        password="password123",
    )
    new_owner = User.objects.create(
        username="new_owner", firstname="New", lastname="Owner", password="password123"
    )

    # Create mock community
    community = Community.objects.create(
        name="Test Community", description="Test", owner=current_owner
    )

    # Create CommunityUser entries
    CommunityUser.objects.create(community=community, user=current_owner, role=-1)
    CommunityUser.objects.create(community=community, user=new_owner, role=0)

    # Call the API
    url = reverse(
        "transfer_ownership",
        kwargs={
            "community_id": community.id,
            "owner_id": current_owner.id,
            "new_owner_id": new_owner.id,
        },
    )
    response = api_client.post(url)

    # Assertions
    assert response.status_code == 200
    assert response.data["message"] == "Ownership transferred successfully."


@pytest.mark.django_db
def test_update_report_status(api_client):
    # Setup
    user = User.objects.create(
        username="reporter", firstname="John", lastname="Doe", password="password"
    )
    community = Community.objects.create(name="Test Community", owner=user)
    report = Report.objects.create(user=user, community=community, reason="SPAM")

    # API call
    url = reverse(
        "update-report-status",
        kwargs={"community_id": community.id, "report_id": report.id},
    )
    payload = {"status": 2}  # Resolved
    response = api_client.patch(url, payload, format="json")

    # Assertions
    assert response.status_code == 200
    report.refresh_from_db()
    assert report.status == 2


@pytest.mark.django_db
def test_report_delete(api_client):
    # Setup
    user = User.objects.create(
        username="reporter", firstname="John", lastname="Doe", password="password"
    )
    community = Community.objects.create(name="Test Community", owner=user)
    report = Report.objects.create(user=user, community=community, reason="SPAM")

    # API call
    url = reverse(
        "report-delete", kwargs={"community_id": community.id, "id": report.id}
    )
    response = api_client.delete(url)

    # Assertions
    assert response.status_code == 200
    assert not Report.objects.filter(id=report.id).exists()


@pytest.mark.django_db
def test_add_template(api_client):
    # Create a mock user
    user = User.objects.create(
        username="template_creator",
        firstname="Creator",
        lastname="User",
        password="password123",
    )

    # Create a mock community
    community = Community.objects.create(
        name="Template Community", description="Test", owner=user
    )

    # Payload for creating a template
    payload = {
        "name": "Test Template",
        "description": "A test template for unit testing.",
        "fields": [],
    }

    # Call the API
    url = reverse("community-add-template", kwargs={"community_id": community.id})
    response = api_client.post(url, payload, format="json")

    # Assertions
    print(response.data)
    assert response.status_code == 201
    assert response.data["template"]["name"] == "Test Template"  # Updated key access
    assert (
        response.data["template"]["description"] == "A test template for unit testing."
    )
    assert response.data["community"] == community.id


@pytest.mark.django_db
def test_accept_reject_join_request(api_client):
    # Create mock user and community
    user = User.objects.create(
        firstname="Test", lastname="User", username="testuser", password="password123"
    )
    community = Community.objects.create(
        name="Test Community", description="A test community", is_public=False
    )
    # Create a join request
    join_request = JoinRequest.objects.create(user=user, community=community, status=0)

    # Test payload to accept the join request
    payload = {"action": 1}  # 1 for accept, -1 for reject
    url = reverse("accept_join_request", kwargs={"request_id": join_request.id})

    # Make the API request
    response = api_client.post(url, payload, format="json")

    # Assertions for accepting
    assert response.status_code == 200
    join_request.refresh_from_db()
    assert join_request.status == 1  # Confirm the request status is updated
    assert CommunityUser.objects.filter(community=community, user=user).exists()

    # Test payload to reject the join request
    payload = {"action": -1}
    response = api_client.post(url, payload, format="json")

    # Assertions for rejecting
    assert response.status_code == 200
    join_request.refresh_from_db()
    assert join_request.status == -1  # Confirm the request status is updated


@pytest.mark.django_db
def test_accept_reject_invitation(api_client):
    # Create mock user and community
    user = User.objects.create(
        firstname="Test", lastname="User", username="testuser", password="password123"
    )
    community = Community.objects.create(
        name="Test Community", description="A test community"
    )

    # Create an invitation
    invitation = Invitation.objects.create(user=user, community=community, status=0)

    # Test payload to accept the invitation
    payload = {"action": 1}  # 1 for accept, -1 for reject
    url = reverse("accept_reject_invitation", kwargs={"invitation_id": invitation.id})

    # Make the API request
    response = api_client.post(url, payload, format="json")

    # Assertions for accepting
    assert response.status_code == 200
    invitation.refresh_from_db()
    assert invitation.status == 1  # Confirm the invitation status is updated
    assert CommunityUser.objects.filter(community=community, user=user).exists()

    # Test payload to reject the invitation
    payload = {"action": -1}
    response = api_client.post(url, payload, format="json")

    # Assertions for rejecting
    assert response.status_code == 200
    invitation.refresh_from_db()
    assert invitation.status == -1  # Confirm the invitation status is updated


@pytest.mark.django_db
def test_data_types(api_client):
    # Set up data in constants if needed
    from communiche import constants

    constants.DATA_TYPES = [
        ("STRING", "String"),
        ("NUMBER", "Number"),
        ("DATE", "Date"),
    ]

    # Call the API
    url = reverse("data_types")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    assert response.json() == ["String", "Number", "Date"]


@pytest.mark.django_db
def test_user_communities(api_client):
    # Create a mock user
    user = User.objects.create(
        username="community_user",
        firstname="Community",
        lastname="User",
        password="password123",
    )

    # Create mock communities and associate with the user
    community1 = Community.objects.create(
        name="Community A", description="Description A", owner=user
    )
    community2 = Community.objects.create(
        name="Community B", description="Description B", owner=user
    )
    CommunityUser.objects.create(community=community1, user=user, role=0)
    CommunityUser.objects.create(community=community2, user=user, role=0)

    # Make the request
    url = reverse("user_communities")
    response = api_client.get(url, {"user_id": user.id})

    # Assertions
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == 2
    assert response_data[0]["name"] == "Community A"
    assert response_data[1]["name"] == "Community B"


@pytest.mark.django_db
def test_templates(api_client):
    # Create mock templates
    template1 = Template.objects.create(name="Template A", description="Description A")
    template2 = Template.objects.create(name="Template B", description="Description B")

    # Make the request
    url = reverse("templates")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    response_data = response.json()
    # print(response_data)
    assert response_data[0]["name"] == "Default"
    assert response_data[1]["name"] == "Default Template"
    assert response_data[2]["name"] == "Template A"
    assert response_data[3]["name"] == "Template B"

    # TODO: This test is adjusted to current template data, shall be looked into later.


@pytest.mark.django_db
def test_posts(api_client):
    # Create a mock user
    user = User.objects.create(
        username="test_user", firstname="Test", lastname="User", password="password123"
    )

    # Create a mock community
    community = Community.objects.create(
        name="Test Community", description="A community for testing", owner=user
    )

    # Create multiple mock posts
    post1 = Posts.objects.create(
        user=user, community=community, content=json.dumps("First Post")
    )
    post2 = Posts.objects.create(
        user=user, community=community, content=json.dumps("Second Post")
    )

    # Call the API
    url = reverse("posts")
    response = api_client.get(url)

    # Assertions
    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["content"] == "Second Post"  # Latest post first
    assert response.data[1]["content"] == "First Post"
    assert response.data[0]["user"]["username"] == "test_user"
    assert response.data[0]["community"]["name"] == "Test Community"
