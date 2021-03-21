import React, { Component } from 'react';
import { View, Image, KeyboardAvoidingView } from 'react-native'
import styles from "./styles";
import PropTypes from 'prop-types';
import CustomTextView from "../CustomTextView";
import CustomButton from "../CustomButton";
import Modal from 'react-native-modal';
import Globals from "../../constants/Globals";
import { WARNING, THUMB_UP, NETWORK_ERROR } from "../../images";
import { FONT_SIZE_12, FONT_SIZE_16, FONT_SIZE_22 } from "../../styles/typography";
import { SCALE_40, } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class AlertPopUp extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: this.props.alertVisibility,
        }
    }

    onOkayClick = () => {
        this.props.showAlert(false, '', '');
        //this.setState({ modalVisible: false, });
    }

    render() {
        //console.log(' render popup')
        return (
            <Modal
                backdropOpacity={0.8}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={1000}
                animationOutTiming={1000}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={800}
                isVisible={this.state.modalVisible}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: scaleSize(220),
                    backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
                    borderRadius: 10
                }}>

                    {
                        this.props.alertType === Globals.ErrorKey.WARNING &&
                        <Image style={{
                            height: scaleSize(50),
                            width: scaleSize(50),
                            resizeMode: 'contain',
                            tintColor: this.props.theme.YELLOW,
                        }} source={WARNING} />
                    }
                    {
                        this.props.alertType === Globals.ErrorKey.SUCCESS &&
                        <Image style={{
                            height: scaleSize(50),
                            width: scaleSize(50),
                            resizeMode: 'contain',
                            tintColor: this.props.theme.GREEN,
                        }} source={THUMB_UP} />
                    }

                    {
                        this.props.alertType === Globals.ErrorKey.NETWORK_ERROR &&
                        <Image style={{
                            height: scaleSize(50),
                            width: scaleSize(50),
                            resizeMode: 'contain',
                            tintColor: this.props.theme.RED,
                        }} source={NETWORK_ERROR} />
                    }

                    {
                        this.props.alertType === Globals.ErrorKey.ERROR &&
                        <Image style={{
                            height: scaleSize(50),
                            width: scaleSize(50),
                            resizeMode: 'contain',
                            tintColor: this.props.theme.RED,
                        }} source={WARNING} />
                    }

                    <CustomTextView
                        textStyle={{ marginTop: scaleSize(20) }}
                        fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                        value={this.props.alertType}
                        fontSize={FONT_SIZE_22} />

                    <CustomTextView
                        fontPaddingVertical={5}
                        fontColor={this.props.theme.TEXT_COLOR_GRAY}
                        value={this.props.alertMessage}
                        fontSize={FONT_SIZE_12} />

                    <CustomButton
                        buttonStyle={[styles.buttonsShadow,
                        {
                            backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                            marginTop: scaleSize(20),
                        }]}
                        onPress={() => this.onOkayClick()}
                        textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                        buttonText={'Okay'}
                        cornerRadius={100}
                        buttonHeight={SCALE_40}
                        buttonWidth={scaleSize(200)} />
                </View>

            </Modal>

        );
    }
}

AlertPopUp.propTypes = {
};

AlertPopUp.defaultProps = {
};

const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
    alertVisibility: state.alertReducer.alertVisibility,
    alertType: state.alertReducer.alertType,
    alertMessage: state.alertReducer.alertMessage,
})

const mapDispatchToProps = dispatch => ({
    showAlert: bindActionCreators(showAlert, dispatch),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AlertPopUp)
