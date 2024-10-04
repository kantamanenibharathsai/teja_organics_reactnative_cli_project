import AsyncStorage from '@react-native-async-storage/async-storage';
import {decryption, encryption} from './encryption';

const get = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data && decryption(data);
  } catch (error) {
    return undefined;
  }
};

const set = async (key: string, value: unknown) => {
  try {
    await AsyncStorage.setItem(key, encryption(JSON.stringify(value)));
    return value;
  } catch (error) {
    return false;
  }
};

const remove = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
};

const Storage = {
  get,
  set,
  remove,
  clearAll,
};

export default Storage;
