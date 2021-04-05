import { StyleSheet } from "react-native";
import { Colors } from "../../styles";
import { scaleWidth, scaleHeight } from "../../styles/scaling";

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
    borderColor: "#69DAD9",
  },
  bgSelected: {
    borderWidth: 2,
    borderColor: "#008000",
  },
  leftImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: scaleWidth * -90,
    justifyContent: "center",
  },
  rightText: {
    flexDirection: "column",
    paddingLeft: scaleWidth * 27,
    paddingRight: scaleWidth * 10,
    top: scaleHeight * 3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  crossIcon: {
    position: "absolute",
    top: scaleHeight * 8,
    right: scaleHeight * 8,
    width: scaleHeight * 28,
    height: scaleHeight * 28,
    borderRadius: scaleHeight * 14,
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
