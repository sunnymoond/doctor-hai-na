import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Picker,
  BackHandler,
} from "react-native";
import styles from "./styles";
import { Typography } from "../../styles";
import { BACK } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import CustomBGCard from "../../components/CustomBGCard";
import CustomBGParent from "../../components/CustomBGParent";
import { ScrollView } from "react-native-gesture-handler";
import { isNetAvailable } from "../../utils/NetAvailable";
import { getJSONData, storeJSONData, clearStore } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import Spinner from "react-native-loading-spinner-overlay";
import { NavigationEvents } from "react-navigation";
import CustomButton from "../../components/CustomButton";
import apiConstant from "../../constants/apiConstant";
import Globals from "../../constants/Globals";
import { FONT_SIZE_16 } from "../../styles/typography";
import { SCALE_25, SCALE_40 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { isEmpty } from "../../utils/Utills";
import { connect } from "react-redux";
import RatingComponent from "../../components/TapRating";
import { bindActionCreators } from "redux";
import { showAlert } from "../../redux/action";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDate } from "../../utils/DateTimeUtills";

class PatientEditProfile extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const user = navigation.getParam(Globals._KEYS.USER_DATA);
    this.state = {
      show: false,
      date: new Date(),
      rating: "5",
      userType: Globals.PATIENT,
      feedbacktext: "",
    };
  }

  componentDidMount() {
    this.initialState = this.state;
  }

  clearStore = () => {
    this.setState({
        rating: '',
        feedbacktext: '',
    });
}

  _onBlurr = () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
  };

  _onFocus = () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
  };

  _handleBackButtonClick = () => {
    this.goBack();
    return true;
  };

  updateProfile = async () => {
    this.signUpCheckValidity();
  };

  checkPhone = (phone) => {
    if (!isNaN(phone)) {
      const reg = /^[0]?[789]\d{9}$/;
      if (this.isPhoneValid(reg, phone)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  isPhoneValid = (reg, phone) => {
    if (reg.test(phone) === false) {
      return false;
    } else {
      return true;
    }
  };

  signUpCheckValidity = () => {
    if (
      this.state.feedbacktext.toString().trim().length == 0 
    ) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter text"
      );
    } else {
      this.feedback();
    }
  };

  feedback = async () => {
    await this.setState({ loading: true });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.INSERT_USER_FEEDBACK;

    const requestBody = {
      userid: userId,
      rating: this.state.rating,
      message: this.state.feedbacktext,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    console.log("urll of feedback ==> " + JSON.stringify(url));
    console.log("requestBody feedback==> " + JSON.stringify(requestBody));
    console.log("headers feedback==> " + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("data feedback==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              this.props.showAlert(
                true,
                Globals.ErrorKey.SUCCESS,
                "Thanks for your Feedback"
              );
              await this.setState({ loading: false });
              await this.clearStore();
              await this.props.navigation.navigate('DoctorProfile');
            } else {
              await this.setState({ loading: false });
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status_msg
              );
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              "Something Went Wrong"
            );
          });
      } else {
        this.setState({ loading: false });
        this.props.showAlert(
          true,
          Globals.ErrorKey.NETWORK_ERROR,
          "Please check network connection."
        );
      }
    });
  };

  ratingCompleted = async (rating) => {
    console.log("Rating is: " + rating);
    await this.setState({ rating: rating, loading: false });
  };

  goBack = async () => {
    const { navigation } = this.props;
    
    const userType = await getJSONData('user');
   // console.log('hhhhhhh',JSON.stringify(userType));
    if (userType.user_role === '2') {
      this.props.navigation.navigate("PatientProfile");
    }
    if (userType.user_role === '1') {
      this.props.navigation.navigate("DoctorProfile");
    }
    this.setState(this.initialState);
  };

  responseOnSuccess = async (data) => {
    this.initialState = this.state;
    if (data.user_data) {
      await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
      this.setState({ loading: false });
      this.props.showAlert(
        true,
        Globals.ErrorKey.SUCCESS,
        "Profile update successfully"
      );
      this.goBack();
    } else {
      this.setState({ loading: false });
    }
  };

  onChange = (event, selectedDate) => {
    if (!isEmpty(true, selectedDate)) {
      this.setState({ show: false, dob: selectedDate });
    } else {
      this.setState({ show: false });
    }
  };

  render() {
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents
          onWillFocus={this._onFocus}
          onWillBlur={this._onBlurr}
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: scaleHeight * 25,
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              width: scaleWidth * 60,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === "android" ? "flex-end" : "center",
              alignItems: "center",
            }}
            onPress={() => this.goBack()}
          >
            <Image
              style={{
                width: scaleWidth * 10,
                height: scaleHeight * 20,
                tintColor: this.props.theme.IMAGE_TINT_COLOR,
              }}
              source={BACK}
            />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              left: 50,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === "android" ? "flex-end" : "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_16,
                color: this.props.theme.PRIMARY_TEXT_COLOR,
                fontWeight: "bold",
              }}
            >
              Feedback
            </Text>
          </View>
        </View>
        <ScrollView>
          {/*<Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_30, color: this.props.theme.PRIMARY_TEXT_COLOR }}>Edit Profile</Text>*/}

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard
              cornerRadius={10}
              bgColor={this.props.theme.CARD_BACKGROUND_COLOR}
            >
              <View
                style={(styles.inputViewCards, { padding: scaleWidth * 10 })}
              >
                <RatingComponent
                  selectedColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                  count={5}
                  readonly={true}
                  defaultRating={this.state.rating}
                  showRating={false}
                  size={16}
                  onFinishRating={this.ratingCompleted}
                />
                <TextInput
                  style={{ borderColor: this.props.theme.BUTTON_BACKGROUND_COLOR, borderWidth: 1,marginTop: scaleHeight * 20}}
                  onChangeText={(text) => this.setState({ feedbacktext: text })}
                  value={this.state.review}
                  numberOfLines={5}
                  multiline={true}
                  textAlignVertical= 'top'
                  value={this.state.feedbacktext}
                  placeholder={"Input Feedback Text"}
                />

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: scaleHeight * 20
                  }}
                >
                  <CustomButton
                    buttonStyle={[
                      styles.buttonsShadow,
                      {
                        backgroundColor: this.props.theme
                          .BUTTON_BACKGROUND_COLOR,
                      },
                    ]}
                    onPress={() => this.updateProfile()}
                    textStyle={{
                      fontSize: FONT_SIZE_16,
                      color: this.props.theme.BUTTON_TEXT_COLOR,
                    }}
                    buttonText={"Submit"}
                    cornerRadius={20}
                    buttonHeight={SCALE_25}
                    buttonWidth={scaleSize(100)}
                  />
                </View>
              </View>
            </CustomBGCard>
          </View>

          <View style={{ height: scaleHeight * 10 }}></View>
        </ScrollView>
      </CustomBGParent>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.themeReducer.theme,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientEditProfile);
