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
import { getJSONData, storeJSONData } from "../../utils/AsyncStorage";
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
import MultiSelect from "../../components/MultiSelectDropDown";
import { bindActionCreators } from "redux";
import { GRAY_LIGHT } from "../../styles/colors";
import { showAlert } from "../../redux/action";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDate } from "../../utils/DateTimeUtills";

class DoctorEditProfile extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const user = navigation.getParam(Globals._KEYS.USER_DATA);
    this.state = {
      loading: false,
      user: user,
      user_name: user.user_name ? user.user_name : "",
      dob: user.date_of_birth ? user.date_of_birth : "",
      gender: user.gender ? user.gender : "",
      phone_number: user.phone_number ? user.phone_number : "",
      home_phone: user.home_phone ? user.home_phone : "",
      office_phone: user.office_phone ? user.office_phone : "",
      user_bio: user.user_bio ? user.user_bio : "",
      experience: user.experience ? user.experience : "",
     // age: user.age ? user.age : "",
      age: user.age ? user.age : "",
      show: false,
      date: new Date(),
      speciality: [],
      selectedItems: [],
      specialityCategory: [],
    };
  }

  componentDidMount() {
    console.log('experienceeeeeeeeeeeeeeeee',JSON.stringify(this.state.experience));
    this.initialState = this.state;
    this.GetDoctorsSpecialityList();
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
    await this.callEditProfileApi();
    //this.signUpCheckValidity();
  };

  goBack = () => {
    this.props.navigation.navigate("DoctorProfile");
    this.setState(this.initialState);
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
    if (this.state.user_name.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter user name"
      );
    } else if (
      this.state.phone_number.toString().trim().length == 0 
    ) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter valid phone number"
      );
    }else if (
      this.state.dob.toString().trim().length == 0
    ) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter dob"
      );
    }else if (
      this.state.user_bio.toString().trim().length == 0
    ) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter valid user bio"
      );
    }   else {
      this.callEditProfileApi();
    }
  };

  GetDoctorsSpecialityList = () => {
    this.setState({
      loading: true,
    });
    const url = apiConstant.MST_SPECIALITY_LIST;

    let headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    const requestBody = {};

    console.log("url multiselect" + JSON.stringify(url));
    console.log("location header-----" + JSON.stringify(headers));
    console.log("request body " + JSON.stringify(requestBody));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("location data ==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              await this.setState({
                loading: false,
                specialityCategory: data.speciality_data,
              });
              
            } else {
              this.setState({ loading: false });
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status_msg
              );
            }
          })
          .catch((error) => {
            this.setState({ loading: false });
            //console.log("Login error : ", error);
            this.props.appReload(true);
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

  callEditProfileApi = async () => {
  //  await this.setState({ loading: true });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    console.log("llllllllllll ==> " + JSON.stringify(this.state.selectedItems));

    const userId = user.pk_user_id;
    let url = apiConstant.MODIFY_USER;

    console.log("urlllllllllllll ==> " + JSON.stringify(url));
   

    let requestBody = {
      user_id: userId,
      user_name: this.state.user_name,
      date_of_birth: this.state.dob,
      gender: this.state.gender,
      phone_number: this.state.phone_number,
      home_phone: this.state.home_phone,
      office_phone: this.state.office_phone,
     speciality: this.state.selectedItems,
      experience: this.state.experience,
      user_bio: this.state.user_bio,
    };

    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
   
    console.log("requestBody ==> " + JSON.stringify(requestBody));
    console.log("headers ==> " + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            console.log("response" + JSON.stringify(response));
            let data = await response.json();
            console.log("data ==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              await this.responseOnSuccess(data);
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

  responseOnSuccess = async (data) => {
    this.initialState = this.state;
    if (data.user_data) {
      await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
      this.setState({ loading: false });
      this.props.navigation.navigate("DoctorProfile");
      this.props.showAlert(
        true,
        Globals.ErrorKey.SUCCESS,
        "Profile update successfully"
      );
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

  onSelectedItemsChange = async (selectedItems) => {
    console.log("selectedItemshhhhhhhhhhhhhh" + JSON.stringify(selectedItems));
    await this.setState({ selectedItems });
    
  //  console.log(this.state.category_data);
  };

  render() {
    const { specialityCategory } = this.state;
    const { selectedItems } = this.state;
    console.log('specialityyyyyyyyyyyyy',JSON.stringify(specialityCategory));
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
              Edit Profile
            </Text>
          </View>

          <View
            style={{
              height: scaleHeight * 25,
              position: "absolute",
              right: scaleWidth * 10,
              alignItems: "center",
              justifyContent: Platform.OS === "android" ? "flex-end" : "center",
            }}
          >
            <CustomButton
              buttonStyle={[
                styles.buttonsShadow,
                { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR },
              ]}
              onPress={() => this.updateProfile()}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
              }}
              buttonText={"Save"}
              cornerRadius={20}
              buttonHeight={SCALE_25}
              buttonWidth={scaleSize(100)}
            />
          </View>
        </View>
        <ScrollView>
          {/*<Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_30, color: this.props.theme.PRIMARY_TEXT_COLOR }}>Edit Profile</Text>*/}

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard
              cornerRadius={10}
              bgColor={this.props.theme.CARD_BACKGROUND_COLOR}
            >
              <View style={styles.inputViewCards}>
                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ first_name: text })}
                  value={this.state.user_name}
                  placeholder={"User Name"}
                />

                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ phone_number: text })}
                  value={this.state.phone_number}
                  keyboardType="numeric"
                  placeholder={"Phone number"}
                />

                <TouchableOpacity onPress={() => this.setState({ show: true })}>
                  <TextInput
                    style={styles.textInputStyle}
                    onChangeText={(text) =>
                      this.setState({
                        dob: text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ""),
                      })
                    }
                    value={this.state.dob === "" ? "" : getDate(this.state.dob)}
                    placeholder={"DOB between 15 to 60"}
                    keyboardType={"numeric"}
                    editable={false}
                  />
                </TouchableOpacity>

                {this.state.show && (
                  <DateTimePicker
                    value={this.state.date}
                    mode={"date"}
                    display="default"
                    style={{
                      backgroundColor:
                        Platform.OS === "android" ? "black" : "white",
                      marginTop: 20,
                    }}
                    onChange={this.onChange}
                    minimumDate={new Date().setFullYear(
                      new Date().getFullYear() - 60
                    )}
                    maximumDate={new Date().setFullYear(
                      new Date().getFullYear() - 14
                    )}
                  />
                )}

                <Picker
                  selectedValue={this.state.experience}
                  style={(styles.textInputStyle, { marginTop: 20 })}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ experience: itemValue })
                  }
                >
                  <Picker.Item label="Total Exp" value="" />
                  <Picker.Item label="1 years" value="1 years" />
                  <Picker.Item label="2 years" value="2 years" />
                  <Picker.Item label="3 years" value="3 years" />
                  <Picker.Item label="4 years" value="4 years" />
                  <Picker.Item label="5 years" value="5 years" />
                  <Picker.Item label="6 years" value="6 years" />
                  <Picker.Item label="7 years" value="7 years" />
                  <Picker.Item label="8 years" value="8 years" />
                  <Picker.Item label="9 years" value="9 years" />
                  <Picker.Item label="10 years" value="10 years" />
                  <Picker.Item label="11 years" value="11 years" />
                  <Picker.Item label="12 years" value="12 years" />
                  <Picker.Item label="13 years" value="13 years" />
                  <Picker.Item label="14 years" value="14 years" />
                  <Picker.Item label="15 years" value="15 years" />
                  <Picker.Item label="16 years" value="16 years" />
                  <Picker.Item label="17 years" value="17 years" />
                  <Picker.Item label="18 years" value="18 years" />
                  <Picker.Item label="19 years" value="19 years" />
                  <Picker.Item label="20 years" value="20 years" />
                </Picker>

                <View style={{ marginTop: 20 }}>
                  <MultiSelect
                    hideTags
                    items={specialityCategory}
                    uniqueKey="pk_speciality_id"
                    ref={(component) => {
                      this.multiSelect = component;
                    }}
                    onSubmitClick={() => this.onSubmitClick()}
                    onSelectedItemsChange={this.onSelectedItemsChange}
                    selectedItems={selectedItems}
                    selectText="Pick Speciality"
                    searchInputPlaceholderText="Search Speciality..."
                    onChangeInput={(text) => console.log(text)}
                    //altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor={
                      this.props.theme.BUTTON_BACKGROUND_COLOR
                    }
                    tagBorderColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                    tagTextColor="#CCC"
                    selectedItemTextColor={
                      this.props.theme.SECONDARY_TEXT_COLOR
                    }
                    selectedItemIconColor={
                      this.props.theme.BUTTON_BACKGROUND_COLOR
                    }
                    itemTextColor={this.props.theme.PRIMARY_TEXT_COLOR}
                    displayKey="speciality"
                    searchInputStyle={{ color: "#CCC" }}
                    submitButtonColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                    submitButtonText="Submit"
                    styleItemsContainer={{
                      maxHeight: scaleHeight * 170,
                      zIndex: 5,
                      backgroundColor: this.props.theme.BACKGROUND_COLOR,
                    }}
                    styleListContainer={{ zIndex: 5 }}
                    styleSelectorContainer={{
                      position: "absolute",
                      right: 0,
                      left: 0,
                      zIndex: 5,
                    }}
                    styleDropdownMenuSubsection={{
                      height: scaleHeight * 45,
                      backgroundColor: GRAY_LIGHT,
                      borderRadius: scaleWidth * 25,
                      paddingLeft: 15,
                      paddingRight: 5,
                    }}
                    styleInputGroup={{
                      height: scaleHeight * 45,
                      backgroundColor: GRAY_LIGHT,
                      borderRadius: scaleWidth * 25,
                      paddingRight: 10,
                    }}
                  />
                </View>
                <TextInput
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ user_bio: text })}
                  value={this.state.user_bio}
                  placeholder={"User bio"}
                />

                <Picker
                  selectedValue={this.state.gender}
                  style={styles.textInputStyle}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ gender: itemValue })
                  }
                >
                  <Picker.Item label="Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorEditProfile);
