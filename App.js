import React, { Component } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navigator from './src/navigations/Navigation'
import NavigationService from './src/navigations/NavigationService'
import AlertPopUp from './src/components/AlertPopUp'
import { GoogleSignin } from "@react-native-community/google-signin";
import { connect } from 'react-redux';

class App extends Component {
  constructor() {
    super();
    LogBox.ignoreLogs(['Class RCTCxxModule']);
    this.state = {
      isPopUp: false,
      notificationData: {},
    }

    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      offlineAccess: true,
      webClientId: '527886345464-86lpthudfgioijtd7u4s8b35ufnhiecb.apps.googleusercontent.com',
    });

  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
    /*this.unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.result) {
        var result = await JSON.parse(remoteMessage.data.result);
        console.log("=========> remoteMessage <============" + JSON.stringify(remoteMessage));
        this.setState({
          notificationData: remoteMessage,
          isPopUp: true,
        })
      }
    });

    this.setBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    this.setNotificationOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('notification click', remoteMessage);
    });*/
  }

  componentWillUnmount() {
    //this.setBackground;
    //this.setNotificationOpen;
    //this.unsubscribe;
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
        <View style={styles.navigatorView}>
          <Navigator
            ref={navigatorRef => {
              NavigationService.init(navigatorRef);
            }}
          />
          
        </View>
        {this.props.alertVisibility && (
            <AlertPopUp/>
          )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  navigatorView: {
    flex: 1,
    width: '100%',
  },
})

const mapStateToProps = state => ({
  theme: state.themeReducer.theme,
  alertVisibility: state.alertReducer.alertVisibility,
})

export default connect(
  mapStateToProps,
)(App)