import { StyleSheet } from 'react-native';
import { BLACK, GRAY_LIGHT, PRIMARY, SECONDARY, WHITE } from "../../styles/colors";
import { scaleFont, scaleSize } from "../../styles/mixins";

const styles = StyleSheet.create({
    buttonsShadow: {
        shadowColor: "#00000078",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
});

export default styles;
