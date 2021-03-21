import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ifIphoneX } from "../../utils/iPhoneXHelper";
import OfflineNotice from "../../utils/OfflineNotice";
import Spinner from 'react-native-loading-spinner-overlay';
import { PRIMARY, WHITE } from "../../styles/colors";
import PropTypes from 'prop-types';
import styles, { STATUSBAR_HEIGHT } from "./styles";
import { connect } from 'react-redux'

const MyStatusBar = ({ backgroundColor, ...props }) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
);

class CustomBGParent extends Component {

    constructor(props) {
        super(props);

        if (Platform.OS === 'ios') {
            this.state = { statusbar: false }
        } else {
            this.state = { statusbar: true }
        }
    }

    render() {

        return (
           // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
                <View style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
                    {Platform.OS === 'android' &&
                     <MyStatusBar
                        translucent backgroundColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                        barStyle="light-content" />}

                    <View style={[styles.content, { backgroundColor: this.props.theme.BACKGROUND_COLOR, paddingTop: this.props.topPadding ? STATUSBAR_HEIGHT : 0 }]}>
                        <OfflineNotice />
                        {this.props.children}
                    </View>

                    <Spinner
                        overlayColor={"rgba(34, 60, 83, 0.6)"}
                        visible={this.props.loading}
                        textContent={'Loading...'}
                        textStyle={{ color: '#FFF' }}
                    />

                </View>
            //</TouchableWithoutFeedback>

        );
    }
}

CustomBGParent.propTypes = {
    backGroundColor: PropTypes.string,
    loading: PropTypes.bool,
    topPadding: PropTypes.bool
};

CustomBGParent.defaultProps = {
    backGroundColor: '',
    loading: false,
    topPadding: true,
};

const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})
export default connect(
    mapStateToProps,
)(CustomBGParent)

