from django.db import models

class Comment(models.Model):
    text = models.TextField(max_length=200)
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    pic = models.ForeignKey(
        "pics.Pic",
        related_name="comments",
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name="posted_comments",
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return f"Comment: {self.id} on {self.pic}"

