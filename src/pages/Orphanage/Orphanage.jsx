import React, { useEffect, useState } from "react";
import "./Orphanage.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import orpimage from "../../images/NIGERIA-SCHOOL-ORPHANS.jpg";
import { Chart } from "react-google-charts";
import ExcSvg from "../../svg/ExcSvg";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import CheckConnection from "../../components/CheckConnection";
import PhoneIcon from "../../svg/PhoneIcon";
import EmailIcon from "../../svg/EmailIcon";

export default function Orphanage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const orphanageId = params.orphanageid;
  const [orphanageList, setOrphanageList] = useState(null);
  const [pieChartInfo, setPieChartInfo] = useState(null);
  const [testConnection, setTestConnection] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [imgSrc, setImgSrc] = useState(orpimage);
  console.log("this is the params" + orphanageId);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log(firebaseUser);
      setUser(firebaseUser);
    });
  }, []);

  useEffect(() => {
    const getOrphanages = async () => {
      try {
        console.log("getting orphanageList...");
        const allOrphanages = await getDoc(doc(db, "orphanages", orphanageId));
        if (allOrphanages.exists()) {
          const orphanageData = allOrphanages.data();
          if (orphanageData.orphanage_profile_photo) {
            setImgSrc(orphanageData.orphanage_profile_photo);
          }
          setPieChartInfo([
            ["Task", "Hours per Day"],
            ["Boys", orphanageData.num_of_male_children],
            ["Girls", orphanageData.num_of_female_children],
          ]);
          setOrphanageList(orphanageData);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching orphanages:", error);
        setTestConnection(true);
      }
    };
    getOrphanages();
  }, []);

  const optionsChart = {
    title: "Gender Distribution",
    is3D: true,
  };

  function pageReload() {
    setTimeout(() => {
      window.location.reload();
    }, 17000);
  }

  return (
    <>
      {testConnection ? (
        <>
          <CheckConnection />
          {pageReload()}
        </>
      ) : (
        <>
          {!pieChartInfo ? (
            <Spinner />
          ) : (
            <div className="two-pagecontent">
              <Header userId={user?.uid} userPhotoURL={user?.photoURL} />

              <section className="two-section-one">
                <div className="two-secone-divone">
                  <div>
                    <div className="two-orp-img">
                      <img src={imgSrc} alt="no imge"></img>
                    </div>
                  </div>
                  <div className="two-about-orp">
                    <div className="two-abt-orp-mesh">
                      <h2 className="two-orp-name">{orphanageList.name}</h2>
                      <h4 className="two-orp-abt">About</h4>
                      <div className="two-orp-bio">
                        {orphanageList.orphanage_biography}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="two-orp-sec-one-btn">
                  <div>
                    <button
                      className="CartBtn"
                      onClick={() => {
                        setButtonState(true);
                        try {
                          const uploadToDonateList = async () => {
                            await setDoc(
                              doc(db, "ToDonateList", user?.uid),
                              { [orphanageId]: orphanageId },
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
                          <g id="SVGRepo_bgCarrier" stroke-width="0" />

                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
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
                        navigate("/donation/" + orphanageId + "/" + orphanageList.name);
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
                          <g id="SVGRepo_bgCarrier" stroke-width="0" />

                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
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
                <div className="two-orp-details">
                  <div className="two-orp-address">
                    {orphanageList.address}
                    <ExcSvg />
                  </div>
                  <a
                    href={"mailto:" + orphanageList.email}
                    className="two-orp-address link-removal-style"
                  >
                    {orphanageList.email}
                    <EmailIcon />
                  </a>
                  <div className="two-orp-address ">
                    {orphanageList.phone_number}
                    <PhoneIcon />
                  </div>
                  <div className="two-res-no">
                    {orphanageList.num_of_residents} Residents!
                  </div>
                </div>
              </section>

              <section className="two-section-two">
                <div>
                  {orphanageList.orphanage_photos && (
                    <h2 className="header-two-font">Photos</h2>
                  )}

                  <div className="two-orp-img-list">
                    {orphanageList.orphanage_photos &&
                      Object.values(orphanageList.orphanage_photos).map(
                        (photos) => (
                          <div>
                            <div className="two-orp-img-one">
                              <img
                                width="600px"
                                alt={photos}
                                src={photos}
                              ></img>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </div>
                <div>
                  <h2 className="header-two-font">Living Conditions</h2>
                  <div className="liv-cn-gender-dis">
                    <div className="back-logo-image">
                      <div className="orp-living-con">
                        {orphanageList.living_condition}
                      </div>
                    </div>
                    <div className="gender-distribution">
                      <Chart
                        chartType="PieChart"
                        data={pieChartInfo}
                        options={optionsChart}
                        width={"500px"}
                        height={"300px"}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="header-two-font">Special Needs Cases</h2>
                  <div className="back-logo-image">
                    <div className="orp-spe-needs">
                      {orphanageList.special_needs_description}
                    </div>
                  </div>
                </div>
                <h2 className="header-two-font">Campaigns</h2>
                <div></div>
              </section>
            </div>
          )}
        </>
      )}
    </>
  );
}
