import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>You are working offline.</Text>
        </View>
    );
}

class OfflineNotice extends PureComponent {

    state = {
        isConnected: true
    };

    handleConnectivityChange = state => {
        if (state.isConnected) {
            this.setState({ isConnected: state.isConnected });
        } else {
            this.setState({ isConnected: state.isConnected });
        }
    };

    componentDidMount() {
        this.isNetWorksAvailable = NetInfo.addEventListener(state => {
            this.handleConnectivityChange(state)
        });
    }

    componentWillUnmount() {
        this.isNetWorksAvailable();
    }

    render() {
        if (!this.state.isConnected) {
            return <MiniOfflineSign />;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#D5BE60',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
    },
    offlineText: { color: '#fff', fontWeight: 'bold' }
});

export default OfflineNotice;
