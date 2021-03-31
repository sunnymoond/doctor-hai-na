import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Platform } from 'react-native'
import styles from './styles'
import { Colors, Typography } from '../../styles'
import { SIGN_OUT, BACK, PAYMENTS, LOCATION, CAMERA_ICON, FEEDBACK } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import CustomButton from "../../components/CustomButton";
import CustomBGCard from "../../components/CustomBGCard";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import CustomBGParent from "../../components/CustomBGParent";
import { GRAY_DARK } from "../../styles/colors";
import { ScrollView } from 'react-native-gesture-handler';
import { isNetAvailable } from "../../utils/NetAvailable";
import { clearStore, getJSONData, storeData, storeJSONData } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import Spinner from 'react-native-loading-spinner-overlay';
import CustomTextView from "../../components/CustomTextView";
import { getFileExtension, getFileName } from "../../utils/Utills";
import Modal from 'react-native-modal';
import { FONT_SIZE_16, FONT_SIZE_20 } from "../../styles/typography";
import { SCALE_30 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { NavigationEvents, NavigationActions } from 'react-navigation';
import Globals, { COUNTRY_CODE } from '../../constants/Globals';
import apiConstant from '../../constants/apiConstant';
import ImageComponent from '../../components/ImageComponent'
import { signOut } from "../../utils/socialLoginAuth";
import { isEmpty } from "../../utils/Utills";
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { switchTheme, showAlert } from '../../redux/action'
import { darkTheme, lightTheme } from '../../styles/theme'


class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showLogoutPopUp: false,
      showImagePopUp: false,
      showRemovePhotoPopUp: false,
      user: {},
      filePath: {},
      fcmToken: "",
    }
  }

  async componentDidMount() {
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    await this.setState({ user: user });
  }

  _onFocus = async () => {
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    console.log('user---', JSON.stringify(user));
    await this.setState({ user: user });
  }

  editClicked = () => {
    this.props.navigation.navigate('PatientEditProfile', { user: this.state.user });
  };

  chooseFile = () => {
    this.setState({
      showImagePopUp: true
    });
  };

  logout = async () => {
    this.setState({ showLogoutPopUp: true });
  };

  confirmLogoutClick = async () => {
    this.callLogoutApi();
  };

  onRemoveClick = () => {
    this.setState({ showRemovePhotoPopUp: true });
  }

  confirmRemoveClick = () => {
    this.callRemoveProfileImageApi();
  }

  callRemoveProfileImageApi = async () => {
    await this.setState({ loading: true });
    const url = apiConstant.REMOVE_PROFILE_IMAGE;

    const requestBody = {
      user_id: this.state.user.pk_user_id,
      image_name: this.state.user.profile_image,
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }

    console.log('requestBody ==> ' + JSON.stringify(requestBody));
    console.log('headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers).then(async (response) => {
          let data = await response.json();
          console.log('data ==> ' + JSON.stringify(data));
          if (data.status_id === 200) {
            const user = await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
            this.onCancelClick();
            this.props.showAlert(true, Globals.ErrorKey.SUCCESS, data.status_msg);
            await this.setState({ loading: false, showLogoutPopUp: false, user: data.user_data, filePath: {} });
          } else {
            await this.setState({ loading: false, showLogoutPopUp: false });
            this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
          }
        }).catch(error => {
          this.setState({ loading: false, showLogoutPopUp: false });
          this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something went wrong');
        });
      } else {
        this.setState({ loading: false, showLogoutPopUp: false });
        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
      }
    });
  }

  callLogoutApi = async () => {
    await this.setState({ loading: true });
    const url = apiConstant.LOGOUT;

    const requestBody = {
      user_id: this.state.user.pk_user_id
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }

    console.log('requestBody ==> ' + JSON.stringify(requestBody));
    console.log('headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers).then(async (response) => {
          let data = await response.json();
          console.log('data ==> ' + JSON.stringify(data));
          if (data.status_id === 1) {
            await clearStore('user');
            await this.setState({ showLogoutPopUp: false });
            await signOut();
            this.resetStack();
          } else {
            await this.setState({ loading: false, showLogoutPopUp: false });
            this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
          }
        }).catch(error => {
          this.setState({ loading: false, showLogoutPopUp: false });
          this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something went wrong');
        });
      } else {
        this.setState({ loading: false, showLogoutPopUp: false });
        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
      }
    });
  }

  resetStack = () => {
    /*const navigateAction = NavigationActions.navigate({
      routeName: 'AuthLoading',
      key: null,
      index: 0,
      action: NavigationActions.navigate({ routeName: 'AuthLoading' }),
    });
    this.props.navigation.dispatch(navigateAction);*/
    this.props.navigation.navigate('AuthLoading');
  }

  onCancelClick = () => {
    this.setState({
      showLogoutPopUp: false,
      showImagePopUp: false,
      showRemovePhotoPopUp: false,
    });
  };

  Feeback = () => {
    this.props.navigation.navigate('Feedback');
  };

  switchTheme = async (theme) => {
    if (theme.mode === 'light') {
      await storeData(Globals._KEYS.THEME_TYPE, Globals._KEYS.LIGHT_THEME);
      this.props.switchTheme(lightTheme);
    } else {
      await storeData(Globals._KEYS.THEME_TYPE, Globals._KEYS.DARK_THEME);
      this.props.switchTheme(darkTheme);
    }
  };

  onLibraryClick = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      compressImageQuality: 0.2
    }).then(async response => {
      console.log(response);
      await this.setState({ filePath: response })
      if (response.path) {
        this._uploadImageToTheServer(response.path);
      }
    }).catch(e => {
      console.log(e);
    });
  };

  onPhotoClick = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
      compressImageQuality: 0.2
    }).then(async response => {
      console.log(response);
      await this.setState({ filePath: response })
    }).catch(e => {
      console.log(e);
    });
  };

  _uploadImageToTheServer = async (path) => {
    await this.setState({ loading: true, });
    let url = apiConstant.UPDATE_PROFILE_IMAGE;
    let fileName = getFileName(this.state.filePath.path);
    let requestBody = {
      user_id: this.state.user.pk_user_id,
      profile_image: this.state.filePath.data,
      image_ext: getFileExtension(fileName),
    };

    let headers = {
      "Content-Type": "application/json",
    };

    console.log("url ==> " + JSON.stringify(url));
    console.log("headers ==> " + JSON.stringify(headers));
    console.log("requestBody ==> " + JSON.stringify(requestBody));
    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers)
          .then(async (response) => {
            console.log("data1 ==> data1 " + JSON.stringify(response));
            console.log('response ==> ' + response);
            let data = await response.json();
            console.log('data ==> ' + JSON.stringify(data));
            if (data.status_id === 200) {
              await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
              this.onCancelClick();
              this.props.showAlert(true, Globals.ErrorKey.SUCCESS, data.status_msg);
              await this.setState({ loading: false, user: data.user_data, filePath: {} });
            } else {
              await this.setState({ loading: false, });
              this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
            }
          }).catch(error => {
            console.log('Error', JSON.stringify(error))
            this.setState({ loading: false, });
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something went wrong');
          });
      } else {
        this.setState({ loading: false, });
        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
      }
    });
  };

  render() {
    return (
      <CustomBGParent loading={this.state.loading} topPadding={false}>
        <NavigationEvents
          onWillFocus={this._onFocus}
        />
        <Spinner
          overlayColor={"rgba(34, 60, 83, 0.6)"}
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF' }}
        />
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scaleHeight * 25,
          }}>
          <View
            style={{
              position: 'absolute',
              left: scaleWidth * 25,
              height: scaleHeight * 30,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center'
            }}>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_16,
                color: this.props.theme.PRIMARY_TEXT_COLOR,
                fontWeight: 'bold'
              }}>
              Profile
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              width: scaleWidth * 60,
              height: scaleHeight * 30,
              right: scaleWidth * 0,
              justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
              alignItems: 'center'
            }}
            onPress={() => this.logout()}>
            <Image
              style={{
                width: scaleWidth * 22,
                height: scaleHeight * 22,
                tintColor: this.props.theme.IMAGE_TINT_COLOR
              }}
              source={SIGN_OUT} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{
            marginTop: scaleHeight * 22,
            marginBottom: scaleHeight * 22,
          }}>
            <View style={{ width: '100%', height: scaleHeight * 114, flexDirection: 'column', justifyContent: 'center' }}>

              <View style={{ width: scaleWidth * 114, height: scaleWidth * 114, borderRadius: scaleWidth * 114 / 2, position: 'absolute', left: scaleWidth * 22, backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.chooseFile()}>
                  <View
                    style={{
                      width: scaleWidth * 114,
                      height: scaleWidth * 114,
                      borderRadius: scaleWidth * 114 / 2,
                      backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {!isEmpty(true, this.state.user.profile_image) || !isEmpty(true, this.state.filePath.path) ? (
                      !isEmpty(true, this.state.filePath.path) ? (
                        <Image source={{ uri: this.state.filePath.path }}
                          style={{ width: scaleWidth * 114, height: scaleWidth * 114, borderRadius: scaleWidth * 114 / 2 }}
                          resizeMode='cover' />
                      ) : (<ImageComponent imageUrl={apiConstant.IMAGE_URL + this.state.user.profile_image}
                        imageWidth={scaleWidth * 114}
                        imageHeight={scaleWidth * 114}
                        imageBorderRadius={scaleWidth * 114 / 2} />)
                    ) : (
                        null//<Text style={styles.circleText}>{this.state.first_name.charAt(0).toUpperCase() + this.state.last_name.charAt(0).toUpperCase()}</Text>
                      )
                    }
                    <Image
                      source={CAMERA_ICON}
                      style={{
                        width: scaleWidth * 36,
                        height: scaleHeight * 33,
                        alignSelf: 'center',
                        position: 'absolute',
                        tintColor: Colors.WHITE
                      }}
                      resizeMode='contain' />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: scaleWidth * 166, flexDirection: 'column', alignItems: 'flex-start' }}>
                {this.state.user.user_name
                  ? <Text style={{ marginBottom: scaleHeight * 6, fontSize: Typography.FONT_SIZE_18, color: this.props.theme.PRIMARY_TEXT_COLOR, textAlign: 'left' }}>{isEmpty(false, this.state.user.user_name)}</Text>
                  : null
                }
                {this.state.user.phone_number
                  ? <Text
                    style={{
                      marginBottom: scaleHeight * 6,
                      fontSize: Typography.FONT_SIZE_16,
                      color: this.props.theme.PRIMARY_TEXT_COLOR
                    }}>
                    {isEmpty(false, `${this.state.user.phone_number}`.replace(COUNTRY_CODE, ''))}</Text>
                  : null
                }
                {this.state.user.user_email
                  ? <Text style={{ marginBottom: scaleHeight * 6, fontSize: Typography.FONT_SIZE_16, color: this.props.theme.PRIMARY_TEXT_COLOR }}>{isEmpty(false, this.state.user.user_email)}</Text>
                  : null
                }
              </View>
            </View>

            <View style={{ width: '100%', alignItems: 'center', marginLeft: scaleWidth * 10, marginBottom: scaleHeight * 55 }}>
              <CustomButton onPress={() => this.editClicked()} textStyle={{ fontSize: 14, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Edit"} cornerRadius={5}
                buttonWidth={scaleHeight * 80} buttonHeight={scaleHeight * 35} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
            </View>

            <Text style={{ marginLeft: scaleWidth * 22, marginBottom: 25, fontSize: Typography.FONT_SIZE_22, color: this.props.theme.PRIMARY_TEXT_COLOR }}>Account</Text>
            <View style={[styles.cardShadow, styles.margins]}>
              <CustomBGCard cornerRadius={10} bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
                <View style={{ marginHorizontal: 15, marginTop: 20 }}>

                  {this.props.theme.mode === 'light' ? (
                    <TouchableOpacity style={{}} onPress={() => this.switchTheme(darkTheme)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                        <Image style={{ height: scaleHeight * 18, width: scaleWidth * 23, marginLeft: 10, tintColor: this.props.theme.IMAGE_TINT_COLOR }} source={PAYMENTS} />
                        <Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_18, color: Colors.BLACK }}>Switch to Dark Theme</Text>
                        <Image style={{ width: scaleWidth * 10, height: scaleHeight * 15, position: 'absolute', tintColor: this.props.theme.IMAGE_TINT_COLOR, right: scaleWidth * 1, marginBottom: scaleHeight * 10, transform: [{ rotate: '180deg' }] }} source={BACK} />
                      </View>
                    </TouchableOpacity>

                  ) : (
                      <TouchableOpacity style={{}} onPress={() => this.switchTheme(lightTheme)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                          <Image style={{ height: scaleHeight * 18, width: scaleWidth * 23, marginLeft: 10, tintColor: this.props.theme.IMAGE_TINT_COLOR }} source={PAYMENTS} />
                          <Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_18, color: Colors.BLACK }}>Switch to light Theme</Text>
                          <Image style={{ width: scaleWidth * 10, height: scaleHeight * 15, position: 'absolute', tintColor: this.props.theme.IMAGE_TINT_COLOR, right: scaleWidth * 1, marginBottom: scaleHeight * 10, transform: [{ rotate: '180deg' }] }} source={BACK} />
                        </View>
                      </TouchableOpacity>

                    )}
                  {/*<TouchableOpacity onPress={() => this.NotificatonClicked()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                      <Image style={{ height: scaleHeight * 24, width: scaleWidth * 20, marginLeft: 10, tintColor: this.props.theme.IMAGE_TINT_COLOR }} source={BELL} />
                      <Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_18, color: Colors.BLACK }}>Notifications</Text>
                      <Image style={{ width: scaleWidth * 10, height: scaleHeight * 15, position: 'absolute', tintColor: this.props.theme.IMAGE_TINT_COLOR, right: scaleWidth * 1, marginBottom: scaleHeight * 10, transform: [{ rotate: '180deg' }] }} source={BACK} />
                    </View>
                  </TouchableOpacity>*/}
                </View>

            
                <View style={{ marginHorizontal: 15, marginBottom: 60, marginTop: 20 }}>

                    <TouchableOpacity style={{}} onPress={() => this.Feeback()}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderColor: GRAY_DARK, }}>
                        <Image style={{ height: scaleHeight * 24, width: scaleWidth * 24, marginLeft: 10, tintColor: this.props.theme.IMAGE_TINT_COLOR }} source={FEEDBACK} />
                        <Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_18, color: Colors.BLACK }}>Feed Back</Text>
                        <Image style={{ width: scaleWidth * 10, height: scaleHeight * 15, position: 'absolute', tintColor: this.props.theme.IMAGE_TINT_COLOR, right: scaleWidth * 1, marginBottom: scaleHeight * 10, transform: [{ rotate: '180deg' }] }} source={BACK} />
                      </View>
                    </TouchableOpacity>      

          </View>
          </CustomBGCard>
          </View>
          </View>
        </ScrollView>
        <ConfirmationPopUp
          isModelVisible={this.state.showLogoutPopUp}
          positiveButtonText={Globals.YES}
          negativeButtonText={Globals.NO}
          onPositivePress={() => this.confirmLogoutClick()}
          onNegativePress={() => this.onCancelClick()}
          alertMessage={Globals.LOGOUT_MESSAGE} />
        <ConfirmationPopUp
          isModelVisible={this.state.showRemovePhotoPopUp}
          positiveButtonText={Globals.DELETE}
          negativeButtonText={Globals.CANCEL}
          onPositivePress={() => this.confirmRemoveClick()}
          onNegativePress={() => this.onCancelClick()}
          alertMessage={Globals.DELETE_PROFILE_PIC_MESSAGE} />
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
          swipeDirection={['down']}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          isVisible={this.state.showImagePopUp}>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: scaleSize(120),
              width: '100%',
              paddingHorizontal: scaleWidth * 30,
              backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>

            <View style={{
              height: scaleHeight * 5,
              width: scaleWidth * 50,
              borderRadius: 4,
              marginTop: scaleHeight * 5,
              borderColor: this.props.theme.BORDER_TOP_COLOR,
              backgroundColor: this.props.theme.BORDER_TOP_COLOR
            }}>

            </View>
            <CustomTextView
              noOfLines={1}
              fontPaddingVertical={5}
              fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
              value={Globals.PROFILE_PHOTE}
              fontSize={FONT_SIZE_20} />
            <View
              style={{
                width: '100%',
                alignItems: 'flex-start',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              {!isEmpty(true, this.state.user.profile_image) &&
                <CustomButton
                  buttonStyle={[
                    styles.buttonsShadow,
                    {
                      backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                      marginTop: scaleSize(10),
                      marginBottom: scaleSize(10),
                    }]}
                  onPress={() => this.onRemoveClick()}
                  textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                  buttonText={Globals.REMOVE}
                  cornerRadius={100}
                  buttonHeight={SCALE_30}
                  buttonWidth={scaleSize(100)} />}
              <CustomButton
                buttonStyle={[
                  styles.buttonsShadow,
                  {
                    backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  }]}
                onPress={() => this.onPhotoClick()}
                textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                buttonText={Globals.CAMERA}
                cornerRadius={100}
                buttonHeight={SCALE_30}
                buttonWidth={scaleSize(100)} />
              <CustomButton
                buttonStyle={[
                  styles.buttonsShadow,
                  {
                    backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                    marginTop: scaleSize(10),
                    marginBottom: scaleSize(10),
                  }]}
                onPress={() => this.onLibraryClick()}
                textStyle={{
                  fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR
                }}
                buttonText={Globals.GALLERY}
                cornerRadius={100}
                buttonHeight={SCALE_30}
                buttonWidth={scaleSize(100)} />
            </View>
          </View>
        </Modal>


      </CustomBGParent>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
  switchTheme: bindActionCreators(switchTheme, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientProfile)