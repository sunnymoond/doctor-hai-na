import { GoogleSignin } from "@react-native-community/google-signin";
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { Platform } from 'react-native';

const onGoogleButtonPress = async () => {
    // auth().signOut().then(() => console.log('User signed out!'));
    let googleData = {};
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    googleData.token = idToken;

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    googleData.credentials = googleCredential;

    // Sign-in the user with the credential
    googleData.userData = await auth().signInWithCredential(googleCredential);
    return googleData; //auth().signInWithCredential(googleCredential);
};

const onFacebookButtonPress = async () => {
    // auth().signOut().then(() => console.log('User signed out!'));
    let fb_data = {};
    // auth().signOut().then(() => console.log('User signed out!'));
    // Attempt login with permissions

    // something like this
    //LoginManager.setLoginBehavior(Platform.OS === 'ios' ? 'native' : 'NATIVE_ONLY');

    if (Platform.OS === "android") {
        LoginManager.setLoginBehavior("web_only")
    }
    let result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
        throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    fb_data.token = data;

    if (!data) {
        throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    fb_data.credentials = facebookCredential;

    // Sign-in the user with the credential
    fb_data.userData = await auth().signInWithCredential(facebookCredential);
    return fb_data;
};

const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await LoginManager.logOut()
      auth().signOut().then(() => console.log('Your are signed out!'));
    } catch (error) {
      console.error(error);
    }
  };

export {
    onGoogleButtonPress,
    onFacebookButtonPress,
    signOut
};