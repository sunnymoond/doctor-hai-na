import { StyleSheet } from 'react-native'
import { WHITE, GRAY_DARK, BLACK } from "../../styles/colors";
import { Typography } from '../../styles'
import { SCALE_10,SCALE_15, SCALE_20, SCALE_40, SCALE_60 } from "../../styles/spacing";
import { scaleWidth, scaleHeight } from "../../styles/scaling";

export default StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor: WHITE
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
        backgroundColor: WHITE
    },
    margins: {
        marginHorizontal: 20,
        elevation: 4,
        borderRadius: 10
    },
    inputViewCards: {
        marginHorizontal: SCALE_15,
        marginBottom: SCALE_60,
        marginTop: SCALE_20
    },
    textInputStyle: {
        fontSize: Typography.FONT_SIZE_16,
        height: SCALE_40,
        borderColor: GRAY_DARK,
        borderBottomWidth: 1,
        marginTop: SCALE_10,
        color: BLACK
    },
    circleText: {
        color: WHITE,
        fontSize: 22,
        lineHeight: 30,
        paddingHorizontal: 10
    },
    crossIcon: {
        position: "absolute",
        top: -10,
        right: -10,
        width: 28,
        height: 28,
        borderRadius: 14,
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center"
    },
    crossIconDelete: {
        position: "absolute",
        top: 0,
        right: scaleWidth * 110,
        bottom: 0,
        width: scaleWidth * 28,
        height: scaleWidth * 28,
        borderRadius: 14,
        zIndex: 3,
        justifyContent: "center",
        alignItems: "center"
    },
})