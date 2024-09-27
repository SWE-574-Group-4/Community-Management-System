import pytest
from django.test import TestCase, Client
from django.urls import reverse
from .serializers import CommunityUserSerializer, UserSerializer, TemplateSerializer
from .models import CommunityUser, User, Template, Community

class TestUserSerializer(TestCase):
    def setUp(self):
        self.user_attributes = {
            'firstname': 'Test',
            'lastname': 'User',
            'username': 'testuser',
            'email': 'testuser@test.com',
            'dob': '2000-01-01',
            'country': 'Test Country',
            'phone': '1234567890',
            'short_bio': 'This is a test user',
            'password': 'testpassword123'
        }

        self.user = User.objects.create(**self.user_attributes)
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'firstname', 'lastname', 'username', 'email', 'dob', 'country', 'phone', 'short_bio']))

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['firstname'], self.user_attributes['firstname'])
        self.assertEqual(data['lastname'], self.user_attributes['lastname'])
        self.assertEqual(data['username'], self.user_attributes['username'])
        self.assertEqual(data['email'], self.user_attributes['email'])
        self.assertEqual(data['dob'], self.user_attributes['dob'])
        self.assertEqual(data['country'], self.user_attributes['country'])
        self.assertEqual(data['phone'], self.user_attributes['phone'])
        self.assertEqual(data['short_bio'], self.user_attributes['short_bio'])

    def test_invalid_firstname(self):
        self.user_attributes['firstname'] = ''  # empty string is invalid
        serializer = UserSerializer(data=self.user_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('firstname', serializer.errors)

    def test_invalid_lastname(self):
        self.user_attributes['lastname'] = ''  # empty string is invalid
        serializer = UserSerializer(data=self.user_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('lastname', serializer.errors)

    def test_invalid_username(self):
        self.user_attributes['username'] = ''  # empty string is invalid
        serializer = UserSerializer(data=self.user_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

    def test_invalid_dob(self):
        self.user_attributes['dob'] = '2000-13-01'  # not a valid date
        serializer = UserSerializer(data=self.user_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('dob', serializer.errors)

class TestTemplateSerializer(TestCase):
    def setUp(self):
        self.community = Community.objects.create(name="Test Community")
        self.template_attributes = {
            'name': 'Test Template',
            'description': 'This is a test template',
            'fields': [],
            'community': self.community,
        }
        self.template = Template.objects.create(**self.template_attributes)

    def test_template_serializer(self):
        serializer = TemplateSerializer(instance=self.template)
        expected_data = {
            'id': self.template.id,
            'name': 'Test Template',
            'description': 'This is a test template',
            'created_at': self.template.created_at.isoformat().replace('+00:00', 'Z'),
            'updated_at': self.template.updated_at.isoformat().replace('+00:00', 'Z'),
            'fields': [],
        }
        self.assertEqual(serializer.data, expected_data)

    def test_template_serializer_invalid_name(self):
        self.template_attributes['name'] = ''  # empty string is invalid
        serializer = TemplateSerializer(data=self.template_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

    def test_template_serializer_invalid_description(self):
        self.template_attributes['description'] = ''  # empty string is invalid
        serializer = TemplateSerializer(data=self.template_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertIn('description', serializer.errors)

class UserListViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create(username='user1', password='password1')
        self.user2 = User.objects.create(username='user2', password='password2')

    def test_user_list(self):
        response = self.client.get(reverse('user_list'))
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, serializer.data)