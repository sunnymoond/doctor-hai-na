import React from 'react'
import { View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from "../styles";
import PropTypes from 'prop-types';
import { scaleHeight, scaleWidth } from "../styles/scaling";
import { FACEBOOK } from "../images";

export default class FaceBookSignIn extends React.Component {
    render() {
        return (
            <View style={[this.props.buttonStyle,{ borderRadius: 5, width: this.props.buttonWidth, height: this.props.buttonHeight }]}>
                <TouchableOpacity
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={0.9} onPress={this.props.onPress}>
                    <View style={{
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                        height: scaleHeight * 36,
                        width: scaleWidth * 37,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image source={FACEBOOK} resizeMode={"contain"}
                            style={{ width: this.props.imageWidth, height: this.props.imageHeight, marginTop: 5, marginLeft: scaleWidth * 8 }} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

FaceBookSignIn.propTypes = {
    buttonStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    onPress: PropTypes.func,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    bg_color: PropTypes.string
};

FaceBookSignIn.defaultProps = {
    buttonStyle: {},
    buttonWidth: scaleWidth * 154,
    buttonHeight: scaleHeight * 56,
    imageWidth: scaleWidth * 28,
    imageHeight: scaleHeight * 33,
};
