/**
 * @format
 */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import themeReducer from './src/redux/themeReducer'
import countReducer from './src/redux/countReducer'
import refreshReducer from './src/redux/refreshReducer'
import alertReducer from './src/redux/alertReducer'

const store = createStore(
  combineReducers({ themeReducer, countReducer, refreshReducer, alertReducer }),
  applyMiddleware(thunk)
)

const backgroundNotificationHandler = async (remoteMessage) => {
  console.log('Received Background Notification');
  return Promise.resolve()
}

class RNRedux extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundNotificationHandler);
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(RNRedux));