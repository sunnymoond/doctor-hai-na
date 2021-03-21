import React, { Component } from 'react';
import { ScrollView, TextInput, View, Image, TouchableOpacity, Keyboard, Platform } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import { GRAY_DARK, TEXT_COLOR } from "../../styles/colors";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import { EYE_OFF, EYE_ON } from "../../images";
import { FONT_SIZE_16, FONT_SIZE_20, FONT_SIZE_25 } from "../../styles/typography";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_40, SCALE_60 } from "../../styles/spacing";
import { Spacing, Typography } from '../../styles'
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import { isNetAvailable } from "../../utils/NetAvailable";
import { onFacebookButtonPress, onGoogleButtonPress } from "../../utils/socialLoginAuth";
import GoogleSignIn from "../../components/GoogleSignIn";
import FaceBookSignIn from "../../components/FaceBookSignIn";
import Globals from "../../constants/Globals";
import { COUNTRY_CODE } from "../../constants/Globals";
import apiConstant from "../../constants/apiConstant";
import { capitalize, isEmpty } from "../../utils/Utills"
import { NavigationEvents } from 'react-navigation';
import { getData, storeData, storeJSONData } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import messaging from '@react-native-firebase/messaging';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            emailOrPhone: "",
            location: "",
            password: "",
            method: 'login',
            isCustomerSelected: true,
            isBarberSelected: false,
            isShowPassword: false,
            isEmail: false,
            facebook_id: '',
            google_id: '',
            first_name: '',
            last_name: '',
            userType: Globals.PATIENT,
            fcmToken: '',
            signInButtonText: Globals.PATIENT_SIGN_IN
        };

    }

    componentDidMount() {
        this.requestUserPermission();
    }

    _onFocus = () => {
        const { navigation } = this.props;
        const userType = navigation.getParam('userType');
        if (userType === Globals.PATIENT) {
            this.customerClicked();
        }
        if (userType === Globals.DOCTOR) {
            this.barberClicked();
        }
    }

    clearStore = () => {
        this.setState({
            emailOrPhone: '',
            facebook_id: '',
            google_id: '',
            first_name: '',
            last_name: '',
        });
    }

    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            this.getToken();
            console.log('Authorization status:', authStatus);
        }
    }

    getToken = () => {
        messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                console.log("fcmToken", fcmToken);
                this.setState({ fcmToken: fcmToken });
            } else {
                console.log("no token found");
            }
        });
    }

    customerClicked = async () => {
        await this.setState({
            signInButtonText: Globals.PATIENT_SIGN_IN,
            isCustomerSelected: true,
            isBarberSelected: false,
            userType: Globals.PATIENT
        })
    };

    barberClicked = async () => {
        await this.setState({
            signInButtonText: Globals.DOCTOR_SIGN_IN,
            isCustomerSelected: false,
            isBarberSelected: true,
            userType: Globals.DOCTOR
        })
    };

    onSuccessGoogleSignin = () => {
        this.clearStore();
        Keyboard.dismiss();
        //this.props.showAlert(true, Globals.ErrorKey.SUCCESS,'Comeing soon... jai singh');
        //return
        isNetAvailable().then(success => {
            if (success) {
                onGoogleButtonPress().then(async (user) => {
                    this.setState({
                        loading: true,
                        google_id: user.userData.user.uid,
                        emailOrPhone: user.userData.user.email,
                        first_name: user.userData.user.displayName.split(' ')[0].trim(),
                        last_name: user.userData.user.displayName.split(' ')[1].trim()
                    });
                    console.log('Google Data: uid = ' + user.userData.user.uid + ' email= ' + user.userData.user.email);
                    let response = await this.checkEmailOrPhone();
                    if (response) {
                        this.callLoginApi();
                    } else {
                        this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter a valid phone number or email address.');
                    }
                }).catch(error => {
                    console.log(error)
                })
            } else {
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
            }
        });
    };

    onSuccessFaceBookSignIn = () => {
        this.clearStore();
        Keyboard.dismiss();
        //this.props.showAlert(true, Globals.ErrorKey.SUCCESS,'Comeing soon... jai singh');
        //return
        isNetAvailable().then(success => {
            if (success) {
                onFacebookButtonPress().then(async (data) => {
                    console.log('Facebook Data: = ' + JSON.stringify(data));
                    /*this.setState({
                        facebook_id: data.userData.user.uid,
                        emailOrPhone: data.userData.user.email,
                        first_name: data.userData.user.displayName.split(' ')[0].trim(),
                        last_name: data.userData.user.displayName.split(' ')[1].trim()
                    });*/
                    this.setState({
                        facebook_id: data.userData.user.uid,
                        emailOrPhone: data.userData.additionalUserInfo.profile.email,
                        first_name: data.userData.additionalUserInfo.profile.first_name,
                        last_name: data.userData.additionalUserInfo.profile.last_name
                    });
                    console.log('Facebook Data: uid = ' + data.userData.user.uid + ' email= ' + data.userData.user.email);
                    let response = await this.checkEmailOrPhone();
                    if (response) {
                        this.callLoginApi();
                    } else {
                        this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter a valid phone number or email address.');
                    }
                }).catch((error) => {
                    console.log("error => ", error);
                })
            } else {
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
            }
        });
    };

    onPressSignIN = async () => {
        Keyboard.dismiss();
        if (this.state.emailOrPhone.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter email or mobile number');
        } else if (this.state.password.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter password');
        } else {
            let response = await this.checkEmailOrPhone();
            if (response) {
                this.callLoginApi();
            } else {
                this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please enter a valid phone number or email address');
            }
        }
    };

    callLoginApi = async () => {
        await this.setState({ loading: true });
        const url = apiConstant.LOGING;
        let mediaType = '';
        let mediaToken = '';
        let loginType = '1';//1-Email,2-Social

        if (!isEmpty(true, this.state.facebook_id)) {
            loginType = '2';//2-Social
            mediaType = '1';//1-Facebook
            mediaToken = this.state.facebook_id;
        }
        if (!isEmpty(true, this.state.google_id)) {
            loginType = '2';//2-Social
            mediaType = '2';//2-Google
            mediaToken = this.state.google_id;
        }
        const requestBody = {
            media_type: mediaType,
            media_token: mediaToken,
            login_type: loginType,
            device_type: Platform.OS,
            user_role: this.state.userType === Globals.PATIENT ? Globals.PATIENT_ROLE_ID : Globals.DOCTOR_ROLE_ID,
            user_name : this.state.first_name +' '+this.state.last_name,
            email: this.state.isEmail ? this.state.emailOrPhone : '',
            password: this.state.password,
            //phone_number: this.state.isEmail ? '' : COUNTRY_CODE + this.state.emailOrPhone, //+91-9001807825,
            fcm_id: this.state.fcmToken,
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }

        console.log('DoctorHaiNa url==> ' + JSON.stringify(url));
        console.log('DoctorHaiNa requestBody ==> ' + JSON.stringify(requestBody));
        console.log('DoctorHaiNa headers ==> ' + JSON.stringify(headers));

        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {
                    let data = await response.json();
                    console.log('data ==> ' + JSON.stringify(data));
                    /*if (data.status.code === 200) {
                        await this.setState({ loading: false });
                        if (data.result.user.is_otp_verified) {
                            await this.responseOnSuccess(data);
                        } else {
                            this.props.navigation.navigate('OtpVerification', { requestBody: requestBody, from: "Login", message: "" });
                        }
                    } else {
                        await this.setState({ loading: false });
                        alert(data.status.message);
                    }*/
                    if (data.status_id === 1) {
                        await this.setState({ loading: false });
                        await this.responseOnSuccess(data);
                    } else {
                        await this.setState({ loading: false });
                        this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
                    }
                }).catch(error => {
                    this.setState({ loading: false });
                    console.log("Login error : ", error);
                });
            } else {
                this.setState({ loading: false });
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
            }
        });
    }

    responseOnSuccess = async (data) => {
        if (data.user_data) {
            await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
            this.setState({ loading: false });
            if (data.user_data.user_role == Globals.DOCTOR_ROLE_ID) {
                this.props.navigation.navigate(Globals.DOCTOR);
            } else {
                this.props.navigation.navigate(Globals.PATIENT);
            }
        } else {
            this.setState({ loading: false });
        }
    };

    onPressSignUp = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate('SignUp', { userType: this.state.userType });
    };

    onPressForgotPassword = () => {
        this.props.navigation.navigate('ForgotPassword', { userType: this.state.userType });
    };

    showPassword = () => {
        if (this.state.isShowPassword) {
            this.setState({ isShowPassword: false });
        } else {
            this.setState({ isShowPassword: true });
        }

    };

    checkEmailOrPhone = async () => {
        if (isNaN(this.state.emailOrPhone)) {
            // If the Given Value is Not Number Then It Will Return True and This Part Will Execute.
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (this.isEmailOrPhoneValid(reg)) {
                await this.setState({ isEmail: true, emailOrPhone: this.state.emailOrPhone.toLowerCase() });
                return true;
            } else {
                return false;
            }
        }
        else {
            // If the Given Value is Number Then It Will Return False and This Part Will Execute.
            const reg = /^[0]?[789]\d{9}$/;
            if (this.isEmailOrPhoneValid(reg)) {
                await this.setState({ isEmail: false });
                return true;
            } else {
                return false;
            }
        }
    }

    isEmailOrPhoneValid = (reg) => {
        if (reg.test(this.state.emailOrPhone) === false) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        return (
            <CustomBGParent loading={this.state.loading} backGroundColor={this.props.theme.BACKGROUND_COLOR}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                />
                <ScrollView style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}
                    keyboardShouldPersistTaps='handled'>
                    <View style={styles.textViewHeader}>
                        <CustomTextView textStyle={{ marginTop: scaleHeight * 50, marginLeft: scaleWidth * 20, fontWeight: 'bold' }}
                            fontTextAlign={'left'} fontColor={this.props.theme.PRIMARY_TEXT_COLOR} fontSize={Typography.FONT_SIZE_25} value={"Sign In"} />
                    </View>

                    <View style={styles.buttonSection}>
                        <CustomButton
                            isSelected={this.state.isCustomerSelected}
                            onPress={this.customerClicked}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={capitalize(Globals.PATIENT)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 150}
                            buttonHeight={scaleHeight * 35}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]} />
                        <View style={{ width: scaleWidth * 10 }} />
                        <CustomButton
                            isSelected={this.state.isBarberSelected}
                            onPress={this.barberClicked}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={capitalize(Globals.DOCTOR)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 150}
                            buttonHeight={scaleHeight * 35}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]} />
                    </View>

                    <View style={[styles.cardShadow, styles.margins]}>
                        <CustomBGCard
                            topMargin={scaleHeight * 20}
                            cornerRadius={10}
                            bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                            <View
                                style={{
                                    marginHorizontal: scaleWidth * 15,
                                    marginBottom: scaleHeight * 60,
                                    marginTop: scaleHeight * 20
                                }}>
                                <TextInput
                                    style={{
                                        fontSize: FONT_SIZE_16,
                                        height: scaleHeight * 50,
                                        borderColor: GRAY_DARK,
                                        borderBottomWidth: 1,
                                        marginTop: scaleHeight * 20
                                    }}
                                    onChangeText={text => this.setState({ emailOrPhone: text })}
                                    value={this.state.emailOrPhone}
                                    placeholder={"Your Email or Phone"} />

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: scaleHeight * 20,
                                        borderBottomWidth: 1,
                                        borderColor: GRAY_DARK,
                                    }}>
                                    <TextInput
                                        style={{
                                            fontSize: FONT_SIZE_16,
                                            height: scaleHeight * 50,
                                            width: '85%'
                                        }}
                                        onChangeText={text => this.setState({ password: text })}
                                        value={this.state.password}
                                        placeholder={"Password"}
                                        secureTextEntry={!this.state.isShowPassword} />
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: scaleHeight * 35,
                                            width: scaleWidth * 35
                                        }}
                                        onPress={this.showPassword}>
                                        <Image
                                            style={{
                                                height: scaleHeight * 15,
                                                width: scaleWidth * 15
                                            }}
                                            source={this.state.isShowPassword ? EYE_ON : EYE_OFF} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </CustomBGCard>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: scaleHeight * 10,
                            marginHorizontal: scaleWidth * 20,
                        }}>
                        <TouchableOpacity onPress={this.onPressForgotPassword} >
                            <CustomTextView
                                value={"Forgot Password?"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                fontSize={FONT_SIZE_16} />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            marginHorizontal: scaleWidth * 20,
                            marginTop: scaleHeight * 30
                        }}>
                        <CustomButton
                            onPress={() => this.onPressSignIN()}
                            textStyle={{
                                fontSize: FONT_SIZE_20,
                                color: this.props.theme.BUTTON_TEXT_COLOR
                            }}
                            buttonText={this.state.signInButtonText}
                            cornerRadius={100}
                            buttonHeight={scaleHeight * 50}
                            buttonStyle={[styles.buttonsShadow,
                            { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                            buttonWidth={Spacing.SCALE_320} />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        marginTop: scaleHeight * 15,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{ marginRight: scaleWidth * 7 }}>
                            <GoogleSignIn
                                onPress={() => this.onSuccessGoogleSignin()}
                                buttonStyle={{ backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }}
                                buttonHeight={scaleHeight * 50}
                                buttonWidth={scaleWidth * 154}
                                imageHeight={scaleHeight * 37}
                                imageWidth={scaleWidth * 36} />
                        </View>
                        <View style={{ marginLeft: scaleWidth * 7 }}>
                            <FaceBookSignIn
                                onPress={() => this.onSuccessFaceBookSignIn()}
                                buttonStyle={{ backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }}
                                buttonHeight={scaleHeight * 50}
                                buttonWidth={scaleWidth * 154}
                                imageWidth={scaleWidth * 28}
                                imageHeight={scaleHeight * 33} />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: scaleHeight * 40
                        }}>
                        <CustomTextView
                            value={"Don't have an account?"}
                            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                            textStyle={{ opacity: 0.5 }}
                            fontSize={FONT_SIZE_16} />
                        <TouchableOpacity onPress={this.onPressSignUp} >
                            <CustomTextView
                                value={" Sign Up"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                textStyle={{ fontWeight: 'bold' }}
                                fontSize={FONT_SIZE_16} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </CustomBGParent>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
    showAlert: bindActionCreators(showAlert, dispatch),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)