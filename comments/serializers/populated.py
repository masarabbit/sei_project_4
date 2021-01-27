from jwt_auth.serializers.common import NestedUserSerializer
from ..serializers.common import CommentSerializer

class PopulatedCommentSerializer(CommentSerializer):
    owner = NestedUserSerializer()