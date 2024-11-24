from django.utils import timezone
from django.db import models
from django.db.models import JSONField, Sum, Count
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
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

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

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    tier = models.CharField(max_length=20)
    criteria = models.JSONField()
    icon = models.ImageField(upload_to='badges/icons/', null=True, blank=True)  # Image field for badge icons

    def post_criteria(self, user):
        user_posts = user.posts_set.count()
        
        return user_posts >= self.criteria.get("posts", 0)
    
    def get_like_criteria(self, user):
        user_upvotes_received = sum(post.likes.count() for post in user.posts_set.all())

        return user_upvotes_received >= self.criteria.get("single_post_likes", 0)
        print(user_upvotes_received)

    def give_like_criteria(self, user):
        user_upvotes_given = user.post_likes.count()

        return user_upvotes_given >= self.criteria.get("likes_given", 0)
        print(user_upvotes_given)

class UserBadge(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
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
