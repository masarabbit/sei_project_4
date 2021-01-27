from pics.serializers.populated import PopulatedPicSerializer
from comments.serializers.common import CommentSerializer
from ..serializers.common import UserSerializer, NestedUserSerializer

class PopulatedUserSerializer(UserSerializer):

    created_pic = PopulatedPicSerializer(many=True)
    posted_comments = CommentSerializer(many=True)
    favorited_pic = PopulatedPicSerializer(many=True)
    followed_by = NestedUserSerializer(many=True)
    following = NestedUserSerializer(many=True)
