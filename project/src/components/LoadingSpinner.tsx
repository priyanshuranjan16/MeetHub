import React from 'react';
import { Video } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-200 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="text-center relative z-10">
        <div className="relative mb-8">
          {/* Main Logo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Video className="w-10 h-10 text-white" />
          </div>
          
          {/* Animated Ring */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-2xl animate-spin mx-auto"></div>
          
          {/* Pulse Effect */}
          <div className="absolute inset-0 w-20 h-20 bg-blue-500 rounded-2xl animate-ping opacity-20 mx-auto"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Loading MeetHub</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Please wait while we set up your professional meeting experience...
          </p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;