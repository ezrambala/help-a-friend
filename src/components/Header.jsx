import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import "./ComponentsCss/responsivecss.css";
import { useMediaQuery } from "react-responsive";

import UserIcon from "../svg/UserIcon";
import imglogo from "../images/logo.png";
import Menusvg from "../svg/Menusvg";

//uses orphanage.css classes
export default function Header({ userId, userPhotoURL }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 725px)" });
  function userLogout() {
    signOut(auth)
      .then(() => {
        alert("user logged out");
        navigate("/");
      })
      .catch((error) => {
        alert("there was an error");
      });
  }

  return (
    <div className="two-header">
      <div>
        <div className="two-logo">
          <img
          
            src={imglogo}
            alt="logo"
            className="two-logo-img"
          ></img>
        </div>
      </div>

      <div className="two-header-icons">
        {userId ? (
          <></>
        ) : (
          <>
            <div>
              <Link
                to={"/login"}
                className="dp-heading-font-family orphanage-login-icon"
              >
                LOGIN
              </Link>
            </div>

            <div>
              <Link
                to={"/register"}
                className="dp-heading-font-family orphanage-login-icon"
              >
                SIGN-UP
              </Link>
            </div>
          </>
        )}
        {isMobile ? (
          <>
            <div>
              <div className="nav-links-menu"><Menusvg height={"22px"} width={"22px"}/></div>
            </div>
          </>
        ) : (
          <>
            <div>
              <Link
                to={"/"}
                className="orphanage-login-icon dp-heading-font-family"
              >
                DASHBOARD
              </Link>
            </div>
            <div>
              <Link
                to={"/forum"}
                className="orphanage-login-icon dp-heading-font-family"
              >
                FORUM
              </Link>
            </div>
            <div>
              <div className="orphanage-login-icon dp-heading-font-family">
                DONATIONS
              </div>
            </div>
          </>
        )}

        {userId ? (
          <div>
            <div className="dropdown">
              <button
                className="btn btn-secondary  acc-icon"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img width={"45px"} src={userPhotoURL} alt=""></img>
              </button>
              <div
                className="dropdown-menu acc-dpdown"
                aria-labelledby="dropdownMenuButton"
              >
                <Link
                  className="orphanage-login-dpdown  dp-heading-font-family"
                  to={"/todonate"}
                >
                  <div> To Donate List</div>
                </Link>
                <Link
                  className="orphanage-login-dpdown  dp-heading-font-family"
                  to={"/create-forum"}
                >
                  <div> Create Forum </div>
                </Link>

                <Link
                  className="orphanage-login-dpdown  dp-heading-font-family"
                  onClick={userLogout}
                >
                  <div>Log Out</div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
