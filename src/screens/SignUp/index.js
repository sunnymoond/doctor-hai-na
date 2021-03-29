import React, { Component } from 'react';
import { Dimensions, TextInput, View, Image, TouchableOpacity, Keyboard } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import { GRAY_DARK, TEXT_COLOR } from "../../styles/colors";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import { ScrollView } from 'react-native-gesture-handler';
import { EYE_OFF, EYE_ON } from "../../images";
import { FONT_SIZE_16, FONT_SIZE_20, FONT_SIZE_25 } from "../../styles/typography";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_40, SCALE_60 } from "../../styles/spacing";
import { isNetAvailable } from "../../utils/NetAvailable";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import apiConstant from "../../constants/apiConstant";
import Globals, { COUNTRY_CODE } from "../../constants/Globals";
import { storeData, storeJSONData } from "../../utils/AsyncStorage";
import { capitalize } from "../../utils/Utills";
import { NavigationEvents } from 'react-navigation';
const { width } = Dimensions.get('window');
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            first_name: "",
            last_name: "",
            verify_medium: '',
            emailOrPhoneNumber: "",
            location: "",
            password: "",
            method: 'signup',
            isCustomerSelected: true,
            isBarberSelected: false,
            isShowPassword: false,
            userType: Globals.PATIENT,
            fcmToken: '',
            signInButtonText: Globals.CUSTOMER_SIGN_UP
        };

    }

    componentDidMount() {
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

    customerClicked = () => {
        this.setState({
            signInButtonText: Globals.CUSTOMER_SIGN_UP,
            isCustomerSelected: true,
            isBarberSelected: false,
            userType: Globals.PATIENT
        })
    };

    barberClicked = () => {
        this.setState({
            signInButtonText: Globals.BARBER_SIGN_UP,
            isCustomerSelected: false,
            isBarberSelected: true,
            userType: Globals.DOCTOR
        })
    };

    onPressSignup = () => {
        Keyboard.dismiss();
        this.signUpCheckValidity();
    };

    signUpCheckValidity = () => {
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

        if (this.state.first_name.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter first name');
        } else if (this.state.last_name.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter last name');
        } else if (this.state.emailOrPhoneNumber.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter email or phone number');
        } else if (this.state.password.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter password');
        } else if (this.state.password.toString().trim().length < 8) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Password should be a minimum of 8 characters');
        } else {
            if (!isNaN(this.state.emailOrPhoneNumber)) {
                if (this.state.emailOrPhoneNumber.toString().trim().length < 6 || this.state.emailOrPhoneNumber.toString().trim().length > 13) {
                    this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please enter a valid phone number');
                } else {
                    this.setState({ loading: true });
                    this.signUp("", this.state.emailOrPhoneNumber);
                }
            } else {
                if (validEmail.test(this.state.emailOrPhoneNumber) === false) {
                    this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please enter valid email');
                } else {
                    this.setState({ loading: true });
                    this.signUp(this.state.emailOrPhoneNumber, "");
                }
            }
        }
    };

    signUp = (email, phoneNumber) => {
        let url = apiConstant.REGISTER;
        let headers = { "Content-Type": "application/json" };

        let requestBody = {
            user_role: this.state.userType === Globals.PATIENT ? 2 : 1,
            password: this.state.password,
            email: email.toLowerCase(),
            phone_number: phoneNumber ? COUNTRY_CODE + phoneNumber : '',
            user_name: this.state.first_name + ' ' + this.state.last_name,
            fcm_id: this.state.fcmToken,
            device_type: Platform.OS,
            verify_medium: 2,  // 1= phone, 2= email 
        };

        console.log('requestBody signup => ', JSON.stringify(requestBody));
        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {

                    let data = await response.json();
                    console.log("data => ", JSON.stringify(data));
                    if (data.status_id === 1) {
                        this.setState({ loading: false });
                        this.props.navigation.navigate('OtpVerification', { token: data.token, requestBody: requestBody, from: "SignUp", message: data.status_msg });
                        this.props.showAlert(true, Globals.ErrorKey.SUCCESS, data.status_msg);
                    } else {
                        this.setState({ loading: false });
                        this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
                    }
                }).catch((error) => {
                    this.setState({ loading: false });
                    console.log("error => ", error);
                });
            } else {
                this.setState({ loading: false });
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please connect to the network');
            }
        })
    };



    showPassword = () => {
        if (this.state.isShowPassword) {
            this.setState({ isShowPassword: false });
        } else {
            this.setState({ isShowPassword: true });
        }
    };

    goToLogin = () => {
        Keyboard.dismiss();
        this.props.navigation.navigate('Login', { userType: this.state.userType });
    };

    render() {
        return (
            <CustomBGParent loading={this.state.loading} backGroundColor={this.props.theme.BACKGROUND_COLOR}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                />
                <ScrollView style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}
                    keyboardShouldPersistTaps='handled'>
                    <View style={styles.textViewHeader}>
                        <CustomTextView textStyle={{ marginTop: scaleHeight * 20, marginLeft: scaleWidth * 20, fontWeight: 'bold' }}
                            fontTextAlign={'left'} fontColor={this.props.theme.PRIMARY_TEXT_COLOR} fontSize={FONT_SIZE_25} value={"Sign Up"} />
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
                            topMargin={scaleHeight * 15}
                            cornerRadius={scaleWidth * 15}
                            bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                            <View style={styles.inputViewCards}>
                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ first_name: text })}
                                    value={this.state.first_name}
                                    placeholder={"First Name"} />

                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ last_name: text })}
                                    value={this.state.last_name}
                                    placeholder={"Last Name"} />

                                <TextInput style={styles.textInputStyle}
                                    onChangeText={text => this.setState({ emailOrPhoneNumber: text })}
                                    value={this.state.emailOrPhoneNumber}
                                    placeholder={"Your Email or Phone Number"} />

                                <View style={styles.textInputPassword}>
                                    <TextInput style={{ height: scaleHeight * 50, width: '85%' }}
                                        onChangeText={text => this.setState({ password: text })}
                                        value={this.state.password}
                                        placeholder={"Password"} secureTextEntry={!this.state.isShowPassword} />
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: scaleHeight * 35,
                                            width: scaleWidth * 35
                                        }}
                                        onPress={this.showPassword.bind(this)}>
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

                    <View style={{ marginHorizontal: scaleWidth * 20, marginTop: scaleHeight * 15 }}>
                        <CustomButton
                            onPress={() => this.onPressSignup()}
                            textStyle={{ fontSize: FONT_SIZE_20, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.state.signInButtonText}
                            cornerRadius={100}
                            buttonHeight={scaleHeight * 50}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                            buttonWidth={'100%'} />
                    </View>

                    <TouchableOpacity
                        onPress={this.goToLogin}
                        activeOpacity={0.8}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center', alignItems: 'center', marginTop: scaleHeight * 20
                            }}>
                            <CustomTextView value={"If you have an account?"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR} textStyle={{ opacity: 0.5 }} fontSize={FONT_SIZE_16} />
                            <CustomTextView
                                value={" Sign In"}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                textStyle={{ fontWeight: 'bold' }}
                                fontSize={FONT_SIZE_16} />
                        </View>
                    </TouchableOpacity>
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
)(SignUp)