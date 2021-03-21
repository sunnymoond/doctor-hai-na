import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import styles from './styles'
import CustomBGParent from "../../components/CustomBGParent";
import { scaleWidth, scaleHeight } from "../../styles/scaling";
import entries from './entries'
import { connect } from 'react-redux'

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: entries.ENTRIES,
      activeSlide: 0,
    };
  }

  startNow = async () => {
    this.props.navigation.navigate('Login');
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.slider}>
        <Image source={item.image} style={styles.imageStyle}></Image>
        <View style={styles.infoViewStyle}>
          <Text style={[styles.title, { color: this.props.theme.PRIMARY_TEXT_COLOR }]}>{item.title}</Text>
          <Text style={[styles.subTitle, { color: this.props.theme.PRIMARY_TEXT_COLOR }]}>{item.subtitle}</Text>
        </View>
      </View>
    );
  }

  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainerStyle}
        dotStyle={[styles.dotStyle, { backgroundColor: this.props.theme.PRIMARY_TEXT_COLOR }]}
        inactiveDotStyle={[styles.inactiveDotStyle, { backgroundColor: this.props.theme.PRIMARY_TEXT_COLOR }]}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={this._carousel}
        tappableDots={!!this._carousel}
      />
    );
  }

  render() {
    return (
        <CustomBGParent style={[styles.container, { backgroundColor: this.props.theme.BACKGROUND_COLOR }]}>
          <Text style={[styles.welcomeStyle, { color: this.props.theme.PRIMARY_TEXT_COLOR }]}>Welcome</Text>

          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={this.state.entries}
            sliderWidth={scaleWidth * 350}
            itemWidth={scaleHeight * 300}
            renderItem={this.renderItem}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
            hasParallaxImages={true}
            inactiveSlideScale={0.90}
            inactiveSlideOpacity={0.7}
            containerCustomStyle={styles.sliderCarousel}
            contentContainerCustomStyle={styles.sliderContentContainer}
          />
          {this.pagination}
          <TouchableOpacity
            style={[styles.button,
            { backgroundColor: this.props.theme.BUTTON_BACKGROUND_COLOR }]}
            onPress={() => this.startNow()}>
            <Text
              style={[styles.startNow,
              { color: this.props.theme.BUTTON_TEXT_COLOR }]}>
              Start Now
              </Text>
          </TouchableOpacity>
        </CustomBGParent>
    )
  }
}
const mapStateToProps = state => ({
  theme: state.themeReducer.theme
})

export default connect(
  mapStateToProps,
)(Welcome)