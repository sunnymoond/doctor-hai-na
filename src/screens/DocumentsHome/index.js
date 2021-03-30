import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import styles from "./styles";
import { Colors, Typography } from "../../styles";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import CustomBGParent from "../../components/CustomBGParent";
import EmptyView from "../../components/EmptyView";
import { PENCIL, CROSS, BACK } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import { FONT_SIZE_16 } from "../../styles/typography";
import { SCALE_25, SCALE_30 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { getJSONData, getData } from "../../utils/AsyncStorage";
import apiConstant from "../../constants/apiConstant";
import {
  fetchServerDataGet,
  fetchServerDataPost,
} from "../../utils/FetchServerRequest";
import Spinner from "react-native-loading-spinner-overlay";
import { isNetAvailable } from "../../utils/NetAvailable";
import { getDate, getTime } from "../../utils/DateTimeUtills";
import { isEmpty } from "../../utils/Utills";
import Globals from "../../constants/Globals";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DocumentView from "../../components/DocumentView";
import { showAlert } from "../../redux/action";

class DoctorAddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refreshing: false,
      document: [],
    };
  }

  async componentDidMount() {
    this.callAddressApi();
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp !== this.props) {
      this.callAddressApi();
    }
  }

  clearState = () => {
    this.setState({
      loading: false,
      refreshing: false,
      addresses: [],
    });
  };

  onEditClick = (data) => {
    console.log("data", JSON.stringify(data));
    this.props.navigation.navigate("DoctorAddAddress", {
      data: data,
      from: "list",
    });
  };

  goBack = () => {
    this.props.navigation.navigate("DoctorProfile");
    this.setState(this.initialState);
  };

  onDeleteClick = (data) => {
    this.callRemoveDoctorAddressApi(data);
  };

  UploadDocument = () => {
    this.props.navigation.navigate("DocumentsUpload");
  };

  onClickItem = (data) => {
    //this.props.navigation.navigate('DoctorAddAddress', { data: data, from: "list" });
  };

  callRemoveDoctorAddressApi = async (item) => {
    await this.setState({ loading: true });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.REMOVE_DOCTOR_ADDRESS_INFO;

    const requestBody = {
      user_id: userId,
      address_id: item.pk_doctor_schedule_id,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    };

    console.log("requestBody ==> " + JSON.stringify(requestBody));
    console.log("headers ==> " + JSON.stringify(headers));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("data ==> " + JSON.stringify(data));
            if (data.status_id === 200) {
              this.callAddressApi();
              this.props.showAlert(
                true,
                Globals.ErrorKey.SUCCESS,
                data.status_msg
              );
            } else {
              await this.setState({ loading: false, showLogoutPopUp: false });
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status_msg
              );
            }
          })
          .catch((error) => {
            this.setState({ loading: false, showLogoutPopUp: false });
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              "Something went wrong"
            );
          });
      } else {
        this.setState({ loading: false, showLogoutPopUp: false });
        this.props.showAlert(
          true,
          Globals.ErrorKey.NETWORK_ERROR,
          "Please check network connection."
        );
      }
    });
  };

  onRefresh = async () => {
    await this.setState({ swipeRefreshing: true });
    this.callAddressApi();
  };

  callAddressApi = async () => {
    this.setState({ loading: true });

    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.GET_DOCTOR_DOCUMENT_LIST;

    const requestBody = {
      user_id: userId,
    };

    let headers = {
      "Content-Type": "application/json",
    };

    console.log("url----" + JSON.stringify(url));
    console.log("headers----" + JSON.stringify(headers));
    console.log("requestBody----" + JSON.stringify(requestBody));

    isNetAvailable().then((success) => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            let data = await response.json();
            console.log("data ==> " + JSON.stringify(data));
          //  if (data.status_id === 200) {
              this.setState({
                loading: false,
                refreshing: false,
                document: data.document_data,
              });
           /* } else {
              this.setState({ loading: false, refreshing: false });
              this.props.showAlert(
                true,
                Globals.ErrorKey.ERROR,
                data.status_msg
              );
            }*/
          })
          .catch((error) => {
            this.setState({ loading: false, refreshing: false });
            this.props.showAlert(
              true,
              Globals.ErrorKey.ERROR,
              "Something Whent Wrong"
            );
          });
      } else {
        this.setState({ loading: false, refreshing: false });
        this.props.showAlert(
          true,
          Globals.ErrorKey.NETWORK_ERROR,
          "Please check network connection."
        );
      }
    });
  };

  LoadMoreRandomData = async () => {
    if (this.state.pageCount < this.state.totalPageCount) {
      await this.setState({ pageCount: this.state.pageCount + 1 });
      await this.callAddressApi();
    }
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
            <ActivityIndicator
              size="large"
              color={this.props.theme.BUTTON_BACKGROUND_COLOR}
            />
          </View>
        );
      } else {
        return <View></View>;
      }
    } catch (error) {
      console.log("error");
    }
  };

  renderItem = ({ item }) => {
    return (
      <DocumentView
        onItemPress={() => this.onClickItem(item)}
        viewWidth={scaleWidth * 240}
        viewHeight={scaleHeight * 130}
        item={item}
      />
      );
  };

  render() {
    const { document } = this.state;
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents onDidFocus={() => this.callAddressApi()} />
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
              }}>
                
              Educational Profile
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
              onPress={() => this.UploadDocument()}
              textStyle={{
                fontSize: FONT_SIZE_16,
                color: this.props.theme.BUTTON_TEXT_COLOR,
                paddingHorizontal: scaleWidth * 10,
              }}
              buttonText={"Upload Document"}
              cornerRadius={20}
              buttonHeight={SCALE_25}
              // buttonWidth={scaleSize(100)}
            />
          </View>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.swipeRefreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
          data={document}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter}
          onEndReached={() => this.LoadMoreRandomData()}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          ListEmptyComponent={
            !this.state.loading ? (
              <EmptyView EmptyText={Globals.EmptyListKey.EMPTY_ADDRESS} />
            ) : (
              ""
            )
          }
          contentContainerStyle={{ flexGrow: 1 }}
          removeClippedSubviews={true}
          bounces={false}
          initialNumToRender={100}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          scrollEnabled={true}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorAddressList);
