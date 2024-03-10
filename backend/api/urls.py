from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('dashboard/', views.dashboard),
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),
    path('profile/<str:username>/', views.ProfileView.as_view(), name='profile'),
    path('profiles/', views.ProfilesView.as_view(), name='profiles'),
    path('profiles/search/', views.ProfilesView.as_view(), name='profiles-search'),
    path('post/', views.PostView.as_view(), name='post'),
    path('post/<str:pk>/', views.PostView.as_view(), name='post'),
    path('comment/', views.CommentView.as_view(), name='comment'),
    path('comment/<int:comment_id>/delete/', views.CommentView.as_view(), name='comment-delete'),
    path('post/<int:post_id>/like/', views.LikePost.as_view(), name='like-post'),
]
