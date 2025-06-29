import React, { useState } from 'react';
import { X, Video, Hash, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinMeeting: (meetingId: string) => void;
}

const JoinMeetingModal: React.FC<JoinMeetingModalProps> = ({
  isOpen,
  onClose,
  onJoinMeeting,
}) => {
  const [meetingId, setMeetingId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Sample meeting IDs for demonstration
  const validMeetingIds = ['1', '2', '3', '4', '5', '6'];

  const validateMeetingId = async (id: string) => {
    if (!id.trim()) {
      setError('');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setError('');

    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 500));

    if (validMeetingIds.includes(id.trim())) {
      setIsValid(true);
      setError('');
    } else {
      setIsValid(false);
      setError('Meeting not found. Please check the ID and try again.');
    }

    setIsValidating(false);
  };

  const handleInputChange = (value: string) => {
    setMeetingId(value);
    
    // Clear previous validation state
    setError('');
    setIsValid(false);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateMeetingId(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleJoin = () => {
    if (isValid && meetingId.trim()) {
      onJoinMeeting(meetingId.trim());
      setMeetingId('');
      setError('');
      setIsValid(false);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleJoin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Join Meeting</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Hash className="w-4 h-4 inline mr-2" />
              Meeting ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={meetingId}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  error 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500' 
                    : isValid
                    ? 'border-green-300 dark:border-green-600 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter meeting ID (e.g., 1, 2, 3...)"
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : error ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : null}
              </div>
            </div>
            
            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
            
            {isValid && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Meeting found! Ready to join.</span>
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Demo Meeting IDs
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              Try these sample meeting IDs:
            </p>
            <div className="flex flex-wrap gap-2">
              {validMeetingIds.map((id) => (
                <button
                  key={id}
                  onClick={() => handleInputChange(id)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>You'll join as a participant</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={!isValid || isValidating}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <Video className="w-4 h-4" />
            <span>Join Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinMeetingModal;