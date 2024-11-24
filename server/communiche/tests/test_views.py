import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from communiche.models import User, Community, CommunityUser, Posts
from django.contrib.auth.hashers import make_password


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

    # Debugging info
    print(f"Response data: {response.data}")  # Log the response data for debugging

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
