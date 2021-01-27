from django.db import models

class Pic(models.Model):
    title = models.CharField(max_length=50)
    image = models.CharField(max_length=300)
    description = models.TextField(max_length=200, null=True)
    dots = models.TextField()
    color_palette = models.TextField()
    categories = models.ManyToManyField(
        "categories.Category",  
        related_name="pics"
    )  
    artist = models.ForeignKey(
        "jwt_auth.User",
        related_name="created_pic",
        on_delete=models.CASCADE
    )
    favorited_by = models.ManyToManyField(
        "jwt_auth.User",
        related_name="favorited_pic",
        blank=True
    )


    def __str__(self):
        return self.title
        #maybe add artist name here later