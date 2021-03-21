import React, { Component } from 'react';
import { Text, View, Switch } from 'react-native'
import { isNetAvailable } from "../../utils/NetAvailable";
import { getJSONData, storeJSONData } from "../../utils/AsyncStorage";
import { fetchServerDataPost } from "../../utils/FetchServerRequest";
import CustomBGParent from "../../components/CustomBGParent";
import Globals from '../../constants/Globals';
import apiConstant from '../../constants/apiConstant';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAlert } from '../../redux/action'

class DoctorHome extends Component {

    constructor(props) {
        const { navigation } = props;
        super(props);
        this.state = {
            loading: false,
            user: {},
            switchText: '',
            switchValue: false
        }
    }

    componentDidMount() {
        this.setData();
    }

    componentDidUpdate(prevProp, prevState) {
        if (prevProp.isFocused !== this.props.isFocused) {
            this.setData();
        }
    }

    setData = async () => {
        const user = await getJSONData(Globals._KEYS.USER_DATA);
        await this.setState({ user: user });
        console.log('user', JSON.stringify(user));
    }

    toggleSwitch = async (switchValue) => {
        await this.setState({ loading: true });
        const url = apiConstant.CHECK_DOCTOR_AVAILABILITY;
        let isAvailable = 'FALSE';
        if (switchValue) {
            isAvailable = 'TRUE';
        } else {
            isAvailable = 'FALSE';
        }

        const requestBody = {
            user_id: this.state.user.pk_user_id,
            is_available: isAvailable,
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
                        await storeJSONData(Globals._KEYS.USER_DATA, data.user_data);
                        this.props.showAlert(true, Globals.ErrorKey.SUCCESS, data.status_msg);
                        await this.setState({ loading: false, user: data.user_data });
                    } else {
                        await this.setState({ loading: false, });
                        this.props.showAlert(true, Globals.ErrorKey.ERROR, data.status_msg);
                    }
                }).catch(error => {
                    this.setState({ loading: false, });
                    this.props.showAlert(true, Globals.ErrorKey.ERROR, 'Something went wrong');
                });
            } else {
                this.setState({ loading: false, showLogoutPopUp: false });
                this.props.showAlert(true, Globals.ErrorKey.NETWORK_ERROR, 'Please check network connection.');
            }
        });
    }

    render() {
        return (
            <CustomBGParent loading={this.state.loading} topPadding={false}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.theme.BACKGROUND_COLOR }}>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR }}>Welcome {this.state.user.user_name}</Text>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR }}>{this.state.user.is_available_flg == 1 ? 'You are Online' : 'You are Offline'}</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.user.is_available_flg == 1 ? "#f5dd4b" : "#f4f3f4"}
                        value={this.state.user.is_available_flg == 1 ? true : false}
                        onValueChange={(switchValue) => this.toggleSwitch(switchValue)} />
                </View>
            </CustomBGParent>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

const mapDispatchToProps = dispatch => ({
    showAlert: bindActionCreators(showAlert, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DoctorHome)