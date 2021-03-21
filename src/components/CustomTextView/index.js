import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { FONT_SIZE_12 } from "../../styles/typography";

export default class CustomTextView extends Component {

    render() {
        return (
            <Text numberOfLines={this.props.noOfLines}
                style={[this.props.textStyle, {
                    backgroundColor: this.props.backGroundColor,
                    // fontFamily: this.props.FontName,
                    flex: this.props.textFlex,
                    fontSize: this.props.fontSize,
                    color: this.props.fontColor,
                    textAlign: this.props.fontTextAlign,
                    paddingVertical: this.props.fontPaddingVertical,
                    paddingHorizontal: this.props.fontPaddingHorizontal,
                }]}>
                {this.props.value}
            </Text>
        );
    }
}

CustomTextView.propTypes = {
    textStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    backGroundColor: PropTypes.string,
    textFlex: PropTypes.number,
    noOfLines: PropTypes.number,
    value: PropTypes.string,
    fontColor: PropTypes.string,
    fontSize: PropTypes.number,
    fontTextAlign: PropTypes.string,
    fontPaddingVertical: PropTypes.number,
    fontPaddingHorizontal: PropTypes.number,
    fontName: PropTypes.string
};

CustomTextView.defaultProps = {
    textStyle: {},
    backGroundColor: 'transparent',
    value: "Default text",
    fontColor: "#000000",
    fontSize: FONT_SIZE_12,
    noOfLines: undefined,
    fontTextAlign: 'center',
    fontPaddingVertical: 1,
    fontPaddingHorizontal: 1,
    fontName: ''
};
