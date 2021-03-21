import { StyleSheet } from 'react-native'
import { Colors } from '../../styles'
import { scaleHeight, scaleWidth } from "../../styles/scaling";

export default StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: Colors.WHITE
    },
    buttonsShadow: {
        shadowColor: "#00000078",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        //backgroundColor: Colors.THEME_COLOR,
    },

    cardShadow: {
        shadowColor: "#00000029",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
        backgroundColor: Colors.WHITE
    },
    margins: {
        marginHorizontal: 20,
        elevation: 4,
        borderRadius: 10
    },

    circleText: {
        color: Colors.WHITE,
        fontSize: 18,
        lineHeight: 30,
        paddingHorizontal: 10
    },
})