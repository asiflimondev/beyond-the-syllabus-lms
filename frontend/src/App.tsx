import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@context/AuthContext';
import Layout from '@components/layout/Layout';

// Public Pages
import HomePage from '@pages/public/HomePage';
import AboutPage from '@pages/public/AboutPage';
import ProgramsPublicPage from '@pages/public/ProgramsPublicPage';
import GalleryPublicPage from '@pages/public/GalleryPublicPage';
import FAQPublicPage from '@pages/public/FAQPublicPage';
import ContactPage from '@pages/public/ContactPage';

// Auth Pages
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import StudentRegisterPage from '@pages/StudentRegisterPage';

// Protected Pages (Admin)
import DashboardPage from '@pages/DashboardPage';
import ProgramsPage from '@pages/ProgramsPage';
import AdmissionPage from '@pages/AdmissionPage';
import TeacherManagement from '@pages/admin/TeacherManagement';
import StudentsManagement from '@pages/admin/StudentsManagement';

// Protected Pages (Teacher)
import TeacherDashboard from '@pages/teacher/TeacherDashboard';
import TeacherPrograms from '@pages/teacher/TeacherPrograms';
import TeacherStudents from '@pages/teacher/TeacherStudents';
import TeacherMockTests from '@pages/teacher/TeacherMockTests';
import TeacherMarkEntry from '@pages/teacher/TeacherMarkEntry';

// Protected Pages (Student)
import StudentDashboard from '@pages/student/StudentDashboard';
import MockTestsPage from '@pages/student/MockTestsPage';
import StudentProfile from '@pages/student/StudentProfile';

// Protected Pages (Office)
import OfficeDashboard from '@pages/office/OfficeDashboard';

// Settings Page
import SettingsPage from '@pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = window.location.pathname;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (location === '/' || location === '/admin' || location === '/teacher' || location === '/student' || location === '/office') {
    const role = user?.role;
    if (role === 'admin') return <Navigate to="/admin/dashboard" />;
    if (role === 'office') return <Navigate to="/office/dashboard" />;
    if (role === 'teacher') return <Navigate to="/teacher/dashboard" />;
    if (role === 'student') return <Navigate to="/student/dashboard" />;
  }
  
  return <Layout>{children}</Layout>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/programs" element={<ProtectedRoute><ProgramsPage /></ProtectedRoute>} />
            <Route path="/admin/admission" element={<ProtectedRoute><AdmissionPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute><StudentsManagement /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute><TeacherManagement /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="/teacher" element={<ProtectedRoute><Navigate to="/teacher/dashboard" /></ProtectedRoute>} />
            <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/programs" element={<ProtectedRoute><TeacherPrograms /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher/mock-tests" element={<ProtectedRoute><TeacherMockTests /></ProtectedRoute>} />
            <Route path="/teacher/mark-entry/:mockTestId" element={<ProtectedRoute><TeacherMarkEntry /></ProtectedRoute>} />
            <Route path="/teacher/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            <Route path="/student" element={<ProtectedRoute><Navigate to="/student/dashboard" /></ProtectedRoute>} />
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/mock-tests" element={<ProtectedRoute><MockTestsPage /></ProtectedRoute>} />
            <Route path="/student/mock-tests/:id" element={<ProtectedRoute><div className="p-8 text-center text-gray-500">Mock Test Detail - Coming Soon</div></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />

            <Route path="/office" element={<ProtectedRoute><Navigate to="/office/dashboard" /></ProtectedRoute>} />
            <Route path="/office/dashboard" element={<ProtectedRoute><OfficeDashboard /></ProtectedRoute>} />
            <Route path="/office/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs" element={<ProgramsPublicPage />} />
            <Route path="/gallery" element={<GalleryPublicPage />} />
            <Route path="/faq" element={<FAQPublicPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/student-register" element={<StudentRegisterPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;