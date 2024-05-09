import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { getDocs, doc, query,collection, where, getDoc } from "firebase/firestore";
import Header from "../../components/Header";
export default function OrphanageEarnings() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(null);
  const params = useParams();
  const orphanageId = params.orphanageid;
  const [tableInfo, setTableInfo] = useState(null);
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
    if (donationInfo.exists()) {
      const donationData = donationInfo.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTableInfo(donationData);
    }
  };

  return (
    <div className="orp-earn-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
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
              const amount = info.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              
              return (
                <tr key={index}>
                  <td>{"₦ "+ amount}</td>
                  <td>{info.createdAt.toDate().toString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
