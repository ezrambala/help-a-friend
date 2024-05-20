import React, { useState, useEffect } from "react";
import "./registerevent.css";
import { onAuthStateChanged } from "firebase/auth";
import { storage, auth, db } from "../../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Spinner from "../../components/Spinner";

const RegisterEvent = () => {
  const [buttonState, setButtonState] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [eventType, setEventType] = useState("Seminar");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [formInfo, setFormInfo] = useState({
    name: "",
    date: "",
    websiteURL: "",
    description: "",
  });
  const navigate = useNavigate();
  const fileEName = "event-photo";
  const userId = user?.uid;

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setButtonState(false);
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSpinner(true);
    const file = e.target[5]?.files[0];
    if (!file) {
      alert("CHOOSE A FILE");
    }
    if (file) {
      setButtonState(true);
      const storageRef = ref(
        storage,
        `photos/eventPhotos/${userId}/event-photo/${generateRandomString(5)}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // setProgresspercent(progress);
        },
        (error) => {
          alert(error);
          setButtonState(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await setDoc(
                doc(
                  db,
                  "events",
                  generateRandomString(12) + userId + generateRandomString(5)
                ),
                {
                  name: formInfo.name,
                  description: formInfo.description,
                  websiteURL: formInfo.websiteURL,
                  date: formInfo.date,
                  eventPhotoUrl: downloadURL,
                  eventType: eventType,
                  status: 1,
                  createdAt: serverTimestamp(),
                  createdBy: userId,
                },
                { merge: true }
              )
                .then(() => {
                  setSpinner(false);
                  setButtonState(false);
                  alert("event registered");
                })
                .catch((e) => {
                  alert("event registering error:" + e.message);
                  setSpinner(false);
                });
            })
            .catch((e) => {
              alert("photo upload error:" + e.message);
            });
        }
      );
    }
  };

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  if (spinner) {
    return <Spinner />;
  }
  return (
    <div className="register-event-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
      <h1 className="dp-heading-font-family">Register An Event</h1>
      <form className="register-event-form" onSubmit={handleSubmit}>
        <input
          className="ev-reg-input"
          type="text"
          value={formInfo.name}
          onChange={(event) => {
            setFormInfo((prev) => ({ ...prev, name: event.target.value }));
          }}
          placeholder="Enter Event Name"
          required
        ></input>
        <input
          className="ev-reg-input"
          type="text"
          value={formInfo.description}
          onChange={(event) => {
            setFormInfo((prev) => ({
              ...prev,
              description: event.target.value,
            }));
          }}
          placeholder="Enter Event Description"
          required
        ></input>
        <div>
          <div>Event Date</div>
          <input
            className="ev-reg-input"
            type="datetime-local"
            value={formInfo.date}
            onChange={(event) => {
              setFormInfo((prev) => ({ ...prev, date: event.target.value }));
            }}
            required
          ></input>
        </div>
        <input
          className="ev-reg-input"
          type="text"
          value={formInfo.websiteURL}
          onChange={(event) => {
            setFormInfo((prev) => ({
              ...prev,
              websiteURL: event.target.value,
            }));
          }}
          placeholder="Enter Website"
        ></input>
        <div>
          <div>Event Type</div>
          <select
            className="ev-reg-input"
            onChange={async (e) => {
              setEventType(e.target.value);
              console.log(eventType);
            }}
            id="service-options"
            name="service-options"
            required
          >
            <option value="Seminar">Seminar</option>
            <option value="Webinar">Webinar</option>
          </select>
        </div>
        <div>
          <div>Select event image</div>
          <input
            type="file"
            accept=".jpeg,.jpg, .webp"
            className="dp-heading-font-family ev-reg-input"
            required
          />
        </div>
        <button className="ev-reg-submit" type="submit" disabled={buttonState}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegisterEvent;
