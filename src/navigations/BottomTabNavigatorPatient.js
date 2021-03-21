import React from "react";
import {  Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from "react-navigation-tabs";

import { HISTORY, HOME, PROFILE, SHOP, WALLET, BARBAR } from "../images";
import TabWalletScreen from "../screens/TabWalletScreen";
import TabHistoryScreen from "../screens/TabHistoryScreen";
import TabHomeScreen from "../screens/TabHomeScreen";
import TabCartScreen from "../screens/TabCartScreen";
import TabProfileScreen from "../screens/TabProfileScreen";

import BottomTab from '../components/BottomTab';
import BottomTabItem from '../components/BottomTabItem'
import PatientHome from "../screens/PatientHome";
import DoctorDetail from "../screens/DoctorDetail";
import PatientProfile from "../screens/PatientProfile";
import PatientEditProfile from "../screens/PatientEditProfile";

const { width, height } = Dimensions.get('window');
//Use iPhone as base size wich is 375 * 812

const baseWidth = 414;
const baseHeight = 972;

let scaleWidth = width / baseWidth;
let scaleHeight = height / baseHeight;

const PatientProfileNavigation = createSwitchNavigator({
    PatientProfile,
    PatientEditProfile,
}, {
    initialRouteName: 'PatientProfile'
})

const PatientHomeNavigation = createSwitchNavigator({
    PatientHome,
    DoctorDetail,
}, {
    initialRouteName: 'PatientHome'
})


const Tabs = createBottomTabNavigator(
    {
        /*Wallet: {
            screen: TabWalletScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={WALLET} isFocused={focused} />
                )
            }
        },*/
        History: {
            screen: TabHistoryScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={HISTORY} isFocused={focused} />
                )
            }
        },
        Home: {
            screen: PatientHomeNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={HOME} isFocused={focused} />
                )
            }
        },
        /*Cart: {
            screen: TabCartScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={SHOP} isFocused={focused} isBudgeCount={true} />
                )
            }
        },*/
        Profile: {
            screen: PatientProfileNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={PROFILE} isFocused={focused} />
                )
            }
        },
    },
    {
        tabBarComponent: props => <BottomTab {...props} />,
        initialRouteName: 'Home',
        tabBarOptions: {
            showLabel: false,
            allowFontScaling: false, keyboardHidesTabBar: true,
            backBehavior: "initialRoute"
        }
    }
);

export default createStackNavigator({ Tabs }, { headerMode: "none" });

