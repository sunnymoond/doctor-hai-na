import React, { Component } from "react";
import {
  View,
  Image,
  alert,
  Platform,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import styles from "./styles";
import { GRAY_LIGHT } from "../../styles/colors";
import { INTRO1, INTRO2, INTRO3, LOCATION, SEARCH } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import CustomButton from "../../components/CustomButton";
import CustomBGParent from "../../components/CustomBGParent";
import DoctorItemView from "../../components/DoctorItemView";
import { isNetAvailable } from "../../utils/NetAvailable";
import { getJSONData } from "../../utils/AsyncStorage";
import {
  fetchServerDataGet,
  fetchServerDataPost,
} from "../../utils/FetchServerRequest";
import MultiSelect from "../../components/MultiSelectDropDown";
import {
  FONT_SIZE_12,
  FONT_SIZE_16,
  FONT_SIZE_22,
} from "../../styles/typography";
import { SCALE_40 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import CustomTextView from "../../components/CustomTextView";
import EmptyView from "../../components/EmptyView";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showAlert } from "../../redux/action";
import { SliderBox } from "react-native-image-slider-box";
import FastImage from "react-native-fast-image";
import apiConstant from "../../constants/apiConstant";
import Geolocation from "@react-native-community/geolocation";
import Globals from "../../constants/Globals";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
const locationConfig = {
  skipPermissionRequests: false,
  authorizationLevel: "whenInUse",
};
Geolocation.setRNConfiguration(locationConfig);

const items = [
  {
    id: "1",
    name: "Ondo",
  },
  {
    id: "2",
    name: "Ogun",
  },
  {
    id: "3",
    name: "Calabar",
  },
  {
    id: "4",
    name: "Lagos",
  },
  {
    id: "5",
    name: "Maiduguri",
  },
  {
    id: "6",
    name: "Anambra",
  },
  {
    id: "7",
    name: "Benue",
  },
  {
    id: "8",
    name: "Kaduna",
  },
  {
    id: "9",
    name: "Abuja",
  },
];

class PatientHome extends Component {
  constructor(props) {
    const { navigation } = props;
    super(props);
    this.state = {
      loading: false,
      user: {},
      data: [],
      modalVisible: false,
      newServicePopUp: false,
      swipeRefreshing: false,
      refreshing: false,
      pageCount: 1,
      totalPageCount: 0,
      images: [INTRO1, INTRO2, INTRO3],
      selectedItems: [],
     // searchText: "",
      specialityCategory: [],
    };
  }

  onSelectedItemsChange = async (selectedItems) => {
    console.log("selectedItems" + JSON.stringify(selectedItems));
    this.setState({ selectedItems });
    await this.getBarberCurrentLocation();
  };

  onSubmitClick = () => {
    console.log("onSubmitClick" + JSON.stringify(this.state.selectedItems));
  };

  componentDidMount() {
    this.getBarberCurrentLocation();
    this.GetDoctorsSpecialityList();
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp !== this.props) {
      this.getBarberCurrentLocation();
    }
  }

  searchFilterFunction = async (text) => {
    if (text.toString().trim().length >= 3) {
      this.setState({loading: false,searchText: text});
      await this.getBarberCurrentLocation();
    //  await this.sendBarberLocation();
    }
   
  };

  getBarberCurrentLocation = async () => {
    this.setState({
      loading: true,
    });
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        };
        console.log("Geolocation ===> " + JSON.stringify(region));
        this.sendBarberLocation(region);
      },
      (error) => {
        this.setState({
          error: error.message,
          loading: false,
          modalVisible: true,
        });
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 }
    );
  };

  onPermissionClick = async () => {
    if (Platform.OS === "android") {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 10000,
      })
        .then(async (data) => {
          if (data == "enabled") {
            await this.setState({ modalVisible: false });
            this.getBarberCurrentLocation();
          } else if (data == "already-enabled") {
            await this.setState({ modalVisible: false });
            this.getBarberCurrentLocation();
          }
        })
        .catch((err) => {
          this.props.showAlert(
            true,
            Globals.ErrorKey.ERROR,
            "Permission " + err.message
          );
        });
    } else {
      await this.setState({ modalVisible: false });
    }
  };

  GetDoctorsSpecialityList = () => {
    this.setState({loading: true});
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

  sendBarberLocation = async (region) => {
    this.setState({
      loading: true,
    });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const userRole = user.user_role;

    console.log('bbbbbbbbbbbbbbbb',JSON.stringify(this.state.specialityCategory));
    const url = apiConstant.GET_ALL_DOCTORS_LIST;

    let headers = {
      "Content-Type": "application/json; charset=utf-8",
    };

   


    const requestBody = {

      latitude: region.latitude,
      longitude: region.longitude,
      user_id: userId,
      user_role: userRole,
      search_location : this.state.searchText,
      doc_specility: this.state.selectedItems.length == 0 ? "": this.state.selectedItems,
    };

    console.log("urllllllllllll select-----" + JSON.stringify(url));
    console.log("location header-----" + JSON.stringify(headers));
    console.log("location requestBody select-----" + JSON.stringify(requestBody));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("location data ==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              await this.setState({
                loading: false,
                data: data.doctor_data,
              });
              console.log('datadddddddddddddddddd',JSON.stringify(data.doctor_data));
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
          // this.props.appReload(true);
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

  onClickItem = async (item) => {
    this.props.navigation.navigate("DoctorDetail", { data: item });
  };

  renderItem = ({ item }) => {
    return (
      <DoctorItemView
        onItemPress={() => this.onClickItem(item)}
        viewWidth={scaleWidth * 240}
        viewHeight={scaleHeight * 130}
        item={item}
      />
    );
  };

  renderFooter = () => {
    try {
      if (this.state.refreshing) {
        return (
          <View
            style={{
              paddingVertical: scaleHeight * 5,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <ActivityIndicator size="large" color="#0000FF" />
          </View>
        );
      } else {
        return null;
      }
    } catch (error) {
      console.log("error");
    }
  };

  LoadMoreRandomData = async () => {
    if (this.state.apiType !== "pending") {
      if (this.state.pageCount < this.state.totalPageCount) {
        await this.setState({ pageCount: this.state.pageCount + 1 });
        await this.getBarberCurrentLocation();
      }
    }
  };

  onRefresh = async () => {
    await this.setState({
      swipeRefreshing: true,
      pageCount: 1,
      totalPageCount: 0,
    });
    await this.getBarberCurrentLocation();
  };

  render() {
    const { data } = this.state;
    const { selectedItems } = this.state;
    const { specialityCategory } = this.state;
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              height: scaleHeight * 45,
              backgroundColor: GRAY_LIGHT,
              borderRadius: scaleWidth * 25,
            }}
          >
            <TextInput
              style={{
                paddingLeft: scaleWidth * 10,
                flex: 1,
                textAlignVertical: "center",
                fontSize: scaleWidth * 12,
                height: scaleHeight * 45,
              }}
              onChangeText={(text) => this.searchFilterFunction(text)}
              value={this.state.searchText}
              placeholder={"Search here ..."}
            />
            <Image
              source={SEARCH}
              style={{
                marginHorizontal: scaleWidth * 10,
                height: scaleHeight * 16,
                width: scaleWidth * 16,
              }}
              resizeMode={"contain"}
            />
          </View>
        </View>
        <SliderBox
          ImageComponent={FastImage}
          images={this.state.images}
          sliderBoxHeight={scaleWidth * 150}
          onCurrentImagePressed={(index) =>
            console.warn(`image ${index} pressed`)
          }
          parentWidth={this.state.width}
          dotColor={this.props.theme.TEXT_COLOR_GRAY}
          paginationBoxVerticalPadding={10}
          autoplay
          circleLoop
          imageLoadingColor={this.props.theme.TEXT_COLOR_GRAY}
        />
        <View
          style={{
            flex: 1,
            marginVertical: 10,
            marginHorizontal: 10,
            backgroundColor: this.props.theme.WHITE,
          }}
        >
          <MultiSelect
            hideTags
            items={specialityCategory}
            uniqueKey="speciality_id"
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
            tagRemoveIconColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
            tagBorderColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
            tagTextColor="#CCC"
            selectedItemTextColor={this.props.theme.SECONDARY_TEXT_COLOR}
            selectedItemIconColor={this.props.theme.BUTTON_BACKGROUND_COLOR}
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
        </View>
        <FlatList
          data={data}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter}
          onEndReached={() => this.LoadMoreRandomData()}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          ListEmptyComponent={
            <EmptyView EmptyText={Globals.EmptyListKey.EMPTY_DATA} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <Modal
          backdropOpacity={0.8}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}
          isVisible={this.state.modalVisible}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: scaleSize(300),
              backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
              borderRadius: 10,
            }}
          >
            <Image
              style={{
                height: scaleSize(50),
                width: scaleSize(50),
                resizeMode: "contain",
                tintColor: this.props.theme.IMAGE_TINT_COLOR,
              }}
              source={LOCATION}
            />
            <CustomTextView
              textStyle={{ marginTop: scaleSize(20) }}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              //value={this.state.error}
              value={"Device Location is off"}
              fontSize={FONT_SIZE_22}
            />
            <CustomTextView
              fontPaddingVertical={5}
              fontColor={this.props.theme.TEXT_COLOR_GRAY}
              value={
                "Please turn on your device location to ensure hassle free experience "
              }
              fontSize={FONT_SIZE_12}
            />

            <CustomButton
              buttonStyle={[
                styles.buttonsShadow,
                {
                  backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                  marginTop: scaleSize(20),
                },
              ]}
              onPress={() => this.onPermissionClick()}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
              }}
              buttonText={"Turn on Device location"}
              cornerRadius={100}
              buttonHeight={SCALE_40}
              buttonWidth={scaleSize(200)}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(PatientHome);
