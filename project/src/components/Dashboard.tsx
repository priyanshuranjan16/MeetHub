import React from 'react';
import { Plus, Video, Calendar, Users, Clock, TrendingUp, Star, Zap, Target, Award } from 'lucide-react';
import { Meeting } from '../types/Meeting';
import { formatTime, formatDate } from '../utils/meetings';
import UserAvatar from './UserAvatar';

interface DashboardProps {
  meetings: Meeting[];
  onCreateMeeting: () => void;
  onJoinMeeting: (meetingId: string) => void;
  onJoinWithId?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meetings, onCreateMeeting, onJoinMeeting, onJoinWithId }) => {
  const now = new Date();
  const upcomingMeetings = meetings.filter(m => 
    m.status === 'scheduled' && new Date(m.startTime) > now
  ).slice(0, 3);
  
  const ongoingMeetings = meetings.filter(m => m.status === 'ongoing');
  const todayMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.startTime);
    return meetingDate.toDateString() === now.toDateString();
  });

  const thisWeekMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.startTime);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return meetingDate >= weekStart && meetingDate <= weekEnd;
  });

  const stats = [
    {
      label: 'Today\'s Meetings',
      value: todayMeetings.length,
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      label: 'Active Now',
      value: ongoingMeetings.length,
      icon: Video,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: 'Live',
      changeType: 'neutral' as const,
    },
    {
      label: 'This Week',
      value: thisWeekMeetings.length,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      label: 'Total Hours',
      value: Math.round(meetings.reduce((total, meeting) => total + meeting.duration, 0) / 60),
      icon: Clock,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+15%',
      changeType: 'positive' as const,
    },
  ];

  const quickActions = [
    {
      title: 'Start Instant Meeting',
      description: 'Jump into a meeting right now',
      icon: Video,
      color: 'from-blue-600 to-blue-700',
      action: () => console.log('Start instant meeting'),
      buttonText: 'Start Now',
    },
    {
      title: 'Schedule Meeting',
      description: 'Plan your next meeting',
      icon: Calendar,
      color: 'from-indigo-600 to-purple-600',
      action: onCreateMeeting,
      buttonText: 'Schedule',
    },
    {
      title: 'Join with ID',
      description: 'Enter a meeting ID to join',
      icon: Target,
      color: 'from-emerald-600 to-teal-600',
      action: onJoinWithId || (() => console.log('Join with ID')),
      buttonText: 'Join',
    },
    {
      title: 'Record Session',
      description: 'Start a recording session',
      icon: Award,
      color: 'from-rose-600 to-pink-600',
      action: () => console.log('Record session'),
      buttonText: 'Record',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning! 👋</h1>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Ready for your meetings today? You have {upcomingMeetings.length} upcoming meetings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onJoinWithId}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Join with ID</span>
          </button>
          <button
            onClick={onCreateMeeting}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>New Meeting</span>
          </button>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div key={index} className={`bg-gradient-to-r ${action.color} rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8" />
                  <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-white text-opacity-90 mb-4 text-sm">{action.description}</p>
                <button 
                  onClick={action.action}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm backdrop-blur-sm"
                >
                  {action.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : stat.changeType === 'negative'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {stat.changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Ongoing Meetings */}
      {ongoingMeetings.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-green-900 dark:text-green-100">Live Meetings</h2>
              <span className="px-3 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                {ongoingMeetings.length} active
              </span>
            </div>
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Join anytime</span>
            </div>
          </div>
          
          <div className="grid gap-4">
            {ongoingMeetings.map((meeting) => (
              <div key={meeting.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-green-200 dark:border-green-700 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Started at {formatTime(new Date(meeting.startTime))}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Host:</span>
                      <UserAvatar user={meeting.host} size="sm" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{meeting.host.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onJoinMeeting(meeting.id)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Upcoming Meetings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Meetings</h2>
              {upcomingMeetings.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {upcomingMeetings.length} scheduled
                </span>
              )}
            </div>
            <button 
              onClick={onCreateMeeting}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Schedule new
            </button>
          </div>
        </div>
        
        {upcomingMeetings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No upcoming meetings</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Schedule a meeting to get started with your team</p>
            <button
              onClick={onCreateMeeting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Schedule Meeting
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {meeting.title}
                      </h3>
                      <Star className="w-4 h-4 text-gray-300 hover:text-yellow-500 cursor-pointer transition-colors" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-1">{meeting.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(new Date(meeting.startTime))}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(new Date(meeting.startTime))} ({meeting.duration}m)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">With:</span>
                      <div className="flex -space-x-2">
                        {meeting.participants.slice(0, 4).map((participant) => (
                          <UserAvatar
                            key={participant.id}
                            user={participant}
                            size="sm"
                            className="ring-2 ring-white dark:ring-gray-800"
                          />
                        ))}
                        {meeting.participants.length > 4 && (
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">
                            +{meeting.participants.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm">
                      Details
                    </button>
                    <button
                      onClick={() => onJoinMeeting(meeting.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;