import React, { Component } from 'react';
import { View, Image, } from 'react-native'
import PropTypes from 'prop-types';
import CustomTextView from "../CustomTextView";
import { WARNING } from "../../images";
import { FONT_SIZE_22 } from "../../styles/typography";
import { scaleSize } from "../../styles/mixins";
import { connect } from 'react-redux'

class EmptyView extends Component {

    render() {
        //console.log(' render popup')
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Image style={{
                    height: scaleSize(50),
                    width: scaleSize(50),
                    resizeMode: 'contain',
                    tintColor: this.props.theme.IMAGE_TINT_COLOR,
                }} source={WARNING} />

                <CustomTextView
                    textStyle={{ marginTop: scaleSize(20) }}
                    fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                    value={this.props.EmptyText}
                    fontSize={FONT_SIZE_22} />

            </View>
        );
    }
}

EmptyView.propTypes = {
    EmptyText: PropTypes.string,
};

EmptyView.defaultProps = {
    EmptyText: '',
};

const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

export default connect(
    mapStateToProps,
)(EmptyView)
