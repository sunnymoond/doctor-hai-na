import { createStackNavigator } from "react-navigation-stack";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import OtpVerification from "../screens/OtpVerification";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";

export default createStackNavigator({
    Welcome,
    Login,
    SignUp,
    OtpVerification,
    ForgotPassword,
    ResetPassword
},
    {
        headerShown: false,
        headerMode: 'none'
    });
