import React, { useState } from "react";
import "./register.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  
  const [formInfo, setFormInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  function handleSubmitForm(event) {
    event.preventDefault();
    console.log(formInfo);

    // create User With Email And Password
    createUserWithEmailAndPassword(auth, formInfo.email, formInfo.password)
      .then(() => {
        // after that, update the users username
        updateProfile(auth.currentUser, { displayName: formInfo.username })
          .then(() => {alert("User registered successfully!!");  navigate("/");})
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert(errorMessage);
      });
  }
  return (
    <div className="regpage">
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
                className="input-register"
                type="submit"
                value="Register"
              ></input>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
