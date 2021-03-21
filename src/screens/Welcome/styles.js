import { StyleSheet } from 'react-native'
import { Spacing, Colors, Typography } from '../../styles'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column'
    },
    title: {
        width: '100%',
        textAlign: 'center',
        marginBottom: Spacing.SCALE_10,
        marginTop: Spacing.SCALE_10,
        fontSize: Typography.FONT_SIZE_18,
        fontWeight: 'bold'
    },
    subTitle: {
        width: '100%',
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_14,
    },
    slider: {
        width: '100%',
        height: '100%',
        overflow: 'visible', // for custom animations
        //backgroundColor: 'red'
    },
    sliderContentContainer: {
        paddingVertical: 0 // for custom animation
    },
    sliderCarousel: {
        marginTop: Spacing.SCALE_10,
        overflow: 'visible' // for custom animations
    },
    button: {
        width: '80%',
        marginLeft: Spacing.SCALE_30,
        borderRadius: Spacing.SCALE_25,
        paddingTop: Spacing.SCALE_10,
        paddingBottom: Spacing.SCALE_10,
        marginBottom: Spacing.SCALE_30,
        //backgroundColor: Colors.BLUE_BERRY,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: Spacing.SCALE_6,
        shadowRadius: Spacing.SCALE_15,
        shadowOffset: { width: 1, height: 13 },
    },
    dotStyle: {
        width: Spacing.SCALE_10,
        height: Spacing.SCALE_10,
        borderRadius: Spacing.SCALE_5,
        //backgroundColor: Colors.BLACK,
        marginHorizontal: -Spacing.SCALE_10,
    },
    inactiveDotStyle: {
        width: Spacing.SCALE_10,
        height: Spacing.SCALE_10,
        borderRadius: Spacing.SCALE_5,
        //backgroundColor: Colors.BLACK,
        marginHorizontal: -Spacing.SCALE_10,
    },
    paginationContainerStyle: {
        backgroundColor: 'transparent',
        marginBottom: Spacing.SCALE_10
    },
    imageStyle: {
        width: '100%',
        height: '70%',
        borderRadius: Spacing.SCALE_20
    },
    infoViewStyle: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: Spacing.SCALE_10
    },
    welcomeStyle: {
        width: '100%',
        textAlign: 'left',
        marginLeft: Spacing.SCALE_30,
        marginTop: Spacing.SCALE_40,
        fontSize: Typography.FONT_SIZE_30,
        fontWeight: 'bold'
    },
    startNow: {
        textAlign: 'center',
        marginHorizontal: '20%',
        fontSize: Typography.FONT_SIZE_20,
        //color: Colors.WHITE
    }
})