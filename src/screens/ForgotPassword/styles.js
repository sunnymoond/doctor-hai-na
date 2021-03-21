import { Platform, StatusBar, StyleSheet } from 'react-native';
import { GRAY_MEDIUM, THEME_BUTTON_COLOR } from "../../styles/colors";
import { SCALE_10, SCALE_20, SCALE_50 } from "../../styles/spacing";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textViewHeader: {
        marginTop: SCALE_10
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
        marginLeft: SCALE_20,
        marginTop: SCALE_20,
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
        marginHorizontal: SCALE_20,
        marginVertical: SCALE_10,
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
