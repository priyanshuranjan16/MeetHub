import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Monitor, 
  Users, 
  MessageSquare, 
  Settings,
  MoreVertical,
  Volume2,
  VolumeX,
  Presentation
} from 'lucide-react';
import { MeetingParticipant, User } from '../types/Meeting';
import UserAvatar from './UserAvatar';
import ClientPresentationRoom from './ClientPresentationRoom';

interface MeetingRoomProps {
  meetingId: string;
  meetingTitle: string;
  onLeaveMeeting: () => void;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ 
  meetingId, 
  meetingTitle, 
  onLeaveMeeting 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Check if this is the client presentation meeting
  const isClientPresentation = meetingTitle.toLowerCase().includes('client presentation');

  // Simulate participants joining
  useEffect(() => {
    const mockParticipants: MeetingParticipant[] = [
      {
        id: '1',
        name: 'You',
        email: 'you@company.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isHost: true,
        isMuted: isMuted,
        isVideoOn: isVideoOn,
        joinedAt: new Date(),
        isOnline: true,
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isHost: false,
        isMuted: false,
        isVideoOn: true,
        joinedAt: new Date(Date.now() - 5 * 60 * 1000),
        isOnline: true,
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike@company.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isHost: false,
        isMuted: true,
        isVideoOn: false,
        joinedAt: new Date(Date.now() - 3 * 60 * 1000),
        isOnline: true,
      },
    ];

    setParticipants(mockParticipants);
  }, [isMuted, isVideoOn]);

  // If this is a client presentation, show the enhanced presentation room
  if (isClientPresentation || isPresentationMode) {
    return (
      <ClientPresentationRoom
        meetingId={meetingId}
        meetingTitle={meetingTitle}
        onLeaveMeeting={onLeaveMeeting}
      />
    );
  }

  const ParticipantVideo: React.FC<{ participant: MeetingParticipant; isMain?: boolean }> = ({ 
    participant, 
    isMain = false 
  }) => {
    const size = isMain ? 'w-full h-full' : 'w-full h-48';
    
    return (
      <div className={`${size} bg-gray-900 rounded-lg relative overflow-hidden`}>
        {participant.isVideoOn ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            {participant.avatar ? (
              <img 
                src={participant.avatar} 
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserAvatar user={participant} size="xl" />
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <UserAvatar user={participant} size="xl" />
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {participant.name}
              {participant.isHost && ' (Host)'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {participant.isMuted && (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
            {!participant.isVideoOn && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const mainParticipant = participants.find(p => p.id === '2') || participants[0];
  const otherParticipants = participants.filter(p => p.id !== mainParticipant?.id);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-lg font-semibold">{meetingTitle}</h1>
          <p className="text-gray-400 text-sm">Meeting ID: {meetingId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={() => setIsPresentationMode(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Presentation className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg transition-colors ${
              showParticipants 
                ? 'text-white bg-gray-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-2 rounded-lg transition-colors ${
              showChat 
                ? 'text-white bg-gray-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-6">
          <div className="h-full flex flex-col space-y-4">
            {/* Main Video */}
            {mainParticipant && (
              <div className="flex-1">
                <ParticipantVideo participant={mainParticipant} isMain />
              </div>
            )}
            
            {/* Other Participants */}
            {otherParticipants.length > 0 && (
              <div className="flex space-x-4 h-48">
                {otherParticipants.map((participant) => (
                  <div key={participant.id} className="flex-1">
                    <ParticipantVideo participant={participant} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-4">
              Participants ({participants.length})
            </h3>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors">
                  <UserAvatar user={participant} size="sm" />
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">
                      {participant.name}
                      {participant.isHost && ' (Host)'}
                    </div>
                    <div className="text-gray-400 text-xs">{participant.email}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {participant.isMuted ? (
                      <MicOff className="w-4 h-4 text-red-400" />
                    ) : (
                      <Mic className="w-4 h-4 text-green-400" />
                    )}
                    {participant.isVideoOn ? (
                      <Video className="w-4 h-4 text-green-400" />
                    ) : (
                      <VideoOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex flex-col">
            <h3 className="text-white font-semibold mb-4">Chat</h3>
            <div className="flex-1 space-y-3 mb-4">
              <div className="text-gray-400 text-sm text-center">
                Chat messages will appear here
              </div>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-3 rounded-full transition-colors ${
            isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full transition-colors ${
            !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {isVideoOn ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3 rounded-full transition-colors ${
            isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          <Monitor className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => setIsPresentationMode(true)}
          className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <Presentation className="w-5 h-5 text-white" />
        </button>

        <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5 text-white" />
        </button>

        <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={onLeaveMeeting}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors ml-8"
        >
          <Phone className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;