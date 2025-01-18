from django.urls import path
from movies.api.views import MovieListCreateAPIView, MovieDetailAPIView, ReviewCreateAPIView, ReviewDetailAPIView, CustomRegisterView, get_user_info

urlpatterns = [
    path('movies/', MovieListCreateAPIView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailAPIView.as_view(), name='movie-detail'),
    path('movies/<int:movie_pk>/review/', ReviewCreateAPIView.as_view(), name='movie-review'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),
    path('auth/registration/', CustomRegisterView.as_view(), name='registration-page'),
    path('auth/user/',get_user_info, name='user-info'),

]