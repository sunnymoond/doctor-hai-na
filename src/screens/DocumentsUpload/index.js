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
import ImagePicker from "react-native-image-crop-picker";
import styles from "./styles";
import { Typography, Colors } from "../../styles";
import { BACK, CAMERA_ICON } from "../../images";
import Modal from "react-native-modal";
import { GRAY_DARK } from "../../styles/colors";
import ImageComponent from "../../components/ImageComponent";
import CustomTextView from "../../components/CustomTextView";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import { getFileExtension, getFileName } from "../../utils/Utills";
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
import { FONT_SIZE_16, FONT_SIZE_20 } from "../../styles/typography";
import { SCALE_25, SCALE_30 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { isEmpty } from "../../utils/Utills";
import { connect } from "react-redux";
import MultiSelect from "../../components/MultiSelectDropDown";
import { bindActionCreators } from "redux";
import { GRAY_LIGHT } from "../../styles/colors";
import { showAlert } from "../../redux/action";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDate } from "../../utils/DateTimeUtills";

class DocumentsUpload extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const document = navigation.getParam("document_data");
    this.state = {
      loading: false,
      document: document,
      show: false,
      date: new Date(),
      enrollment_no: "",
      doctor_id: "",
      grade: "",
      experience: "",
      selectedItems: [],
      speciality: "",
      speciality_value: "",
      image: "",
      filePath: {},
      speciality_data: [],
      category_data: [],
      showImagePopUp: false,
      selectedCategory: [],
      selected_category_data: [],
      specialityCategory: [],
    };
  }

  componentDidMount() {
    // console.log('selectedDocumentssssssssss',JSON.stringify(this.state.user));
    this.initialState = this.state;
    this.GetDoctorsSpecialityList();
  }

  chooseFile = () => {
    this.setState({
      showImagePopUp: true,
    });
  };

  _onBlurr = () => {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
  };

  onCancelClick = () => {
    this.setState({
      showLogoutPopUp: false,
      showImagePopUp: false,
      showRemovePhotoPopUp: false,
    });
  };

  _onFocus = async () => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this._handleBackButtonClick
    );
    await this.GetDoctorsSpecialityList();
  };

  _handleBackButtonClick = () => {
    this.goBack();
    return true;
  };

  updateProfile = async () => {
    this.signUpCheckValidity();
  };

  goBack = () => {
    this.props.navigation.navigate("DocumentsHome");
    this.setState(this.initialState);
  };

  onLibraryClick = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      mediaType: "photo",
      compressImageQuality: 0.2,
    })
      .then(async (response) => {
        console.log(response);
        await this.onCancelClick();
        await this.setState({ filePath: response });
        if (response.path) {
          //  this._uploadImageToTheServer(response.path);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onPhotoClick = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      mediaType: "photo",
      compressImageQuality: 0.2,
    })
      .then(async (response) => {
        console.log(response);
        await this.onCancelClick();
        await this.setState({ filePath: response });
      })
      .catch((e) => {
        console.log(e);
      });
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

  signUpCheckValidity = async () => {
    console.log("hhhhhhhhhhhhhhh", this.state.selectedItems.length == 0);
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    console.log("qqqqqqqqqqqqqqqqq", JSON.stringify(user));

    if (this.state.selectedItems.length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please select degree "
      );
    } else if (this.state.selectedCategory.length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please select sub degree"
      );
    } else if (this.state.enrollment_no.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter enrollemnt no"
      );
    } else if (this.state.grade.toString().trim().length == 0) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please enter grade"
      );
    } else if (
      isEmpty(true, this.state.filePath.path) &&
      this.props.navigation.getParam("document_data") == null
    ) {
      this.props.showAlert(
        true,
        Globals.ErrorKey.WARNING,
        "Please select the document image"
      );
    } else {
      if (this.state.document != null) {
        console.log("hhhhhhhhhhhhhhhhhhhh");
        await this.selectedDocument();
      } else {
        await this.uploadDocuments();
      }
    }
  };

  GetDoctorsSpecialityList = () => {
    this.setState({
      loading: true,
    });
    const url = apiConstant.GET_DOCTORS_SPECIALITY_LIST;

    let headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    const requestBody = {};

    console.log("location header-----" + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("location data multiselect==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              await this.setState({
                loading: false,
                specialityCategory: data.speciality_category,
                speciality_data: data.speciality_data,
              });
              await this.SetMultiselectValue();
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
            //this.props.appReload(true);
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

  uploadDocuments = async () => {
    await this.setState({ loading: false });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.UPLOAD_DOCTOR_DOCUMENTS;
    let fileName = getFileName(this.state.filePath.path);
    const requestBody = {
      user_id: userId,
      speciality_category: this.state.speciality_category,
      speciality: this.state.speciality,
      speciality_value: this.state.speciality_value,
      experience: this.state.experience,
      grade: this.state.grade,
      enrollment_no: this.state.enrollment_no,
      doc_image: this.state.filePath.data,
      image_ext: getFileExtension(fileName),
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    console.log("url upadte ==> " + JSON.stringify(url));
    console.log("requestBody ==> " + JSON.stringify(requestBody));
    console.log("headers ==> " + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("data ==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              this.props.showAlert(
                true,
                Globals.ErrorKey.SUCCESS,
                data.status_msg
              );
              this.props.navigation.navigate("DocumentsHome");
              //await this.responseOnSuccess(data);
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

  selectedDocument = async () => {
    console.log("eeeeeeeeeeeeeeeeeeeeeeeee");
    await this.setState({ loading: false });
    const selected_doc = this.props.navigation.getParam("document_data");
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    console.log("dddddddddddddd", JSON.stringify(selected_doc));
    const userId = user.pk_user_id;
    const docId = selected_doc.pk_doc_id;

    const url = apiConstant.UPLOAD_DOCTOR_DOCUMENTS_DETAILS;
    let fileName = getFileName(this.state.filePath.path);
    const requestBody = {
      user_id: userId,
      document_id: docId,
      speciality_category: this.state.speciality_category,
      speciality: this.state.speciality,
      speciality_value: this.state.speciality_value,
      experience: this.state.experience,
      grade: this.state.grade,
      enrollment_no: this.state.enrollment_no,
      doc_image_update: this.state.filePath.data,
      image_ext_update: getFileExtension(fileName),
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    console.log("url upadtedddddd ==> " + JSON.stringify(url));
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
              this.props.showAlert(
                true,
                Globals.ErrorKey.SUCCESS,
                data.status_msg
              );
              this.props.navigation.navigate("DocumentsHome");
              //await this.responseOnSuccess(data);
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
    console.log("selectedItems" + JSON.stringify(selectedItems));
    await this.setState({ category_data: [], selectedItems });
    this.state.speciality_data.forEach((elem) => {
      if (elem.category_id == selectedItems[0]) {
        this.state.category_data.push(elem);
      }
    });
    console.log(this.state.category_data);
  };

  SetMultiselectValue = async () => {
    const document_select = this.props.navigation.getParam("document_data");
    this.state.speciality_data.forEach((elem) => {
      if (elem.speciality_id == document_select.speciality) {
        //  this.state.document.speciality.push(elem);
        var selectedItem = [];
        var category = [];
        selectedItem.push(elem.speciality_id);
        category.push(elem.category_id);

        this.setState({
          selectedItems: category,
        });
        this.state.speciality_data.forEach((elem) => {
          if (elem.category_id == this.state.selectedItems[0]) {
            this.state.category_data.push(elem);
          }
        });

        this.setState({
          selectedItems: category,
          selectedCategory: selectedItem,
          speciality_value: document_select.speciality_value,
          speciality: document_select.speciality,
          grade: document_select.grade,
          enrollment_no: document_select.enrollment_no,
          image: document_select.doc_image,
        });
      }
    });
  };

  onSpecialityItemsChange = async (selectedCategory) => {
    console.log("selectedItems" + JSON.stringify(selectedCategory));
    await this.setState({ selectedCategory });
    this.state.speciality_data.forEach((elem) => {
      if (elem.speciality_id == selectedCategory[0]) {
        this.setState({
          speciality: elem.speciality_id,
          speciality_value: elem.speciality_title,
        });
      }
    });
  };

  render() {
    const { specialityCategory } = this.state;
    const { selectedItems } = this.state;
    const { category_data } = this.state;
    const { selectedCategory } = this.state;
  //  const item =this.props.navigation.getParam("document_data")
   // console.log('aaaaaaaaaaaaaaaaaa',JSON.stringify(item));
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
              Educational Profile
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
                style={{
                  paddingVertical: scaleWidth * 10,
                  paddingHorizontal: scaleWidth * 10,
                }}
              >
                <MultiSelect
                  hideTags
                  items={specialityCategory}
                  uniqueKey="category_id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  // onSubmitClick={() => this.onSubmitClick()}
                  onSelectedItemsChange={this.onSelectedItemsChange}
                  selectedItems={selectedItems}
                  selectText="Pick Speciality"
                  searchInputPlaceholderText="Search Speciality..."
                  onChangeInput={(text) => console.log(text)}
                  //altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                  tagBorderColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                  tagTextColor="#CCC"
                  selectedItemTextColor={this.props.theme.SECONDARY_TEXT_COLOR}
                  selectedItemIconColor={
                    this.props.theme.BUTTON_BACKGROUND_COLOR
                  }
                  single={true}
                  itemTextColor={this.props.theme.PRIMARY_TEXT_COLOR}
                  displayKey="title"
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

                <MultiSelect
                  hideTags
                  items={category_data}
                  uniqueKey="speciality_id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  // onSubmitClick={() => this.onSubmitClick()}
                  onSelectedItemsChange={this.onSpecialityItemsChange}
                  selectedItems={selectedCategory}
                  selectText="Pick Speciality"
                  searchInputPlaceholderText="Search Speciality..."
                  onChangeInput={(text) => console.log(text)}
                  //altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                  tagBorderColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
                  tagTextColor="#CCC"
                  selectedItemTextColor={this.props.theme.SECONDARY_TEXT_COLOR}
                  selectedItemIconColor={
                    this.props.theme.BUTTON_BACKGROUND_COLOR
                  }
                  single={true}
                  itemTextColor={this.props.theme.PRIMARY_TEXT_COLOR}
                  displayKey="speciality_title"
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
               
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 1,
                      borderColor: GRAY_DARK,
                      fontSize: FONT_SIZE_16,
                      height: scaleHeight * 50,
                     // marginTop: scaleHeight * 20
                    }}
                  >
                    <TextInput
                      style={{
                        width: "100%",
                        // alignItems: "center",
                        justifyContent: "center",
                      }}
                      textAlignVertical= 'bottom'
                      onChangeText={(text) =>
                        this.setState({ enrollment_no: text })
                      }
                      placeholder={"Enrollment No."}
                      value={this.state.enrollment_no}
                    />
                  </View>
             
                <View
                  style={{
                    flexDirection: "row",
                    //  alignItems: "center",
                     marginBottom: 10,
                    borderBottomWidth: 1,
                    borderColor: GRAY_DARK,
                  }}
                >
                  <TextInput
                    style={
                      (styles.textInputStyle,
                      { alignItems: "center", justifyContent: "center" ,  width: "100%",})
                    }
                    textAlignVertical= 'bottom'
                    onChangeText={(text) => this.setState({ grade: text })}
                    placeholder={"Grade"}
                    value={this.state.grade}
                  />
                </View>

                <TouchableOpacity onPress={() => this.chooseFile()}>
                  <View
                    style={{
                      width: "100%",
                      height: scaleHeight * 200,
                      //cornerRadius: scaleWidth * 10,
                      borderRadius: scaleWidth * 10,
                      backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {!isEmpty(true, this.state.image) ||
                    !isEmpty(true, this.state.filePath.path) ? (
                      !isEmpty(true, this.state.filePath.path) ? (
                        <Image
                          source={{ uri: this.state.filePath.path }}
                          style={{
                            width: "100%",
                            height: scaleHeight * 200,
                            borderRadius: scaleWidth * 10,
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <ImageComponent
                          imageUrl={apiConstant.IMAGE_URL + this.state.image}
                          imageWidth={"100%"}
                          imageHeight={scaleHeight * 200}
                          imageBorderRadius={scaleHeight * 10}
                        />
                      )
                    ) : null}
                    <Image
                      source={CAMERA_ICON}
                      style={{
                        width: scaleWidth * 36,
                        height: scaleHeight * 33,
                        alignSelf: "center",
                        position: "absolute",
                        tintColor: Colors.WHITE,
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>

            {/*  {item.status_id === "2" && (
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
                    {isEmpty(
                      false,
                      "Reason : " + this.props.item.comment_by_admin
                    )}
                  </Text>
                )}
                    */}

                <View
                  style={{
                    height: scaleHeight * 25,
                    alignItems: "center",
                    marginTop: scaleWidth * 10,
                    justifyContent: "center",
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
                    buttonText={"Upload"}
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
        <Modal
          backdropOpacity={0.8}
          //animationIn="zoomInDown"
          //animationOut="zoomOutUp"
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionInTiming={400}
          backdropTransitionOutTiming={400}
          onSwipeComplete={() => this.onCancelClick()}
          onBackdropPress={() => this.onCancelClick()}
          swipeDirection={["down"]}
          style={{
            justifyContent: "flex-end",
            margin: 0,
          }}
          isVisible={this.state.showImagePopUp}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              height: scaleSize(120),
              width: "100%",
              paddingHorizontal: scaleWidth * 30,
              backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View
              style={{
                height: scaleHeight * 5,
                width: scaleWidth * 50,
                borderRadius: 4,
                marginTop: scaleHeight * 5,
                borderColor: this.props.theme.BORDER_TOP_COLOR,
                backgroundColor: this.props.theme.BORDER_TOP_COLOR,
              }}
            ></View>
            <CustomTextView
              noOfLines={1}
              fontPaddingVertical={5}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              value={Globals.UPLOAD_DOCUMENT}
              fontSize={FONT_SIZE_20}
            />
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CustomButton
                buttonStyle={[
                  styles.buttonsShadow,
                  {
                    backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  },
                ]}
                onPress={() => this.onPhotoClick()}
                textStyle={{
                  fontSize: FONT_SIZE_16,
                  color: this.props.theme.BUTTON_TEXT_COLOR,
                }}
                buttonText={Globals.CAMERA}
                cornerRadius={100}
                buttonHeight={SCALE_30}
                buttonWidth={scaleSize(100)}
              />
              <CustomButton
                buttonStyle={[
                  styles.buttonsShadow,
                  {
                    backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  },
                ]}
                onPress={() => this.onLibraryClick()}
                textStyle={{
                  fontSize: FONT_SIZE_16,
                  color: this.props.theme.BUTTON_TEXT_COLOR,
                }}
                buttonText={Globals.GALLERY}
                cornerRadius={100}
                buttonHeight={SCALE_30}
                buttonWidth={scaleSize(100)}
              />
            </View>
          </View>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsUpload);
