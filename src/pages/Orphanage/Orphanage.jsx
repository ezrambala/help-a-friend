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
          console.log(orphanageData.num_of_male_children);
          console.log(orphanageData.num_of_female_children);
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
              <Header userId={user?.uid} />

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
                        try {
                          setDoc(
                            doc(db, "ToDonateList", user?.uid),
                            { [orphanageId]: orphanageId },
                            { merge: true }
                          );
                        } catch (error) {
                          navigate("/register");
                        }
                      }}
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
                    <button className="CartBtn carbtn2">
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
