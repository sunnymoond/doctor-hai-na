import React, { Component } from "react";
import { ActivityIndicator, View } from "react-native";
import { getData, storeData, getJSONData, storeJSONData, clearStore } from "../../utils/AsyncStorage";
import Globals from "../../constants/Globals"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { switchTheme, updateCount } from '../../redux/action'
import { darkTheme, lightTheme } from '../../styles/theme'

class AuthLoading extends Component {

    async componentDidMount() {
        const user = await getJSONData(Globals._KEYS.USER_DATA);
        console.log('user',JSON.stringify(user))
        try {
            const themeType = await getData(Globals._KEYS.THEME_TYPE);
            if (themeType != null) {
                if (themeType == Globals._KEYS.LIGHT_THEME) {
                    this.props.switchTheme(lightTheme)
                } else {
                    this.props.switchTheme(darkTheme)
                }
            } else {
                await storeData(Globals._KEYS.THEME_TYPE, Globals._KEYS.LIGHT_THEME);
                this.props.switchTheme(lightTheme)
            }

        } catch (error) {
            await storeData(Globals._KEYS.THEME_TYPE, Globals._KEYS.DARK_THEME);
            this.props.switchTheme(lightTheme)
        }
        this.applicationInit(user)

    }

    applicationInit = async (value) => {
        const { navigation } = this.props;
        console.log('value',value);
        if (value == null) {
            navigation.navigate(Globals.AUTH_LOGIN);
        } else {
            if (value.user_role == Globals.DOCTOR_ROLE_ID) {
                navigation.navigate(Globals.DOCTOR);
            } else {
                navigation.navigate(Globals.PATIENT);
            }

        }
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
    switchTheme: bindActionCreators(switchTheme, dispatch),
    updateCount: bindActionCreators(updateCount, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthLoading)
