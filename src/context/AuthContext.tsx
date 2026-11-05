import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/notice';

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  isAdmin: boolean;
  switchRole: (role: UserRole) => void;
  loginAsAdmin: (passcode?: string) => boolean;
  logoutToStudent: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const STUDENT_USER: UserProfile = {
  role: 'student',
  name: 'Alex Morgan',
  email: 'alex.morgan@college.edu',
  designation: 'B.Tech Student (Batch 2023-2027)',
  department: 'CSE'
};

const ADMIN_USER: UserProfile = {
  role: 'admin',
  name: 'Dr. Sarah Jenkins',
  email: 'dean.academics@college.edu',
  designation: 'Dean of Academic Affairs & Chief Administrator',
  department: 'General'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('college_notice_user_role');
      return saved === 'admin' ? 'admin' : 'student';
    } catch {
      return 'student';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('college_notice_user_role', role);
    } catch (e) {
      console.warn('Failed to save role:', e);
    }
  }, [role]);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const loginAsAdmin = (passcode?: string): boolean => {
    // If passcode provided, default passcode is 'admin' or 'college2026', or empty for instant dev demo
    if (passcode && passcode !== 'admin' && passcode !== 'college2026') {
      return false;
    }
    setRole('admin');
    setIsLoginModalOpen(false);
    return true;
  };

  const logoutToStudent = () => {
    setRole('student');
  };

  const user = role === 'admin' ? ADMIN_USER : STUDENT_USER;

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAdmin: role === 'admin',
        switchRole,
        loginAsAdmin,
        logoutToStudent,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
