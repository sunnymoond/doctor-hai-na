import React from 'react'
import { View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from "../styles";
import PropTypes from 'prop-types';
import { scaleHeight, scaleWidth } from "../styles/scaling";
import { GOOGLE } from "../images";

export default class GoogleSignIn extends React.Component {
    render() {
        return (
            <View style={[this.props.buttonStyle,{ borderRadius: 5, width: this.props.buttonWidth, height: this.props.buttonHeight }]}>
                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={0.9}
                    onPress={this.props.onPress}>
                    <Image source={GOOGLE} style={{ width: this.props.imageWidth, height: this.props.imageHeight, tintColor: Colors.WHITE }} resizeMode={"contain"} />
                </TouchableOpacity>
            </View>
        )
    }

}

GoogleSignIn.propTypes = {
    buttonStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    onPress: PropTypes.func,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
};

GoogleSignIn.defaultProps = {
    buttonStyle: {},
    buttonWidth: scaleWidth * 154,
    buttonHeight: scaleHeight * 56,
    imageWidth: scaleWidth * 36,
    imageHeight: scaleHeight * 37
};