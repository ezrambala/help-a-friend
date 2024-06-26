import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import {
  getDocs,
  doc,
  query,
  collection,
  where,
  getDoc,
} from "firebase/firestore";
import Header from "../../components/Header";
import "./orphanageearnings.css";
export default function OrphanageEarnings() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(null);
  const params = useParams();
  const orphanageId = params.orphanageid;
  const [tableInfo, setTableInfo] = useState(null);
  const [filterValue, setFilterValue] = useState(0);
  const [orphanageList, setOrphanageList] = useState(null);
  const [filterValue2, setFilterValue2] = useState(0);
  const [linkValue, setLinkValue] = useState("Copy Link!");
  const [linkValue2, setLinkValue2] = useState("Copy Link!");
  let totalAmount = 0;
  let orpLink = "https://helpafriend.netlify.app/orphanage/" + orphanageId;
  let donateLink =
    "https://helpafriend.netlify.app/donation/" +
    orphanageId +
    "/" +
    orphanageList?.name;

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  }, []);
  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);
  async function getUser() {
    const userInfo = await getDoc(doc(db, "Users", user.uid));
    if (userInfo.exists()) {
      const userData = userInfo.data();
      if (userData.userType != 12 || userData.orphanageCreated != orphanageId) {
        navigate("/");
      } else {
        getDonationInfo();
        getOrphanages();
      }
      setUserInfo(userData);
    }
  }
  const getDonationInfo = async () => {
    const q = query(
      collection(db, "orphanage-payments"),
      where("orphanage_id", "==", orphanageId)
    );
    const donationInfo = await getDocs(q).catch((e) => {
      alert(e.message);
    });
    if (!donationInfo.empty) {
      const donationData = donationInfo.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTableInfo(donationData);
    }
  };
  const getOrphanages = async () => {
    try {
      const allOrphanages = await getDoc(doc(db, "orphanages", orphanageId));
      if (allOrphanages.exists()) {
        const orphanageData = allOrphanages.data();
        setOrphanageList(orphanageData);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching orphanages:", error);
    }
  };
  function returnDay(num) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[num];
  }
  function returnMonth(num) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[num];
  }
  function returnSuffix(num) {
    if (num >= 11 && num <= 13) {
      return num + "th";
    }
    switch (num % 10) {
      case 1:
        return num + "st";
      case 2:
        return num + "nd";
      case 3:
        return num + "rd";
      default:
        return num + "th";
    }
  }

  return (
    <div className="orp-earn-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
      <div className="fillter-sec">
        Select The Date Range
        <div className="to-frm">
          From:
          <input
            type="datetime-local"
            id="calendar"
            name="calendar"
            onChange={(event) => {
              setFilterValue(parseInt(Date.parse(event.target.value)));
            }}
          ></input>
          To:
          <input
            type="datetime-local"
            id="calendar"
            name="calendar"
            onChange={(event) => {
              console.log(Date.parse(event.target.value));
              setFilterValue2(parseInt(Date.parse(event.target.value)));
            }}
          ></input>
        </div>
      </div>
      <div>
        <div className="tablediv">
          <table className="ud-table">
            <thead>
              <tr>
                <th>Donation Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tableInfo?.map((info, index) => {
                const amount = info.amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                const dFormat = parseInt(info.createdAt.seconds * 1000);
                if (dFormat >= filterValue && dFormat <= filterValue2) {
                  totalAmount = totalAmount + parseInt(info.amount);
                  return (
                    <tr key={index}>
                      <td>{"₦ " + amount}</td>
                      <td>
                        {returnDay(info.createdAt.toDate().getDay()) +
                          ", " +
                          returnSuffix(info.createdAt.toDate().getDate()) +
                          " " +
                          returnMonth(info.createdAt.toDate().getMonth()) +
                          " " +
                          info.createdAt.toDate().getFullYear()}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
        <div className="tot-amoun">Total Amount: {totalAmount} </div>
        <div className="share-orp-page">
          Share Orphanage Link
          <div
            className="sh-orp-btn"
            onClick={async () => {
              navigator.clipboard.writeText(orpLink);
              setLinkValue((prev) => {
                if (linkValue == "Copy Link!") {
                  return "Copied !";
                } else {
                  return "Copy Link!";
                }
              });
            }}
          >
            {linkValue}
          </div>
        </div>
        <div className="share-orp-page">
          Share Donation Link
          <div
            className="sh-orp-btn"
            onClick={async () => {
              navigator.clipboard.writeText(donateLink);
              setLinkValue2((prev) => {
                if (linkValue2 == "Copy Link!") {
                  return "Copied !";
                } else {
                  return "Copy Link!";
                }
              });
            }}
          >
            {linkValue2}
          </div>
        </div>
      </div>
    </div>
  );
}
