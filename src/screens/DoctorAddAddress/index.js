import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput, Platform, BackHandler } from 'react-native';
import MapView from "react-native-maps";
import styles from "./styles";
import { Typography } from '../../styles';
import { scaleHeight, scaleWidth } from "../../styles/scaling";
import { BACK, LOCATION } from "../../images";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { isNetAvailable } from "../../utils/NetAvailable";
import { getJSONData } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import Globals from "../../constants/Globals";
import Spinner from 'react-native-loading-spinner-overlay';
import { FONT_SIZE_12, FONT_SIZE_16, FONT_SIZE_22 } from "../../styles/typography";
import { SCALE_40, SCALE_30 } from "../../styles/spacing";
import { getTime, convertDateFrom12HoursFormate, sort_days } from '../../utils/DateTimeUtills';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isEmpty } from "../../utils/Utills";
import apiConstant from "../../constants/apiConstant"
import { scaleSize } from "../../styles/mixins";
import Modal from 'react-native-modal';
import CustomTextView from "../../components/CustomTextView";
import CustomButton from "../../components/CustomButton";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'
import NavigationService from '../../navigations/NavigationService'
import { NavigationEvents } from 'react-navigation';
//import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
const locationConfig = { skipPermissionRequests: false, authorizationLevel: "whenInUse" }
Geolocation.setRNConfiguration(locationConfig);
// Disable yellow box warning messages
console.disableYellowBox = true;

const GOOGLE_PLACES_API_KEY = 'AIzaSyBFkG6LTGiTkVjMwn2XonJuy_7TCU0a6JI';
Geocoder.init(GOOGLE_PLACES_API_KEY, { language: "en" });

class MapLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            region: {
                latitude: undefined,
                longitude: undefined,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            },
            isMapReady: false,
            marginTop: 1,
            address_id: '',
            userLocation: "",
            regionChangeProgress: false,
            modalVisible: false,
            permissionPopup: false,
            error: null,
            manual_address: '',
            manualAddressPH: 'Enter your Manual Address (Optional)',
            saveButtonText: 'Save',
            organization_name: '',
            showManualAddress: false,
            showLocationAddress: true,
            serviceStartTime: Globals._KEYS.START_TIME,
            serviceEndTime: Globals._KEYS.END_TIME,
            date: new Date(),
            show: false,
            timeMode: '',
            selectedServiceDay: [],
            isSunSelected: false,
            isMonSelected: false,
            isTueSelected: false,
            isWedSelected: false,
            isThuSelected: false,
            isFriSelected: false,
            isSatSelected: false,
        };
    }

    componentDidMount() {
        //this.getCurrentLocation();
    }

    componentWillUnmount() {
        Geolocation.stopObserving();
    }

    _onBlurr = () => {
        Geolocation.stopObserving();
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    _onFocus = async () => {
        const { navigation } = this.props;
        const addressData = navigation.getParam('data');
        if (addressData) {
            console.log('addressData', JSON.stringify(addressData));
            this.setEditData(addressData);
        } else {
            //this.initialState = this.state
            this.getCurrentLocation();
        }
        if (this.mapView) {
            await this.setState({ isMapReady: true, marginTop: 0, showManualAddress: false });
            let initialRegion = Object.assign({}, this.state.region);
            this.mapView.animateToRegion(initialRegion, 2000);
        }
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    _handleBackButtonClick = () => {
        const { navigation } = this.props;
        const fromScreen = navigation.getParam('from');
        if (fromScreen) {
            this.props.navigation.navigate('DoctorAddressList');
        } else {
            this.props.navigation.navigate('DoctorProfile');
        }
        this.setState({ show: false, })
        return true;
    }

    setEditData = async (data) => {
        console.log('data', JSON.stringify(data));
        var barberSelectedWorking = data.days.split(',');
        this.setState({ address_id: data.pk_doctor_schedule_id });
        if (isEmpty(true, data.start_time)) {
            this.setState({ serviceStartTime: Globals._KEYS.START_TIME });
        } else {
            this.setState({ serviceStartTime: convertDateFrom12HoursFormate(data.start_time) });
        }
        if (isEmpty(true, data.end_time)) {
            this.setState({ serviceEndTime: Globals._KEYS.END_TIME });
        }
        else {
            this.setState({ serviceEndTime: convertDateFrom12HoursFormate(data.end_time) });
        }
        let array = this.state.selectedServiceDay;
        await barberSelectedWorking.map(item => {
            console.log('item', item)
            if (item == Globals._KEYS.SUNDAY) {
                if (!array.includes(Globals._KEYS.SUNDAY)) {
                    array.push(item);
                }
                this.setState({ isSunSelected: true });
            } else if (item == Globals._KEYS.MONDAY) {
                if (!array.includes(Globals._KEYS.MONDAY)) {
                    array.push(item);
                }
                this.setState({ isMonSelected: true });
            } else if (item == Globals._KEYS.TUESDAY) {
                if (!array.includes(Globals._KEYS.TUESDAY)) {
                    array.push(item);
                }
                this.setState({ isTueSelected: true });
            } else if (item == Globals._KEYS.WEDNESDAY) {
                if (!array.includes(Globals._KEYS.WEDNESDAY)) {
                    array.push(item);
                }
                this.setState({ isWedSelected: true });
            } else if (item == Globals._KEYS.THURSDAY) {
                if (!array.includes(Globals._KEYS.THURSDAY)) {
                    array.push(item);
                }
                this.setState({ isThuSelected: true });
            } else if (item == Globals._KEYS.FRIDAY) {
                if (!array.includes(Globals._KEYS.FRIDAY)) {
                    array.push(item);
                }
                this.setState({ isFriSelected: true });
            } else if (item == Globals._KEYS.SATURDAY) {
                if (!array.includes(Globals._KEYS.SATURDAY)) {
                    array.push(item);
                }
                this.setState({ isSatSelected: true });
            }
        });
        const region = {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            latitudeDelta: 0.03,
            longitudeDelta: 0.03
        };
        this.setState({
            selectedServiceDay: array,
            organization_name: data.clinic_name,
            userLocation: data.address,
            region: region,
            loading: false,
        });

    }

    getCurrentLocation = () => {
        this.setState({ loading: true, showManualAddress: false })
        Geolocation.getCurrentPosition(
            (position) => {
                const region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03
                };
                this.setState({
                    region: region,
                    loading: false,
                    error: null,
                });
                console.log('Geolocation ===> ' + JSON.stringify(region));
            },
            (error) => {
                this.setState({
                    error: error.message,
                    loading: false,
                    modalVisible: true
                });
                console.log(error.message);
            },
            {
                enableHighAccuracy: false, timeout: 200000, maximumAge: 5000,
                forceRequestLocation: this.state.permissionPopup, showLocationDialog: this.state.permissionPopup
            },
        );
    }

    onPermissionClick = async () => {
        if (Platform.OS === 'android') {
            RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 10000 })
                .then(async data => {
                    if (data == 'enabled') {
                        await this.setState({ modalVisible: false });
                        this.getCurrentLocation();
                    } else if (data == 'already-enabled') {
                        await this.setState({ modalVisible: false });
                        this.getCurrentLocation();
                    }
                }).catch(err => {
                    this.props.showAlert(true, Globals.ErrorKey.ERROR, "Permission " + err.message);
                });
        } else {
            await this.setState({ modalVisible: false });
        }
    };

    onManualAddressClick = async () => {
        await this.setState({
            modalVisible: false,
            showManualAddress: true,
            showLocationAddress: false,
            manualAddressPH: 'Enter your Manual Address here...',
            saveButtonText: 'Pick your manual address'
        });
        //this.clearState();
    };

    goBack = async () => {
        this._handleBackButtonClick();
    }

    clearState = () => {
        this.setState({
            region: {
                latitude: undefined,
                longitude: undefined,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            },
            isMapReady: false,
            marginTop: 1,
            userLocation: "",
            regionChangeProgress: false,
            modalVisible: false,
            permissionPopup: false,
            error: null,
            manual_address: '',
            manualAddressPH: 'Enter your Manual Address (Optional)',
            saveButtonText: 'Save',
            serviceStartTime: Globals._KEYS.START_TIME,
            serviceEndTime: Globals._KEYS.END_TIME,
            date: new Date(),
            show: false,
            timeMode: '',
            selectedServiceDay: [],
            isSunSelected: false,
            isMonSelected: false,
            isTueSelected: false,
            isWedSelected: false,
            isThuSelected: false,
            isFriSelected: false,
            isSatSelected: false,
        })
    }

    onMapReady = () => {
        this.setState({ isMapReady: true, marginTop: 0 });
        let initialRegion = Object.assign({}, this.state.region);
        this.mapView.animateToRegion(initialRegion, 2000);
    }

    // Fetch location details as a JOSN from google map API
    fetchAddress = () => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyBiuz54IsHinOf7Gipkjq9H2a6wQKctAfw")
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log('responseJson', JSON.stringify(responseJson))
                const userLocation = responseJson.results[0].formatted_address;
                console.log('userLocation', JSON.stringify(userLocation))
                this.setState({
                    showLocationAddress: true,
                    userLocation: userLocation,
                    regionChangeProgress: false,
                    loading: false
                });
            });
    }

    // Update state on region change
    onRegionChange = region => {
        this.setState({
            region,
            regionChangeProgress: true,
            loading: true
        }, () => this.fetchAddress());
    }

    // Action to be taken after select location button click
    onLocationSelect = async () => {
        if (!this.state.region.latitude && !this.state.region.longitude) {
            Geocoder.from(this.state.manual_address.toString())
                .then(async (json) => {
                    var location = json.results[0].geometry.location;
                    //console.log('wow--' + JSON.stringify(location));
                    const region = {
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03
                    };
                    await this.setState({
                        region: region,
                        saveButtonText: 'Save'
                    })
                })
                .catch((error) => {
                    this.setState({
                        error: error.message,
                        loading: false,
                        modalVisible: true
                    });
                    console.log(error.message);
                });
            return;
        }

        if (!this.state.region.latitude || !this.state.region.longitude) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'The location must for the set avalability');
        } else if (!this.state.userLocation && !this.state.manual_address) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'The address must for the set avalability');
        } else if (isEmpty(true, this.state.organization_name)) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please Enter Your Organization Name');
        } else if (this.state.serviceStartTime === Globals._KEYS.START_TIME) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please select working start time');
        } else if (this.state.serviceEndTime === Globals._KEYS.END_TIME) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please select working end time');
        } else if (this.state.selectedServiceDay.length <= 0) {
            this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Please select working days');
        } else {
            this.callDoctorWorkingApi();
        }

    }

    callDoctorWorkingApi = async () => {
        var startTime = getTime(this.state.serviceStartTime);
        var endTime = getTime(this.state.serviceEndTime);
        await this.setState({ loading: true });
        const user = await getJSONData(Globals._KEYS.USER_DATA);
        const userId = user.pk_user_id;
        const url = apiConstant.DOCTOR_WORKING;

        const requestBody = {
            address_id: this.state.address_id,
            user_id: userId,
            address: this.state.userLocation,
            manual_address: this.state.manual_address,
            city: "",
            state: "",
            zipcode: "",
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            clinic_name: this.state.organization_name,
            days: this.state.selectedServiceDay,
            start_time: startTime,
            end_time: endTime
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
                        await this.setState({ loading: false });
                        this.props.showAlert(true, Globals.ErrorKey.SUCCESS, data.status_msg);
                        this._handleBackButtonClick();
                    } else {
                        await this.setState({ loading: false });
                        this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
                    }
                }).catch(error => {
                    this.setState({ loading: false });
                    this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something went wrong');
                });
            } else {
                this.setState({ loading: false });
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
            }
        });
    }

    showTimepicker = (val) => {
        this.setState({ show: true, timeMode: val, });
    };

    onChange = (event, selectedDate) => {
        if (!isEmpty(true, selectedDate)) {
            var TimeNow = new Date(selectedDate.toString());
            if (this.state.timeMode === this.state.serviceStartTime) {
                this.setState({ show: false, serviceStartTime: selectedDate });
            } else {
                if (this.state.serviceStartTime === Globals._KEYS.START_TIME) {
                    this.setState({ show: false, });
                    this.props.showAlert(true, Globals.ErrorKey.WARNING, 'Please select the start time before select the end time');
                }
                if (this.state.serviceStartTime != Globals._KEYS.START_TIME) {
                    var SelectedStartTime = new Date(this.state.serviceStartTime.toString());
                    if (SelectedStartTime.getTime() >= TimeNow.getTime()) {
                        this.setState({ show: false, });
                        this.props.showAlert(true, Globals.ErrorKey.WARNING, 'You cannot select the previous time in the start time.');
                    } else {
                        this.setState({ show: false, serviceEndTime: selectedDate });
                    }
                }

            }
        } else {
            this.setState({ show: false, });
        }
    };

    buttonClicked = (val) => {
        let array = this.state.selectedServiceDay;
        if (val === Globals._KEYS.SUNDAY) {
            if (!this.state.isSunSelected) {
                if (!array.includes(Globals._KEYS.SUNDAY)) {
                    array.push(Globals._KEYS.SUNDAY);
                }
                this.setState({ isSunSelected: true, });
            } else {
                const index = array.indexOf(Globals._KEYS.SUNDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isSunSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.MONDAY) {
            if (!this.state.isMonSelected) {
                if (!array.includes(Globals._KEYS.MONDAY)) {
                    array.push(Globals._KEYS.MONDAY);
                }
                this.setState({ isMonSelected: true, });
            } else {
                const index = array.indexOf(Globals._KEYS.MONDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isMonSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.TUESDAY) {
            if (!this.state.isTueSelected) {
                if (!array.includes(Globals._KEYS.TUESDAY)) {
                    array.push(Globals._KEYS.TUESDAY);
                }
                this.setState({ isTueSelected: true, });
            } else {
                const index = array.indexOf(Globals._KEYS.TUESDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isTueSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.WEDNESDAY) {
            if (!this.state.isWedSelected) {
                if (!array.includes(Globals._KEYS.WEDNESDAY)) {
                    array.push(Globals._KEYS.WEDNESDAY);
                }
                this.setState({ isWedSelected: true, });
            } else {
                const index = array.indexOf(Globals._KEYS.WEDNESDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isWedSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.THURSDAY) {
            if (!this.state.isThuSelected) {
                if (!array.includes(Globals._KEYS.THURSDAY)) {
                    array.push(Globals._KEYS.THURSDAY);
                }
                this.setState({ isThuSelected: true, });
            } else {
                const index = array.indexOf(Globals._KEYS.THURSDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isThuSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.FRIDAY) {
            if (!this.state.isFriSelected) {
                if (!array.includes(Globals._KEYS.FRIDAY)) {
                    array.push(Globals._KEYS.FRIDAY);
                }
                this.setState({ isFriSelected: true });
            } else {
                const index = array.indexOf(Globals._KEYS.FRIDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isFriSelected: false });
                }
            }
        }
        else if (val === Globals._KEYS.SATURDAY) {
            if (!this.state.isSatSelected) {
                if (!array.includes(Globals._KEYS.SATURDAY)) {
                    array.push(Globals._KEYS.SATURDAY);
                }
                this.setState({ isSatSelected: true });
            } else {
                const index = array.indexOf(Globals._KEYS.SATURDAY)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({ isSatSelected: false });
                }
            }
        }
        this.setState({ selectedServiceDay: sort_days(array) });
        //console.log('selectedays---' + JSON.stringify(this.state.selectedServiceDay));
        //console.log('sort_days',sort_days(this.state.selectedServiceDay))
    };

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
                <NavigationEvents
                    onWillFocus={this._onFocus}
                    onWillBlur={this._onBlurr}
                />
                <Spinner
                    overlayColor={"rgba(34, 60, 83, 0.6)"}
                    visible={this.state.loading}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style={{ width: '100%', height: scaleHeight * 50, flexDirection: 'row', alignItems: 'center', marginVertical: scaleHeight * 25, }}>
                    <TouchableOpacity style={{
                        position: 'absolute',
                        width: scaleWidth * 60,
                        height: scaleHeight * 50,
                        justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
                        alignItems: 'center'
                    }} onPress={() => this.goBack()}>
                        <Image style={{ width: scaleWidth * 10, height: scaleHeight * 20, tintColor: this.props.theme.IMAGE_TINT_COLOR }} source={BACK} />
                    </TouchableOpacity>
                    {/*<View style={{
                        position: 'absolute',
                        left: scaleWidth * 60,
                        height: scaleHeight * 25,
                        justifyContent: Platform.OS === 'android' ? 'flex-end' : 'center',
                        alignItems: 'center'
                    }}>
                        <GooglePlacesAutocomplete
                            placeholder='Search'
                            onPress={(data, details = null) => {
                                const region = {
                                    latitude: details.geometry.location.lat,
                                    longitude: details.geometry.location.lng,
                                    latitudeDelta: 0.03,
                                    longitudeDelta: 0.03
                                };
                                this.setState({
                                    region: region,
                                });
                                if (this.mapView)
                                    this.mapView.animateToRegion({
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        latitudeDelta: 0.03,
                                        longitudeDelta: 0.03
                                    });
                            }}
                            query={{
                                key: GOOGLE_PLACES_API_KEY,
                                language: 'en',
                            }}
                            minLength={2}
                            returnKeyType={'search'}
                            listViewDisplayed={'auto'}
                            fetchDetails={true}
                            nearbyPlacesAPI='GooglePlacesSearch'
                            debounce={200}
                            autoFoucs={true}
                            styles={{
                                textInputContainer: {
                                    width: scaleWidth * 280,
                                    height: scaleHeight * 35,
                                    marginTop: scaleHeight * 10,
                                    backgroundColor: this.props.theme.INPUT_BACKGROUND_COLOR,
                                    borderRadius: scaleHeight * 20,
                                },
                                textInput: {
                                    fontSize: Typography.FONT_SIZE_16,
                                    width: scaleWidth * 280,
                                    height: scaleHeight * 35,
                                    alignItems: 'center',
                                    backgroundColor: this.props.theme.INPUT_BACKGROUND_COLOR,
                                    borderRadius: scaleHeight * 20,
                                },
                                listView: {
                                    backgroundColor: 'rgba(0,0,0,.8)',
                                    position: 'absolute',
                                    top: scaleHeight * 50,
                                    width: scaleWidth * 280,
                                    zIndex: 5,
                                }
                            }}
                        />
                    </View>*/}
                </View>
                <View style={{ flex: 1, }}>
                    {!!this.state.region.latitude && !!this.state.region.longitude &&
                        <MapView
                            ref={ref => (this.mapView = ref)}
                            style={{ ...styles.map, marginTop: this.state.marginTop }}
                            initialRegion={this.state.region}
                            showsUserLocation={true}
                            onMapReady={this.onMapReady}
                            onRegionChangeComplete={this.onRegionChange}
                        >
                        </MapView>
                    }


                    <View style={styles.mapMarkerContainer}>
                        <Image style={styles.marker} source={LOCATION} />
                    </View>
                </View>

                <View style={[styles.bottomView, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
                    <Text
                        style={{
                            fontSize: Typography.FONT_SIZE_16,
                            fontWeight: "bold",
                            color: this.props.theme.PRIMARY_TEXT_COLOR
                        }}>
                        Move map for location
                                  </Text>
                    {
                        this.state.showLocationAddress && this.state.manual_address!='' &&
                        <View>
                            <Text
                                numberOfLines={2} style={{
                                    fontSize: Typography.FONT_SIZE_14,
                                    paddingVertical: scaleHeight * 10,
                                    borderBottomColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                                    borderBottomWidth: 0.5,
                                    width: scaleWidth * 320,
                                    color: this.props.theme.PRIMARY_TEXT_COLOR
                                }}>
                                {!this.state.regionChangeProgress ? this.state.userLocation : "Identifying Location..."}
                            </Text>
                        </View>
                    }
                    <TextInput
                        style={[styles.textInputStyle, { color: this.props.theme.PRIMARY_TEXT_COLOR }]}
                        onChangeText={text => this.setState({ manual_address: text })}
                        value={this.state.manual_address}
                        placeholderTextColor={this.props.theme.TEXT_COLOR_GRAY}
                        placeholder={this.state.manualAddressPH} />

                    <TextInput
                        style={[styles.textInputStyle, { color: this.props.theme.PRIMARY_TEXT_COLOR }]}
                        onChangeText={text => this.setState({ organization_name: text })}
                        value={this.state.organization_name}
                        placeholderTextColor={this.props.theme.TEXT_COLOR_GRAY}
                        placeholder={'Enter organization name'} />
                    <Text style={{ textAlign: 'left', fontSize: Typography.FONT_SIZE_16, color: this.props.theme.PRIMARY_TEXT_COLOR, fontWeight: 'bold' }}>Working Time and Days</Text>

                    <View style={styles.buttonSection}>
                        <CustomButton
                            onPress={() => this.showTimepicker(this.state.serviceStartTime)}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.state.serviceStartTime === Globals._KEYS.START_TIME
                                ? Globals._KEYS.START_TIME
                                : getTime(this.state.serviceStartTime)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 155}
                            buttonHeight={30}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                        <View style={{ width: 10 }} />
                        <CustomButton
                            onPress={() => this.showTimepicker(this.state.serviceEndTime)}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={this.state.serviceEndTime === Globals._KEYS.END_TIME
                                ? Globals._KEYS.END_TIME
                                : getTime(this.state.serviceEndTime)}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 155}
                            buttonHeight={30}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                    </View>
                    <View style={styles.buttonSection}>
                        <CustomButton
                            isSelected={this.state.isSunSelected}
                            onPress={() => this.buttonClicked(Globals._KEYS.SUNDAY)}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={"Sun"}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 100}
                            buttonHeight={30}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                        <View style={{ width: 10 }} />
                        <CustomButton isSelected={this.state.isMonSelected} onPress={() => this.buttonClicked(Globals._KEYS.MONDAY)} textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Mon"} cornerRadius={100}
                            buttonWidth={scaleWidth * 100} buttonHeight={30} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                        <View style={{ width: 10 }} />
                        <CustomButton isSelected={this.state.isTueSelected} onPress={() => this.buttonClicked(Globals._KEYS.TUESDAY)} textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Tue"} cornerRadius={100}
                            buttonWidth={scaleWidth * 100} buttonHeight={30} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                    </View>
                    <View style={styles.buttonSection}>
                        <CustomButton isSelected={this.state.isWedSelected} onPress={() => this.buttonClicked(Globals._KEYS.WEDNESDAY)} textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Wed"} cornerRadius={100}
                            buttonWidth={scaleWidth * 100} buttonHeight={30} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                        <View style={{ width: 10 }} />
                        <CustomButton isSelected={this.state.isThuSelected} onPress={() => this.buttonClicked(Globals._KEYS.THURSDAY)} textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Thu"} cornerRadius={100}
                            buttonWidth={scaleWidth * 100} buttonHeight={30} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                        <View style={{ width: 10 }} />
                        <CustomButton isSelected={this.state.isFriSelected} onPress={() => this.buttonClicked(Globals._KEYS.FRIDAY)} textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }} buttonText={"Fri"} cornerRadius={100}
                            buttonWidth={scaleWidth * 100} buttonHeight={30} buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                    </View>
                    <View style={styles.buttonSection}>
                        <CustomButton
                            isSelected={this.state.isSatSelected}
                            onPress={() => this.buttonClicked(Globals._KEYS.SATURDAY)}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={"Sat"}
                            cornerRadius={100}
                            buttonWidth={scaleWidth * 100}
                            buttonHeight={30}
                            buttonStyle={[styles.buttonsShadow, { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, }]} />
                    </View>
                    <CustomButton
                        buttonStyle={[styles.buttonsShadow,
                        { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR, marginTop: scaleSize(10), }]}
                        onPress={() => this.onLocationSelect()}
                        textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                        buttonText={this.state.saveButtonText}
                        cornerRadius={100}
                        buttonHeight={SCALE_30}
                        buttonWidth={scaleSize(320)} />

                </View>
                {this.state.show && (
                    <DateTimePicker
                        value={this.state.date}
                        mode={'time'}
                        is24Hour={true}
                        display="default"
                        onChange={this.onChange}
                        minimumDate={new Date()}
                        style={{ backgroundColor: Platform.OS === 'android' ? "black" : "white", marginTop: 20 }}
                    />
                )}

                <Modal
                    backdropOpacity={0.8}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={1000}
                    animationOutTiming={1000}
                    backdropTransitionInTiming={800}
                    backdropTransitionOutTiming={800}
                    isVisible={this.state.modalVisible}>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: scaleSize(300),
                        backgroundColor: this.props.theme.POPUP_BACKGROUND_COLOR,
                        borderRadius: scaleWidth * 10
                    }}>
                        <Image style={{
                            height: scaleSize(50),
                            width: scaleSize(50),
                            resizeMode: 'contain',
                            tintColor: this.props.theme.IMAGE_TINT_COLOR,
                        }} source={LOCATION} />
                        <CustomTextView
                            textStyle={{ marginTop: scaleSize(20) }}
                            fontColor={this.props.theme.PRIMARY_TEXT_COLOR}
                            //value={this.state.error}
                            value={'Device Location is off'}
                            fontSize={FONT_SIZE_22} />
                        <CustomTextView
                            fontPaddingVertical={5}
                            fontColor={this.props.theme.TEXT_COLOR_GRAY}
                            value={'Please turn on your device location to ensure hassle free experience '}
                            fontSize={FONT_SIZE_12} />

                        <CustomButton
                            buttonStyle={[styles.buttonsShadow,
                            {
                                backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                                marginTop: scaleSize(20),
                            }]}
                            onPress={() => this.onPermissionClick()}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={"Turn on Device location"}
                            cornerRadius={100}
                            buttonHeight={SCALE_40}
                            buttonWidth={scaleSize(200)} />

                        <CustomButton
                            buttonStyle={[styles.buttonsShadow,
                            {
                                backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR,
                                marginTop: scaleSize(20),
                            }]}
                            onPress={() => this.onManualAddressClick()}
                            textStyle={{ fontSize: FONT_SIZE_16, color: this.props.theme.BUTTON_TEXT_COLOR }}
                            buttonText={"Select Location Manually"}
                            cornerRadius={100}
                            buttonHeight={SCALE_40}
                            buttonWidth={scaleSize(200)} />
                    </View>
                </Modal>
            </View >
        );
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
)(MapLocation)