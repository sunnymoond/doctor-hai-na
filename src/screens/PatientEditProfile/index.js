import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, TextInput, Platform, Picker, BackHandler, } from 'react-native'
import styles from './styles'
import { Typography } from '../../styles'
import { BACK, } from "../../images";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import CustomBGCard from "../../components/CustomBGCard";
import CustomBGParent from "../../components/CustomBGParent";
import { ScrollView } from 'react-native-gesture-handler';
import { isNetAvailable } from "../../utils/NetAvailable";
import { getJSONData, storeJSONData } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationEvents } from 'react-navigation';
import CustomButton from "../../components/CustomButton";
import apiConstant from "../../constants/apiConstant";
import Globals from '../../constants/Globals';
import { FONT_SIZE_16 } from "../../styles/typography";
import { SCALE_25, SCALE_40 } from "../../styles/spacing";
import { scaleSize } from "../../styles/mixins";
import { isEmpty } from "../../utils/Utills";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDate } from "../../utils/DateTimeUtills";

class PatientEditProfile extends Component {
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
      age: user.age ? user.age : "",
      show: false,
      date: new Date(),
    }
  }

  componentDidMount() {
    this.initialState = this.state
  }

  _onBlurr = () => {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
  }

  _onFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
  }

  _handleBackButtonClick = () => {
    this.goBack();
    return true;
  }

  updateProfile = async () => {
    this.signUpCheckValidity();
  };

  goBack = () => {
    this.props.navigation.navigate('PatientProfile');
    this.setState(this.initialState);
  }

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
  }

  isPhoneValid = (reg, phone) => {
    if (reg.test(phone) === false) {
      return false;
    } else {
      return true;
    }
  }

  signUpCheckValidity = () => {
    if (this.state.user_name.toString().trim().length === 0) {
      this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter user name');
    } else if (this.state.phone_number.toString().trim().length !== 0 && this.checkPhone(this.state.phone_number)) {
      this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please enter valid phone number');
    } else {
      this.callEditProfileApi();
    }
  };

  callEditProfileApi = async () => {
    await this.setState({ loading: true });
    const user = await getJSONData(Globals._KEYS.USER_DATA);
    const userId = user.pk_user_id;
    const url = apiConstant.MODIFY_USER;

    const requestBody = {
      user_id: userId,
      user_name: this.state.user_name,
      date_of_birth: this.state.dob,
      gender: this.state.gender,
      phone_number: this.state.phone_number,
      home_phone: this.state.home_phone,
      office_phone: this.state.office_phone,
      user_bio: this.state.user_bio,
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    console.log('requestBody ==> ' + JSON.stringify(requestBody));
    console.log('headers ==> ' + JSON.stringify(headers));

    isNetAvailable().then(success => {
      if (success) {
        fetchServerDataPost(url, requestBody, headers).then(async (response) => {
          console.log('response' + JSON.stringify(response));
          let data = await response.json();
          console.log('data ==> ' + JSON.stringify(data));
          if (data.status_id === 200) {
            await this.responseOnSuccess(data);
          } else {
            await this.setState({ loading: false });
            this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
          }
        }).catch(error => {
          this.setState({ loading: false });
          this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something Went Wrong');
        });
      } else {
        this.setState({ loading: false });
        this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
      }
    });
  }

  responseOnSuccess = async (data) => {
    this.initialState = this.state
    if (data.user_data) {
      await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
      this.setState({ loading: false });      
      this.props.showAlert(true, Globals.ErrorKey.SUCCESS, 'Profile update successfully');
      this.goBack();
    } else {
      this.setState({ loading: false });
    }
  };

  onChange = (event, selectedDate) => {
    if (!isEmpty(true, selectedDate)) {
      this.setState({ show: false, dob: selectedDate, });
    } else {
      this.setState({ show: false, });
    }
  };

  render() {
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
              Edit Profile
            </Text>
          </View>

          <View style={{
            height: scaleHeight * 25,
            position: 'absolute',
            right: scaleWidth * 10,
            alignItems: 'center',
            justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center'
          }}>
            <CustomButton
              buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
              onPress={() => this.updateProfile()}
              textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
              buttonText={"Save"}
              cornerRadius={20} buttonHeight={SCALE_25} buttonWidth={scaleSize(100)} />
          </View>
        </View>
        <ScrollView>
          {/*<Text style={{ marginLeft: scaleWidth * 22, fontSize: Typography.FONT_SIZE_30, color: this.props.theme.PRIMARY_TEXT_COLOR }}>Edit Profile</Text>*/}

          <View style={[styles.cardShadow, styles.margins]}>
            <CustomBGCard cornerRadius={10} bgColor={this.props.theme.CARD_BACKGROUND_COLOR}>
              <View style={styles.inputViewCards}>
                <TextInput style={styles.textInputStyle}
                  onChangeText={text => this.setState({ first_name: text })}
                  value={this.state.user_name}
                  placeholder={"User Name"} />

                <TextInput style={styles.textInputStyle}
                  onChangeText={text => this.setState({ phone_number: text })}
                  value={this.state.phone_number}
                  keyboardType='numeric'
                  placeholder={"Phone number"} />

                {/*<TextInput style={styles.textInputStyle}
                  onChangeText={text => this.setState({ home_phone: text })}
                  value={this.state.home_phone}
                  keyboardType='numeric'
                  placeholder={"Home Phone"} />

                <TextInput style={styles.textInputStyle}
                  onChangeText={text => this.setState({ office_phone: text })}
                  value={this.state.office_phone}
                  keyboardType='numeric'
        placeholder={"Office Phone"} />*/}

                <TextInput style={styles.textInputStyle}
                  onChangeText={text => this.setState({ user_bio: text })}
                  value={this.state.user_bio}
                  placeholder={"User bio"} />

                <TouchableOpacity onPress={() => this.setState({ show: true })}>
                  <TextInput style={styles.textInputStyle}
                    onChangeText={text => this.setState({ dob: text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '') })}
                    value={this.state.dob === '' ? '' : getDate(this.state.dob)}
                    placeholder={"DOB between 15 to 60"}
                    keyboardType={'numeric'}
                    editable={false} />
                </TouchableOpacity>

                {this.state.show && (
                  <DateTimePicker
                    value={this.state.date}
                    mode={'date'}
                    display="default"
                    style={{ backgroundColor: Platform.OS === 'android' ? "black" : "white", marginTop: 20 }}
                    onChange={this.onChange}
                    minimumDate={new Date().setFullYear(new Date().getFullYear() - 60)}
                    maximumDate={new Date().setFullYear(new Date().getFullYear() - 14)}
                  />
                )}

                <Picker
                  selectedValue={this.state.gender}
                  style={styles.textInputStyle}
                  onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
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
)(PatientEditProfile)