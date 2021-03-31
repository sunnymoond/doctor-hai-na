import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Typography } from "../../styles";
import { BOOKING_PACK_CIRCLE } from "../../images";
import PropTypes from "prop-types";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import RatingComponent from "../../components/TapRating";
import ImageComponent from "../ImageComponent";
import apiConstant from "../../constants/apiConstant";
import { COUNTRY_CODE } from "../../constants/Globals";
import { isEmpty } from "../../utils/Utills";
import { connect } from "react-redux";

class DocumentView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.props.onItemPress}>
        <View
          style={{
            width: this.props.viewWidth,
            height: this.props.viewHeight,
            marginHorizontal: scaleWidth * 20,
            marginBottom: scaleHeight * 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                borderWidth: 1,
                marginTop: scaleHeight * 10,
                height: this.props.viewHeight,
                width: this.props.viewWidth,
                marginStart: scaleWidth * 90,
                borderRadius: scaleWidth * 15,
                backgroundColor: this.props.theme.CARD_BACKGROUND_COLOR,
              }}
            >
              {this.props.item.is_checked && (
                <Image
                  source={BOOKING_PACK_CIRCLE}
                  style={[
                    styles.crossIcon,
                    {
                      height: scaleHeight * 18,
                      width: scaleHeight * 18,
                      tintColor: "green",
                    },
                  ]}
                  resizeMode="cover"
                />
              )}
              <View style={styles.leftImage}>
                <ImageComponent
                  imageUrl={
                    isEmpty(true, this.props.item.doc_image )
                      ? ""
                      : apiConstant.IMAGE_URL + this.props.item.doc_image
                  }
                  imageWidth={scaleWidth * 110}
                  imageHeight={scaleHeight * 100}
                  imageBorderRadius={scaleHeight * 15}
                />
              </View>
              <View
                style={
                  (styles.rightText,
                  {
                    flexDirection: "column",
                    paddingLeft: scaleWidth * 27,
                    paddingRight: scaleWidth * 10,
                  })
                }
              >
              
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: "left",
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                      fontWeight: "bold",
                    }}
                  >
                    {isEmpty(false, this.props.item.enrollment_no)}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: "left",
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                      fontWeight: "bold",
                    }}
                  >
                    {isEmpty(false, this.props.item.grade)}
                  </Text>
               

                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      textAlign: "left",
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.SERVICE_ITEM_TEXT_COLOR,
                      fontWeight: "bold",
                    }}
                  >
                   {isEmpty(false, this.props.item.speciality_value)}
                  </Text>

                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

DocumentView.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  viewWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onItemPress: PropTypes.func,
  onReviewPress: PropTypes.func,
  viewHeight: PropTypes.number,
  buttonText: PropTypes.string,
  isButtonVisible: PropTypes.bool,
};

DocumentView.defaultProps = {
  item: {},
  viewWidth: "100%",
  buttonText: "Reviews",
  isButtonVisible: true,
};

const mapStateToProps = (state) => ({
  theme: state.themeReducer.theme,
});

export default connect(mapStateToProps)(DocumentView);