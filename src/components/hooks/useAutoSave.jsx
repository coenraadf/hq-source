import { useState, useCallback, useRef, useEffect } from 'react';

export function useAutoSave(initialState, saveDelay = 2000, storageKey = null) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const saveTimeoutRef = useRef(null);

  const saveToLocalStorage = (dataToSave) => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (e) {
        console.warn(`Failed to save to localStorage with key "${storageKey}":`, e);
      }
    }
  };

  const updateState = useCallback((newState, isInitialLoad = false) => {
    setState(newState);
    
    if (isInitialLoad) {
      setHistory([newState]);
      setHistoryIndex(0);
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      const trimmedHistory = newHistory.slice(-30);
      setHistory(trimmedHistory);
      setHistoryIndex(trimmedHistory.length - 1);
      saveToLocalStorage(newState);
    }, saveDelay);
  }, [history, historyIndex, saveDelay, storageKey]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
      saveToLocalStorage(history[newIndex]);
    }
  }, [history, historyIndex, storageKey]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setState(history[newIndex]);
      saveToLocalStorage(history[newIndex]);
    }
  }, [history, historyIndex, storageKey]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return { 
    state, 
    updateState, 
    undo, 
    redo, 
    canUndo: historyIndex > 0, 
    canRedo: historyIndex < history.length - 1 
  };
}