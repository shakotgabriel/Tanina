export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}
