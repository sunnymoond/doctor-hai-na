import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Typography } from "../../styles";
import { BOOKING_PACK_CIRCLE, PENCIL } from "../../images";
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
            width: 100,
            height: this.props.viewHeight,
            marginHorizontal: scaleWidth * 20,
            marginBottom: scaleHeight * 18,
          }}
        >
          <View
            style={{
              flexDirection: "column",
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
                    isEmpty(true, this.props.item.doc_image)
                      ? ""
                      : apiConstant.IMAGE_URL + this.props.item.doc_image
                  }
                  imageWidth={scaleWidth * 110}
                  imageHeight={scaleHeight * 100}
                  imageBorderRadius={scaleHeight * 15}
                />
              </View>
              <View style={styles.rightText}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
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
                    {isEmpty(false, this.props.item.enrollment_no)}
                  </Text>

                  {this.props.item.status === "0" ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: "left",
                          justifyContent: "flex-end",
                          marginHorizontal: scaleHeight * 25,
                          fontSize: Typography.FONT_SIZE_16,
                          color: this.props.theme.BUTTON_BACKGROUND_COLOR,
                          fontWeight: "bold",
                        }}
                      >
                        Pending
                      </Text>
                      <View>
                        <TouchableOpacity
                          onPress={this.props.onEditPress}
                        >
                          <Image
                            source={PENCIL}
                            style={{
                              height: scaleHeight * 12,
                              width: scaleWidth * 12,
                              tintColor: this.props.theme.TEXT_COLOR_GRAY,
                            }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : this.props.item.status === "1" ? (
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: "left",
                          justifyContent: "flex-end",
                          paddingHorizontal: scaleHeight * 60,
                          fontSize: Typography.FONT_SIZE_16,
                          color: this.props.theme.GREEN,
                          fontWeight: "bold",
                        }}
                      >
                        Approved
                      </Text>
                    </View>
                  ) : (
                  
                        <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: "left",
                          justifyContent: "flex-end",
                          marginHorizontal: scaleWidth * 22,
                          fontSize: Typography.FONT_SIZE_16,
                          color: this.props.theme.RED,
                          fontWeight: "bold",
                        }}
                      >
                        Rejected
                      </Text>
                      <View>
                        <TouchableOpacity
                          onPress={this.props.onEditPress}
                        >
                          <Image
                            source={PENCIL}
                            style={{
                              height: scaleHeight * 12,
                              width: scaleWidth * 12,
                              tintColor: this.props.theme.TEXT_COLOR_GRAY,
                            }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

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
                    numberOfLines={3}
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
           
                {this.props.item.status === "2" && (
                      <Text
                        numberOfLines={1}
                        style={{
                          textAlign: "left",
                          justifyContent: "flex-end",
                          marginTop: scaleHeight * 10,
                          fontSize: Typography.FONT_SIZE_16,
                          color: this.props.theme.RED,
                          fontWeight: "bold",
                        }}
                      >
                    {isEmpty(false, 'Reason : ' + this.props.item.comment_by_admin)}
                      </Text>
              )}
              
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
  onEditPress: PropTypes.func,
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
