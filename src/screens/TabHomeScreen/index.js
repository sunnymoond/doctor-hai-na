import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { withNavigationFocus } from 'react-navigation';
import CustomBGParent from "../../components/CustomBGParent";
import CustomButton from "../../components/CustomButton";
import { HAM } from "../../images";
import { WHITE } from "../../styles/colors";
import { connect } from 'react-redux'
class TabHomeScreen extends Component {

    constructor(props) {
        const { navigation } = props;
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this._refresh();
    }

    componentDidUpdate(prevProp, prevState) {
        if (prevProp.isFocused !== this.props.isFocused) {
            this._refresh();
        }
    }

    _refresh = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1500)
    };

    render() {
        return (
            <CustomBGParent loading={this.state.loading} topPadding={false}>
                {/*<View style={{ width: '100%', justifyContent: 'flex-start', backgroundColor: this.props.theme.BACKGROUND_COLOR, }}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} style={{ width: 35 }}>
                        <Image source={HAM} style={{ margin: 10, height: 35, width: 35 }} />
                    </TouchableOpacity>
        </View>*/}

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.theme.BACKGROUND_COLOR }}>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR}}>TAB HOME</Text>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR}}>{this.props.isFocused ? 'Focused' : 'Not focused'}</Text>
                </View>
            </CustomBGParent>
        )
    }
}
const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

export default connect(
    mapStateToProps,
)(TabHomeScreen)