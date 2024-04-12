import { useState, useEffect } from "react";
import { storage } from "../firebase/config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import "./ComponentsCss/uploadorphanagephotos.css";

export default function UploadOrphanagePhotos() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [user, setUser] = useState(null);
  const userId =user?.uid;
  //imgurlAsList is so that i dont have to map through imgUrl when storing it in the database
  //and img url is so that i can count when the urls are up to 5 and render particular codes
  // const [imgUrlAsList, setImgUrlAsList] = useState({});
  const [progresspercent, setProgresspercent] = useState(0);
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const orphanageId = params.orphanageid;
  let count = 1;
  let countTwo = 1;

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  });
  useEffect(() => {
    console.log(imgUrl);
  }, [imgUrl]);

  const maxFiles = 5;

  const handleFileChange = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files).slice(0, maxFiles);
    setSelectedFiles(filesArray);
  };

  const handleUpload = (event) => {
    setButtonState(true);
    event.preventDefault();

    if (selectedFiles.length == 5 && imgUrl < 6) {
      selectedFiles.map((file) => {
        const imageiden = "photo" + count;
        const storageRef = ref(
          storage,
          `photos/orphanagePhotos/${orphanageId}/${imageiden}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        //the next line tracks the progress and error of each file upload
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
            alert("success");
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImgUrl((prevImgUrl) => [
                ...prevImgUrl,
                { photoUrl: downloadURL },
              ]);
              // setImgUrlAsList((prevImgUrlAslist) => ({
              //   ...prevImgUrlAslist,
              //   [imageiden]: downloadURL,
              // }));
            });
          }
        );
        count = count + 1;
      });
    } else {
      alert("YOU MUST UPLOAD 5 IMAGES ONLY");
    }
  };

  //this statement below is to check if the img urls are up to 5 then map through them and store them-
  // as an object field in the orphanages collection under the orphanage document that has the-
  // orphangeId as document id
  useEffect(() => {
    if (imgUrl.length == 5) {
      imgUrl.map((imges) => {
        let imageidentwo = "url" + countTwo;
        const storePhotourl = async () => {
          await setDoc(
            doc(db, "orphanages", orphanageId),
            {
              orphanage_photos: {
                [imageidentwo]: imges.photoUrl,
              },
              orphanage_photos_uploadedBy: userId,
            },
            { merge: true }
          );
        };
        storePhotourl();
        alert(imageidentwo);
        countTwo = countTwo + 1;
      });
      navigate("/upload-orp-profile-photo/" + orphanageId);
    }
  }, [imgUrl]);

  return (
    <div className="uploadmul-container">
      <h2 className="dp-heading-font-family upload-img-header">
        Upload Your Orphanage Photos
      </h2>
      <form
        onSubmit={handleUpload}
        onChange={handleFileChange}
        className="upload-mul-pic-form"
      >
        <input
          type="file"
          accept=".jpeg,.jpg"
          multiple
          className="dp-heading-font-family"
        />
        <button
          className="um-upload-btn dp-heading-font-family"
          type="submit"
          disabled={buttonState}
        >
          Upload
        </button>
      </form>
      <p className="dp-heading-font-family">
        Select No More or Less Than 5 Files
      </p>
      <ol className="ol-um-class dp-heading-font-family">
        {selectedFiles.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ol>
    </div>
  );
}
