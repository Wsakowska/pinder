export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

export interface ChatConversation {
  profileId: string;
  messages: Message[];
}

export const mockMessages: ChatConversation[] = [
  {
    profileId: '1',
    messages: [
      {
        id: '1',
        text: 'Hey! How are you?',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        text: 'Hi! I\'m doing great, thanks for asking!',
        sender: 'user',
        timestamp: new Date(Date.now() - 3000000),
      },
      {
        id: '3',
        text: 'That\'s awesome! What have you been up to?',
        sender: 'other',
        timestamp: new Date(Date.now() - 2400000),
      },
      {
        id: '4',
        text: 'Just working on some projects. You?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1800000),
      },
    ],
  },
  {
    profileId: '2',
    messages: [
      {
        id: '1',
        text: 'See you tomorrow!',
        sender: 'other',
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: '2',
        text: 'Sure, see you then!',
        sender: 'user',
        timestamp: new Date(Date.now() - 6600000),
      },
    ],
  },
  {
    profileId: '3',
    messages: [
      {
        id: '1',
        text: 'Wanna grab coffee sometime?',
        sender: 'other',
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: '2',
        text: 'That sounds great! When?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1200000),
      },
    ],
  },
  {
    profileId: '4',
    messages: [
      {
        id: '1',
        text: 'Hi there!',
        sender: 'other',
        timestamp: new Date(Date.now() - 900000),
      },
      {
        id: '2',
        text: 'Hey! Nice to meet you!',
        sender: 'user',
        timestamp: new Date(Date.now() - 600000),
      },
    ],
  },
];
