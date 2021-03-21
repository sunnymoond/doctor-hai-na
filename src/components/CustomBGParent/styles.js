import { Platform, StatusBar, StyleSheet } from 'react-native';
import { BACKGROUND_COLOR, BLACK, GRAY_LIGHT, PRIMARY, SECONDARY, WHITE } from "../../styles/colors";
import { scaleFont, scaleSize } from "../../styles/mixins";
import { ifIphoneX } from "../../utils/iPhoneXHelper";

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? (ifIphoneX() ? 50 : 20) : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    statusBar: {
        height: STATUSBAR_HEIGHT,
    },
    content: {
        flex: 1,
        //backgroundColor: BACKGROUND_COLOR,
    },
});

export default styles;
