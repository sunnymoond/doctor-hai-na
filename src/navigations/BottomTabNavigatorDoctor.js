import React from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from "react-navigation-tabs";
import { LOCATION, HOME, PROFILE, HAIR_DRESSER, WALLET, } from "../images";
import TabWalletScreen from "../screens/TabWalletScreen";
import TabHistoryScreen from "../screens/TabHistoryScreen";
import TabHomeScreen from "../screens/TabHomeScreen";
import TabCartScreen from "../screens/TabCartScreen";
import TabProfileScreen from "../screens/TabProfileScreen";

import BottomTab from '../components/BottomTab';
import BottomTabItem from '../components/BottomTabItem'
import DoctorHome from "../screens/DoctorHome";
import Feedback from "../screens/Feedback";
import DoctorProfile from "../screens/DoctorProfile";
import DoctorEditProfile from "../screens/DoctorEditProfile";
import DocumentsUpload from "../screens/DocumentsUpload";
import DocumentsHome from "../screens/DocumentsHome";
import DoctorAddAddress from "../screens/DoctorAddAddress";
import DoctorAddressList from "../screens/DoctorAddressList";

const { width, height } = Dimensions.get('window');
//Use iPhone as base size wich is 375 * 812

const baseWidth = 414;
const baseHeight = 972;

let scaleWidth = width / baseWidth;
let scaleHeight = height / baseHeight;

const DoctorProfileNavigation = createSwitchNavigator({
    DoctorProfile,
    DoctorEditProfile,
    DoctorAddAddress,
    Feedback,
    DocumentsHome,
    DocumentsUpload
}, {
    initialRouteName: 'DoctorProfile'
})

const DoctorAddressNavigation = createSwitchNavigator({
    DoctorAddressList,
    DoctorAddAddress
}, {
    initialRouteName: 'DoctorAddressList'
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
            screen: DoctorAddressNavigation,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <BottomTabItem image={LOCATION} isFocused={focused} />
                )
            }
        },
        Home: {
            screen: DoctorHome,
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
                    <BottomTabItem image={HAIR_DRESSER} isFocused={focused} isBudgeCount={true}/>
                )
            }
        },*/
        Profile: {
            screen: DoctorProfileNavigation,
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
