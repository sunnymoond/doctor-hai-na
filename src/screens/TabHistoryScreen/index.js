import React, { Component } from 'react';
import { Text, View } from 'react-native'
import { withNavigationFocus } from 'react-navigation';
import CustomBGParent from "../../components/CustomBGParent";
import { connect } from 'react-redux'
class TabHistoryScreen extends Component {

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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.theme.BACKGROUND_COLOR }}>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR}}>TAB HISTORY</Text>
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
)(TabHistoryScreen)