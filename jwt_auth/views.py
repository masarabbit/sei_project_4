from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

from .serializers.common import UserSerializer
from .serializers.populated import PopulatedUserSerializer

User = get_user_model()

class RegisterView(APIView):
    
    #register
    def post(self, request):
        user_to_create = UserSerializer(data=request.data)
        if user_to_create.is_valid():
            user_to_create.save()
            return Response(
                {"message": "Registration Successful"},
                status=status.HTTP_201_CREATED
            )

        return Response(user_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)   


class LoginView(APIView):
    
    #login
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        try:
            user_to_login = User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied(detail="Invalid Credentials")
        if not user_to_login.check_password(password):
            raise PermissionDenied(detail="Invalid Credentials")
        expiry_time = datetime.now() + timedelta(days=7)
        token = jwt.encode(
            {"sub": user_to_login.id, "exp":  int(expiry_time.strftime("%s"))},
            settings.SECRET_KEY,
            algorithm="HS256"
        )

        return Response(
            {"token": token, "message": f"Welcome Back {user_to_login.username}"}
        )          

class ProfileView(APIView):

    permission_classes = (IsAuthenticated, )
    
    #display all pics created by user logged in
    def get(self, request):
        user = User.objects.get(pk=request.user.id)
        serialized_user = PopulatedUserSerializer(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)        


class UserFollowView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        try:
            user_to_follow = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound()
        user_to_follow.followed_by.add(request.user.id) #!possibly change this so that it can be toggled.
        user_to_follow.save()
        serialized_followed_user = PopulatedUserSerializer(user_to_follow)
        return Response(serialized_followed_user.data, status=status.HTTP_201_CREATED)  
    
    #unfollow 
    def delete(self, request, pk):
        try:
            user_to_unfollow = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound()
        user_to_unfollow.followed_by.remove(request.user.id) #!possibly change this so that it can be toggled.
        user_to_unfollow.save()
        serialized_followed_user = PopulatedUserSerializer(user_to_unfollow)
        return Response(serialized_followed_user.data, status=status.HTTP_201_CREATED)                    