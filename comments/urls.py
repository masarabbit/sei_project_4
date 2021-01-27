from django.urls import path
from .views import CommentListView, CommentDetailView

urlpatterns = [
    path("", CommentListView.as_view()),
    path("<int:pk>/", CommentDetailView.as_view())
]