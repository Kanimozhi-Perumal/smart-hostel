const QRCode = require("qrcode");

const generateQR = async (outpassId) => {
  return await QRCode.toDataURL(
    `SMART_HOSTEL_OUTPASS:${outpassId}`
  );
};

module.exports = generateQR;
