const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL;
const WALLET_BASE_URL = process.env.REACT_APP_WALLET_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: AUTH_BASE_URL + "/auth/sendotp",
  SIGNUP_API: AUTH_BASE_URL + "/auth/signup",
  LOGIN_API: AUTH_BASE_URL + "/auth/login",
  UPDATE_DISPLAY_PICTURE_API: AUTH_BASE_URL + "/auth/image",
  FETCHIMAGE_API: AUTH_BASE_URL + "/auth/profileimage",
}


// WALLET ENDPOINTS
export const walletEndpoints = {
  DEPOSIT_PAYMENT_API: WALLET_BASE_URL + "/wallet/deposit",
  DEBIT_PAYMENT_API: WALLET_BASE_URL + "/wallet/debit",
  TRANSFER_PAYMENT_API: WALLET_BASE_URL + "/wallet/transfer",
  TRANSACTION_HISTORY_API: WALLET_BASE_URL+ "/wallet/gethistory",
  FETCHBALANCE_API: WALLET_BASE_URL + "/wallet/getbalance",
}
