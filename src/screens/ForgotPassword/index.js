import React, { Component } from 'react';
import { Dimensions, TextInput, View, Image, TouchableOpacity } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import { GRAY_DARK, TEXT_COLOR, THEME_BUTTON_COLOR } from "../../styles/colors";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import { EYE_OFF, EYE_ON } from "../../images";
import { FONT_SIZE_16, FONT_SIZE_20, FONT_SIZE_25 } from "../../styles/typography";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_30, SCALE_40, SCALE_50, SCALE_60 } from "../../styles/spacing";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import { isNetAvailable } from "../../utils/NetAvailable";
import apiConstant from "../../constants/apiConstant";
import Globals, { COUNTRY_CODE } from "../../constants/Globals";
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'
const { width } = Dimensions.get('window');

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        const { navigation } = props;
        this.state = {
            loading: false,
            phoneNumberOrEmail: '',
            userType: navigation.getParam('userType'),
        };
    }

    componentDidMount() {

    }

    forgotPassword = (email, phoneNumber) => {
        this.setState({ loading: true });
        let url = apiConstant.RESET_PASSWORD_OTP;
        let headers = { "Content-Type": "application/json" };
        let requestBody = {
            user_role: this.state.userType === Globals.DOCTOR ? Globals.DOCTOR_ROLE_ID : Globals.PATIENT_ROLE_ID,
            user_email: email.toLowerCase(),
            //phone_number: phoneNumber ? COUNTRY_CODE + phoneNumber : ''
        };

        console.log('requestBody => ', JSON.stringify(requestBody));
        console.log('url => ', JSON.stringify(url));

        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {
                    let data = await response.json();
                    console.log("data => ", JSON.stringify(data));
                    if (data.status_id === 200) {
                        this.setState({ loading: false });
                        this.props.navigation.navigate('ResetPassword', { requestBody: requestBody });
                    } else {
                        this.setState({ loading: false });
                        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, data.status_msg);
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

    onPressForgotPassword = () => {
        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/

        if (this.state.phoneNumberOrEmail.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter email or mobile number');
        } else {
            if (!isNaN(this.state.phoneNumberOrEmail)) {
                if (this.state.phoneNumberOrEmail.toString().trim().length < 6 || this.state.phoneNumberOrEmail.toString().trim().length > 13) {
                    this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter a valid mobile number');
                } else {
                    this.forgotPassword("", this.state.phoneNumberOrEmail);
                }
            } else {
                if (validEmail.test(this.state.phoneNumberOrEmail) === false) {
                    this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter a valid email address');
                } else {
                    this.forgotPassword(this.state.phoneNumberOrEmail, "");
                }
            }
        }
    };

    onPressCancel = () => {
        this.props.navigation.navigate('Login');
    };

    render() {
        return (
            <CustomBGParent loading={this.state.loading} backGroundColor={this.props.theme.BACKGROUND_COLOR}>

                <View style={styles.textViewHeader}>
                    <CustomTextView textStyle={{ marginTop: SCALE_40, marginLeft: SCALE_40, fontWeight: 'bold' }}
                        fontTextAlign={'left'} fontColor={this.props.theme.PRIMARY_TEXT_COLOR} fontSize={FONT_SIZE_25} value={"Forgot Password?"} />
                </View>

                <View style={[styles.cardShadow, styles.margins]}>
                    <CustomBGCard topMargin={SCALE_40} cornerRadius={SCALE_10} bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                        <View style={{ marginHorizontal: SCALE_15, marginBottom: SCALE_60, marginTop: SCALE_10 }}>
                            <TextInput style={{ height: SCALE_50, borderColor: GRAY_DARK, borderBottomWidth: 1, marginTop: SCALE_20 }}
                                onChangeText={text => this.setState({ phoneNumberOrEmail: text })}
                                value={this.state.phoneNumberOrEmail}
                                placeholder={"Your Email or Phone"} />
                        </View>

                    </CustomBGCard>
                </View>
                <View style={{ marginHorizontal: SCALE_20, marginTop: SCALE_30 }}>
                    <CustomButton
                        onPress={this.onPressForgotPassword}
                        textStyle={{ fontSize: FONT_SIZE_20, color: this.props.theme.BUTTON_TEXT_COLOR }}
                        buttonText={"Send"}
                        cornerRadius={100}
                        buttonHeight={scaleHeight * 50}
                        buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                        buttonWidth={'100%'} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SCALE_20 }}>
                    <CustomButton
                        onPress={this.onPressCancel}
                        textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.PRIMARY_TEXT_COLOR }}
                        buttonText={"Cancel"}
                        buttonHeight={SCALE_50}
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
)(ForgotPassword)