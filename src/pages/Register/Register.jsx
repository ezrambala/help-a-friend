import React, { useState } from "react";
import "./register.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { setDoc, doc } from "firebase/firestore";
import Spinner from "../../components/Spinner";

export default function Register() {
  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formInfo, setFormInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  function handleSubmitForm(event) {
    setButtonState(true);
    event.preventDefault();
    setLoading(true);

    // create User With Email And Password
    createUserWithEmailAndPassword(auth, formInfo.email, formInfo.password)
      .then((userCredential) => {
        const userIden = userCredential.user.uid;
        // after that, update the users username
        updateProfile(auth.currentUser, { displayName: formInfo.username })
          .then(() => {
            const storeUsername = async () => {
              try {
                await setDoc(
                  doc(db, "Users", userIden),
                  {
                    userType: 1,
                  },
                  { merge: true }
                );
                setButtonState(false);
                setLoading(false);
                navigate("/upload-user-profile-photo");
              } catch (e) {
                setButtonState(false);
                setLoading(false);
                const errorMessage = e.message;
                alert(errorMessage);
              }
            };
            storeUsername();
          })
          .catch((error) => {
            setButtonState(false);
            setLoading(false);
            alert(error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="regpage">
      <div className="register-bg-color">
        <div className="reg-con">
          <div className="regtitle">Registration</div>
          <div className="content-form">
            <form
              className="form-register"
              action="#"
              onSubmit={handleSubmitForm}
            >
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Username</span>
                  <input
                    className="input-register"
                    type="text"
                    name="username"
                    value={formInfo.username}
                    onChange={(event) => {
                      setFormInfo((prevFormInfo) => ({
                        ...prevFormInfo,
                        username: event.target.value,
                      }));
                    }}
                    placeholder="Enter your username"
                    required
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input
                    className="input-register"
                    type="email"
                    name="email"
                    value={formInfo.email}
                    onChange={(event) => {
                      setFormInfo((prevFormInfo) => ({
                        ...prevFormInfo,
                        email: event.target.value,
                      }));
                    }}
                    placeholder="Enter your email"
                    required
                  ></input>
                </div>
                <div className="input-box">
                  <span className="details">Password</span>
                  <input
                    className="input-register"
                    type="password"
                    name="password"
                    value={formInfo.password}
                    onChange={(event) => {
                      setFormInfo((prevFormInfo) => ({
                        ...prevFormInfo,
                        password: event.target.value,
                      }));
                    }}
                    placeholder="Enter your password"
                    required
                  ></input>
                </div>
              </div>
              <div className="button">
                <input
                  className="input-register dp-heading-font-family"
                  type="submit"
                  value="Register"
                  disabled={buttonState}
                ></input>
              </div>
              
              <div className="login-option dp-heading-font-family" onClick={() =>{navigate("/login")}}>
                Login?
              </div>
              <div className="login-option dp-heading-font-family" onClick={() =>{navigate("/")}}>
                Dashboard?
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
