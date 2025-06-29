import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './components/auth/AuthPage';
import LoadingSpinner from './components/LoadingSpinner';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import MeetingList from './components/MeetingList';
import ContactsPanel from './components/ContactsPanel';
import SettingsPanel from './components/SettingsPanel';
import CreateMeetingModal from './components/CreateMeetingModal';
import JoinMeetingModal from './components/JoinMeetingModal';
import MeetingRoom from './components/MeetingRoom';
import { Meeting } from './types/Meeting';
import { generateSampleMeetings, generateMeetingId } from './utils/meetings';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [meetings, setMeetings] = useState<Meeting[]>(generateSampleMeetings());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);

  const handleCreateMeeting = (newMeeting: Omit<Meeting, 'id' | 'status' | 'meetingUrl'>) => {
    const meeting: Meeting = {
      ...newMeeting,
      id: generateMeetingId(),
      status: 'scheduled',
      meetingUrl: `meet.company.com/${generateMeetingId()}`,
    };
    
    setMeetings([...meetings, meeting]);
  };

  const handleJoinMeeting = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (meeting) {
      setActiveMeetingId(meetingId);
      // Update meeting status to ongoing
      setMeetings(meetings.map(m => 
        m.id === meetingId ? { ...m, status: 'ongoing' as const } : m
      ));
    }
  };

  const handleLeaveMeeting = () => {
    setActiveMeetingId(null);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    setActiveMeetingId(null);
  };

  const handleOpenJoinModal = () => {
    setIsJoinModalOpen(true);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // If in a meeting, show meeting room
  if (activeMeetingId) {
    const meeting = meetings.find(m => m.id === activeMeetingId);
    return (
      <MeetingRoom
        meetingId={activeMeetingId}
        meetingTitle={meeting?.title || 'Meeting'}
        onLeaveMeeting={handleLeaveMeeting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              meetings={meetings}
              onCreateMeeting={() => setIsCreateModalOpen(true)}
              onJoinMeeting={handleJoinMeeting}
              onJoinWithId={handleOpenJoinModal}
            />
          )}
          
          {activeTab === 'meetings' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meetings</h1>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleOpenJoinModal}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>Join with ID</span>
                  </button>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>
              <MeetingList meetings={meetings} onJoinMeeting={handleJoinMeeting} />
            </div>
          )}
          
          {activeTab === 'contacts' && <ContactsPanel />}
          
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </main>

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMeeting={handleCreateMeeting}
      />

      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinMeeting={handleJoinMeeting}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;