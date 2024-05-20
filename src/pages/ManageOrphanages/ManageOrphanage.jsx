import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/config";
import {
  getDocs,
  collection,
  docs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./manageorphanages.css";

const ManageOrphanage = () => {
  const [user, setUser] = useState(null);
  const [buttonState, setButtonState] = useState(false);
  const [orphanageList, setOrphanageList] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
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
  async function getUser() {
    const userInfo = await getDoc(doc(db, "Users", user.uid));
    const userData = userInfo.data();
    if (userData.userAdmin == 23) {
      getOrphanages();
    } else {
      navigate("/");
    }
    setUserInfo(userData);
  }
  const getOrphanages = async () => {
    const q = query(collection(db, "orphanages"), where("status", "==", false));
    const allOrphanages = await getDocs(q);
    const orphanageData = allOrphanages.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setOrphanageList(orphanageData);
  };
  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);
  return (
    <div className="man-orp-container">
      <div>Pending Orphanages</div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Orphanage Name</th>
              <th>Orphanage Description</th>
              <th>Email</th>
              <th>Orphanage Biography</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orphanageList?.map((orpl, index) => {
              return (
                <tr>
                  <td>{orpl.name}</td>
                  <td className="man-orp-des">{orpl.orphanage_biography}</td>
                  <td></td>
                  <td></td>
                  <td>
                    <button
                      onClick={() => {
                        setButtonState(true);
                        const uploadToDonateList = async () => {
                          try {
                            await updateDoc(doc(db, "orphanages", orpl.id), {
                              status: true,
                            });
                          } catch (error) {
                            switch (error.message) {
                              case "Cannot read properties of undefined (reading 'indexOf')":
                                navigate("/register");
                                break;
                              default:
                                setButtonState(false);
                            }
                          }
                          setButtonState(false);
                        };
                        uploadToDonateList();
                      }}
                      disabled={buttonState}
                    >
                      Accept
                    </button>
                    <button>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrphanage;
