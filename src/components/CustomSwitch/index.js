import React, { Component } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";

class CustomSwitch extends Component {
  animatedValue = new Animated.Value(0);

  render() {
    const moveToggle = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 20],
    });

    const {
      isOn,
      onColor,
      offColor,
      style,
      onToggle,
      labelStyle,
      label,
    } = this.props;

    const color = isOn ? onColor : offColor;

    this.animatedValue.setValue(isOn ? 0 : 1);

    Animated.timing(this.animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
    }).start();

    return (
      <View style={styles.container}>
        {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

        <TouchableOpacity onPress={this.props.onToggle}>
          <View
            style={[styles.toggleContainer, style, { backgroundColor: color }]}
          >
            <Animated.View
              style={[
                styles.toggleWheelStyle,
                {
                  marginLeft: moveToggle,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

CustomSwitch.propTypes = {
  onColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  offColor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onToggle: PropTypes.func,
  isOn: PropTypes.bool,
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CustomSwitch.defaultProps = {
  onColor: "#4cd137",
  offColor: "#ecf0f1",
  label: "",
  isOn: false,
  style: {},
  labelStyle: {},
};

export default CustomSwitch;
