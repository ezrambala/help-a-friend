import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useMediaQuery } from "react-responsive";
import UserIcon from "../svg/UserIcon";
import imglogo from "../images/logo.png";
import Menusvg from "../svg/Menusvg";

//uses orphanage.css classes
export default function Header({ userId, userPhotoURL }) {
  const [userMenu, setUserMenu] = useState(false);
  const [navLinkList, setNavLinkList] = useState(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
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
  async function getUser() {
    const userInfo = await getDoc(doc(db, "Users", userId));
    const userData = userInfo.data();
    setUserInfo(userData);
  }
  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);
  return (
    <div className="two-header">
      <div>
        <div className="two-logo">
          <img src={imglogo} alt="logo" className="two-logo-img"></img>
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
            <div
              onClick={() => {
                setUserMenu(false);
                setNavLinkList((prev) => !prev);
              }}
            >
              <div className="nav-links-menu">
                <Menusvg height={"22px"} width={"22px"} />
              </div>
            </div>
            <div className={`nav-links-list-${navLinkList}`}>
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
            <div>
              <button
                className="acc-icon"
                type="button"
                onClick={() => {
                  setNavLinkList(false);
                  setUserMenu((prev) => !prev);
                }}
              >
                <img width={"45px"} src={userPhotoURL} alt=""></img>
              </button>
              <div className={`acc-dpdown-${userMenu}`}>
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
                  className="orphanage-login-dpdown  dp-heading-font-family dpdown-margin"
                  to={"/upload-user-profile-photo"}
                >
                  <div> Update Profile Photo</div>
                </Link>
                {userInfo?.userType == 12 ? (
                  <>
                    <Link
                      className="orphanage-login-dpdown  dp-heading-font-family "
                      to={
                        "/upload-orp-profile-photo/" + userInfo.orphanageCreated
                      }
                    >
                      <div> Update Orphange Photo</div>
                    </Link>
                    <Link
                      className="orphanage-login-dpdown  dp-heading-font-family "
                      to={"/orphanage-earnings/" + userInfo.orphanageCreated}
                    >
                      <div>Orphange Earnings</div>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
                <Link
                  className="orphanage-login-dpdown  dp-heading-font-family "
                  to={"/your-donations"}
                >
                  <div>Your Donations</div>
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
