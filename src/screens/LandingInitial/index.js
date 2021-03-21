import React, { Component } from 'react';
import { Text, View } from 'react-native'

class LandingInitial extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>LandingInitial</Text>
      </View>
    )
  }
}

export default LandingInitial;