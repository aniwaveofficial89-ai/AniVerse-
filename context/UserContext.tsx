import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// Fix: Import UserProfile
import type { User, UserProfile } from '../types';

const USERS_STORAGE_KEY = 'aniVerseUsers';
const CURRENT_USER_STORAGE_KEY = 'aniVerseCurrentUser';
const ADMIN_EMAIL = 'admin@aniverse.io';

const getInitialUsers = (): User[] => {
  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (!users.some((u: User) => u.email === ADMIN_EMAIL)) {
      users.push({
        id: 'user-admin',
        email: ADMIN_EMAIL,
        password: 'admin123',
        name: 'Admin',
        avatarUrl: './avatars/avatar1.png'
      });
    }
    return users;
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [
      {
        id: 'user-admin',
        email: ADMIN_EMAIL,
        password: 'admin123',
        name: 'Admin',
        avatarUrl: './avatars/avatar1.png'
      }
    ];
  }
};

const getInitialCurrentUser = (): User | null => {
    try {
        const storedUser = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        return null;
    }
}

// Fix: Add missing properties for profile management
interface UserContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  profiles: UserProfile[];
  setActiveProfile: (profileId: string) => void;
  addProfile: (name: string, avatarUrl: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (profileId: string, name: string, avatarUrl: string) => Promise<{ success: boolean; message: string }>;
  deleteProfile: (profileId: string) => Promise<{ success: boolean; message: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getInitialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(getInitialCurrentUser);

  useEffect(() => {
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  useEffect(() => {
    try {
        if (currentUser) {
            window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
        } else {
            window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
        }
    } catch (error) {
        console.error("Failed to save currentUser to localStorage", error);
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      return { success: true, message: 'Logged in successfully' };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name: name.trim(),
      avatarUrl: `./avatars/avatar${Math.ceil(Math.random() * 5)}.png`
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registration successful' };
  };

  // Fix: Implement profile management functions
  const profiles: UserProfile[] = users.map(u => ({ id: u.id, name: u.name, avatarUrl: u.avatarUrl }));

  const setActiveProfile = (profileId: string) => {
    const userToActivate = users.find(u => u.id === profileId);
    if (userToActivate) {
      setCurrentUser(userToActivate);
    }
  };

  const addProfile = async (name: string, avatarUrl: string): Promise<{ success: boolean; message: string }> => {
    const email = `${name.replace(/\s+/g, '').toLowerCase()}-${Date.now()}@aniverse.io`;
    const password = 'password';
    
    if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, message: 'A profile with this name already exists' };
    }

    const newProfile: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name: name.trim(),
      avatarUrl,
    };
    setUsers(prev => [...prev, newProfile]);
    return { success: true, message: 'Profile added successfully' };
  };

  const updateProfile = async (profileId: string, name: string, avatarUrl: string): Promise<{ success: boolean; message: string }> => {
    setUsers(prev => prev.map(user => 
      user.id === profileId ? { ...user, name: name.trim(), avatarUrl } : user
    ));

    if (currentUser?.id === profileId) {
        setCurrentUser(prev => prev ? { ...prev, name: name.trim(), avatarUrl } : null);
    }
    return { success: true, message: 'Profile updated' };
  };

  const deleteProfile = async (profileId: string): Promise<{ success: boolean; message: string }> => {
    if (users.length <= 1) {
      return { success: false, message: "Cannot delete the last profile." };
    }
    setUsers(prev => prev.filter(user => user.id !== profileId));
    if (currentUser?.id === profileId) {
        logout();
    }
    return { success: true, message: 'Profile deleted' };
  };


  const isAdmin = currentUser?.email === ADMIN_EMAIL;
  
  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    register,
    profiles,
    setActiveProfile,
    addProfile,
    updateProfile,
    deleteProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};