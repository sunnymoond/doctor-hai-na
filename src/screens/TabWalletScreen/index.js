/*import React, {Component} from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import Preview from '../../components/FlatListSlider/Preview';
import FlatListSlider from '../../components/FlatListSlider/FlatListSlider';
// import {FlatListSlider} from 'react-native-flatlist-slider';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          image:
            'https://images.unsplash.com/photo-1567226475328-9d6baaf565cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
          desc: 'Silent Waters in the mountains in midst of Himilayas',
        },
        {
          image:
            'https://images.unsplash.com/photo-1455620611406-966ca6889d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1130&q=80',
          desc:
            'Red fort in India New Delhi is a magnificient masterpeiece of humans',
        },
        {
          image:
            'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          desc:
            'Sample Description below the image for representation purpose only',
        },
        {
          image:
            'https://images.unsplash.com/photo-1568700942090-19dc36fab0c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
          desc:
            'Sample Description below the image for representation purpose only',
        },
        {
          image:
            'https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
          desc:
            'Sample Description below the image for representation purpose only',
        },
      ],
    };
  }

  render() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    return (
      <SafeAreaView>
        <ScrollView>
          <FlatListSlider
            data={this.state.data}
            timer={2000}
            imageKey={'image'}
            local={false}
            width={screenWidth}
            separator={0}
            loop={true}
            autoscroll={false}
            currentIndexCallback={index => console.log('Index', index)}
            onPress={item => alert(JSON.stringify(item))}
            indicator
            animation
          />
          <View style={styles.separator} />
          <FlatListSlider
            data={this.state.data}
            width={275}
            //timer={4000}
            loop={true}
            autoscroll={false}
            component={<Preview />}
            onPress={item => alert(JSON.stringify(item))}
            indicatorActiveWidth={40}
            contentContainerStyle={styles.contentStyle}
          />
          <View style={styles.separator} />
          <FlatListSlider
            data={this.state.data}
            timer={5000}
            onPress={item => alert(JSON.stringify(item))}
            indicatorContainerStyle={{position:'absolute', bottom: 20}}
            indicatorActiveColor={'#8e44ad'}
            indicatorInActiveColor={'#ffffff'}
            indicatorActiveWidth={30}
            animation
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 20,
  },
  contentStyle: {
    paddingHorizontal: 16,
  },
});*/
import React, { Component } from 'react';
import { Text, View, BackHandler } from 'react-native'
import { withNavigationFocus } from 'react-navigation';
import CustomBGParent from "../../components/CustomBGParent";
import { connect } from 'react-redux'
import { NavigationEvents } from 'react-navigation';

class TabWalletScreen extends Component {

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

    _onBlurr = () => {
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }
  
    _onFocus = () => {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }
  
    _handleBackButtonClick = () => {
      this.props.navigation.goBack(null);
      return true;
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
            <NavigationEvents
              onWillFocus={this._onFocus}
              onWillBlur={this._onBlurr}
            />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.theme.BACKGROUND_COLOR }}>
                    <Text style={{ color: this.props.theme.PRIMARY_TEXT_COLOR}}>TAB WALLET</Text>
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
)(TabWalletScreen)