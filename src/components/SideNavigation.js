import React, { Component } from 'react';
import { View, } from 'react-native'
import CustomBGParent from "./CustomBGParent";
import { DrawerItems } from "react-navigation-drawer";
import { scaleWidth, } from "../styles/scaling";
import { connect } from 'react-redux'

class SideNavigation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<CustomBGParent topPadding={false}>
            <View
                style={{
                    width: scaleWidth * 300,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                }}>
                <DrawerItems style={{ width: scaleWidth * 300}}
                    activeBackgroundColor={'trasnparent'}
                    activeTintColor={this.props.theme.BUTTON_TEXT_COLOR}
                    {...this.props}
                />
            </View>
        </CustomBGParent>)
    }

};
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})
export default connect(
    mapStateToProps,
)(SideNavigation)