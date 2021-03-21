import { Platform, StatusBar, StyleSheet } from 'react-native';
import { THEME_BUTTON_COLOR } from "../../styles/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textViewHeader: {
        marginTop: 10
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
        backgroundColor: THEME_BUTTON_COLOR,
    },
    buttonSection: {
        marginLeft: 20,
        marginTop: 20,
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
        marginHorizontal: 20,
        marginVertical: 10,
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
});

export default styles;
