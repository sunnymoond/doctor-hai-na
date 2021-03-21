import React from 'react';
import { TouchableOpacity, Platform, Text } from 'react-native';
//import styled from 'styled-components';
import DateTimePicker from '@react-native-community/datetimepicker';
const Container = styled.TouchableOpacity`
  background-color: ${Platform.OS === 'ios' ? '#00000066' : 'transparent'};
  position: absolute;
  bottom: 0;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;
/*const Header = styled.View`
  width: 100%;
  padding: 16px;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: white;
  border-bottom-width: 1;
  border-color: grey;
`;*/
export default class DatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date(this.props.date),
        };
    }

    render() {
        const { onClose, onChange } = this.props;
        const { date, mode } = this.state;
        return (
            <Container onPress={onClose}>
                {Platform.OS === 'ios' && (
                    //<Header>
                        <TouchableOpacity onPress={onClose}>
                            <Text>Done</Text>
                        </TouchableOpacity>
                   // </Header>
                )}
                <DateTimePicker
                    value={date}
                    mode={mode}
                    display="default"
                    onChange={(e, d) => {
                        if (Platform.OS === 'ios') {
                            this.setState({ date: d });
                            onChange(d);
                        } else {
                            onClose(d);
                        }
                    }}
                    is24Hour={true}
                    style={{ backgroundColor: Platform.OS === 'android' ? "black" : "white" }}
                    minimumDate={new Date()}
                />
            </Container>
        );
    }
}