import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';

type AuthView = 'login' | 'signup' | 'reset';

const AuthPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400 to-blue-500 dark:from-indigo-600 dark:to-blue-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 dark:bg-blue-600 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400 dark:bg-purple-600 rounded-full opacity-30 animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-30 animate-bounce animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-pink-400 dark:bg-pink-600 rounded-full opacity-30 animate-bounce animation-delay-3000"></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200/50 dark:border-gray-700/50 group"
      >
        <div className="relative">
          {isDarkMode ? (
            <svg className="w-5 h-5 text-yellow-500 transition-transform duration-200 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700 transition-transform duration-200 group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </div>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-200 hover:shadow-3xl">
          {currentView === 'login' && (
            <LoginForm
              onSwitchToSignup={() => setCurrentView('signup')}
              onSwitchToReset={() => setCurrentView('reset')}
            />
          )}
          {currentView === 'signup' && (
            <SignupForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
          {currentView === 'reset' && (
            <ResetPasswordForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">MeetHub</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 MeetHub. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;