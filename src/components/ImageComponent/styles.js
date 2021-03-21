import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';

export default StyleSheet.create({
  buttonsShadow: {
    shadowColor: "#00000078",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    marginLeft: 35,
    marginTop: 3,
    backgroundColor: Colors.THEME_COLOR,
  },
  bgUnSelected: {
    borderWidth: 1,
    borderColor: '#69DAD9'
  },
  bgSelected: {
    borderWidth: 2,
    borderColor: '#008000'
  },
  leftImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    left: -90,
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  rightText: {
    left: 40,
    top: 10,
    justifyContent: "center",
    alignItems: 'flex-start'
  },
  crossIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    zIndex: 3,
    backgroundColor: Colors.THEME_COLOR,
    justifyContent: "center",
    alignItems: "center"
  },
})