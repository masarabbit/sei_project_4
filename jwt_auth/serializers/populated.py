from pics.serializers.populated import PopulatedPicSerializer
from comments.serializers.common import CommentSerializer
from ..serializers.common import UserSerializer

class PopulatedUserSerializer(UserSerializer):

    created_pic = PopulatedPicSerializer(many=True)
    posted_comments = CommentSerializer(many=True)
    favorited_pic = PopulatedPicSerializer(many=True)