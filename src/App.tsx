import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/authContext';
import { LoginPage } from './components/login-page/LoginPage';
import { RegisterPage } from './components/login-page/RegisterPage';
import { ForgotPasswordPage } from './components/login-page/ForgotPasswordPage';
import { DashboardLayout } from './components/login-page/DashboardLayout';
import { Toaster } from './components/ui/sonner';

// Import components (Giữ nguyên các import của bạn)
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentCourses } from './components/student/StudentCourses';
import { CourseDetail } from './components/student/CourseDetail';
import { AssignmentDetail } from './components/student/AssignmentDetail';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentReports } from './components/student/StudentReports';
import { StudentDocuments } from './components/student/StudentDocuments';
import { StudentDiscussions } from "./components/student/StudentDiscussion";
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { AdminCourses } from './components/admin/AdminCourses';
import { AdminReports } from './components/admin/AdminReports';
import { ProfilePage } from './components/login-page/ProfilePage';

type AuthPage = 'login' | 'register' | 'forgot-password';
type AppPage = 'dashboard' | 'courses' | 'assignments' | 'documents' | 'discussions' | 'reports' | 'profile' | 'users' | 'students' | 'settings' | 'course-detail' | 'assignment-detail';

function AppContent() {
  const { user, login, logout, register } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as AppPage);
    setPageData(data || null);
    window.scrollTo(0, 0);
  };

  if (!user) {
    switch (authPage) {
      case 'forgot-password':
        return <ForgotPasswordPage onNavigateToLogin={() => setAuthPage('login')} />;
      default:
        return <LoginPage onNavigateToRegister={() => setAuthPage('register')} onNavigateToForgotPassword={() => setAuthPage('forgot-password')} />;
    }
  }

  // Mỗi role sẽ có một object định nghĩa các page
  const renderContent = () => {
    const commonProps = { user, onNavigate: handleNavigate };
    
    // Config cho Student
    const studentRoutes: Record<string, React.ReactNode> = {
      'dashboard': <StudentDashboard {...commonProps} />,
      'courses': <StudentCourses {...commonProps} />,
      'course-detail': <CourseDetail courseId={pageData?.courseId} onNavigate={handleNavigate} />,
      'assignments': <StudentAssignments {...commonProps} />,
      'assignment-detail': <AssignmentDetail assignmentId={pageData?.assignmentId} onNavigate={handleNavigate} />,
      'documents': <StudentDocuments {...commonProps} />,
      'discussions': <StudentDiscussions user={user} />,
      'reports': <StudentReports user={user} />,
      'profile': <ProfilePage user={user} />,
    };

    // Config cho Admin
    const adminRoutes: Record<string, React.ReactNode> = {
      'dashboard': <AdminDashboard onNavigate={handleNavigate} />,
      'users': <UserManagement />,
      'courses': <AdminCourses />,
      'reports': <AdminReports />,
      'settings': <ProfilePage user={user} />,
      'profile': <ProfilePage user={user} />,
    };

    let currentRoutes = {};
    if (user.role === 'Student') currentRoutes = studentRoutes;
    else if (user.role === 'Admin') currentRoutes = adminRoutes;

    return currentRoutes[currentPage as keyof typeof currentRoutes] || 
           <div className="p-8 text-center text-red-500">Trang không tồn tại (404)</div>;
  };

  return (
    <DashboardLayout
      user={user}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={logout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
