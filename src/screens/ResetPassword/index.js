import React, { Component } from 'react';
import { Dimensions, TextInput, Text, View, Image, TouchableOpacity } from 'react-native'
import CustomBGParent from "../../components/CustomBGParent";
import CustomTextView from "../../components/CustomTextView";
import { GRAY_DARK, TEXT_COLOR } from "../../styles/colors";
import styles from "./styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import { EYE_OFF, EYE_ON, PASSSET } from "../../images";
import { FONT_SIZE_12, FONT_SIZE_16, FONT_SIZE_20, FONT_SIZE_22, FONT_SIZE_25 } from "../../styles/typography";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_3, SCALE_30, SCALE_40, SCALE_50, SCALE_60 } from "../../styles/spacing";
import Modal from 'react-native-modal';
import { scaleSize } from "../../styles/mixins";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import { isNetAvailable } from "../../utils/NetAvailable";
import apiConstant from "../../constants/apiConstant";
import Globals, { COUNTRY_CODE } from "../../constants/Globals";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

const { width } = Dimensions.get('window');

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        const { navigation } = props;
        this.state = {
            loading: false,
            name: "",
            phoneNumber: "",
            location: "",
            password: "",
            passwordConfirm: "",
            OTP: "",
            isCustomerSelected: true,
            isBarberSelected: false,
            isShowPassword: false,
            isShowPasswordConfirm: false,
            isShowOTP: false,
            modalVisible: false,
            requestBody: navigation.getParam('requestBody')
        };
    }

    hideModel = () => {
        this.setState({ modalVisible: false, loading: true });
        setTimeout(() => {
            this.props.navigation.navigate('Login');
        }, 1500);

    };

    onPressResetPassword = () => {
        this.matchPassword();
    };

    onPressCancel = () => {
        this.props.navigation.navigate('Login');
    };

    showPasswordNewPassword = () => {
        if (this.state.isShowPassword) {
            this.setState({ isShowPassword: false });
        } else {
            this.setState({ isShowPassword: true });
        }
    };

    showPasswordConfirmPassword = () => {
        if (this.state.isShowPasswordConfirm) {
            this.setState({ isShowPasswordConfirm: false });
        } else {
            this.setState({ isShowPasswordConfirm: true });
        }
    };

    showOTP = () => {
        if (this.state.isShowOTP) {
            this.setState({ isShowOTP: false });
        } else {
            this.setState({ isShowOTP: true });
        }
    };

    ResetPassword = () => {
        this.setState({ loading: true });
        let url = apiConstant.RESET_PASSWORD;
        let headers = { "Content-Type": "application/json" };
        let requestBody = {
            password: this.state.password,
            user_email: this.state.requestBody.user_email,
            otp: this.state.OTP,
            user_role: this.state.requestBody.user_role,
            //phone_number: this.state.requestBody.phone_number,
        };

        console.log('requestBody reset pass => ', JSON.stringify(requestBody));

        isNetAvailable().then(success => {
            if (success) {
                fetchServerDataPost(url, requestBody, headers).then(async (response) => {

                    let data = await response.json();
                    console.log("data => ", JSON.stringify(data));
                    if (data.status_id === 200) {
                        this.setState({ loading: false, password: "", passwordConfirm: "" });
                        this.setState({ modalVisible: true });
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

    matchPassword = () => {
        if (this.state.password.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter new password');
        } else if (this.state.passwordConfirm.toString().trim().length === 0) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter confirm password');
        } else if (this.state.password.toString().trim().length < 8) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Password should be a minimum of 8 characters');
        } else if (this.state.password !== this.state.passwordConfirm) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, "Password doesn't match");
        } else if (this.state.OTP.toString().trim().length != 6) {
            this.props.showAlert(true, Globals.ErrorKey.WARNING, 'OTP should be an equal of 6 characters');
        } else {
            this.ResetPassword();
        }
    };

    render() {
        return (
            <CustomBGParent loading={this.state.loading} backGroundColor={this.props.theme.BACKGROUND_COLOR}>
                <View style={{ flex: 1 }}>
                    <View style={styles.textViewHeader}>
                        <CustomTextView
                            textStyle={{ marginTop: SCALE_50, marginLeft: SCALE_20, fontWeight: 'bold' }}
                            fontTextAlign={'left'}
                            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                            fontSize={FONT_SIZE_25}
                            value={"Reset Password"} />
                    </View>

                    <View style={[styles.cardShadow, styles.margins]}>
                        <CustomBGCard topMargin={SCALE_30} cornerRadius={10} bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                            <View style={{ marginHorizontal: SCALE_15, marginBottom: SCALE_60, marginTop: SCALE_20 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SCALE_20, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                                    <TextInput style={{ height: SCALE_50, width: '85%' }}
                                        onChangeText={text => this.setState({ password: text })}
                                        value={this.state.password}
                                        placeholder={"New Password"}
                                        secureTextEntry={!this.state.isShowPassword} />
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: SCALE_30, width: SCALE_30 }} onPress={this.showPasswordNewPassword}>
                                        <Image style={{ height: SCALE_15, width: SCALE_15 }} source={this.state.isShowPassword ? EYE_ON : EYE_OFF} />
                                    </TouchableOpacity>

                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SCALE_20, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                                    <TextInput style={{ height: SCALE_50, width: '85%' }}
                                        onChangeText={text => this.setState({ passwordConfirm: text })}
                                        value={this.state.passwordConfirm}
                                        placeholder={"Confirm Password"} secureTextEntry={!this.state.isShowPasswordConfirm} />
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: SCALE_30, width: SCALE_30 }} onPress={this.showPasswordConfirmPassword}>
                                        <Image style={{ height: SCALE_15, width: SCALE_15 }} source={this.state.isShowPasswordConfirm ? EYE_ON : EYE_OFF} />
                                    </TouchableOpacity>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SCALE_20, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                                    <TextInput style={{ height: SCALE_50, width: '85%' }}
                                        onChangeText={text => this.setState({ OTP: text })}
                                        value={this.state.OTP}
                                        placeholder={"Enter OTP"}
                                        secureTextEntry={!this.state.isShowOTP} />
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: SCALE_30, width: SCALE_30 }} onPress={this.showOTP}>
                                        <Image style={{ height: SCALE_15, width: SCALE_15 }} source={this.state.isShowOTP ? EYE_ON : EYE_OFF} />
                                    </TouchableOpacity>

                                </View>

                            </View>

                        </CustomBGCard>
                    </View>

                    <View style={{ marginHorizontal: SCALE_20, marginTop: SCALE_30 }}>
                        <CustomButton
                            onPress={() => this.onPressResetPassword()}
                            textStyle={{ fontSize: FONT_SIZE_20 }}
                            buttonText={"Reset Password"}
                            cornerRadius={100}
                            buttonHeight={SCALE_50}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
                            buttonWidth={'100%'} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SCALE_20 }}>
                        <CustomButton
                            onPress={() => this.onPressCancel()}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={"Cancel"}
                            buttonHeight={SCALE_50}
                            buttonWidth={'100%'} />
                    </View>

                    <Modal style={{ justifyContent: 'center', alignItems: 'center', }} isVisible={this.state.modalVisible}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: scaleSize(508),
                            width: scaleSize(311),
                            backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
                            borderRadius: 10
                        }}>
                            <Image style={{ height: scaleSize(136), width: scaleSize(136) }} source={PASSSET} />
                            <CustomTextView
                                textStyle={{ marginTop: scaleSize(36) }}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                value={'Your password has\nbeen reset successfully'}
                                fontSize={FONT_SIZE_22} />
                            <CustomTextView
                                fontPaddingVertical={5}
                                fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                                value={''}
                                fontSize={FONT_SIZE_12} />
                            <CustomButton
                                buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, marginTop: scaleSize(35), }]}
                                onPress={this.hideModel}
                                textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                                buttonText={"OKAY"}
                                cornerRadius={100}
                                buttonHeight={SCALE_40}
                                buttonWidth={scaleSize(100)} />
                        </View>
                    </Modal>

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
)(ResetPassword)