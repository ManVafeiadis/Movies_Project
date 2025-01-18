# Movies API

A Django REST API for managing movies and user reviews. This API provides endpoints for movie management and user reviews with JWT authentication.

## Features

- JWT Authentication
- User Registration and Authentication
- Movie Management (Admin only for creation/modification)
- User Reviews System
- MySQL Database Integration

## Database Models

### Movie
- `title`: CharField(max_length=100)
- `director`: CharField(max_length=50)
- `category`: CharField(max_length=40)
- `description`: TextField
- `release_date`: DateField

### Review
- `created_at`: DateTimeField(auto_now_add=True)
- `updated_at`: DateTimeField(auto_now=True)
- `review_author`: ForeignKey(User)
- `review`: TextField
- `rating`: PositiveIntegerField(1-10)
- `movie`: ForeignKey(Movie)

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/registration/`: Register a new user
- `POST /api/token/`: Obtain JWT token pair
- `POST /api/token/refresh/`: Refresh JWT token
- `POST /api/token/verify/`: Verify JWT token

### Movie Endpoints
- `GET /api/movies/`: List all movies
- `POST /api/movies/`: Create a new movie (Admin only)
- `GET /api/movies/{id}/`: Retrieve a specific movie
- `PUT /api/movies/{id}/`: Update a movie (Admin only)
- `DELETE /api/movies/{id}/`: Delete a movie (Admin only)

### Review Endpoints
- `GET /api/movies/{movie_id}/review/`: List all reviews for a movie
- `POST /api/movies/{movie_id}/review/`: Create a review for a movie (Authenticated users)
- `GET /api/reviews/{id}/`: Retrieve a specific review
- `PUT /api/reviews/{id}/`: Update a review
- `DELETE /api/reviews/{id}/`: Delete a review

## Installation

1. Clone the repository:
```bash
git clone [https://github.com/ManVafeiadis/Movies_Project/tree/main/movies_backend]
cd movies_backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. A. Create a `.env` file in the root directory with the following content:
```
# Django configuration
SECRET_KEY=your-secret-key
DEBUG=True

# Database configuration
DB_NAME=movies_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306

# JWT configuration
JWT_ACCESS_TOKEN_LIFETIME=50  # 5 minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # 24 hours
```
B. Add this lines to your settings.py:
  ```
  from dotenv import load_dotenv
  load_dotenv()  # take environment variables from .env

  # To call the variables from .env you have to follow this syntax:
  # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = os.getenv('SECRET_KEY')
  # And for your external library the following:
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
  ```

5. Create MySQL database:
```sql
CREATE DATABASE movies_db;
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON movies_db.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

6. Apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create a superuser:
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected endpoints:

1. Register a new user or login to get the JWT token
2. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Example Requests

### Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/registration/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password1": "securepassword123",
    "password2": "securepassword123"
  }'
```

### Create a Movie (Admin Only)
```bash
curl -X POST http://localhost:8000/api/movies/ \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "director": "Christopher Nolan",
    "category": "Sci-Fi",
    "description": "A thief who steals corporate secrets...",
    "release_date": "2010-07-16"
  }'
```

### Create a Review
```bash
curl -X POST http://localhost:8000/api/movies/1/review/ \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "review": "Amazing movie!",
    "rating": 9
  }'
```

## Development

- The project uses Django 5.1.4
- REST Framework for API development
- MySQL as the database
- JWT for authentication
- Custom permissions for admin-only access to certain endpoints

## Testing

The project includes comprehensive test coverage for all major functionality. Tests are written using Django's test framework and Django REST Framework's APITestCase.

### Test Coverage

1. Registration and Login Tests:
   - User registration validation
   - Password strength and match verification
   - JWT token acquisition

2. Movie Management Tests:
   - Movie creation (admin only)
   - Movie listing
   - Movie updates (admin only)
   - Movie deletion (admin only)
   - Unauthorized access attempts

3. Review System Tests:
   - Review creation by authenticated users
   - Prevention of duplicate reviews
   - Rating validation (1-10 range)
   - Multiple user review scenarios
   - Unauthorized access prevention

### Running Tests

Run all tests:
```bash
python manage.py test
```

Run specific test classes:
```bash
python manage.py test movies.tests.RegistrationLoginTests
python manage.py test movies.tests.MovieTests
python manage.py test movies.tests.ReviewTests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
