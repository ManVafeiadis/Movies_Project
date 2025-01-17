from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from movies.models import Movie, Review
from datetime import date
import json

class RegistrationLoginTests(APITestCase):
    def test_registration_success(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "TestPass123!",
            "password2": "TestPass123!"
        }
        response = self.client.post("/api/auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_registration_password_mismatch(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "TestPass123!",
            "password2": "DifferentPass123!"
        }
        response = self.client.post("/api/auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_weak_password(self):
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "123",
            "password2": "123"
        }
        response = self.client.post("/api/auth/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_obtain(self):
        # First create a user
        user = User.objects.create_user(username="testuser", password="TestPass123!")
        
        # Try to get token
        data = {
            "username": "testuser",
            "password": "TestPass123!"
        }
        response = self.client.post("/api/token/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)

class MovieTests(APITestCase):
    def setUp(self):
        # Create admin user
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='AdminPass123!'
        )
        
        # Create normal user
        self.normal_user = User.objects.create_user(
            username='normal_user',
            email='user@example.com',
            password='UserPass123!'
        )
        
        # Create test movie
        self.movie = Movie.objects.create(
            title="Test Movie",
            director="Test Director",
            category="Test Category",
            description="Test Description",
            release_date=date(2024, 1, 1)
        )

    def get_admin_token(self):
        response = self.client.post("/api/token/", {
            "username": "admin",
            "password": "AdminPass123!"
        })
        return response.data['access']

    def get_user_token(self):
        response = self.client.post("/api/token/", {
            "username": "normal_user",
            "password": "UserPass123!"
        })
        return response.data['access']

    def test_list_movies(self):
        response = self.client.get("/api/movies/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_movie_as_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_admin_token()}')
        data = {
            "title": "New Movie",
            "director": "New Director",
            "category": "Action",
            "description": "New movie description",
            "release_date": "2024-01-15"
        }
        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Movie.objects.count(), 2)

    def test_create_movie_as_normal_user(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user_token()}')
        data = {
            "title": "New Movie",
            "director": "New Director",
            "category": "Action",
            "description": "New movie description",
            "release_date": "2024-01-15"
        }
        response = self.client.post("/api/movies/", data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_movie_as_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_admin_token()}')
        data = {"title": "Updated Movie Title"}
        response = self.client.patch(f"/api/movies/{self.movie.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.movie.refresh_from_db()
        self.assertEqual(self.movie.title, "Updated Movie Title")

    def test_delete_movie_as_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_admin_token()}')
        response = self.client.delete(f"/api/movies/{self.movie.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Movie.objects.count(), 0)

class ReviewTests(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(
            username='user1',
            password='UserPass123!'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='UserPass123!'
        )
        
        # Create movie
        self.movie = Movie.objects.create(
            title="Test Movie",
            director="Test Director",
            category="Test Category",
            description="Test Description",
            release_date=date(2024, 1, 1)
        )

    def get_user1_token(self):
        response = self.client.post("/api/token/", {
            "username": "user1",
            "password": "UserPass123!"
        })
        return response.data['access']

    def get_user2_token(self):
        response = self.client.post("/api/token/", {
            "username": "user2",
            "password": "UserPass123!"
        })
        return response.data['access']

    def test_create_review_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user1_token()}')
        data = {
            "review": "Great movie!",
            "rating": 9
        }
        response = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_create_review_unauthenticated(self):
        data = {
            "review": "Great movie!",
            "rating": 9
        }
        response = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_duplicate_review(self):
        # Create first review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user1_token()}')
        data = {
            "review": "First review",
            "rating": 8
        }
        self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        
        # Try to create second review
        data = {
            "review": "Second review",
            "rating": 9
        }
        response = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_rating(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user1_token()}')
        data = {
            "review": "Invalid rating",
            "rating": 11  # Rating should be 1-10
        }
        response = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_multiple_users_review(self):
        # First user review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user1_token()}')
        data = {
            "review": "User 1 review",
            "rating": 8
        }
        response1 = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second user review
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_user2_token()}')
        data = {
            "review": "User 2 review",
            "rating": 9
        }
        response2 = self.client.post(f"/api/movies/{self.movie.id}/review/", data)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        
        # Check that both reviews exist
        self.assertEqual(Review.objects.count(), 2)