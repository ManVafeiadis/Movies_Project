# Movie Review Application Frontend

A modern, responsive movie review application built with React, TypeScript, and Vite. This frontend allows users to browse movies, write reviews, and manage content with admin capabilities.

## 🚀 Features

- User authentication (login/register)
- Movie browsing with search capabilities
- Movie details with reviews
- User review system (create, edit, delete)
- Admin panel for movie management
- Responsive design using Tailwind CSS
- JWT-based authentication
- TypeScript for type safety

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-review-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```env
VITE_API_URL=http://localhost:8000/api  # or your backend API URL
```

4. Start the development server:
```bash
npm run dev
```

## 📦 Dependencies

Main dependencies used in this project:

```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "jwt-decode": "^4.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.2",
    "vite": "^6.0.5"
  }
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── forms/
│   │   ├── FormInput.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── movies/
│   │   ├── MovieCard.tsx
│   │   ├── MovieDetail.tsx
│   │   ├── MovieEdit.tsx
│   │   └── MovieList.tsx
│   └── reviews/
│       ├── ReviewForm.tsx
│       └── ReviewItem.tsx
├── context/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🔌 API Endpoints Required

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/registration/` - User registration
  ```typescript
  {
    username: string;
    email: string;
    password1: string;
    password2: string;
  }
  ```
- `POST /api/token/` - Login (returns JWT tokens)
  ```typescript
  {
    username: string;
    password: string;
  }
  ```
- `POST /api/token/refresh/` - Refresh token
  ```typescript
  {
    refresh: string;
  }
  ```

### Movies
- `GET /api/movies/` - List all movies
- `GET /api/movies/:id/` - Get single movie
- `POST /api/movies/` - Create movie (admin only)
  ```typescript
  {
    title: string;
    director: string;
    category: string;
    description: string;
    release_date: string; // YYYY-MM-DD format
  }
  ```
- `PUT /api/movies/:id/` - Update movie (admin only)
- `DELETE /api/movies/:id/` - Delete movie (admin only)

### Reviews
- `POST /api/movies/:id/review/` - Create review
  ```typescript
  {
    review: string;
    rating: number; // 1-10
  }
  ```
- `PUT /api/reviews/:id/` - Update review (owner or admin)
- `DELETE /api/reviews/:id/` - Delete review (owner or admin)

## 📊 Data Types

### Movie Type
```typescript
interface Movie {
    id: number;
    title: string;
    director: string;
    category: string;
    description: string;
    release_date: string;
    reviews: Review[];
}
```

### Review Type
```typescript
interface Review {
    id: number;
    created_at: string;
    updated_at: string;
    review_author: string;
    review: string | null;
    rating: number;
}
```

### User Type
```typescript
interface User {
    username: string;
    isAdmin: boolean;
    token: string;
}
```

## 🔒 Authentication

The application uses JWT tokens for authentication. All authenticated requests should include the Authorization header:

```typescript
headers: {
    'Authorization': `Bearer ${token}`
}
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The main theme colors are:
- cream: '#FBF5DD'
- sage: '#A6CDC6'
- navy: '#16404D'
- gold: '#DDA853'

## 🚀 Development

1. Start development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Preview production build:
```bash
npm run preview
```

## 📝 TypeScript Configuration

The project includes strict TypeScript configuration. Check `tsconfig.json` for details.

## 🔧 Setting Up Your Own Backend

To create a compatible backend, ensure:

1. All API endpoints match the specified routes
2. Response data structures match the TypeScript interfaces
3. JWT authentication is implemented
4. Proper CORS configuration for frontend access
5. Required permissions:
   - Admin-only routes for movie management
   - User authentication for reviews
   - Owner/admin permissions for review management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request
