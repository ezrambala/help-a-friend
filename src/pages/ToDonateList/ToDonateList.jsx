import React, { useEffect, useState } from "react";
import "./todonatelist.css";
import ChatsvgGreen from "../../svg/ChatsvgGreen";
import UserIcon from "../../svg/UserIcon";
import imglogo from "../../images/logo.png";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ToDonateList() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userid;

  const [toDonateList, setToDonateList] = useState(null);
  const [orphanageList, setOrphanageList] = useState(null);
  const getToDonateList = async () => {
    const ToDonate = await getDoc(doc(db, "ToDonateList", userId));
    if (ToDonate.exists()) {
      const ToDonateData = [ToDonate.data()];
      setToDonateList(ToDonateData);
      console.log(ToDonateData);
      const orphanageData = ToDonateData.map((orpl) => {
        console.log("wee");
      });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getToDonateList();
  }, []);

  return (
    <div className="tdl-page-container">
      <div className="two-header">
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
      </div>

      <div className="tdl-section-one">
        <div>
          <h2 className="tdl-page-heading">Hey Ezra</h2>
        </div>
        <div>
          <h3 className="dp-heading-font-family">Your To-Donate List</h3>
          <h6 className="dp-heading-font-family">
            This is a Bookmark of all the orphanages you wish To-Donate To
          </h6>
        </div>
        <div className="tdl-card">
          <div className="to-donate-to">
            <h5 className="tdl-card-numbering dp-heading-font-family">1</h5>
            <div className="tdt-content">
              <h4>Light Of Lugbe</h4>
              <div>Address</div>
            </div>
            <div className="tdt-content-two">
              <div className="tdt-link">Donate</div>
              <div className="tdt-link">Remove</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
