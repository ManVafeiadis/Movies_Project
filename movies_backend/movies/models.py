from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import  User

# Create your models here.

class Movie (models.Model):
    title = models.CharField(max_length=100)
    director = models.CharField(max_length=50)
    category = models.CharField(max_length=40)
    description = models.TextField()
    release_date = models.DateField()

    def __str__(self):
        return self.title
    

class Review (models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    review_author = models.ForeignKey(User, on_delete=models.CASCADE)
    review = models.TextField(blank=True, null=True)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)]) 
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="reviews")   

    def __str__(self):
        return str(self.rating)