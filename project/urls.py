from django.contrib import admin
# from django.urls import path, include
from django.urls import path, include, re_path
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/pics/', include('pics.urls')),
    path('api/comments/', include('comments.urls')),
    path('api/auth/', include('jwt_auth.urls')),
    re_path(r'^.*$', index)
]
