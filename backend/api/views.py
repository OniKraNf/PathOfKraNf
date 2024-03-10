import json
import os
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from api.models import Like, Profile, User, Post, Comment
from api.serializer import ProfileSerializer, MyTokenObtainPairSerializer, RegisterSerializer, PostSerializer, CommentSerializer
from rest_framework import generics, status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser

# for sending email and generate token
from django.utils.http import urlsafe_base64_decode
from .utils import generate_token
from django.utils.encoding import force_text
from django.views.generic import View, CreateView


# Create your views here.

class ProfileView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def get(self, request, *args, **kwargs):
        username = kwargs.get('username')
        try: 
            profile = Profile.objects.get(user__username=username)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)  
        except Profile.DoesNotExist: 
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def patch(self, request, *args, **kwargs):
        
        username = kwargs.get('username')
        
        try: 
            profile = Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            image = request.FILES.get('image')
            if image:
                profile.image = os.path.join('user_images', username, image.name)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ProfilesView(APIView):
    def get(self, request, *args, **kwargs):
        username = request.query_params.get('username', None)
        if username:
            profile = Profile.objects.filter(user__username__icontains=username)
        else:
            profile = Profile.objects.all()
        serializer = ProfileSerializer(profile, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PostView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                post = Post.objects.get(pk=pk)
                comments = post.comments.all()
                serializer = PostSerializer(post)
                comment_serializer = CommentSerializer(comments, many=True)
                return Response ({'post': serializer.data, 'comments': comment_serializer.data})
            except Post.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    def post(self, request):        
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            user_id = request.data.get('user_id')
            title = request.data.get('title')
            description = request.data.get('description')
            serializer.save(user_id=user_id, title=title, description=description)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
class LikePost(APIView):
    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(pk=post_id)
            current_likes = post.likes
            liked = Like.objects.filter(user=user, post=post).count()
            if not liked:
                liked = Like.objects.create(user=user, post=post)
                current_likes = current_likes + 1
            else:
                liked = Like.objects.filter(user=user, post=post).delete()
                current_likes = current_likes - 1
            post.likes = current_likes
            post.save() 
            return Response({'likes': current_likes}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'error': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)

class CommentView(APIView):
    def post(self, request, format=None):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            user_id = request.data.get('user_id')
            post_id = request.data.get('post_id')
            
            if post_id is None:
                return Response({'success': False, 'message': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if user_id is None:
                return Response({'success': False, 'message': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save(post_id=post_id, user_id=user_id)
            
            post = Post.objects.get(pk=post_id)
            post.count_comments += 1
            post.save()
            
            return Response({'success': True, 'message': 'Comment created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(pk=comment_id)
            post = comment.post
            print(post)
            if post.count_comments > 0:
                post.count_comments -= 1
                post.save()
            comment.delete()
            return Response({'success': True, 'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({'success': False, 'message': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = RegisterSerializer
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == 'GET':
        response = f"Hey {request.user}, You are visiting a get path of kranf"
        return Response({'response': response}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.POST.get('text')
        response = f"Hey {request.user}, your text is {text}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    return Response({}, status=status.HTTP_400_BAD_REQUEST)

class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception as identifier:
            user = None
        if user is not None and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, 'activatesuccess.html')
        else:
            return render(request, 'activatefail.html')
# @api_view(['GET'])
# def get_data(request):
#     user = {'username': 'milan', 'email': 'milan@gmail.com'}
#     return Response(user)