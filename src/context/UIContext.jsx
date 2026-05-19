import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <UIContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </UIContext.Provider>
  );
};
