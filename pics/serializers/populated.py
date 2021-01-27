from comments.serializers.populated import PopulatedCommentSerializer
from categories.serializers.common import CategorySerializer
from ..serializers.common import PicSerializer
from jwt_auth.serializers.common import NestedUserSerializer


class PopulatedPicSerializer(PicSerializer):
    comments = PopulatedCommentSerializer(many=True)
    categories = CategorySerializer(many=True)
    artist = NestedUserSerializer()
    favorited_by = NestedUserSerializer(many=True)