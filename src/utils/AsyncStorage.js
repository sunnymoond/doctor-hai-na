import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('AsyncStorage storeData error: ' + error.message);
    }
};

const storeJSONData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('AsyncStorage storeJSONData error: ' + error.message);
    }
};

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error) {
        console.error('AsyncStorage getData error: ' + error.message);
    }
};

const getJSONData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('AsyncStorage getJSONData error: ' + error.message);
    }
};

const clearStore = async (key) => {
    try {
        // await AsyncStorage.removeItem(key)
        await AsyncStorage.setItem(key, "");
    } catch (error) {
        console.error('AsyncStorage clearStore error: ' + error.message);
    }
};

export {
    storeData,
    storeJSONData,
    getData,
    getJSONData,
    clearStore
}