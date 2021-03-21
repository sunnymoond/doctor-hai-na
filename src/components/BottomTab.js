import React, { Component } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { BottomTabBar } from "react-navigation-tabs";
import { connect } from 'react-redux'

const { width, height } = Dimensions.get('window');
//Use iPhone as base size wich is 375 * 812

const baseWidth = 414;
const baseHeight = 972;

let scaleWidth = width / baseWidth;
let scaleHeight = height / baseHeight;

class BottomTab extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ backgroundColor: this.props.theme.BACKGROUND_COLOR, justifyContent: 'center', alignItems: 'center' }}>
                <BottomTabBar {...this.props} style={{ backgroundColor: this.props.theme.BACKGROUND_COLOR, paddingHorizontal: 10, width: 308, borderTopWidth: 0.6, borderTopColor: this.props.theme.BORDER_TOP_COLOR }} />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})
export default connect(
    mapStateToProps,
)(BottomTab)