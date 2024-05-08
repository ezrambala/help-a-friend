import React, { useEffect, useState } from "react";
import {
  query,
  where,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";
import "./userdonation.css";

export default function UserDonation() {
  const [user, setUser] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [tableInfoTwo, setTableInfoTwo] = useState(null);
  const userIdtwo = user?.uid;
  const navigate = useNavigate();
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
    const getDonationInfo = async () => {
      const q = query(
        collection(db, "orphanage-payments"),
        where("user_id", "==", userIdtwo)
      );
      const donationInfo = await getDocs(q);
      const donationData = donationInfo.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //now we retrieve all orphange names with the id in the orphanageData array and combine the data
      const combinedData = await Promise.all(
        donationData.map(async (docs) => {
          const orphanageInfo = await getDoc(
            doc(db, "orphanages", docs.orphanage_id)
          );
          const orphanageData = orphanageInfo.data();
          return { ...docs, orphanageName: orphanageData.name };
        })
      );
      setTableInfo(combinedData);
    };
    const getCampaignInfo = async () => {
      const q = query(
        collection(db, "campaign-payments"),
        where("user_id", "==", userIdtwo)
      );
      const CampaignInfo = await getDocs(q);
      const donationData = CampaignInfo.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      //now we retrieve all campaign names with the id in the orphanageData array and combine the data
      const combinedData = await Promise.all(
        donationData.map(async (docs) => {
          const campaignInfo = await getDoc(
            doc(db, "campaigns", docs.campaign_id)
          );
          const campaignData = campaignInfo.data();
          return { ...docs, campaignName: campaignData.title};
        })
      );
      setTableInfoTwo(combinedData);
    };
    if (user) {
      getDonationInfo();
      getCampaignInfo();
    }
  }, [user]);

  return (
    <div className="ud-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
      <div>
        <h2 className="">{"Hey " + user?.displayName}</h2>
      </div>
      <div><h4>Your Orphange Donations</h4></div>
      <div className="tablediv">
        <table className="ud-table">
          <thead>
            <tr>
              <th>OrphanageName</th>
              <th>Donation Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tableInfo?.map((info, index) => {
              const amount = info.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              
              return (
                <tr>
                  <td>{info.orphanageName}</td>
                  <td>{"₦ "+ amount}</td>
                  <td>{info.createdAt.toDate().toString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div><h4>Your Campaign Donations</h4></div>
      <div className="tablediv">
        <table className="ud-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Donation Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {tableInfoTwo?.map((info, index) => {
              const amount = info.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              
              return (
                <tr>
                  <td>{info.campaignName}</td>
                  <td>{"₦ "+ amount}</td>
                  <td>{info.createdAt.toDate().toString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
