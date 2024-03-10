import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils import timezone


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField()

    USERNAME_FIELD = 'email' # Authorization with email not with username
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.username
    
def post_image_path(instance, filename):
    base_filename, file_extension = os.path.splitext(filename)
    unique_id = str(instance.id) 
    new_filename = f'post_{unique_id}{file_extension}'
    return os.path.join('post_images', new_filename)
    
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length = 100)
    description = models.CharField(max_length = 2000)
    image = models.ImageField(upload_to=post_image_path, blank=True)
    likes = models.IntegerField(default=0, blank=True)
    count_comments = models.IntegerField(default=0, blank=True)
    verified = models.BooleanField(default=False, blank=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)
        
    def __str__(self):
        return self.title
    
class Comment(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(max_length = 400)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f'Comment by ${self.user.username} on {self.post.title}'
    

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')
    liked = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'post')
    
def user_directory_path(instance, filename):
    # Paste path for user images
    return f'user_images/{instance.user.username}/{filename}'
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=300)
    bio = models.CharField(max_length = 2000)
    image = models.ImageField(default='default.jpg', upload_to=user_directory_path)
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.full_name
    
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        
def save_user_profile(sender, instance, *args, **kwargs):
    instance.profile.save()
    
post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)
    

    