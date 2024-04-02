import React, { useEffect, useState } from "react";
import "./todonatelist.css";
import ChatsvgGreen from "../../svg/ChatsvgGreen";
import UserIcon from "../../svg/UserIcon";
import imglogo from "../../images/logo.png";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Header from "../../components/Header";

export default function ToDonateList() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userid;
  const [orphanageList, setOrphanageList] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log(firebaseUser);
      setUser(firebaseUser);
    });
  }, []);

  const getToDonateList = async () => {
    const ToDonate = await getDoc(doc(db, "ToDonateList", userId));
    if (ToDonate.exists()) {
      const ToDonateData = ToDonate.data();
      console.log(Object.values(ToDonateData));
      const ToDonateDataAsList = Object.values(ToDonateData);

      const orphanageDataPromises = ToDonateDataAsList.map(async (orpl) => {
        return getDoc(doc(db, "orphanages", orpl));
      });
      Promise.all(orphanageDataPromises).then((orphanageData) => {
        console.log(orphanageData);
        const allorphanages = orphanageData.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOrphanageList(allorphanages);
        console.log(allorphanages);
      });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getToDonateList();
    console.log(orphanageList);
  }, []);

  return (
    <div className="tdl-page-container">
      <Header userId={user?.uid} />
      <div className="tdl-section-one">
        <div>
          <h2 className="tdl-page-heading">{"Hey " + user?.displayName}</h2>
        </div>
        <div>
          <h3 className="dp-heading-font-family">Your To-Donate List</h3>
          <h6 className="dp-heading-font-family">
            This is a Bookmark of all the orphanages you wish To-Donate To
          </h6>
        </div>
        {orphanageList.map((orpl, index) => (
          <div className="tdl-card">
            <div className="to-donate-to">
              <h5 className="tdl-card-numbering dp-heading-font-family">
                {index + 1}
              </h5>
              <div className="tdt-content">
                <h4>{orpl.name}</h4>
                <div style={{ fontSize: "12px" }}>{orpl.address}</div>
              </div>
              <div className="tdt-content-two">
                <div className="tdt-link">Donate</div>
                <div className="tdt-link">Remove</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
