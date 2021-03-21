import React, { Component } from 'react';
import { View, Image, ActivityIndicator } from 'react-native'
import { LOADING, NO_IMAGE, } from "../../images";
import PropTypes from 'prop-types';
import { isEmpty } from "../../utils/Utills";
import { connect } from 'react-redux'
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

class ImageComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imagUrlValidate: true,
      loading: true,
    }
  }

  componentDidMount() {
    this.checkImgUrl(this.props.imageUrl);
    if (this.props.imageUrl) {
      Image.prefetch(this.props.imageUrl);
    }
  }

  _onLoad = () => {
    //console.log('onLoad');
  };

  _onLoadEnd = () => {
    //console.log('onLoadEnd')
    this.setState({
      loading: true
    })
  };

  _onLoadStart = () => {
    //console.log('onLoadStart');
  };

  checkImgUrl = (url) => {
    fetch(url)
      .then(res => {
        if (res.ok) {
          this.setState({ imagUrlValidate: true })
        } else {
          this.setState({ imagUrlValidate: false })
        }
      }).catch(err => {
        this.setState({ imagUrlValidate: false })
      });
  }

  render() {
    return (
      <View
        style={{
          height: this.props.imageHeight,
          width: this.props.imageWidth,
        }}>
        {this.state.loading &&
          <ShimmerPlaceholder
            style={{
              position: 'absolute',
              height: this.props.imageHeight,
              width: this.props.imageWidth,
              borderRadius: this.props.imageBorderRadius,
            }}
            shimmerColors={[
              this.props.theme.SHIMMER_COLOR_1,
              this.props.theme.SHIMMER_COLOR_2,
              this.props.theme.SHIMMER_COLOR_3]}
            LinearGradient={LinearGradient}
          />
        }
        {isEmpty(true, this.props.imageUrl) ? (
          <Image
            style={{
              alignSelf: 'stretch',
              height: this.props.imageHeight,
              width: this.props.imageWidth,
              borderRadius: this.props.imageBorderRadius,
              borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
              borderWidth: 1
            }}
            source={NO_IMAGE}
            onLoadEnd={() => this._onLoadEnd()}
            resizeMode="cover" />
        ) : (
            this.state.imagUrlValidate ? (
              <View
                style={{
                  alignSelf: 'stretch',
                  height: this.props.imageHeight,
                  width: this.props.imageWidth,
                  borderRadius: this.props.imageBorderRadius
                }}>
                <Image
                  //onLoad={() => this._onLoad()}
                  //onLoadStart={() => this._onLoadStart()}
                  onLoadEnd={() => this._onLoadEnd()}
                  source={{ uri: this.props.imageUrl }}
                  style={{
                    alignSelf: 'stretch',
                    height: this.props.imageHeight,
                    width: this.props.imageWidth,
                    borderRadius: this.props.imageBorderRadius,
                    borderWidth: 1,
                    borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                  }} resizeMode="cover" />
              </View>
            ) : (
                <Image
                  style={{
                    alignSelf: 'stretch',
                    height: this.props.imageHeight,
                    width: this.props.imageWidth,
                    borderRadius: this.props.imageBorderRadius,
                    borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    borderWidth: 1
                  }}
                  source={NO_IMAGE}
                  onLoadEnd={() => this._onLoadEnd()}
                  resizeMode="cover" />
              )
          )
        }
      </View>
    );
  }
}

ImageComponent.propTypes = {
  imageWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  imageHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  imageBorderRadius: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  imageUrl: PropTypes.string,
};

ImageComponent.defaultProps = {
  imageUrl: '',
  imageWidth: '',
  imageHeight: '',
  imageBorderRadius: '0',
};

const mapStateToProps = state => ({
  theme: state.themeReducer.theme
})

export default connect(
  mapStateToProps,
)(ImageComponent)