import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useUser } from './UserContext';

interface MyListContextType {
  myList: string[];
  addToMyList: (animeId: string) => void;
  removeFromMyList: (animeId: string) => void;
  isInMyList: (animeId: string) => boolean;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [myList, setMyList] = useState<string[]>([]);

  const MY_LIST_STORAGE_KEY = currentUser ? `aniVerseMyList_${currentUser.id}` : null;

  useEffect(() => {
    if (!MY_LIST_STORAGE_KEY) {
      setMyList([]); 
      return;
    }
    try {
      const items = window.localStorage.getItem(MY_LIST_STORAGE_KEY);
      setMyList(items ? JSON.parse(items) : []);
    } catch (error) {
      console.error("Could not parse My List from localStorage", error);
      setMyList([]);
    }
  }, [currentUser, MY_LIST_STORAGE_KEY]);

  useEffect(() => {
    if (!MY_LIST_STORAGE_KEY) return;
    try {
      window.localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(myList));
    } catch (error) {
      console.error("Could not save My List to localStorage", error);
    }
  }, [myList, MY_LIST_STORAGE_KEY]);

  const addToMyList = (animeId: string) => {
    if (!myList.includes(animeId)) {
      setMyList(prevList => [...prevList, animeId]);
    }
  };

  const removeFromMyList = (animeId: string) => {
    setMyList(prevList => prevList.filter(id => id !== animeId));
  };

  const isInMyList = (animeId: string) => {
    return myList.includes(animeId);
  };

  return (
    <MyListContext.Provider value={{ myList, addToMyList, removeFromMyList, isInMyList }}>
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = (): MyListContextType => {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};