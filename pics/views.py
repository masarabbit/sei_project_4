from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import status

from .models import Pic
from .serializers.common import PicSerializer
from .serializers.populated import PopulatedPicSerializer


class PicListView(APIView):
    
    #index
    def get(self, _request):
        pics = Pic.objects.all()
        serialized_pic = PopulatedPicSerializer(pics, many=True)
        return Response(serialized_pic.data, status=status.HTTP_200_OK)
    
    #create
    def post(self, request):
        pic_to_create = PicSerializer(data=request.data)
        if pic_to_create.is_valid():
            pic_to_create.save()
            return Response(pic_to_create.data, status=status.HTTP_201_CREATED)
        return Response(pic_to_create.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)   


class PicDetailView(APIView):
    
    permission_classes = (IsAuthenticatedOrReadOnly, )
    
    #check existence
    def get_pic(self, pk):
        try:
            return Pic.objects.get(pk=pk)
        except Pic.DoesNotExist:
            raise NotFound()
    
    #get single
    def get(self, _request, pk):
        pic = self.get_pic(pk=pk)
        serialized_pic = PopulatedPicSerializer(pic)
        return Response(serialized_pic.data, status=status.HTTP_200_OK)
    
    #update
    def put(self, request, pk):
        pic_to_update = self.get_pic(pk=pk)

        if pic_to_update.artist.id != request.user.id: #permission
            raise PermissionDenied()

        updated_pic = PicSerializer(pic_to_update, data=request.data)
        if updated_pic.is_valid():
            updated_pic.save()
            return Response(updated_pic.data, status=status.HTTP_202_ACCEPTED)
        return Response(updated_pic.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    

    #delete
    def delete(self, request, pk):
        pic_to_delete = self.get_pic(pk=pk)

        if pic_to_delete.artist.id != request.user.id: #permission
            raise PermissionDenied()

        pic_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class PicFavoriteView(PicDetailView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        pic_to_favorite = self.get_pic(pk=pk)
        pic_to_favorite.favorited_by.add(request.user.id) #!possibly change this so that it can be toggled.
        pic_to_favorite.save()
        serialized_favorited_pic = PopulatedPicSerializer(pic_to_favorite)
        return Response(serialized_favorited_pic.data, status=status.HTTP_201_CREATED)


    def delete(self, request, pk):
        pic_to_unfavorite = self.get_pic(pk=pk)
        pic_to_unfavorite.favorited_by.remove(request.user.id) #!possibly change this so that it can be toggled.
        pic_to_unfavorite.save()
        serialized_favorited_pic = PopulatedPicSerializer(pic_to_unfavorite)
        return Response(serialized_favorited_pic.data, status=status.HTTP_204_NO_CONTENT)        