import React, { Component } from 'react';
import { Dimensions, View, } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { storeData, storeJSONData } from "../../utils/AsyncStorage";
import Globals from "../../constants/Globals";
import {
    FONT_SIZE_14,
    FONT_SIZE_20,
    FONT_SIZE_25
} from "../../styles/typography";
import { SCALE_15, SCALE_20, SCALE_30, SCALE_40, SCALE_50 } from "../../styles/spacing";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import { isNetAvailable } from "../../utils/NetAvailable";
import apiConstant from "../../constants/apiConstant";
import { COUNTRY_CODE } from "../../constants/Globals";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

const { width } = Dimensions.get('window');

// code for automatic resend otp
// let countDownTimer = 600;

class OtpVerification extends Component {

    constructor(props) {
        super(props);
        const { navigation } = props;
        this.state = {
            loading: false,
            headerText: "",
            subHeaderText: "",
            buttonText: "",
            code: "",
            fromScreen: navigation.getParam('from'),
            requestBody: navigation.getParam('requestBody'),
            token: navigation.getParam('token'),
        };
    }

    componentDidMount() {
        if (this.state.fromScreen === 'ForgotPassword') {
            this.setState({
                headerText: "Forgot Password?",
                subHeaderText: "You'll shortly receive an OTP on email or phone number to setup a new password.",
                buttonText: "Restore Password",
            });
        }
        if (this.state.fromScreen === 'SignUp') {
            this.setState({
                headerText: "Verify Your Email Or Number",
                subHeaderText: "An OTP is sent to your registered email or mobile number.",
                buttonText: "Verify Now",
            });
        }
        if (this.state.fromScreen === 'AuthLoading' || this.state.fromScreen === 'Login') {
            this.setState({
                headerText: "Verify Your Email Or Number",
                subHeaderText: "An OTP is sent to your registered email or mobile number.",
                buttonText: "Verify Now",
            });
            this.resendOtp();
        }
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    clearState = () => {
        this.setState({
            loading: false,
            code: "",
        })
    }

    VerifyOtp = (code) => {
        this.setState({ loading: true });
        let url = apiConstant.REGISTER_WITH_OTP;
        let headers = { "Content-Type": "application/json" };

        let requestBody = {
            token: this.state.token,
            otp: code,
            user_role: this.state.requestBody.user_role
        };

        console.log('requestBody verify otp => ', JSON.stringify(requestBody));

        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {
                    let data = await response.json();
                    console.log("data => ", JSON.stringify(data));
                    this.clearState();
                    if (data.status_id === 1) {
                        if (this.state.fromScreen === 'ForgotPassword') {
                            this.props.navigation.navigate('ResetPassword', { requestBody: requestBody });
                        } else {
                            if (data.user_data) {

                                await storeJSONData('user', data.user_data);
                                this.setState({ loading: false });
                                if (data.user_data.user_role == Globals.DOCTOR_ROLE_ID) {
                                    this.props.navigation.navigate(Globals.DOCTOR);
                                } else {
                                    this.props.navigation.navigate(Globals.PATIENT);
                                }
                            } else {
                                this.setState({ loading: false });
                            }
                        }
                    } else {
                        await this.setState({ loading: false });
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

    resendOtp = () => {
        this.setState({ loading: true });
        let url = apiConstant.RESEND_SIGNUP_OTP;
        let headers = { "Content-Type": "application/json" };
        let requestBody = {
            token: this.state.token,
            verify_medium: 2,  // 1= phone, 2= email 
        };

        console.log('requestBody resend OTP => ', JSON.stringify(requestBody));

        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {
                    let data = await response.json();
                    console.log("data => ", JSON.stringify(data));
                    if (data.status_id === 1) {
                        this.setState({ loading: false });
                        await this.responseOnSuccess(data);
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

    responseOnSuccess = async (data) => {
        if (data.user_data) {
            await storeJSONData('user', data.user_data);
            this.setState({ loading: false });
            if (data.user_data.role_id == Globals.DOCTOR_ROLE_ID) {
                this.props.navigation.navigate(Globals.DOCTOR);
            } else {
                this.props.navigation.navigate(Globals.PATIENT);
            }
        } else {
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <CustomBGParent loading={this.state.loading}>
                <View style={styles.textViewHeader}>
                    <CustomTextView
                        textStyle={{ marginTop: SCALE_50, marginLeft: SCALE_40, fontWeight: 'bold' }}
                        fontTextAlign={'left'}
                        fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                        fontSize={FONT_SIZE_25}
                        value={this.state.headerText} />

                    <CustomTextView
                        textStyle={{ marginTop: SCALE_15, marginLeft: SCALE_40, marginRight: SCALE_30, }}
                        fontTextAlign={'left'}
                        fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                        fontSize={FONT_SIZE_14}
                        value={this.state.subHeaderText} />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <OTPInputView
                        style={{ width: '80%', height: SCALE_30 * 5 }}
                        pinCount={6}
                        code={this.state.code}
                        onCodeChanged={code => { this.setState({ code }) }}
                        autoFocusOnLoad
                        codeInputFieldStyle={[
                            styles.underlineStyleBase,
                            {
                                backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR
                            }]}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={this.VerifyOtp}
                        placeholderCharacter={'*'}
                        placeholderTextColor={this.props.theme.BUTTON_TEXT_COLOR}
                    />
                </View>

                <View style={{ marginHorizontal: SCALE_40 }}>
                    <CustomButton
                        onPress={() => this.VerifyOtp.bind(this, this.state.code)}
                        textStyle={{ fontSize: FONT_SIZE_20, color: this.props.theme.BUTTON_TEXT_COLOR }}
                        buttonText={this.state.buttonText}
                        cornerRadius={100}
                        buttonHeight={50}
                        buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                        buttonWidth={'100%'} />
                </View>

                {/* code for automatic resend otp */}
                {/* <CustomTextView textStyle={{marginTop: SCALE_30}} fontSize={FONT_SIZE_16} fontColor={TEXT_COLOR}
                                value={'Resend confirmation code in ' + this.state.timer + ' sec'}/>*/}

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SCALE_20 }}>
                    <CustomButton
                        onPress={() => this.resendOtp()}
                        textStyle={{ fontSize: FONT_SIZE_14, color: this.props.theme.PRIMARY_TEXT_COLOR }}
                        buttonText={"Didn't receive otp? Resend"}
                        buttonHeight={SCALE_30}
                        buttonWidth={'100%'} />
                </View>
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
)(OtpVerification)