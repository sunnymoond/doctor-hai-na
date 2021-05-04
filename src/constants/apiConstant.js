//const BASE_URL = "https://hair-there.herokuapp.com/";
//const BASE_URL = "https://hair-there-dev.herokuapp.com/";

const BASE_URL = "https://www.doctorhaina.com/";
const BASE_URL_AUTH = BASE_URL + "_auth/";

export default {
    // authentications
    IMAGE_URL:BASE_URL+"uploads/",
    AUTHENTICATE: BASE_URL_AUTH + "authenticate",
    LOGING: BASE_URL + "app/doctor_web_api/email_login",
    REGISTER: BASE_URL + "app/doctor_web_api/register",
    REGISTER_WITH_OTP: BASE_URL + "app/doctor_web_api/register_with_otp",
    UPLOAD_DOCTOR_DOCUMENTS: BASE_URL + "app/doctor_web_api/upload_doctor_documents",
    UPLOAD_DOCTOR_DOCUMENTS_DETAILS: BASE_URL + "app/doctor_web_api/update_doctor_documents_details",
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
    INSERT_USER_FEEDBACK: BASE_URL + "app/doctor_web_api/insert_user_feedback",
    REMOVE_DOCTOR_ADDRESS_INFO: BASE_URL + "app/doctor_web_api/remove_doctor_address_info",
    CHECK_DOCTOR_AVAILABILITY: BASE_URL + "app/doctor_web_api/check_doctor_availability",
    GET_ALL_DOCTORS_LIST: BASE_URL + "app/doctor_web_api/get_all_doctors_list",
    MST_SPECIALITY_LIST: BASE_URL + "app/doctor_web_api/mst_speciality_list",
    GET_USER: BASE_URL + "app/doctor_web_api/email_login",
    GET_DOCTORS_SPECIALITY_LIST: BASE_URL + "app/doctor_web_api/get_doctor_speciality_list",
};


export {
    BASE_URL,
    BASE_URL_AUTH,
}