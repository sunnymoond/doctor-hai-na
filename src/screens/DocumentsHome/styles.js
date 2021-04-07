import { StyleSheet } from 'react-native';
import { Colors } from '../../styles';
import { scaleWidth, scaleHeight } from '../../styles/scaling';

export default StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: Colors.WHITE
  },
  buttonsShadow: {
    shadowColor: "#00000078",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    backgroundColor: '#69DAD9',
  },

  cardShadow: {
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: Colors.WHITE
  },
  margins: {
    marginHorizontal: scaleWidth*10,
    marginVertical: 5,
    elevation: 4,
    borderRadius: 10
  },
  bgUnSelected: {
    borderWidth: 1,
    borderColor: '#69DAD9'
  },
  bgSelected: {
    borderWidth: 2,
    borderColor: '#008000'
  },
  circleText: {
    color: Colors.WHITE,
    fontSize: 22,
    lineHeight: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  buttonSection: {
    marginLeft: 30,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  crossIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    zIndex: 3,
    backgroundColor: '#69DAD9',
    justifyContent: "center",
    alignItems: "center"
  },
  leftImage: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 120,
    height: 110,
    borderRadius: 15,
    left: -105,
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
  numberBox: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 15,
    height: 15,
    borderRadius: 7,
    zIndex: 3,
    backgroundColor: Colors.RED,
    justifyContent: "center",
    alignItems: "center"
  },
  number: { fontSize: 10, color: "#FFF", fontWeight: 'bold' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 60, 83, 0.6)'
  },

  absoluteFillObject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  imageHolder: {
    margin: 5,
    height: 160,
    width: '100%',
    flex: 1,
    position: 'relative'
  },
  textViewHolder: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: 'center'
  },
  textOnImage: {
    color: 'white'
  },
})