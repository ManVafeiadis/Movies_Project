import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/forms/Login';
import Register from './components/forms/Register';
import MovieList from './components/Movies/MovieList';
import MovieDetail from './components/Movies/MovieDetail';
import CreateMovie from './components/Movies/CreateMovie';
import MovieEdit from './components/Movies/MovieEdit';

// Protected Route component for admin-only routes
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Main layout component that includes the header and footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-sage">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MovieList />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin-only routes */}
            <Route 
              path="/create-movie" 
              element={
                <AdminRoute>
                  <CreateMovie />
                </AdminRoute>
              } 
            />
            <Route 
              path="/edit-movie/:id" 
              element={
                  <AdminRoute>
                      <MovieEdit />
                  </AdminRoute>
              } 
            />

            {/* Catch-all route for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
