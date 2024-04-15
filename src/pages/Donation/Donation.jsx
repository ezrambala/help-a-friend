import React, { useState, useEffect } from "react";
import "./donation.css";
import imgbanner from "../../images/help-a-friend-banner.png";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/config";
import { useNavigate, useParams } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Header from "../../components/Header";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Donation() {
  const [user, setUser] = useState(null);
  const userId = user?.uid;
  const userEmail = user?.email;
  const userName = user?.displayName;
  const params = useParams();
  const navigate = useNavigate();
  const orphanageId = params.orphanageid;
  const orphanageName = params.orphanagename;
  const [buttonState, setButtonState] = useState(false);
  console.log(orphanageId);
  console.log(orphanageName);
  console.log(userEmail);
  const [formInfo, setFormInfo] = useState({
    amount: "",
    phone: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  }, []);

  const config = {
    public_key: process.env.REACT_APP_PUBKEY,
    tx_ref: Date.now(),
    amount: formInfo.amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,banktransfer,ussd",
    customer: {
      email: userEmail,
      phone_number: formInfo.phone,
      name: userName,
    },
    customizations: {
      title: "my Payment Title",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
  
  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="donation-page-container">
      <Header userId={user?.uid} />
      <div className="dp-main-section">
        <div className="dp-section-one">
          <div className="dp-haf-img">
            <img
              width={"350px"}
              height={"350px"}
              src={imgbanner}
              alt="Hey Now"
            ></img>
          </div>
          <div className="dp-haf-bio dp-heading-font-family">
            Help a Friend, a compassionate initiative dedicated to supporting
            orphanages in our local community. At Help a Friend, we believe in
            the power of collective kindness to make a significant impact in the
            lives of those in need.
          </div>
        </div>
        <div className="dp-section-two">
          <h2 className="dp-heading-font-family">Donate Now</h2>
          <h5 className="dp-heading-font-family dashed-border">
            One Time Payment
          </h5>
          <h5 className="dp-heading-font-family">Orphanage</h5>
          <input className="dp-input" value={orphanageName}></input>
          <h5 className="dp-heading-font-family">Enter the Donation Amount</h5>
          <input
            value={formInfo.amount}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                amount: event.target.value,
              }));
            }}
            className="dp-input"
            type="number"
            placeholder="#30,000"
          ></input>
           <h5 className="dp-heading-font-family">Enter Your Phone Number</h5>
          <input
            value={formInfo.phoneNumber}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                phone: event.target.value,
              }));
            }}
            className="dp-input"
            type="text"
            placeholder="08064513214"
          ></input>
          <input
            className="dp-heading-font-family dp-submit"
            type="submit"
            value={"Help A Friend"}
            disabled={buttonState}
            onClick={() => {
              setButtonState(true);
              const onclickAmount = formInfo.amount;
              handleFlutterPayment({
                callback: async (response) => {
                  console.log(response);
                  await addDoc(collection(db, "orphanage-payments"), {
                    orphanage_id: orphanageId,
                    user_id: userId,
                    amount: onclickAmount,
                    createdAt: serverTimestamp(),
                  })
                    .then(() => {})
                    .catch((error) => {});
                  closePaymentModal(); // this will close the modal programmatically
                },
                onClose: () => {},
              });
            }}
          ></input>
        </div>
      </div>
    </div>
  );
}
