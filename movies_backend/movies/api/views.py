from rest_framework import generics, permissions, status
from rest_framework.generics import get_object_or_404
from movies.models import Movie, Review
from movies.api.serializers import MovieSerializer, ReviewSerializer
from rest_framework.exceptions import  ValidationError
from movies.api.permissions import IsAdminUserOrReadOnly, IsNotAuthenticated
from dj_rest_auth.registration.views import RegisterView
from rest_framework.response import Response



class MovieListCreateAPIView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class MovieDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer 
    permission_classes = [IsAdminUserOrReadOnly] 
     


class ReviewCreateAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        movie_pk = self.kwargs.get("movie_pk")
        movie = get_object_or_404(Movie, pk=movie_pk)
        review_author = self.request.user
        review_queryset = Review.objects.filter(movie=movie, review_author=review_author)
        if review_queryset.exists():
            raise ValidationError('You have already reviewed this movie')
        serializer.save(movie=movie, review_author=review_author)


class ReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer            


class CustomRegisterView(RegisterView):
    """
    Custom registration view that allows:
    - Unauthenticated users to register
    - Admin users to create new users
    - No access for authenticated non-admin users
    """
    permission_classes = [(IsNotAuthenticated | IsAdminUserOrReadOnly)]

    def get(self, request, *args, **kwargs):
        """Handle GET requests by returning registration form information"""
        return Response({
            "message": "Please use POST method to register",
            "required_fields": {
                "username": "string",
                "email": "string",
                "password1": "string",
                "password2": "string"
            }
        })

    def post(self, request, *args, **kwargs):
        """Handle POST requests for registration"""
        if request.user.is_authenticated and not request.user.is_staff:
            return Response(
                {"detail": "You are already authenticated. Please log out to register a new account."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)
