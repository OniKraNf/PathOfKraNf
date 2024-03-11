from django.http import JsonResponse
from rest_framework_simplejwt.tokens import Token
from api.models import User, Profile, Post, Comment

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

# for sending email and generate token
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .utils import TokenGenerator, generate_token
from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View

class PostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'user_id', 'username', 'count_comments', 'title', 'likes', 'description', 'image', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        
class ProfileSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(source='user.username', read_only = True)
    
    class Meta:
        model = Profile
        fields = ['id', 'username', 'full_name', 'bio', 'image', 'verified']
        
class CommentSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'user_id', 'post_id', 'text', 'created_at', 'username']

    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user) -> Token:
        token = super().get_token(user)
        
        groups = [group.name for group in user.groups.all()]    
        
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified
        token['is_active'] = user.is_active
        token['groups'] = groups
        
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, required = True, validators=[validate_password])
    password2 = serializers.CharField(write_only = True, required = True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields does not match"})
        
        return attrs
    
    def create(self, validated_data):
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_active = False
        ) 
        
        user.set_password(validated_data['password'])
        user.save()
        
        email_subject = "Activate Your Account"
        
        message = render_to_string(
            'activate.html',
            {
                'user': user,
                'domain': 'localhost:8000/',
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': generate_token.make_token(user) 
            }
        )
        
        email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [validated_data['email']])
        email_message.send()
        
        print(message)
        
        return user            