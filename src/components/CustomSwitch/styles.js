import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
      },
      toggleContainer: {
        width: 50,
        height: 30,
        marginLeft: 3,
        borderRadius: 15,
        justifyContent: "center",
      },
      label: {
        marginRight: 2,
      },
      toggleWheelStyle: {
        width: 25,
        height: 25,
        backgroundColor: "white",
        borderRadius: 12.5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
        elevation: 1.5,
      },
});

export default styles;