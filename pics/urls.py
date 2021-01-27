from django.urls import path
from .views import PicListView, PicDetailView, PicFavoriteView

urlpatterns = [
    path("", PicListView.as_view()),
    path("<int:pk>/", PicDetailView.as_view()),
    path("<int:pk>/favorite/", PicFavoriteView.as_view())
]