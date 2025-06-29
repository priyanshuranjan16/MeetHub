import { Contact, ContactGroup } from '../types/Contact';

export const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
    department: 'Engineering',
    role: 'Senior Developer',
    phone: '+1 (555) 123-4567',
    timezone: 'PST',
    isFavorite: true,
    tags: ['frontend', 'react', 'team-lead'],
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    department: 'Design',
    role: 'UX Designer',
    phone: '+1 (555) 234-5678',
    timezone: 'EST',
    isFavorite: false,
    tags: ['design', 'ux', 'prototyping'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
    department: 'Product',
    role: 'Product Manager',
    phone: '+1 (555) 345-6789',
    timezone: 'CST',
    isFavorite: true,
    tags: ['product', 'strategy', 'analytics'],
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
    department: 'Engineering',
    role: 'Backend Developer',
    phone: '+1 (555) 456-7890',
    timezone: 'PST',
    isFavorite: false,
    tags: ['backend', 'api', 'database'],
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa@company.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
    department: 'Marketing',
    role: 'Marketing Director',
    phone: '+1 (555) 567-8901',
    timezone: 'EST',
    isFavorite: true,
    tags: ['marketing', 'campaigns', 'analytics'],
  },
  {
    id: '6',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    isOnline: true,
    department: 'Sales',
    role: 'Sales Manager',
    phone: '+1 (555) 678-9012',
    timezone: 'MST',
    isFavorite: false,
    tags: ['sales', 'client-relations', 'revenue'],
  },
];

export const sampleContactGroups: ContactGroup[] = [
  {
    id: '1',
    name: 'Engineering Team',
    contacts: sampleContacts.filter(c => c.department === 'Engineering'),
    color: 'blue',
  },
  {
    id: '2',
    name: 'Design Team',
    contacts: sampleContacts.filter(c => c.department === 'Design'),
    color: 'purple',
  },
  {
    id: '3',
    name: 'Product Team',
    contacts: sampleContacts.filter(c => c.department === 'Product'),
    color: 'green',
  },
  {
    id: '4',
    name: 'Favorites',
    contacts: sampleContacts.filter(c => c.isFavorite),
    color: 'yellow',
  },
];

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};