import { Platform, StatusBar, StyleSheet } from 'react-native';
import { GRAY_DARK, THEME_BUTTON_COLOR } from "../../styles/colors";
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import { FONT_SIZE_16, } from "../../styles/typography";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textViewHeader: {
        marginTop: scaleHeight * 5
    },
    buttonsShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 10,
        backgroundColor: THEME_BUTTON_COLOR
    },
    buttonSection: {
        marginLeft: scaleWidth * 20,
        marginTop: scaleHeight * 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 7,
    },
    margins: {
        marginHorizontal: scaleWidth * 20,
        marginVertical: scaleHeight * 10,
    },
    signUpButtonsShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 10,
        backgroundColor: THEME_BUTTON_COLOR,
        width: '100%'
    },
    textInputStyle: {
        fontSize: FONT_SIZE_16,
        height: scaleHeight * 50,
        borderColor: GRAY_DARK,
        borderBottomWidth: 1,
        marginTop: scaleHeight * 20
    },
    textInputPassword: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: scaleHeight * 20,
        borderBottomWidth: 1,
        borderColor: GRAY_DARK,
    },
    inputViewCards: {
        marginHorizontal: scaleWidth * 15,
        marginBottom: scaleHeight * 60,
        marginTop: scaleHeight * 20
    }
});

export default styles;
