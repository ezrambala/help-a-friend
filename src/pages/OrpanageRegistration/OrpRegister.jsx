import React, { useState, useEffect } from "react";
import "./orpregister.css";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function OrpRegister() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formInfo, setFormInfo] = useState({
    name: "",
    address: "",
    manager: "",
    phone: "",
    email: "",
    numOfChild: "",
    maleChild: "",
    femaleChild: "",
    specialChild: "",
    totalRes: "",
    staffnum: "",
    orpBio: "",
    livingCon: "",
    speNeedsDescrip: "",
  });
const userIden = user?.uid;

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

    addDoc(collection(db, "orphanages"), {
      name: formInfo.name,
      address: formInfo.address,
      manager_name: formInfo.manager,
      phone_number: formInfo.phone,
      email: formInfo.email,
      num_of_children: parseInt(formInfo.numOfChild),
      num_of_female_children: parseInt(formInfo.femaleChild),
      num_of_male_children: parseInt(formInfo.maleChild),
      num_of_residents: parseInt(formInfo.totalRes),
      num_of_staff: parseInt(formInfo.staffnum),
      orphanage_biography: formInfo.orpBio,
      living_condition: formInfo.livingCon,
      special_needs_description: formInfo.speNeedsDescrip,
      createdAt: serverTimestamp(),
      createdBy: user?.uid,
      status: false,
    })
      .then(async (docRef) => {
        const changeUserInfo = async () => {
          try {
            await setDoc(
              doc(db, "Users", userIden),
              {
                userType: 12,
                orphanageCreated: docRef.id,
              },
            );
           
          } catch (e) {
            const errorMessage = e.message;
            alert(errorMessage);
          }
        };
        changeUserInfo();
        alert("Orphanage Registered");
        navigate("/upload-orp-photos/" + docRef.id);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }
  return (
    <div className="orp-register-div">
      <form className="orp-register-form" onSubmit={handleSubmitForm}>
        <div className="orp-form-header">
          <div>
            <h1>Register Orphanage</h1>
          </div>
        </div>

        <div className="orp-input-div">
          <label>What is the name of the orphanage home?</label>
          <input
            className="orp-reg-input"
            type="text"
            name="orphanage-name"
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
          <label>What is the address of the orphanage home?&nbsp;</label>
          <input
            className="orp-reg-input"
            type="text"
            name="orphange-address"
            value={formInfo.address}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                address: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Name Of Manager&nbsp;</label>
          <input
            className="orp-reg-input"
            type="text"
            name="manager-name"
            value={formInfo.manager}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                manager: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Contact Information of Orphange (PHONE NUMBER)&nbsp;</label>
          <input
            className="orp-reg-input"
            type="tel"
            name="phone-number"
            value={formInfo.phone}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                phone: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Contact Information Of Orphanage (EMAIL)&nbsp;</label>
          <input
            className="orp-reg-input"
            type="email"
            name="orphanage-email"
            value={formInfo.email}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                email: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>
            The number of children currently living in the orphanage home?&nbsp;
          </label>
          <input
            className="orp-reg-input"
            type="number"
            name="number-current-chd"
            value={formInfo.numOfChild}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                numOfChild: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Number of male children in the orphanage home?&nbsp;</label>
          <input
            className="orp-reg-input"
            type="number"
            name="male-chd"
            value={formInfo.maleChild}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                maleChild: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Number of female children in the orphanage home?&nbsp;</label>
          <input
            className="orp-reg-input"
            type="number"
            name="female-chd"
            value={formInfo.femaleChild}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                femaleChild: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>
            Number of Special Needs children in the orphanage home?&nbsp;
          </label>
          <input
            className="orp-reg-input"
            type="number"
            name="special-chd"
            value={formInfo.specialChild}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                specialChild: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>Total Number Of Residents.&nbsp;</label>
          <input
            className="orp-reg-input"
            type="number"
            name="num-res"
            value={formInfo.totalRes}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                totalRes: event.target.value,
              }));
            }}
          ></input>
        </div>

        <div className="orp-input-div">
          <label>
            How many staff members are employed at the orphanage home?&nbsp;
          </label>
          <input
            className="orp-reg-input"
            type="number"
            name="num-staffs"
            value={formInfo.staffnum}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                staffnum: event.target.value,
              }));
            }}
          ></input>
        </div>

        {/* <div className="orp-input-div">
          <label for="RESULT_FileUpload-13">
            Legal Registration Document
          </label>
          <div className="">
            <input
              type="file"
              name="FileUpload"
              title=""
              accept=".avi,.bmp,.doc,.docx,.gif,.jpeg,.jpg,.webp,.heic,.mp3,.mp4,.mpeg,.mpg,.pdf,.png,.ppt,.pptx,.txt,.wav,.wmv,.xls,.xlsx,.zip"
            ></input>
            <div className="file_upload_files"></div>
            <div className="file_upload_info"></div>
          </div>
        </div> */}

        <div className="orp-input-div">
          <label>
            Orphanage Biography (This is shown in the About Orphanage section)
            &nbsp;
          </label>
          <textarea
            name="about-orphanage"
            rows="7"
            cols="50"
            value={formInfo.orpBio}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                orpBio: event.target.value,
              }));
            }}
          ></textarea>
        </div>

        <div className="orp-input-div">
          <label>Describe The Orphanages Living Condition&nbsp;</label>
          <textarea
            name="RESULT_TextArea-14"
            id="RESULT_TextArea-14"
            rows="7"
            cols="50"
            value={formInfo.livingCon}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                livingCon: event.target.value,
              }));
            }}
          ></textarea>
        </div>

        <div className="orp-input-div">
          <label>Describe your cases of Special Needs Children&nbsp;</label>
          <textarea
            name="RESULT_TextArea-15"
            rows="7"
            cols="50"
            value={formInfo.speNeedsDescrip}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                speNeedsDescrip: event.target.value,
              }));
            }}
          ></textarea>
        </div>

        <div>
          <input type="submit" className="orp-regisster-submit"></input>
        </div>
      </form>
    </div>
  );
}
