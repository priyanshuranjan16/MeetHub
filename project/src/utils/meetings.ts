import { Meeting, User } from '../types/Meeting';

// Sample users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: false,
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
  },
];

// Generate sample meetings
export const generateSampleMeetings = (): Meeting[] => {
  const now = new Date();
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team standup meeting to discuss progress and blockers',
      startTime: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes from now
      duration: 30,
      host: sampleUsers[0],
      participants: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
      status: 'scheduled',
      meetingUrl: 'meet.company.com/team-standup-123',
    },
    {
      id: '2',
      title: 'Product Review',
      description: 'Weekly product review with stakeholders and development team',
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      host: sampleUsers[1],
      participants: [sampleUsers[0], sampleUsers[1], sampleUsers[3]],
      status: 'scheduled',
      meetingUrl: 'meet.company.com/product-review-456',
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Quarterly presentation to key client stakeholders',
      startTime: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      duration: 90,
      host: sampleUsers[0],
      participants: [sampleUsers[0], sampleUsers[1], sampleUsers[2], sampleUsers[3]],
      status: 'ongoing',
      meetingUrl: 'meet.company.com/client-presentation-789',
    },
    {
      id: '4',
      title: 'Design System Workshop',
      description: 'Workshop to establish design system guidelines and components',
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
      duration: 120,
      host: sampleUsers[2],
      participants: [sampleUsers[1], sampleUsers[2], sampleUsers[3]],
      status: 'completed',
      meetingUrl: 'meet.company.com/design-workshop-101',
    },
    {
      id: '5',
      title: 'Sprint Planning',
      description: 'Planning session for the upcoming sprint with the development team',
      startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 90,
      host: sampleUsers[1],
      participants: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
      status: 'scheduled',
      meetingUrl: 'meet.company.com/sprint-planning-202',
    },
    {
      id: '6',
      title: 'All Hands Meeting',
      description: 'Monthly company-wide meeting to share updates and announcements',
      startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Last week
      duration: 60,
      host: sampleUsers[0],
      participants: sampleUsers,
      status: 'completed',
      meetingUrl: 'meet.company.com/all-hands-303',
    },
  ];

  return meetings;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
  
  if (Math.abs(diffInMinutes) < 1) return 'Now';
  
  if (diffInMinutes > 0) {
    // Future
    if (diffInMinutes < 60) return `In ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `In ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `In ${diffInDays}d`;
    
    return date.toLocaleDateString();
  } else {
    // Past
    const absDiffInMinutes = Math.abs(diffInMinutes);
    if (absDiffInMinutes < 60) return `${absDiffInMinutes}m ago`;
    
    const diffInHours = Math.floor(absDiffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }
};

export const generateMeetingId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};