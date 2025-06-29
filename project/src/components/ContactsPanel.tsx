import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  Video, 
  Phone, 
  Mail, 
  Filter,
  Users,
  Clock,
  MapPin,
  Tag,
  MoreVertical
} from 'lucide-react';
import { Contact, ContactGroup } from '../types/Contact';
import { sampleContacts, sampleContactGroups, formatLastSeen } from '../utils/contacts';
import UserAvatar from './UserAvatar';

const ContactsPanel: React.FC = () => {
  const [contacts] = useState<Contact[]>(sampleContacts);
  const [contactGroups] = useState<ContactGroup[]>(sampleContactGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'favorites'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'groups'>('list');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedFilter) {
      case 'online':
        return matchesSearch && contact.isOnline;
      case 'favorites':
        return matchesSearch && contact.isFavorite;
      default:
        return matchesSearch;
    }
  });

  const ContactCard: React.FC<{ contact: Contact; onClick: () => void }> = ({ contact, onClick }) => (
    <div 
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <UserAvatar user={contact} size="md" showOnlineStatus />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{contact.name}</h3>
            {contact.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{contact.email}</p>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</span>
            {!contact.isOnline && contact.lastSeen && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatLastSeen(contact.lastSeen)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ContactDetail: React.FC<{ contact: Contact; onClose: () => void }> = ({ contact, onClose }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="text-center mb-6">
        <UserAvatar user={contact} size="xl" showOnlineStatus />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{contact.name}</h3>
        <p className="text-gray-600 dark:text-gray-400">{contact.role}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.department}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400" />
          <span className="text-gray-900 dark:text-white">{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{contact.phone}</span>
          </div>
        )}
        {contact.timezone && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{contact.timezone}</span>
          </div>
        )}
      </div>

      {contact.tags.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Video className="w-5 h-5" />
          <span>Start Meeting</span>
        </button>
        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Mail className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team and external contacts</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'online' | 'favorites')}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="all">All Contacts</option>
            <option value="online">Online Only</option>
            <option value="favorites">Favorites</option>
          </select>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-3 transition-colors ${
                activeView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveView('groups')}
              className={`px-4 py-3 transition-colors ${
                activeView === 'groups'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              Groups
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className={`${selectedContact ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {activeView === 'list' ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => setSelectedContact(contact)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {contactGroups.map((group) => (
                <div key={group.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-3 h-3 rounded-full bg-${group.color}-500`}></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({group.contacts.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      >
                        <UserAvatar user={contact} size="sm" showOnlineStatus />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{contact.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        {selectedContact && (
          <div className="lg:col-span-1">
            <ContactDetail 
              contact={selectedContact} 
              onClose={() => setSelectedContact(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPanel;