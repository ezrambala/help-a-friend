import React, { useEffect, useState } from "react";
import "../OrpanageRegistration/orpregister.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateForum() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const userPhoto = user?.photoURL;
  const userDisplayName = user?.displayName;
  const userId = user?.uid;
  const [formInfo, setFormInfo] = useState({
    name: "",
    description: "",
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

  function handleSubmitForm(event) {
    event.preventDefault();
    addDoc(collection(db, "forums"), {
      name: formInfo.name,
      description: formInfo.description,
      creatorUrl: userPhoto,
      creatorId: userId,
      creatorDisplayName: userDisplayName,
      status: "pending",
      photoUrlUploadedBy: "",
      photoUrl: "",
      createdAt: serverTimestamp(),
    })
      .then((docRef) => {
        alert("Forum Registered");
        navigate("/upload-forum-photo/" + docRef.id);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }
  return (
    <div className="orp-register-div">
      <form className="orp-register-form" onSubmit={handleSubmitForm}>
        <div className="orp-form-header">
          <div>
            <h1>Create Forum</h1>
          </div>
        </div>

        <div className="orp-input-div">
          <label>What is the name of the Forum?</label>
          <input
            className="orp-reg-input"
            type="text"
            name="forum-name"
            value={formInfo.name}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                name: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>
            Describe The Purpose Of This Forum and How It Will Help
            Orphanages&nbsp;
          </label>
          <textarea
            name="RESULT_TextArea-15"
            rows="7"
            cols="50"
            value={formInfo.description}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                description: event.target.value,
              }));
            }}
          ></textarea>
        </div>

        <div>
          <input type="submit" className="orp-regisster-submit"></input>
        </div>
        <div>
          <input
            onClick={() => {
              navigate("/");
            }}
            value={"Back To Dasboard"}
            className="orp-regisster-submit fixed-btn-sbt"
          ></input>
        </div>
      </form>
    </div>
  );
}
