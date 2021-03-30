//const BASE_URL = "https://hair-there.herokuapp.com/";
//const BASE_URL = "https://hair-there-dev.herokuapp.com/";

const BASE_URL = "https://www.doctorhaina.com/";
const BASE_URL_AUTH = BASE_URL + "_auth/";
const BASE_URL_API = "http://cdn.expertscube.com/api/";
export default {
    // authentications
    IMAGE_URL:BASE_URL+"uploads/",
    AUTHENTICATE: BASE_URL_AUTH + "authenticate",
    LOGING: BASE_URL + "app/doctor_web_api/email_login",
    REGISTER: BASE_URL + "app/doctor_web_api/register",
    REGISTER_WITH_OTP: BASE_URL + "app/doctor_web_api/register_with_otp",
    UPLOAD_DOCTOR_DOCUMENTS: BASE_URL + "app/doctor_web_api/upload_doctor_documents",
    RESEND_SIGNUP_OTP: BASE_URL + "app/doctor_web_api/resend_signup_otp",
    LOGOUT: BASE_URL + "app/doctor_web_api/logout",
    RESET_PASSWORD_OTP: BASE_URL + "app/doctor_web_api/reset_password_otp",
    RESET_PASSWORD: BASE_URL + "app/doctor_web_api/reset_password",
    DOCTOR_WORKING: BASE_URL + "app/doctor_web_api/doctor_address_info",
    DOCTOR_SCHEDULE_DETAIL: BASE_URL + "app/doctor_web_api/get_doctor_schedule_detail",
    GET_DOCTOR_DOCUMENT_LIST: BASE_URL + "app/doctor_web_api/get_doctor_document_list",
    MODIFY_USER: BASE_URL + "app/doctor_web_api/update_user_profile",
    UPDATE_PROFILE_IMAGE: BASE_URL + "app/doctor_web_api/update_profile_image",
    REMOVE_PROFILE_IMAGE: BASE_URL + "app/doctor_web_api/remove_profile_image",
    REMOVE_DOCTOR_ADDRESS_INFO: BASE_URL + "app/doctor_web_api/remove_doctor_address_info",
    CHECK_DOCTOR_AVAILABILITY: BASE_URL + "app/doctor_web_api/check_doctor_availability",
    GET_ALL_DOCTORS_LIST: BASE_URL + "app/doctor_web_api/get_all_doctors_list",
    GET_DOCTORS_SPECIALITY_LIST: BASE_URL + "app/doctor_web_api/get_doctor_speciality_list",
    VERIFY_OTP: BASE_URL_AUTH + "verifyOTP",
    FORGOT_PASSWORD: BASE_URL_AUTH + "forgotPassword",
    SAVE_PASSWORD: BASE_URL_AUTH + "savePassword",    
    VERIFY_MOBILE_NUMBER: BASE_URL + "_users/verifyMobileNumber",
    SEND_MOBIL_OTP: BASE_URL + "_users/sendmobileOtp",
    GET_USER: BASE_URL + "app/doctor_web_api/email_login",
    SAVE_LAT_LONG: BASE_URL + "_users/saveLatLong",
    CREATE_RATING: BASE_URL + "_ratings/createRating",
    EDIT_REVIEWS_AND_RATING: BASE_URL + "_ratings/editReviewsAndRating",
    GET_REVIEW_RATING: BASE_URL + "_ratings/getReviewsAndRating",
    GET_OTHER_REVIEW_RATING: BASE_URL + "_ratings/getOtherReviewsAndRating",
    GET_MY_REVIEW_RATING: BASE_URL + "_ratings/getMyReviewsAndRating",
    LISTING_USER: BASE_URL + "_users/listingUser",
    WORKING_BARBER_SERVICE: BASE_URL + "_service-working/barberServices",
    NOTIFICATIONS: BASE_URL + "_notification/notifications",
    NOTIFICATIONS_STATUS_UPDATE: BASE_URL + "_notification/notificationStatusUpdate",
    SELECTED_BARBER_WORKING: BASE_URL + "_service-working/selectedBarberWorking",
    SELECTED_BARBER_SERVICE: BASE_URL + "_service-barber/selectedBarberServices",
    BARBER_SELECTED_SERVICE: BASE_URL + "_service-barber/barberSelectedServices",
    BARBER_SERVICE: BASE_URL + "_service-barber/barberServices",
    CHANGE_STATUS: BASE_URL + "_appointments/change-status",
    ALL: BASE_URL + "_appointments/all?type=",
    STATUS: BASE_URL + "_appointments/status",
    BY_MONTH: BASE_URL + "_appointments/appointment-by-month",
    DETAIL: BASE_URL + "_appointments/detail/",
    CAPTURE: BASE_URL + "_location/capture",
    LOCATION_HISTORY: BASE_URL + "_location/location-history",
    CREATE: BASE_URL + "_transactions/create",
    SERVICES_CATEGORIES: BASE_URL + "_service-category/servicesCategories",
    SEARCH: BASE_URL + "_services/search",
    SERVICES: BASE_URL + "_services/services",
    // api data
    UPLOAD_IMAGES: BASE_URL_API + "upload_file_base64",
    UPLOAD_VIDEO: BASE_URL_API + "upload_fdata",
    API_LOGIN: BASE_URL_API + "login",

    STRIPE_ENROLL: BASE_URL + "_stripe/enrol",
    CONFIRM_PAYMENT: BASE_URL + "_stripe/confirmPayment",
    GET_OTP: BASE_URL + "_stripe/paymentAuthenticate"

};


export {
    BASE_URL,
    BASE_URL_AUTH,
}