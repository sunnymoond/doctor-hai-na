import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
  BackHandler
} from 'react-native'
import styles from './styles'
import { Colors, Typography } from '../../styles';
import DoctorItemView from "../../components/DoctorItemView";
import CustomBGCard from "../../components/CustomBGCard";
import CustomBGParent from "../../components/CustomBGParent";
import EmptyView from "../../components/EmptyView";
import { GOOGLE_MAP, BACK } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import apiConstant from "../../constants/apiConstant";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import openMap from 'react-native-open-maps';
import { isNetAvailable } from "../../utils/NetAvailable";
import { isEmpty } from "../../utils/Utills";
import Globals from '../../constants/Globals';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class DoctorDetail extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const selectedDoctor = navigation.getParam('data');
    this.state = {
      loading: false,
      refreshing: false,
      selectedDoctor: selectedDoctor ? {} : selectedDoctor,
      addresses: [],
    }
  }

  async componentDidMount() {
    this.setData();
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevProp !== this.props) {
      this.setData();
    }
  }

  _onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
  }

  _onFocus = () => {
    this.setData();
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
  }

  _handleBackButtonClick = () => {
    this.goBack();
    return true;
  }

  goBack = () => {
    this.props.navigation.navigate('PatientHome');
    this.setState(this.initialState);
  }

  clearState = () => {
    this.setState({
      loading: false,
      refreshing: false,
      addresses: []
    });
  }

  setData = async () => {
    const { navigation } = this.props;
    const selectedDoctor = navigation.getParam('data');
    console.log('selectedDoctor', JSON.stringify(selectedDoctor))
    await this.setState({
      loading: false,
      refreshing: false,
      selectedDoctor: selectedDoctor,
      addresses: []
    });
    this.callAddressApi();
  }

  _goToMap(item) {
    const end = item.address;
    const travelType = 'drive';
    openMap({ travelType, end });
  }


  onRefresh = async () => {
    await this.setState({ swipeRefreshing: true, });
    this.callAddressApi();
  };

  callAddressApi = async () => {
    this.setState({ loading: true });
    const userId = this.state.selectedDoctor.pk_user_id;
    const url = apiConstant.DOCTOR_SCHEDULE_DETAIL;

    const requestBody = {
      user_id: userId,
    }

    let headers = {
      "Content-Type": "application/json",
    };

    console.log('url----' + JSON.stringify(url));
    console.log('headers----' + JSON.stringify(headers));
    console.log('requestBody----' + JSON.stringify(requestBody));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers).then(async (response) => {
          let data = await response.json();
          console.log('data ==> ' + JSON.stringify(data));
          if (data.status_id === 200) {
            this.setState({ loading: false, refreshing: false, addresses: data.address_data });
          } else {
            this.setState({ loading: false, refreshing: false });
            this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
          }
        }).catch(error => {
          this.setState({ loading: false, refreshing: false });
          this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something Whent Wrong');
        });
      } else {
        this.setState({ loading: false, refreshing: false });
        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
      }
    });
  }

  LoadMoreRandomData = async () => {
    if (this.state.pageCount < this.state.totalPageCount) {
      await this.setState({ pageCount: this.state.pageCount + 1 });
      await this.callAddressApi();
    }
  }

  renderFooter = () => {
    try {
      if (this.state.refreshing) {
        return (
          <View
            style={{
              paddingVertical: scaleHeight * 5,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent'
            }}>
            <ActivityIndicator size="large" color={this.props.theme.BUTTON_BACKGROUND_COLOR} />
          </View>)
      } else {
        return <View></View>;
      }
    } catch (error) {
      console.log('error');
    }
  };


  renderItem = ({ item }) => {
    return (
      <View style={[styles.cardShadow, styles.margins]}>
        <CustomBGCard cornerRadius={10} bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
          <View style={{ paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'column', justifyContent: 'flex-start', }}>
            <View style={{ paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between', }}>
              <Text style={{ fontWeight: "bold", fontSize: Typography.FONT_SIZE_14, color: Colors.BLACK, }}>
                {isEmpty(false, item.start_time) + ' To ' + isEmpty(false, item.end_time)}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <TouchableOpacity
                  style={{
                    width: scaleWidth * 24,
                    height: scaleHeight * 24,
                    alignItems: 'center'
                  }}
                  onPress={() => this._goToMap(item)}>
                  <Image
                    source={GOOGLE_MAP}
                    style={{
                      height: scaleHeight * 20,
                      width: scaleWidth * 18,
                    }}
                    resizeMode="cover" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ textAlign: 'left', fontSize: Typography.FONT_SIZE_14, color: Colors.BLACK, }}>
              {isEmpty(false, item.clinic_name)}
            </Text>
            <Text style={{ textAlign: 'left', fontSize: Typography.FONT_SIZE_14, color: Colors.BLACK, }}>
              {isEmpty(false, item.days)}
            </Text>
            <Text style={{ textAlign: 'left', fontSize: Typography.FONT_SIZE_14, color: Colors.BLACK, }}>
              {isEmpty(false, item.address)}
            </Text>
          </View>
        </CustomBGCard>
      </View>
    )
  }

  render() {
    const { addresses } = this.state
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents
          onWillFocus={this._onFocus}
          onWillBlur={this._onBlurr} />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scaleHeight * 25,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: scaleWidth * 60,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center'
            }}
            onPress={() => this.goBack()}>
            <Image
              style={{
                width: scaleWidth * 10,
                height: scaleHeight * 20,
                tintColor: this.props.theme.IMAGE_TINT_COLOR
              }}
              source={BACK} />
          </TouchableOpacity>
          <View
            style={{
              position: 'absolute',
              left: 50,
              height: scaleHeight * 25,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center'
            }}>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_16,
                color: this.props.theme.PRIMARY_TEXT_COLOR,
                fontWeight: 'bold'
              }}>
              Doctor detail
            </Text>
          </View>
        </View>
        {Object.keys(this.state.selectedDoctor).length > 0 &&
          <DoctorItemView
            viewWidth={scaleWidth * 240}
            viewHeight={scaleHeight * 130}
            item={this.state.selectedDoctor} />}

        <FlatList
          refreshControl={
            <RefreshControl refreshing={this.state.swipeRefreshing} onRefresh={() => this.onRefresh()} />
          }
          data={addresses}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderFooter}
          onEndReached={() => this.LoadMoreRandomData()}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          ListEmptyComponent={!this.state.loading ? <EmptyView EmptyText={Globals.EmptyListKey.EMPTY_ADDRESS} /> : ''}
          contentContainerStyle={{ flexGrow: 1 }}
          removeClippedSubviews={true}
          bounces={false}
          initialNumToRender={100}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          scrollEnabled={true}
        />
      </CustomBGParent>
    )
  }
}
const mapStateToProps = state => ({
  theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DoctorDetail)