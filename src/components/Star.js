import React, { PureComponent } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';

import { STAR_SELECTED, STAR_UNSELECTED } from "../images";
const STAR_SIZE = 40;

export default class Star extends PureComponent {
  static defaultProps = {
    selectedColor: '#f1c40f'
  };

  constructor() {
    super();
    this.springValue = new Animated.Value(1);

    this.state = {
      selected: false
    };
  }

  spring() {
    const { position, starSelectedInPosition } = this.props;

    this.springValue.setValue(1.2);

    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 2,
        tension: 1,
        useNativeDriver: true,
      }
    ).start();

    this.setState({ selected: !this.state.selected });
    starSelectedInPosition(position);
  }

  render() {
    const { fill, size, selectedColor, isDisabled, starStyle } = this.props;
    const starSource = fill && selectedColor === null ? STAR_SELECTED : STAR_UNSELECTED;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this.spring.bind(this)} disabled={isDisabled}>
        <Animated.Image
          source={starSource}
          style={[
            styles.starStyle,
            {
              //tintColor: fill && selectedColor ? selectedColor : undefined
              tintColor: fill && selectedColor ? selectedColor : "#e5e5e5",
              width: size || STAR_SIZE,
              height: size || STAR_SIZE,
              transform: [{ scale: this.springValue }]
            },
            starStyle
          ]}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  starStyle: {
    margin: 3
  }
});
