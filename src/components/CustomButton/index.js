import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
import styles from './styles'
import { THEME_BUTTON_DISABLE } from "../../styles/colors";

export default class CustomButton extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.container, { marginTop: this.props.topMargin },
            !this.props.isSelected && { opacity: 0.5 }]}>
                {/*this.props.isSelected ?
                    <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}
                        style={[this.props.buttonStyle,
                        {
                            height: this.props.buttonHeight,
                            width: this.props.buttonWidth,
                            borderRadius: this.props.cornerRadius
                        },
                        styles.selectedButton]}>
                        <Text style={[styles.selectedText, this.props.textStyle]}>{this.props.buttonText}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}
                        style={[this.props.buttonStyle,
                        {
                            opacity: 0.5,
                            height: this.props.buttonHeight,
                            width: this.props.buttonWidth,
                            borderRadius: this.props.cornerRadius
                        },
                        styles.button]}>
                        <Text style={[styles.text, this.props.textStyle]}>{this.props.buttonText}</Text>
                    </TouchableOpacity>
                    */}
                <TouchableOpacity onPress={this.props.onPress}
                    style={[this.props.buttonStyle, styles.selectedButton, this.props.isSelected,
                    {
                        height: this.props.buttonHeight,
                        width: this.props.buttonWidth,
                        borderRadius: this.props.cornerRadius
                    },
                    ]}>
                    <Text style={[this.props.isSelected
                        ? styles.selectedText
                        : styles.text,
                    this.props.textStyle]}>
                        {this.props.buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

}

CustomButton.propTypes = {
    buttonStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    textStyle: PropTypes.object,
    buttonWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onPress: PropTypes.func,
    buttonText: PropTypes.string,
    topMargin: PropTypes.number,
    cornerRadius: PropTypes.number,
    buttonHeight: PropTypes.number,
    isSelected: PropTypes.bool,

};

CustomButton.defaultProps = {
    buttonStyle: {},
    textStyle: {},
    buttonWidth: '100%',
    buttonText: '',
    topMargin: 0,
    cornerRadius: 0,
    buttonHeight: 50,
    isSelected: true,
};