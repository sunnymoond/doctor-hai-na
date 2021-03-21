import { Linking, Alert, Platform } from 'react-native';

const isEmpty = (returnBoolean, val) => {
    if (returnBoolean) {
        return (val === undefined || val === null || val.length <= 0 || val == 'null') ? true : false;
    } else {
        return (val === undefined || val === null || val.length <= 0 || val == 'null') ? 'Not available' : (isNaN(val) ? capitalizeName(val) : val);
    }
}

const isEmptyValue = (val) => {
    return (val === undefined || val === null || val.length <= 0 || val == 'null') ? 'Not available' : (isNaN(val) ? capitalizeName(val) : val);
}

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const getFileExtension = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

const getFileName = (str) => {
    return (/[.]/.exec(str)) ? /[^/]+$/.exec(str)[0] : undefined;
}

const emailValidation = (email) => {
    console.log(email);
    if (email !== null) {
        const emailTrimmed = email.trim();
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(emailTrimmed.toLocaleLowerCase());
    } else {
        return false;
    }
};
const capitalizeName = (name) => {
    if (name != undefined && !name.includes('@'))
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
    else
        return name;
}

const getEndTime = (date, time, selectedHours, selectedMinuts) => {
    const bookingDateTimeLocal = new Date(date + 'T' + time);
    var dateNow = new Date(bookingDateTimeLocal);
    var EndDateAndTime = new Date();
    EndDateAndTime.setFullYear(dateNow.getFullYear());
    EndDateAndTime.setMonth(dateNow.getMonth());
    EndDateAndTime.setDate(dateNow.getDate());
    EndDateAndTime.setHours(dateNow.getHours() + parseInt(selectedHours));
    EndDateAndTime.setMinutes(dateNow.getMinutes() + parseInt(selectedMinuts));
    EndDateAndTime.setMilliseconds(0);
    if (EndDateAndTime.getDate() <= dateNow.getDate()) {
        const bookingHours = bookingDateTimeLocal.getHours();
        const bookingMinutes = bookingDateTimeLocal.getMinutes();
        bookingDateTimeLocal.setHours(bookingHours + parseInt(selectedHours));
        bookingDateTimeLocal.setMinutes(bookingMinutes + parseInt(selectedMinuts));
        //const utcTime = getUTCTime(bookingDateTimeLocal);
        return bookingDateTimeLocal;
    } else {
        return null;
    }
}



const callNumber = phone => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};

export {
    isEmpty,
    isEmptyValue,
    getFileExtension,
    emailValidation,
    getFileName,
    capitalize,
    capitalizeName,
    getEndTime,
    callNumber
}