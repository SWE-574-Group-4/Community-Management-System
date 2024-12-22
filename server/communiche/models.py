from django.utils import timezone
from django.db import models
from django.db.models import JSONField, Sum, Count, Max
from django.contrib.auth.hashers import check_password

from .constants import DATA_TYPES

# JSON representation of User model
"""
{
    "firstname": "string",  # Required
    "lastname": "string",  # Required
    "username": "string",  # Required
    "password": "string",  # Required
    "email": "string",
    "dob": "string",
    "country": "string",
    "phone": "string",
    "short_bio": "string"
}
"""
class Tag(models.Model):
    label = models.CharField(max_length=255, null=True)
    qid = models.CharField(max_length=50, unique=True, null=True)

    def __str__(self):
        return self.label

class User(models.Model):
    firstname = models.CharField(max_length=200)  # Required
    lastname = models.CharField(max_length=200)  # Required
    username = models.CharField(max_length=50)  # Required
    password = models.CharField(max_length=128)  # Required
    email = models.CharField(max_length=200, null=True)
    dob = models.DateTimeField(null=True)
    country = models.CharField(max_length=200, null=True)
    phone = models.CharField(max_length=20, null=True)
    short_bio = models.CharField(max_length=600, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def check_password(self, raw_password):
            """
            Checks if the provided raw password matches the hashed password stored in the model.

            Args:
                raw_password (str): The raw password to be checked.

            Returns:
                bool: True if the raw password matches the hashed password, False otherwise.
            """
            return check_password(raw_password, self.password)

class Community(models.Model):
    def save(self, *args, **kwargs):
        is_new = not self.pk  # Check if this is a new instance
        super().save(*args, **kwargs)  # Call the "real" save() method.

        if is_new:
            # Find the default template
            default_template = Template.objects.filter(name='Default Template').first()

            if default_template:
                # Link the community to the template
                TemplateCommunity.objects.create(
                    template=default_template,
                    community=self
                )
                
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=600)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False, null=True)
    reputation_rating = models.DecimalField(max_digits=10, decimal_places=1, default=0, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner', null=True)
    members = models.ManyToManyField(User, through='CommunityUser', related_name='communities')
    rules = models.CharField(max_length=1000, null=True)
    tags = models.ManyToManyField(Tag, related_name="communities", blank=True)

class CommunityUser(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.IntegerField(default=0)  # -1 for owner, 0 for user, 1 for moderator
    joined_at = models.DateTimeField(auto_now_add=True)

class Template(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=600)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    fields = JSONField(default=list)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='templates', null=True)

class TemplateCommunity(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)

class JoinRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=0)  # 0 for pending, 1 for accepted, -1 for rejected

class Invitation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(default=0)  # 0 for pending, 1 for accepted, -1 for rejected

class Posts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    content = models.CharField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name='post_likes')
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)

class PostComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    content = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)
    content = models.CharField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# General Badges for the platform

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    tier = models.CharField(max_length=20)
    criteria = models.JSONField()
    icon = models.ImageField(upload_to='badges/icons/', null=True, blank=True)  # Image field for badge icons

    def comment_criteria(self, user):
        user_comments = user.pcomment_set.count()
        
        return user_comments >= self.criteria.get("comments_count", 0)
    
    def get_comment_criteria(self, user):
        max_comments = user.posts_set.annotate(num_comments=Count('pcomment')).aggregate(max_comments=Max('num_comments'))['max_comments'] or 0

        return max_comments >= self.criteria.get("single_post_comments", 0)

    def post_criteria(self, user):
        user_posts = user.posts_set.count()
        
        return user_posts >= self.criteria.get("posts_count", 0)
    
    def get_like_criteria(self, posts_user):
        max_likes = posts_user.posts_set.annotate(num_likes=Count('likes')).aggregate(max_likes=Max('num_likes'))['max_likes'] or 0

        return max_likes >= self.criteria.get("single_post_likes", 0)

    def give_like_criteria(self, user):
        user_likes_given = user.post_likes.count()

        return user_likes_given >= self.criteria.get("likes_given", 0)
    
    def create_community_criteria(self, user):
        user_communities = user.communities.count()

        return user_communities >= self.criteria.get("communities_created", 0)

    def join_community_criteria(self, user):
        user_joined_communities = user.communityuser_set.count()

        return user_joined_communities >= self.criteria.get("communities_joined", 0)
    
    def duration_criteria(self, user):
        user_duration = (timezone.now() - user.created_at).total_seconds() / 60

        return user_duration >= self.criteria.get("membership_duration_days", 0)

class UserBadge(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(default=timezone.now)

    @classmethod
    def assign_badge(cls, user, badge):
        # Check if user already has this badge
        if not cls.objects.filter(user=user, badge=badge).exists():
            cls.objects.create(user=user, badge=badge)

# Community Specific Badges

class CommunityBadge(models.Model):
    name = models.CharField(max_length=100)
    community = models.ForeignKey(Community, on_delete=models.CASCADE)
    description = models.TextField()
    criteria = models.JSONField()
    background_color = models.CharField(max_length=20, null=True, blank=True)
    icon = models.CharField(max_length=50, null=True, blank=True)

    def comment_criteria(self, user):
        user_comments = PComment.objects.filter(
            post__community=self.community, post__user=user
        ).count()

        return user_comments >= self.criteria.get("comments_count", 0)
    
    def get_comment_criteria(self, user):
        max_comments = user.posts_set.filter(community=self.community).annotate(num_comments=Count('pcomment')).aggregate(max_comments=Max('num_comments'))['max_comments'] or 0

        return max_comments >= self.criteria.get("single_post_comments", 0)

    def post_criteria(self, user):
        user_posts = user.posts_set.filter(community=self.community).count()
        
        return user_posts >= self.criteria.get("posts_count", 0)
    
    def get_like_criteria(self, posts_user):
        max_likes = posts_user.posts_set.annotate(num_likes=Count('likes')).aggregate(max_likes=Max('num_likes'))['max_likes'] or 0

        return max_likes >= self.criteria.get("single_post_likes", 0)

    def give_like_criteria(self, user):
        user_likes_given = user.post_likes.filter(community=self.community).count()

        return user_likes_given >= self.criteria.get("likes_given", 0)
    
    def create_community_criteria(self, user):
        user_communities = user.communities.filter(id=self.community.id).count()

        return user_communities >= self.criteria.get("communities_created", 0)

    def join_community_criteria(self, user):
        user_joined_communities = user.communityuser_set.filter(community=self.community).count()

        return user_joined_communities >= self.criteria.get("communities_joined", 0)
    
    def duration_criteria(self, user):
        community_user = user.communityuser_set.filter(community=self.community).first()
        if community_user:
            user_duration = (timezone.now() - community_user.joined_at).total_seconds() / 60
            return user_duration >= self.criteria.get("membership_duration_days", 0)
        return False
    
class UserCommunityBadge(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    badge = models.ForeignKey(CommunityBadge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(default=timezone.now)

    @classmethod
    def assign_badge(cls, user, badge):
        # Check if user already has this badge
        if not cls.objects.filter(user=user, badge=badge).exists():
            cls.objects.create(user=user, badge=badge)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"
        
class Report(models.Model):
    REPORT_CHOICES = [
        ('SPAM', 'Spam'),
        ('INAPPROPRIATE', 'Inappropriate Content'),
        ('HARASSMENT', 'Harassment'),
        ('DUPLICATE', 'Duplicate Content'),
        ('MISLEADING', 'Misleading/Wrong Content'),
        ('OTHER', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(PComment, on_delete=models.CASCADE, null=True, blank=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=True, blank=True)
    reason = models.CharField(choices=REPORT_CHOICES, max_length=50)
    comment_text = models.CharField(max_length=250, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=0)  # 0 for pending, 1 for in review, 2 for resolved

    def __str__(self):
        return f"{self.reason} - {self.community} - {self.created_at}"
    
class UserFollowing(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"

class RelatedEntity(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="related_entities")
    related_label = models.CharField(max_length=255)  # Name of the related entity
    qid = models.CharField(max_length=50, null=True, blank=True)
    source = models.CharField(
        max_length=50,
        choices=[
            ('user_interest', 'User Interest'),
            ('post', 'Post')
        ],
        null=True,  # Allow null for backward compatibility
        blank=True
    )
    
class UserInterest(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='interests')
    tag = models.ForeignKey('Tag', on_delete=models.CASCADE, related_name='user_interests')

    class Meta:
        unique_together = ('user', 'tag')

    def __str__(self):
        return f"{self.user.username} - {self.tag.label}"