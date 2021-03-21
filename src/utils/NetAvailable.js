import NetInfo from "@react-native-community/netinfo";

export const isNetAvailable = () => new Promise((resolve, reject) => {
    NetInfo.addEventListener(state => {
        const netInfo = state.isConnected;
        resolve(netInfo);
    });
});