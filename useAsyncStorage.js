import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorage = (key, defaultValue) => {
  const [state, setState] = useState({
    hydrated: false,
    storageValue: defaultValue,
  });

  const getStorageValue = async () => {
    let value = defaultValue;
    try {
      value = JSON.parse(await AsyncStorage.getItem(key)) || defaultValue;
    } catch (e) {
    } finally {
      setState({
        hydrated: true,
        storageValue: value,
      });
    }
  };

  const updateStorage = async (newValue) => {
    try {
      if (newValue === null) {
        await AsyncStorage.removeItem(key);
      } else {
        const value = JSON.stringify(newValue);
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
    } finally {
      setState({
        hydrated: false,
        storageValue: newValue,
      });
    }
  };

  useEffect(() => {
    getStorageValue();
  }, [state.hydrated]);

  return [state.storageValue, updateStorage, state.hydrated];
};

export default useAsyncStorage;
