from django.urls import path
from .views import RegisterView, LoginView, ProfileView, UserFollowView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("<int:pk>/follow/", UserFollowView.as_view())
]