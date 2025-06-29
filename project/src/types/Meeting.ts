export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number; // in minutes
  host: User;
  participants: User[];
  status: 'scheduled' | 'ongoing' | 'completed';
  meetingUrl: string;
}

export interface MeetingParticipant extends User {
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  joinedAt: Date;
}