from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers.common import CommentSerializer
from .models import Comment

class CommentListView(APIView):

  permission_classes = (IsAuthenticated, )
  
  #make comment
  def post(self, request):
      comment_to_create = CommentSerializer(data=request.data)
      if comment_to_create.is_valid():
          comment_to_create.save()
          return Response(comment_to_create.data, status=status.HTTP_201_CREATED)
      return Response(comment_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY) 
      

class CommentDetailView(APIView):

    permission_classes = (IsAuthenticated, )
    
    #delete comment
    def delete(self, _request, pk):
        try:
            comment_to_delete = Comment.objects.get(pk=pk)

            if comment_to_delete.owner.id != request.user.id: 
                raise PermissionDenied
              
            comment_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            raise NotFound()      