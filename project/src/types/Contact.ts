export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  department?: string;
  role?: string;
  phone?: string;
  timezone?: string;
  isFavorite: boolean;
  tags: string[];
}

export interface ContactGroup {
  id: string;
  name: string;
  contacts: Contact[];
  color: string;
}