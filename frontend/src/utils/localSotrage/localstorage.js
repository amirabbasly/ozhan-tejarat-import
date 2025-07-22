// src/utils/localStorage.js

export const loadCustomsParams = () => {
    try {
      const serializedParams = localStorage.getItem('customsParams');
      if (serializedParams === null) {
        return { ssdsshGUID: '', urlVCodeInt: '' };
      }
      return JSON.parse(serializedParams);
    } catch (err) {
      console.error('Failed to load customs parameters from localStorage:', err);
      return { ssdsshGUID: '', urlVCodeInt: '' };
    }
  };
  
  export const saveCustomsParams = (params) => {
    try {
      const serializedParams = JSON.stringify(params);
      localStorage.setItem('customsParams', serializedParams);
    } catch (err) {
      console.error('Failed to save customs parameters to localStorage:', err);
    }
  };
  
  export const clearCustomsParams = () => {
    try {
      localStorage.removeItem('customsParams');
    } catch (err) {
      console.error('Failed to clear customs parameters from localStorage:', err);
    }
  };
  