import { QRCodeCanvas } from "qrcode.react";
import { FaDownload } from "react-icons/fa";

const QRDisplay = ({ qrCode }) => {
  if (!qrCode) return null;

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${qrCode}`);
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "outpass-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-50 rounded-xl p-5">
      {/* QR */}
      <div className="bg-white p-3 rounded-lg shadow">
        <QRCodeCanvas
          id={`qr-${qrCode}`}
          value={qrCode}
          size={180}
          level="H"
        />
      </div>

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadQR}
        className="
          flex items-center gap-2
          px-6 py-2.5
          rounded-full
          text-white font-semibold
          bg-gradient-to-r from-indigo-500 to-purple-600
          hover:from-indigo-600 hover:to-purple-700
          shadow-md hover:shadow-xl
          transform hover:-translate-y-0.5 active:scale-95
          transition-all duration-200
        "
      >
        <FaDownload className="text-sm" />
        Download QR
      </button>
    </div>
  );
};

export default QRDisplay;
