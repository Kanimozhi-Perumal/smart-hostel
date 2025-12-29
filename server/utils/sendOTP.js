/**
 * DEV MODE sendOTP
 * ----------------
 * This file intentionally disables email sending.
 * OTP will be handled via console log in parentController.
 */

const sendOTP = async () => {
  console.log("sendOTP is disabled in DEV MODE");
};

module.exports = sendOTP;
