// import './App.css';
import { useState, useEffect } from "react";
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { updateProfile } from "firebase/auth";
import Spinner from "./Spinner";
import "./ComponentsCss/uploadorphanagephotos.css";

function UploadForumPhoto() {
  const [user, setUser] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [uploadToDb, setUploadtoDb] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
  const fileEName = "forum-photo";
  const params = useParams();
  const forumId = params.forumid;
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
    setButtonState(true);
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;
    const storageRef = ref(
      storage,
      `photos/forumPhoto/${forumId}/profile-photo/${fileEName}`
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setUploadtoDb(true);
        });
        
      }
    );
  };
  useEffect(() => {
    if (uploadToDb) {
            const storeForumPhoto = async () => {
              await updateDoc(
                doc(db, "forums", forumId),
                {
                  photoUrl: imgUrl,
                  photoUrlUploadedBy: userId,
                },
              );
              alert("Photo Stored Successfully"); 
              navigate("/forum")
            };
            storeForumPhoto();
            }
          
    }
  , [uploadToDb]);

  if(!user){return <Spinner/>}

  //this file and upload orphanage photos use the same css classes
  return (
    <div className="uploadmul-container">
      <h2 className="dp-heading-font-family upload-img-header">
        Upload Your Forum Photo
      </h2>
      <form onSubmit={handleSubmit} className="upload-mul-pic-form">
        <input type="file" accept=".jpeg,.jpg"  className="dp-heading-font-family" />
        <button type="submit" className="um-upload-btn dp-heading-font-family" disabled={buttonState}>
          Upload
        </button>
      </form>
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
export default UploadForumPhoto;
