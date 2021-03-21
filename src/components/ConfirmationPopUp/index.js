import React, { Component } from 'react';
import { View } from 'react-native'
import styles from "./styles";
import PropTypes from 'prop-types';
import CustomTextView from "../CustomTextView";
import CustomButton from "../CustomButton";
import Modal from 'react-native-modal';
import { FONT_SIZE_16, } from "../../styles/typography";
import { SCALE_35, } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { connect } from 'react-redux'
import { scaleHeight, scaleWidth } from "../../styles/scaling";

class ConfirmationPopUp extends Component {
    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Modal
                backdropOpacity={0.8}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={1000}
                animationOutTiming={1000}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={800}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                isVisible={this.props.isModelVisible}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: scaleSize(150),
                    width: '100%',
                    backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
                    borderRadius: scaleSize(10)
                }}>
                    <View
                        style={{
                            paddingHorizontal: scaleWidth*20,
                            width: '100%',
                            alignItems: 'center',
                        }}>
                        <CustomTextView
                            fontPaddingVertical={5}
                            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                            value={this.props.alertMessage}
                            fontSize={FONT_SIZE_16} />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 40
                        }}>
                        <CustomButton
                            buttonStyle={[styles.buttonsShadow,
                            { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, marginTop: scaleSize(20), }]}
                            onPress={this.props.onNegativePress}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.props.negativeButtonText}
                            cornerRadius={100}
                            buttonHeight={SCALE_35}
                            buttonWidth={scaleSize(100)} />
                        <CustomButton buttonStyle={[styles.buttonsShadow,
                        { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, marginTop: scaleSize(20), }]}
                            onPress={this.props.onPositivePress}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.props.positiveButtonText}
                            cornerRadius={100}
                            buttonHeight={SCALE_35}
                            buttonWidth={scaleSize(100)} />

                    </View>
                </View>
            </Modal>
            </View>
        );
    }
}

ConfirmationPopUp.propTypes = {
    onPositivePress: PropTypes.func,
    onNegativePress: PropTypes.func,
    positiveButtonText: PropTypes.string,
    negativeButtonText: PropTypes.string,
    alertMessage: PropTypes.string,
    isModelVisible: PropTypes.bool,
};

ConfirmationPopUp.defaultProps = {
    positiveButtonText: 'Yes',
    negativeButtonText: 'No',
    alertMessage: '',
    isModelVisible: false,
};

const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
})

export default connect(
    mapStateToProps,
)(ConfirmationPopUp)
