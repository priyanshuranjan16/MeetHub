import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Play, 
  ExternalLink, 
  Search,
  Filter,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Star,
  StarOff,
  MapPin,
  Bell,
  BellOff,
  Share2,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Meeting } from '../types/Meeting';
import { formatTime, formatDate, getRelativeTime } from '../utils/meetings';
import UserAvatar from './UserAvatar';

interface MeetingListProps {
  meetings: Meeting[];
  onJoinMeeting: (meetingId: string) => void;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, onJoinMeeting }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'ongoing' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'participants'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const getStatusConfig = (status: Meeting['status']) => {
    switch (status) {
      case 'ongoing':
        return {
          color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
          icon: Video,
          pulse: true,
        };
      case 'scheduled':
        return {
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
          icon: Calendar,
          pulse: false,
        };
      case 'completed':
        return {
          color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600',
          icon: CheckCircle,
          pulse: false,
        };
      default:
        return {
          color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600',
          icon: Calendar,
          pulse: false,
        };
    }
  };

  const canJoin = (meeting: Meeting) => {
    const now = new Date();
    const meetingTime = new Date(meeting.startTime);
    const endTime = new Date(meetingTime.getTime() + meeting.duration * 60 * 1000);
    
    return meeting.status === 'ongoing' || 
           (now >= new Date(meetingTime.getTime() - 10 * 60 * 1000) && now <= endTime);
  };

  const toggleFavorite = (meetingId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(meetingId)) {
      newFavorites.delete(meetingId);
    } else {
      newFavorites.add(meetingId);
    }
    setFavorites(newFavorites);
  };

  const copyMeetingLink = (meetingUrl: string) => {
    navigator.clipboard.writeText(meetingUrl);
    // You could add a toast notification here
  };

  const toggleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedMeetings = meetings
    .filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.host.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || meeting.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'participants':
          comparison = a.participants.length - b.participants.length;
          break;
        case 'date':
        default:
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const upcomingMeetings = filteredAndSortedMeetings.filter(m => 
    m.status === 'scheduled' || m.status === 'ongoing'
  );
  const pastMeetings = filteredAndSortedMeetings.filter(m => m.status === 'completed');

  const MeetingCard: React.FC<{ meeting: Meeting; isPast?: boolean }> = ({ meeting, isPast = false }) => {
    const isExpanded = expandedMeeting === meeting.id;
    const isFavorite = favorites.has(meeting.id);
    const statusConfig = getStatusConfig(meeting.status);
    const StatusIcon = statusConfig.icon;
    
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group ${isPast ? 'opacity-75 hover:opacity-100' : ''}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {meeting.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span className="capitalize">{meeting.status}</span>
                  {statusConfig.pulse && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                  )}
                </span>
                <button
                  onClick={() => toggleFavorite(meeting.id)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {isFavorite ? (
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
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
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{getRelativeTime(new Date(meeting.startTime))}</span>
                </div>
              </div>
              
              {meeting.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{meeting.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {canJoin(meeting) && !isPast && (
                <button
                  onClick={() => onJoinMeeting(meeting.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4" />
                  <span>Join</span>
                </button>
              )}
              
              <div className="relative group/menu">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => copyMeetingLink(meeting.meetingUrl)}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    {!isPast && (
                      <>
                        <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <Bell className="w-4 h-4" />
                          <span>Remind Me</span>
                        </button>
                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Host:</span>
              <div className="flex items-center space-x-2">
                <UserAvatar user={meeting.host} size="sm" showOnlineStatus />
                <span className="text-sm text-gray-900 dark:text-white">{meeting.host.name}</span>
              </div>
            </div>
            
            <button
              onClick={() => setExpandedMeeting(isExpanded ? null : meeting.id)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <span>{isExpanded ? 'Less' : 'More'} details</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Participants ({meeting.participants.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {meeting.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <UserAvatar user={participant} size="sm" showOnlineStatus />
                      <span className="text-sm text-gray-900 dark:text-white">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Meeting Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Meeting ID:</span>
                    <p className="font-mono text-gray-900 dark:text-white">{meeting.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Meeting URL:</span>
                    <p className="font-mono text-blue-600 dark:text-blue-400 truncate">{meeting.meetingUrl}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search meetings, participants, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSort('date')}
                className={`flex items-center space-x-2 px-4 py-3 transition-colors ${
                  sortBy === 'date'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Date</span>
                {sortBy === 'date' && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => toggleSort('title')}
                className={`flex items-center space-x-2 px-4 py-3 transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  sortBy === 'title'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <span>Title</span>
                {sortBy === 'title' && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => toggleSort('participants')}
                className={`flex items-center space-x-2 px-4 py-3 transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  sortBy === 'participants'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Users className="w-4 h-4" />
                {sortBy === 'participants' && (
                  sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
            
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 transition-colors border-l border-gray-300 dark:border-gray-600 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredAndSortedMeetings.length}</span> of <span className="font-medium">{meetings.length}</span> meetings
            {searchTerm && ` for "${searchTerm}"`}
          </div>
          {favorites.size > 0 && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{favorites.size} favorite{favorites.size !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Sorted by {sortBy} ({sortOrder}ending)</span>
        </div>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Meetings</h2>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              {upcomingMeetings.length}
            </span>
          </div>
          
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Past Meetings</h2>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
              {pastMeetings.length}
            </span>
          </div>
          
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} isPast />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {filteredAndSortedMeetings.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchTerm ? <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" /> : <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'No meetings found' : 'No meetings scheduled'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
            {searchTerm 
              ? `No meetings match "${searchTerm}". Try adjusting your search or filters.`
              : 'Get started by scheduling your first meeting with your team.'
            }
          </p>
          <div className="flex justify-center space-x-3">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear search
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              Schedule Meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingList;