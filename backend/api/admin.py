from django.contrib import admin
from api.models import User, Profile, Post, Comment

# Register your models here.
    
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email']

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'full_name', 'verified']
    
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user', 'title', 'description', 'image', 'verified', 'created_at', 'updated_at']
    
@admin.register(Comment)
class CommentsAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'text']
    date_hierarchy = 'created_at'