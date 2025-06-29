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
  Share2,
  FileText,
  Download,
  Upload,
  Presentation,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Pointer,
  PenTool,
  Square,
  Circle,
  Type,
  Eraser,
  Palette,
  Save,
  Eye,
  EyeOff,
  Clock,
  Star,
  ThumbsUp,
  MessageCircle,
  Zap,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MeetingParticipant, User } from '../types/Meeting';
import UserAvatar from './UserAvatar';

interface ClientPresentationRoomProps {
  meetingId: string;
  meetingTitle: string;
  onLeaveMeeting: () => void;
}

interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'chart' | 'image' | 'video';
  thumbnail: string;
  notes?: string;
}

interface Annotation {
  id: string;
  type: 'pen' | 'highlight' | 'arrow' | 'text' | 'shape';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  content?: string;
  timestamp: Date;
  author: string;
}

interface ChatMessage {
  id: string;
  author: User;
  message: string;
  timestamp: Date;
  type: 'message' | 'reaction' | 'question' | 'poll';
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

const ClientPresentationRoom: React.FC<ClientPresentationRoomProps> = ({ 
  meetingId, 
  meetingTitle, 
  onLeaveMeeting 
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [isPresenting, setIsPresenting] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'pointer' | 'pen' | 'highlight' | 'text' | 'shape'>('pointer');
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [presentationTime, setPresentationTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Sample presentation slides
  const slides: PresentationSlide[] = [
    {
      id: '1',
      title: 'Q4 2024 Performance Review',
      content: 'Quarterly Business Results & Strategic Outlook',
      type: 'title',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      notes: 'Welcome everyone to our Q4 performance review. Today we\'ll cover key metrics, achievements, and strategic direction for 2025.'
    },
    {
      id: '2',
      title: 'Key Achievements',
      content: '• 25% Revenue Growth\n• 40% Customer Acquisition\n• 95% Client Satisfaction\n• 15 New Team Members',
      type: 'content',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      notes: 'Highlight the exceptional growth we\'ve achieved this quarter across all key metrics.'
    },
    {
      id: '3',
      title: 'Revenue Performance',
      content: 'Q4 revenue exceeded targets by 15% with strong performance across all segments',
      type: 'chart',
      thumbnail: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      notes: 'Break down the revenue performance by segment and discuss the factors driving growth.'
    },
    {
      id: '4',
      title: 'Customer Success Stories',
      content: 'Showcasing our impact on client businesses',
      type: 'image',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      notes: 'Share specific customer success stories and testimonials that demonstrate our value proposition.'
    },
    {
      id: '5',
      title: '2025 Strategic Roadmap',
      content: 'Our vision and key initiatives for the upcoming year',
      type: 'content',
      thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      notes: 'Outline the strategic priorities and major initiatives planned for 2025.'
    }
  ];

  // Initialize participants and chat
  useEffect(() => {
    const mockParticipants: MeetingParticipant[] = [
      {
        id: '1',
        name: 'John Doe (You)',
        email: 'john@company.com',
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
        email: 'sarah@client.com',
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
        email: 'mike@client.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isHost: false,
        isMuted: true,
        isVideoOn: false,
        joinedAt: new Date(Date.now() - 3 * 60 * 1000),
        isOnline: true,
      },
      {
        id: '4',
        name: 'Emily Rodriguez',
        email: 'emily@client.com',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isHost: false,
        isMuted: false,
        isVideoOn: true,
        joinedAt: new Date(Date.now() - 8 * 60 * 1000),
        isOnline: true,
      },
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        author: mockParticipants[1],
        message: 'Great presentation so far! The Q4 results are impressive.',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        type: 'message'
      },
      {
        id: '2',
        author: mockParticipants[2],
        message: 'Could you elaborate on the customer acquisition strategy?',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        type: 'question'
      },
      {
        id: '3',
        author: mockParticipants[3],
        message: '👍',
        timestamp: new Date(Date.now() - 30 * 1000),
        type: 'reaction'
      }
    ];

    setParticipants(mockParticipants);
    setChatMessages(mockMessages);

    // Sample poll
    setActivePoll({
      id: '1',
      question: 'Which strategic priority should we focus on first in 2025?',
      options: [
        { id: '1', text: 'Product Innovation', votes: 3, voters: ['2', '3', '4'] },
        { id: '2', text: 'Market Expansion', votes: 1, voters: ['1'] },
        { id: '3', text: 'Customer Experience', votes: 2, voters: ['2', '4'] },
        { id: '4', text: 'Operational Excellence', votes: 0, voters: [] }
      ],
      isActive: true,
      createdBy: '1',
      createdAt: new Date(Date.now() - 5 * 60 * 1000)
    });

    // Timer for presentation
    const timer = setInterval(() => {
      setPresentationTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isMuted, isVideoOn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        author: participants[0],
        message: newMessage,
        timestamp: new Date(),
        type: 'message'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const votePoll = (optionId: string) => {
    if (activePoll) {
      const updatedPoll = { ...activePoll };
      updatedPoll.options = updatedPoll.options.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, '1']
          };
        }
        return option;
      });
      setActivePoll(updatedPoll);
    }
  };

  const PresentationSlideView = () => (
    <div className="relative h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Slide Content */}
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-4xl">
          {slides[currentSlide].type === 'title' ? (
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{slides[currentSlide].title}</h1>
              <p className="text-2xl text-gray-600">{slides[currentSlide].content}</p>
              <div className="mt-8">
                <img 
                  src={slides[currentSlide].thumbnail} 
                  alt="Presentation visual"
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          ) : slides[currentSlide].type === 'chart' ? (
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{slides[currentSlide].title}</h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
                <div className="grid grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">$2.4M</div>
                    <div className="text-sm text-gray-600">Q4 Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">+25%</div>
                    <div className="text-sm text-gray-600">Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">150</div>
                    <div className="text-sm text-gray-600">New Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
                <img 
                  src={slides[currentSlide].thumbnail} 
                  alt="Chart"
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{slides[currentSlide].title}</h2>
              <div className="text-left max-w-3xl mx-auto">
                <div className="text-xl text-gray-700 whitespace-pre-line leading-relaxed">
                  {slides[currentSlide].content}
                </div>
              </div>
              <img 
                src={slides[currentSlide].thumbnail} 
                alt="Content visual"
                className="w-full max-w-3xl mx-auto rounded-lg shadow-lg mt-8"
              />
            </div>
          )}
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Presentation Timer */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
        <Clock className="w-4 h-4" />
        <span>{formatTime(presentationTime)}</span>
        {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      </div>
    </div>
  );

  const AnnotationToolbar = () => (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-2">
      <button
        onClick={() => setSelectedTool('pointer')}
        className={`p-2 rounded transition-colors ${
          selectedTool === 'pointer' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Pointer className="w-4 h-4" />
      </button>
      <button
        onClick={() => setSelectedTool('pen')}
        className={`p-2 rounded transition-colors ${
          selectedTool === 'pen' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <PenTool className="w-4 h-4" />
      </button>
      <button
        onClick={() => setSelectedTool('highlight')}
        className={`p-2 rounded transition-colors ${
          selectedTool === 'highlight' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Square className="w-4 h-4" />
      </button>
      <button
        onClick={() => setSelectedTool('text')}
        className={`p-2 rounded transition-colors ${
          selectedTool === 'text' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Type className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
      
      <div className="flex items-center space-x-1">
        {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#000000'].map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
      
      <button
        onClick={() => setShowAnnotations(!showAnnotations)}
        className={`p-2 rounded transition-colors ${
          showAnnotations ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {showAnnotations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      <button className="p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors">
        <Eraser className="w-4 h-4" />
      </button>
      <button className="p-2 rounded text-gray-600 hover:bg-gray-100 transition-colors">
        <Save className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-white text-lg font-semibold">{meetingTitle}</h1>
            <p className="text-gray-400 text-sm">Client Presentation • {participants.length} participants</p>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-white text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(presentationTime)}</span>
          </div>
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
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-2 rounded-lg transition-colors ${
              showNotes 
                ? 'text-white bg-gray-700' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Presentation Area */}
        <div className="flex-1 p-6 relative">
          <div className="h-full relative">
            <PresentationSlideView />
            {isPresenting && <AnnotationToolbar />}
          </div>
        </div>

        {/* Side Panels */}
        <div className="flex">
          {/* Participants Panel */}
          {showParticipants && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Participants ({participants.length})</span>
              </h3>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <UserAvatar user={participant} size="sm" showOnlineStatus />
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

              {/* Engagement Metrics */}
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-3">Engagement</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Attention Score</span>
                    <span className="text-green-400 font-medium">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Questions Asked</span>
                    <span className="text-blue-400 font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reactions</span>
                    <span className="text-yellow-400 font-medium">12</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat & Q&A</span>
                </h3>
                <button className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Active Poll */}
              {activePoll && (
                <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">Live Poll</span>
                  </div>
                  <p className="text-white text-sm mb-3">{activePoll.question}</p>
                  <div className="space-y-2">
                    {activePoll.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => votePoll(option.id)}
                        className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span>{option.text}</span>
                          <span className="text-blue-400">{option.votes}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <UserAvatar user={message.author} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-sm font-medium">{message.author.name}</span>
                        <span className="text-gray-400 text-xs">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.type === 'question' && (
                          <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">Q</span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message or question..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>

              {/* Quick Reactions */}
              <div className="flex justify-center space-x-2 mt-3">
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-lg">👍</button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-lg">👏</button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-lg">❤️</button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-lg">🤔</button>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-lg">✋</button>
              </div>
            </div>
          )}

          {/* Notes Panel */}
          {showNotes && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex flex-col">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Presentation Notes</span>
              </h3>
              
              {/* Current Slide Notes */}
              <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                <h4 className="text-white font-medium mb-2">Slide {currentSlide + 1} Notes</h4>
                <p className="text-gray-300 text-sm">{slides[currentSlide].notes}</p>
              </div>

              {/* Slide Thumbnails */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                <h4 className="text-white font-medium mb-2">All Slides</h4>
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex space-x-3">
                      <img 
                        src={slide.thumbnail} 
                        alt={slide.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{slide.title}</p>
                        <p className="text-gray-400 text-xs">Slide {index + 1}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-full transition-colors ${
              !isVideoOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
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
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-colors ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <div className="w-5 h-5 bg-white rounded-sm" />
          </button>
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
          
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>

          <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={onLeaveMeeting}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors ml-8"
          >
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientPresentationRoom;