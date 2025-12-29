import { useState } from "react";
import API from "../services/api";
import QRDisplay from "./QRDisplay";

const OutpassForm = () => {
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [outpass, setOutpass] = useState(null);

  const submitOutpass = async () => {
    const res = await API.post("/outpass/request", {
      reason,
      fromDate,
      toDate
    });
    setOutpass(res.data);
  };

  return (
    <div>
      <input placeholder="Reason" onChange={e => setReason(e.target.value)} />
      <input type="date" onChange={e => setFromDate(e.target.value)} />
      <input type="date" onChange={e => setToDate(e.target.value)} />
      <button onClick={submitOutpass}>Request Outpass</button>

      {outpass?.qrCode && <QRDisplay qr={outpass.qrCode} />}
    </div>
  );
};

export default OutpassForm;
