import React, { useEffect, useState } from "react";
import "./dashboard.css";
import "./dashboard-extra.css";
import ExcSvg from "../../svg/ExcSvg";
import UserIcon from "../../svg/UserIcon";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import imglogo from "../../images/logo.png";
import orpcamimg from "../../images/orphanagecampaign.jpg";
import { Link, useNavigate } from "react-router-dom";
import OrphanageNews from "../OrphanageNews/OrphanageNews";
import Spinner from "../../components/Spinner";
import CheckConnection from "../../components/CheckConnection";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orphanageList, setOrphanageList] = useState(null);
  const [capUsername, setCapUsername] = useState(null);
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
  }, []);

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
  const getOrphanages = async () => {
    const allOrphanages = await getDocs(collection(db, "orphanages"));
    const orphanageData = allOrphanages.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setOrphanageList(orphanageData);
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function pageReload() {
    setTimeout(() => {
      window.location.reload();
    }, 17000);
  }

  useEffect(() => {
    getOrphanages();
  }, []);
  useEffect(() => {
    if (user) {
      const str = user?.displayName;
      setCapUsername(capitalize(str));
    }
  }, [user]);

  if (!orphanageList) {
    return <Spinner />;
  }

  return (
    <>
      {orphanageList.length == 0 ? (
        <>
          <CheckConnection />
          {pageReload()}
        </>
      ) : (
        <div className="pagecontent">
          <div className="header">
            <div className="logo">
              <img src={imglogo} alt="logo" className="logo-img"></img>
            </div>

            <div className="search">
              <input
                type="search"
                placeholder="Search"
                className="se-input"
              ></input>
            </div>
            <div className="header-icons">
              {user ? (
                <div>
                  <div className="dp-heading-font-family dashboard-login-icon">
                    WELCOME &nbsp;&nbsp;&nbsp; {capUsername}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <Link
                      to={"/login"}
                      className="dp-heading-font-family dashboard-login-icon"
                    >
                      LOGIN
                    </Link>
                  </div>

                  <div>
                    <Link
                      to={"/register"}
                      className="dp-heading-font-family dashboard-login-icon"
                    >
                      SIGN-UP
                    </Link>
                  </div>
                </>
              )}

              <div>
                {/* <Chatsvg height={"44px"} width={"44px"} /> */}
                <Link to={"/forum"} className="dp-heading-font-family dashboard-login-icon">
                  FORUM
                </Link>
              </div>

              <div>
                <div className="dp-heading-font-family dashboard-login-icon">
                  DONATIONS
                </div>
              </div>

              {!user ? (
                <></>
              ) : (
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
                      <UserIcon height={"34px"} width={"34px"} />
                    </button>
                    <div
                      className="acc-dpdown dropdown-menu "
                      aria-labelledby="dropdownMenuButton"
                    >
                      <Link
                        className="orphanage-login-dpdown  dp-heading-font-family"
                        to={"/todonate"}
                      >
                        <div>To Donate List </div>
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
              )}
            </div>
          </div>

          <section className="section-one">
            <div className="secone-header">
              <h2>Discover The World of Children In Need...</h2>
            </div>
            <OrphanageNews />
            <div className="nav-btn">
              <button className="cssbuttons-io">
                <span>
                  <a href="#orphanages">Orphanages</a>
                </span>
              </button>
              <button className="cssbuttons-io">
                <span>
                  <a href="#campaigns">Campaigns</a>
                </span>
              </button>
            </div>
            <div className="secone-div3">
              <div id="orphanages" className="orphanages">
                {orphanageList.map((orpl) => (
                  <div className="orp-detailcard">
                    <div>
                      <Link
                        className="oprcard-head"
                        to={"orphanage/" + orpl.id}
                      >
                        <h3>{orpl.name}</h3>
                      </Link>

                      <div className="orp-bio">{orpl.orphanage_biography}</div>
                      <div className="orpcard-footer">
                        <p>{orpl.num_of_residents} Residents!</p>
                        <p>
                          {orpl.address}
                          <ExcSvg height={"14px"} width={"14px"} />
                        </p>
                      </div>
                    </div>

                    <div className="orp-card-btns">
                      <div>
                        <button
                          className="CartBtn"
                          onClick={() => {
                            setButtonState(true);
                            try {
                              const uploadToDonateList = async () => {
                                await setDoc(
                                  doc(db, "ToDonateList", user?.uid),
                                  { [orpl.id]: orpl.id },
                                  { merge: true }
                                );
                                
                                setButtonState(false);
                              };
                              uploadToDonateList();
                            } catch (error) {
                              navigate("/register");
                            }
                          }}
                          disabled={buttonState}
                        >
                          <span className="IconContainer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 576 512"
                              fill="rgb(17, 17, 17)"
                              className="cart"
                            >
                              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                            </svg>
                          </span>
                          <p className="text">Donate To</p>
                        </button>
                      </div>
                      <div>
                        <button className="CartBtn carbtn2" onClick={() => {navigate("/donation/"+orpl.id+"/"+orpl.name)}} disabled={buttonState}>
                          <span className="IconContainer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 576 512"
                              fill="rgb(17, 17, 17)"
                              className="cart"
                            >
                              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                            </svg>
                          </span>
                          <p className="text">Donate</p>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div id="campaigns" className="campaigns">
                <div className="orp-campaigncard">
                  <div className="orp-campaigncard-divone">
                    <img
                      className="campaign-img"
                      src={orpcamimg}
                      alt="hey, there"
                    ></img>
                  </div>

                  <div className="orp-cpcard-divtwo">
                    <div className="campaign-details">
                      <h3 className="cp-det-header"> Education For Gwarimpa</h3>
                      <p className="campaign-card-bio">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                    <div className="cp-det-btn">
                      <div>
                        {/* <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#c2c2c2">

                                        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                    
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                    
                                        <g id="SVGRepo_iconCarrier"> <path d="M20 13L20 18C20 19.1046 19.1046 20 18 20L6 20C4.89543 20 4 19.1046 4 18L4 13" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M16 8L12 4M12 4L8 8M12 4L12 16" stroke="#c7c7c7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g>
                                    
                                    </svg> */}
                      </div>
                      <div>
                        <button className="cpcd-dnt">Donate</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-two"></section>
        </div>
      )}
    </>
  );
}
