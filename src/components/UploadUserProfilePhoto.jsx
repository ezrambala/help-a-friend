// import './App.css';
import { useState, useEffect } from "react";
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { updateProfile } from "firebase/auth";
import Spinner from "./Spinner";
import "./ComponentsCss/uploadorphanagephotos.css";

function UploadUserProfilePhoto() {
  const [user, setUser] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [uploadToDb, setUploadtoDb] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
  const fileEName = "user-profile-photo";
  const userId = user?.uid;

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) {alert("CHOOSE A FILE")}
    if (file) {
      setButtonState(true);
      const storageRef = ref(
        storage,
        `photos/userPhotos/${userId}/profile-photo/${fileEName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
          setButtonState(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrl(downloadURL);
            setUploadtoDb(true);
          });
        }
      );
    }
  };
  useEffect(() => {
    if (uploadToDb) {
      updateProfile(auth.currentUser, { photoURL: imgUrl })
        .then(() => {
          setButtonState(false);
          alert("Photo Stored Successfully");
        })
        .catch((error) => {
          console.log(error);
          setButtonState(false);
        });
    }
  }, [uploadToDb]);

  if (!user) {
    return <Spinner />;
  }

  //this file and upload orphanage photos use the same css classes
  return (
    <div className="uploadmul-container">
      <h2 className="dp-heading-font-family upload-img-header">
        Upload Your Profile Photo
      </h2>
      <form onSubmit={handleSubmit} className="upload-mul-pic-form">
        <input
          type="file"
          accept=".jpeg,.jpg"
          className="dp-heading-font-family"
        />
        <button
          type="submit"
          className="um-upload-btn dp-heading-font-family"
          disabled={buttonState}
        >
          Upload
        </button>
      </form>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="um-upload-btn dp-heading-font-family"
        disabled={buttonState}
      >
        Back To Dashboard
      </button>
      {!imgUrl && (
        <div className="outerbar-loading">
          <div
            className="innerbar"
            style={{ width: `${progresspercent}%`, backgroundColor: "#688865" }}
          >
            {progresspercent}%
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </div>
  );
}
export default UploadUserProfilePhoto;
