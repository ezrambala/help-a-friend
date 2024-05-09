import React, { useEffect, useState } from "react";
import "./dashboard.css";
import "./dashboard-extra.css";
import ExcSvg from "../../svg/ExcSvg";
import UserIcon from "../../svg/UserIcon";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import imglogo from "../../images/logo.png";
import orpcamimg from "../../images/orphanagecampaign.jpg";
import { Link, useNavigate } from "react-router-dom";
import OrphanageNews from "../OrphanageNews/OrphanageNews";
import Spinner from "../../components/Spinner";
import CheckConnection from "../../components/CheckConnection";
import FilterSvg from "../../svg/FilterSvg";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orphanageList, setOrphanageList] = useState(null);
  const [campaignList, setCampaignList] = useState(null);
  const [campaignFilter, setCampaignFilter] = useState("");
  const [capUsername, setCapUsername] = useState(null);
  const [buttonState, setButtonState] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
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
  async function getUser() {
    const userInfo = await getDoc(doc(db, "Users", user.uid));
    const userData = userInfo.data();
    setUserInfo(userData);
  }
  const getOrphanages = async () => {
    const allOrphanages = await getDocs(collection(db, "orphanages"));
    const orphanageData = allOrphanages.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setOrphanageList(orphanageData);
  };
  const getCampaigns = async () => {
    const allCampaigns = await getDocs(collection(db, "campaigns"));
    const campaignData = allCampaigns.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCampaignList(campaignData);
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
    getCampaigns();
  }, []);
  useEffect(() => {
    if (user) {
      const str = user?.displayName;
      setCapUsername(capitalize(str));
      getUser();
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
              <img
                width={"250px"}
                src={imglogo}
                alt="logo"
                className="logo-img"
              ></img>
            </div>

            <div className="header-icons">
              {user ? (
                <div>
                  <div className="dp-heading-font-family dashboard-user-welcome">
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
                <Link
                  to={"/forum"}
                  className="dp-heading-font-family dashboard-login-icon"
                >
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
                  <div>
                    <button
                      className="acc-icon"
                      type="button"
                      onClick={() => {
                        setUserMenu((prev) => !prev);
                      }}
                    >
                      <img width={"45px"} src={user?.photoURL} alt=""></img>
                    </button>

                    <div className={`acc-dpdown-${userMenu}`}>
                      <Link
                        className="orphanage-login-dpdown  dp-heading-font-family dpdown-margin"
                        to={"/todonate"}
                      >
                        <div> To Donate List</div>
                      </Link>
                      <Link
                        className="orphanage-login-dpdown  dp-heading-font-family "
                        to={"/create-forum"}
                      >
                        <div> Create Forum </div>
                      </Link>
                      <Link
                        className="orphanage-login-dpdown  dp-heading-font-family "
                        to={"/upload-user-profile-photo"}
                      >
                        <div> Update Profile Photo</div>
                      </Link>
                      {userInfo.userType == 12 ? (
                        <>
                          <Link
                            className="orphanage-login-dpdown  dp-heading-font-family "
                            to={
                              "/upload-orp-profile-photo/" +
                              userInfo.orphanageCreated
                            }
                          >
                            <div> Update Orphange Photo</div>
                          </Link>
                          <Link
                            className="orphanage-login-dpdown  dp-heading-font-family "
                            to={
                              "/orphanage-earnings/" + userInfo.orphanageCreated
                            }
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
                        className="orphanage-login-dpdown  dp-heading-font-family "
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
              <h3>Discover The World of Children In Need...</h3>
            </div>
            <OrphanageNews />
            <div className="nav-btn">
              <a href={"#orphanage-filter"} className="cssbuttons-io ">
                <div>Orphanages</div>
              </a>
              <a href="#campaigns" className="cssbuttons-io ">
                <div>Campaigns</div>
              </a>
            </div>
            <div id="orphanage-filter" className="search">
              <div className="filter-container">
                <FilterSvg h={"20px"} w={"20px"} />
              </div>
              <input
                type="search"
                placeholder="Filter By Address"
                className="se-input"
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
              ></input>
            </div>
            <div className="secone-div3">
              <div className="orphanages">
                {orphanageList
                  .filter((item) => {
                    return searchValue.toLowerCase() === ""
                      ? item
                      : item.address
                          .toLowerCase()
                          .includes(searchValue.toLocaleLowerCase());
                  })
                  .map((orpl) => (
                    <div className="orp-detailcard">
                      <div>
                        <Link
                          className="oprcard-head"
                          to={"orphanage/" + orpl.id}
                        >
                          <h3>{orpl.name}</h3>
                        </Link>

                        <div className="orp-bio">
                          {orpl.orphanage_biography}
                        </div>
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

                              const uploadToDonateList = async () => {
                                try {
                                  await setDoc(
                                    doc(db, "ToDonateList", user?.uid),
                                    { [orpl.id]: orpl.id },
                                    { merge: true }
                                  );
                                } catch (error) {
                                  switch (error.message) {
                                    case "Cannot read properties of undefined (reading 'indexOf')":
                                      navigate("/register");
                                      break;
                                    default:
                                      setButtonState(false);
                                  }
                                }
                                setButtonState(false);
                              };
                              uploadToDonateList();
                            }}
                            disabled={buttonState}
                          >
                            <span className="IconContainer">
                              <svg
                                fill="#000000"
                                height="18px"
                                width="18px"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                enable-background="new 0 0 512 512"
                                className="cart"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                <g id="SVGRepo_iconCarrier">
                                  <g>
                                    <g>
                                      <path d="M256,11C120.9,11,11,120.9,11,256s109.9,245,245,245s245-109.9,245-245S391.1,11,256,11z M256,460.2 c-112.6,0-204.2-91.6-204.2-204.2S143.4,51.8,256,51.8S460.2,143.4,460.2,256S368.6,460.2,256,460.2z" />
                                      <path d="m357.6,235.6h-81.2v-81.2c0-11.3-9.1-20.4-20.4-20.4-11.3,0-20.4,9.1-20.4,20.4v81.2h-81.2c-11.3,0-20.4,9.1-20.4,20.4s9.1,20.4 20.4,20.4h81.2v81.2c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-81.2h81.2c11.3,0 20.4-9.1 20.4-20.4s-9.1-20.4-20.4-20.4z" />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <p className="text">To-Donate List</p>
                          </button>
                        </div>
                        <div>
                          <button
                            className="CartBtn carbtn2"
                            onClick={() => {
                              navigate(
                                "/donation/" + orpl.id + "/" + orpl.name
                              );
                            }}
                            disabled={buttonState}
                          >
                            <span className="IconContainer">
                              <svg
                                fill="#000000"
                                height="20px"
                                width="20px"
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 300.346 300.346"
                                xmlSpace="preserve"
                                className="cart"
                              >
                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                                <g
                                  id="SVGRepo_tracerCarrier"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                <g id="SVGRepo_iconCarrier">
                                  <g>
                                    <g>
                                      <g>
                                        <path d="M296.725,153.904c-3.612-5.821-9.552-9.841-16.298-11.03c-6.753-1.189-13.704,0.559-19.14,4.835l-21.379,17.125 c-3.533-3.749-8.209-6.31-13.359-7.218c-6.746-1.189-13.703,0.559-19.1,4.805l-12.552,9.921h-32.236 c-5.152,0-10.302-1.238-14.892-3.579l-11.486-5.861c-9.678-4.937-20.537-7.327-31.385-6.908 c-15.046,0.579-29.449,6.497-40.554,16.666L2.455,229.328c-2.901,2.656-3.28,7.093-0.873,10.203l32.406,41.867 c1.481,1.913,3.714,2.933,5.983,2.933c1.374,0,2.762-0.374,4.003-1.151l38.971-24.37c2.776-1.736,5.974-2.654,9.249-2.654h90.429 c12.842,0,25.445-4.407,35.489-12.409l73.145-58.281C300.817,177.855,303.165,164.286,296.725,153.904z M216.812,174.294 c2.034-1.602,4.561-2.236,7.112-1.787c1.536,0.271,2.924,0.913,4.087,1.856l-12.645,10.129c-1.126-2.111-2.581-4.019-4.282-5.672 L216.812,174.294z M281.838,173.64l-73.147,58.282c-7.377,5.878-16.634,9.116-26.067,9.116H92.194 c-6.113,0-12.084,1.714-17.266,4.954l-33.17,20.743L17.799,235.78l56.755-51.969c8.468-7.753,19.45-12.267,30.924-12.708 c8.271-0.32,16.552,1.504,23.932,5.268l11.486,5.861c6.708,3.422,14.234,5.231,21.763,5.231h32.504 c4.278,0,7.757,3.48,7.757,7.758c0,4.105-3.21,7.507-7.308,7.745l-90.45,5.252c-4.169,0.242-7.352,3.817-7.11,7.985 c0.243,4.168,3.798,7.347,7.986,7.109l90.45-5.252c9.461-0.549,17.317-6.817,20.283-15.321l53.916-43.189 c2.036-1.602,4.566-2.237,7.114-1.787c2.551,0.449,4.708,1.909,6.074,4.111C286.277,165.745,285.402,170.801,281.838,173.64z" />
                                        <path d="M148.558,131.669c31.886,0,57.827-25.941,57.827-57.827s-25.941-57.827-57.827-57.827S90.731,41.955,90.731,73.842 S116.672,131.669,148.558,131.669z M148.558,31.135c23.549,0,42.707,19.159,42.707,42.707c0,23.549-19.159,42.707-42.707,42.707 c-23.549,0-42.707-19.159-42.707-42.707C105.851,50.293,125.01,31.135,148.558,31.135z" />
                                        <path d="M147.213,87.744c-2.24,0-4.618-0.546-6.698-1.538c-1.283-0.613-2.778-0.65-4.098-0.105 c-1.344,0.554-2.395,1.656-2.884,3.02l-0.204,0.569c-0.87,2.434,0.204,5.131,2.501,6.274c2.129,1.06,4.734,1.826,7.398,2.182 v2.162c0,2.813,2.289,5.101,5.171,5.101c2.814,0,5.102-2.289,5.102-5.101v-2.759c6.712-2.027,11.018-7.542,11.018-14.188 c0-9.156-6.754-13.085-12.625-15.479c-6.355-2.63-6.832-3.78-6.832-5.234c0-1.914,1.664-3.058,4.453-3.058 c2.043,0,3.883,0.366,5.63,1.121c1.273,0.549,2.682,0.553,3.966,0.009c1.28-0.543,2.297-1.599,2.79-2.901l0.204-0.541 c0.97-2.56-0.228-5.41-2.726-6.487c-1.676-0.723-3.51-1.229-5.46-1.508v-1.908c0-2.813-2.289-5.102-5.102-5.102 c-2.813,0-5.101,2.289-5.101,5.102v2.549c-6.511,1.969-10.53,7.12-10.53,13.561c0,8.421,6.76,12.208,13.342,14.789 c5.579,2.262,6.045,4.063,6.045,5.574C152.572,86.724,149.686,87.744,147.213,87.744z" />
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <p className="text">Donate</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="search search-2">
                <div className="filter-container">
                  <FilterSvg h={"20px"} w={"20px"} />
                </div>
                <input
                  type="search"
                  placeholder="Filter By Campaign Category"
                  className="se-input"
                  value={campaignFilter}
                  onChange={(event) => {
                    setCampaignFilter(event.target.value);
                  }}
                ></input>
              </div>
              <div id="campaigns" className="campaigns">
                {campaignList
                  ?.filter((item) => {
                    return campaignFilter.toLowerCase() === ""
                      ? item
                      : item.categoryTags
                          .toLowerCase()
                          .includes(campaignFilter.toLocaleLowerCase());
                  })
                  .map((camp) => (
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
                          <h5 className="cp-det-header">{camp.title}</h5>
                          <div className="campaign-card-bio">
                            {camp.description}
                          </div>
                        </div>
                        <div className="cp-det-btn">
                          <div>
                            <button
                              onClick={() => {
                                navigate(
                                  "/campaign-donation/" +
                                    camp.id +
                                    "/" +
                                    camp.title
                                );
                              }}
                              className="cpcd-dnt"
                            >
                              Donate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          <section className="section-two"></section>
        </div>
      )}
    </>
  );
}
