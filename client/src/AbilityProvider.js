import React, { createContext, useContext } from 'react';
import { defineAbilitiesFor } from './permissions'; 

export const AbilityContext = createContext(null); // Export it here

export const AbilityProvider = ({ children }) => {
  const userRole = localStorage.getItem('userRole'); 
  const ability = defineAbilitiesFor(userRole);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  return useContext(AbilityContext);
};
