import React, { useEffect, useState } from "react";
import "./Orphanage.css";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import orpimage from "../../images/NIGERIA-SCHOOL-ORPHANS.jpg";
import { Chart } from "react-google-charts";
import ExcSvg from "../../svg/ExcSvg";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function Orphanage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const orphanageId = params.orphanageid;
  console.log("this is the params" + orphanageId);

  const [orphanageList, setOrphanageList] = useState(null);
  const [pieChartInfo, setPieChartInfo] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      console.log(firebaseUser);
      setUser(firebaseUser);
    });
  }, []);

  const getOrphanages = async () => {
    console.log("getting orphanageList...");

    const allOrphanages = await getDoc(doc(db, "orphanages", orphanageId));
    if (allOrphanages.exists()) {
      const orphanageData = allOrphanages.data();
      console.log(orphanageData.num_of_male_children);
      console.log(orphanageData.num_of_female_children);
      setPieChartInfo([
        ["Task", "Hours per Day"],
        ["Boys", orphanageData.num_of_male_children],
        ["Girls", orphanageData.num_of_female_children],
      ]);
      setOrphanageList(orphanageData);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getOrphanages();
    // console.log("hello");
  }, []);

  const optionsChart = {
    title: "Gender Distribution",
    is3D: true,
  };

  if (!pieChartInfo) return <Spinner />;

  return (
    <div className="two-pagecontent">
      {/* <div className="two-header">
        <div className="two-logo">
          <img src={imglogo} alt="logo" className="two-logo-img"></img>
        </div>

        <div className="two-header-icons">
          <div>
            <div className="orphanage-login-icon dp-heading-font-family">
              LOGIN
            </div>
          </div>

          <div>
            <div className="orphanage-login-icon dp-heading-font-family">
              SIGN-UP
            </div>
          </div>

          <div>
            <ChatsvgGreen height={"44px"} width={"44px"} />
          </div>

          <div>
            <div className="orphanage-login-icon dp-heading-font-family">
              DONATE
            </div>
          </div>

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
                <UserIcon width={"34px"} height={"34px"} />
              </button>
              <div
                className="dropdown-menu acc-dpdown"
                aria-labelledby="dropdownMenuButton"
              >
                <a className="dropdown-item" href="">
                  Action
                </a>
                <a className="dropdown-item" href="">
                  Another action
                </a>
                <a className="dropdown-item" href="">
                  Something else here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <Header userId={user?.uid}/>

      <section className="two-section-one">
        <div className="two-secone-divone">
          <div>
            <div className="two-orp-img">
              <img src={orpimage} alt=""></img>
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
        <div className="two-orp-details">
          <div className="two-orp-address">
            {orphanageList.address}
            <ExcSvg />
          </div>
          <div className="two-res-no">
            {orphanageList.num_of_residents} Residents!
          </div>
        </div>
      </section>

      <section className="two-section-two">
        <div>
          <h2 className="header-two-font">Photos</h2>
          <div className="two-orp-img-list">
            <div>
              <div className="two-orp-img-one">
                <img width="600px" alt={orpimage} src={orpimage}></img>
              </div>
            </div>
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
  );
}
