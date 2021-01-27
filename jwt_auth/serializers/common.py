from rest_framework import serializers 
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
          password = data.pop("password")
          password_confirmation = data.pop("password_confirmation")

          if password != password_confirmation:
              raise ValidationError({"password_confirmation", "does not match"})

          #! put this back in later
          # try:
          #     password_validation.validate_password(password=password)  
          # except ValidationError as err:
          #     raise ValidationError({"password": err.messages})    

          data["password"] = make_password(password)
          return data

    class Meta:
        model = User     
        fields = "__all__"


class NestedUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "username", "profile_image")
