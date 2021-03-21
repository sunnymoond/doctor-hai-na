import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography } from '../../styles'
import { WHITE, GRAY_DARK } from "../../styles/colors";
import { SCALE_10, SCALE_15, SCALE_20, SCALE_5, SCALE_50, SCALE_60 } from "../../styles/spacing";
import { scaleWidth } from '../../styles/scaling';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    //display: "flex",
    //height: Dimensions.get("screen").height,
    //width: Dimensions.get("screen").width,
    //backgroundColor: Colors.WHITE,
  },
  map: {
    flex: 0.45,
    backgroundColor: Colors.WHITE,
  },
  textInputStyle: {
    fontSize: Typography.FONT_SIZE_14,
    height: SCALE_50,
    width: scaleWidth * 320,
    borderColor: GRAY_DARK,
    borderBottomWidth: 1,
  },
  mapMarkerContainer: {
    left: '48%',
    position: 'absolute',
    top: '20%'
  },
  marker: {
    flex: 1,
  },
  deatilSection: {
    flex: 1,
    //backgroundColor: "#fff",
    padding: 10,
    display: "flex",
    justifyContent: "flex-start"
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  btnContainer: {
    width: Dimensions.get("window").width - 20,
    position: "absolute",
    bottom: 60,
    left: 10
  },
  bottomView: {
    width: '100%',
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    bottom: 0,
    paddingHorizontal: scaleWidth * 30,
    paddingVertical: scaleWidth * 10,
  },
  buttonSection: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
});