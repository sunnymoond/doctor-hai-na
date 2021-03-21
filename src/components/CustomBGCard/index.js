import React,{Component} from 'react'
import { View, } from 'react-native'
import PropTypes from 'prop-types';
import styles from './styles'
import { connect } from 'react-redux'

class CustomBGCard extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={[styles.container, { marginTop: this.props.topMargin, backgroundColor: this.props.bgColor, borderRadius: this.props.cornerRadius }]}>
                {this.props.children}
            </View>
        )
    }

}

CustomBGCard.propTypes = {
    topMargin: PropTypes.number,
    bgColor: PropTypes.string,
    cornerRadius: PropTypes.number
};

CustomBGCard.defaultProps = {
    topMargin: 0,
    bgColor: '',
    cornerRadius: 0
};

const mapStateToProps = state => ({
    theme: state.themeReducer.theme
})

export default connect(
    mapStateToProps,
)(CustomBGCard)