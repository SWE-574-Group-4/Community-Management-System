import json
from rest_framework import serializers
from .models import Template, User, Community, JoinRequest, CommunityUser, TemplateCommunity, Posts, PComment, Invitation

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'firstname', 'lastname', 'username', 'email', 'dob', 'country', 'phone', 'short_bio', 'password']

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'fields']

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

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'is_public', 'reputation_rating', 'templates', 'members', 'is_member', 'has_user_requested', 'is_owner']

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

    class Meta:
        model = Posts
        fields = ['id', 'community', 'content', 'created_at', 'updated_at', 'user', 'likes']

    # def get_comments(self, obj):
    #     return PostCommentSerializer(obj.post_comments.all(), many=True).data

    def get_likes(self, obj):
        return obj.likes.count()

    def get_content(self, obj):
        try:
            return json.loads(obj.content)
        except json.JSONDecodeError:
            return None  # or return some default value

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = PComment
        fields = ['id', 'post', 'content', 'created_at', 'updated_at', 'user']