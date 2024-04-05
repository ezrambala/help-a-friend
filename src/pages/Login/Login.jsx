import React, { useState } from "react";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formInfo, setFormInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleSubmitForm(event) {
    event.preventDefault();
    console.log(formInfo);

    // create User With Email And Password
    signInWithEmailAndPassword(auth, formInfo.email, formInfo.password)
      .then(() => {
        console.log("user logged in successfully!");
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }
  return (
    <div className="user-login-page">
      <form className="user-login-form" onSubmit={handleSubmitForm}>
        <div className="login-form-header">
          <h1>Login</h1>
        </div>
        <div className="login-input-div">
          <label>Email</label>
          <input
            className="user-login-input"
            type="email"
            name="useremail"
            value={formInfo.email}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                email: event.target.value,
              }));
            }}
          ></input>
        </div>
        <div className="login-input-div">
          <label>Password</label>
          <input
            className="user-login-input"
            type="password"
            name="userpassword"
            value={formInfo.password}
            onChange={(event) => {
              setFormInfo((prevFormInfo) => ({
                ...prevFormInfo,
                password: event.target.value,
              }));
            }}
          ></input>
        </div>
        <div>
          <input
            type="submit"
            className="user-login-submit"
            value="Login"
          ></input>
        </div>
      </form>
    </div>
  );
}
