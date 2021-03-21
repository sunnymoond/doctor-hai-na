import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY, SECONDARY, WHITE } from "../../styles/colors";
import { scaleFont, scaleSize } from "../../styles/mixins";
import { FONT_SIZE_20 } from "../../styles/typography";

const styles = StyleSheet.create({
    container: {

    },

    button: {
        //opacity: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        //opacity: 0.5,
        color: WHITE,
        fontSize: FONT_SIZE_20
    },
    selectedText: {
        color: WHITE,
        fontSize: FONT_SIZE_20
    }
});

export default styles;
