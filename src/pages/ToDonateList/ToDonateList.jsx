import React, { useEffect, useState } from "react";
import "./todonatelist.css";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";

export default function ToDonateList() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [updatePage, setUpdatePage] = useState(false);
  const [orphanageList, setOrphanageList] = useState(null);
  const userIdtwo = user?.uid;

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
    const getToDonateList = async () => {
      const ToDonate = await getDoc(doc(db, "ToDonateList", userIdtwo));
      if (ToDonate.exists()) {
        const ToDonateData = ToDonate.data();
        console.log(ToDonateData);
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
    if (user) {
      getToDonateList();
    }
  }, [updatePage, user]);



  if (!orphanageList) return <Spinner />;

  return (
    <div className="tdl-page-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
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
                <div
                  className="tdt-link"
                  onClick={() => {
                    navigate("/donation/" + orpl.id + "/" + orpl.name);
                  }}
                >
                  Donate
                </div>
                <div
                  className="tdt-link"
                  onClick={async () => {
                    const docRef = doc(db, "ToDonateList", userIdtwo);
                    await updateDoc(docRef, {
                      [orpl.id]: deleteField(),
                    });
                    setUpdatePage((prev) => !prev);
                  }}
                >
                  Remove
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
