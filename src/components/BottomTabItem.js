import React, { Component } from 'react'
import { StyleSheet, Image, Dimensions, View, Text } from 'react-native'
import { Colors } from '../styles'
import { connect } from 'react-redux'

const { width, height } = Dimensions.get('window');

const baseWidth = 414;
const baseHeight = 972;

let scaleWidth = width / baseWidth;
let scaleHeight = height / baseHeight;

class BottomTabItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.isFocused
                ?
                <View style={[styles.selectedIcon, { backgroundColor: this.props.theme.SELECTED_BACKGROUND_COLOR_BOTTOM_BAR }]}>
                    <View style={{height: scaleHeight * 35, width: scaleWidth * 33 }}>
                    <Image resizeMode="contain" source={this.props.image} style={{ tintColor: this.props.theme.SELECTED_IMAGE_COLOR_BOTTOM_BAR, height: scaleHeight * 35, width: scaleWidth * 33 }} />
                    {(this.props.isBudgeCount && this.props.serviceCount > 0) &&
                        (
                            <View style={styles.numberBox}>
                                <Text style={styles.number}>{this.props.serviceCount}</Text>
                            </View>
                        )
                    }
                    </View>
                </View>
                :
                <View>
                    <Image resizeMode="contain" source={this.props.image} style={{ tintColor: this.props.theme.BUTTON_BACKGROUND_COLOR, height: scaleHeight * 35, width: scaleWidth * 33 }} />
                    {(this.props.isBudgeCount && this.props.serviceCount > 0) &&
                        (
                            <View style={styles.numberBox}>
                                <Text style={styles.number}>{this.props.serviceCount}</Text>
                            </View>
                        )
                    }
                </View>
        )
    }
}


const styles = StyleSheet.create({
    selectedIcon: {
        borderTopLeftRadius: 5, borderTopRightRadius: 5, justifyContent: 'center', alignItems: 'center', height: 65, width: 60,
    },
    numberBox: {
        position: "absolute",
        top: -5,
        right: -5,
        width: 15,
        height: 15,
        borderRadius: 7,
        zIndex: 3,
        backgroundColor: Colors.RED,
        justifyContent: "center",
        alignItems: "center"
    },
    number: { fontSize: 10, color: "#FFF", fontWeight: 'bold' },
});

const mapStateToProps = state => ({
    theme: state.themeReducer.theme,
    serviceCount: state.countReducer.serviceCount
})
export default connect(
    mapStateToProps,
)(BottomTabItem)