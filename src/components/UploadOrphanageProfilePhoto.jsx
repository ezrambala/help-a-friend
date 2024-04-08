// import './App.css';
import { useState, useEffect } from "react";
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import "./ComponentsCss/uploadorphanagephotos.css";

function UploadOrphanageProfilePhoto() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [uploadToDb, setUploadtoDb] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const orphanageId = params.orphanageid;
  const fileEName = "orphanag-profile-photo";

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target[0]?.files[0];
    if (!file) return;
    const storageRef = ref(
      storage,
      `photos/orphanagePhotos/${orphanageId}/profile-photo/${fileEName}`
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
      const storePhotourl = async () => {
        await setDoc(
          doc(db, "orphanages", orphanageId),
          {
            orphanage_profile_photo: imgUrl,
          },
          { merge: true }
        );
        alert("image uploaded");
      };
      storePhotourl();
    }
  }, [uploadToDb]);
  //this file and upload orphanage photos use the same css classes
  return (
    <div className="uploadmul-container">
      <h2 className="dp-heading-font-family upload-img-header">
        Upload Your Orphanage Profile Photo
      </h2>
      <form onSubmit={handleSubmit} className="upload-mul-pic-form">
        <input type="file" className="dp-heading-font-family" />
        <button type="submit" className="um-upload-btn dp-heading-font-family">
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
export default UploadOrphanageProfilePhoto;
