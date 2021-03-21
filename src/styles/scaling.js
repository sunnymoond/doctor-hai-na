import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');
//Use iPhone as base size wich is 375 * 812

const baseWidth = 375;
const baseHeight = 812;

const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;

const scale = Math.min(scaleWidth, scaleHeight);

export { scale, scaleWidth, scaleHeight }