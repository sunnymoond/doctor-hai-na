import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import AuthLoading from "../screens/AuthLoading";
import AuthStackNavigator from "./AuthStackNavigator";
import BottomTabNavigatorDoctor from "./BottomTabNavigatorDoctor";
import BottomTabNavigatorPatient from "./BottomTabNavigatorPatient";


const AppNavigator = createSwitchNavigator({
    AuthLoading: createStackNavigator({
        AuthLoading: {
          screen: AuthLoading,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
    AuthLogin: createStackNavigator({
        AuthLogin: {
          screen: AuthStackNavigator,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
    Doctor: createStackNavigator({
        BottomTabNavigatorDoctor: {
          screen: BottomTabNavigatorDoctor,
          navigationOptions: {
            headerShown: false,
          },
        },
      }),
    Patient: createStackNavigator({
        BottomTabNavigatorPatient: {
          screen: BottomTabNavigatorPatient,
          navigationOptions: {
            headerShown: false,
          },
        },
      }), 
}, {
    initialRouteName: 'AuthLoading'
});

export default createAppContainer(AppNavigator)
