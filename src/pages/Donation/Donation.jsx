import React from "react";
import "./donation.css";
import imgbanner from "../../images/help-a-friend-banner.png";
import imglogo from "../../images/logo.png";
import DonateSvg from "../../svg/DonateSvg";
import ChatsvgGreen from "../../svg/ChatsvgGreen";
import UserIcon from "../../svg/UserIcon";

export default function Donation() {
  return (
    <div className="donation-page-container">
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
      <div className="dp-main-section">
        <div className="dp-section-one">
          <div className="dp-haf-img">
            <img
              width={"350px"}
              height={"350px"}
              src={imgbanner}
              alt="Hey Now"
            ></img>
          </div>
          <div className="dp-haf-bio dp-heading-font-family">
            Help a Friend, a compassionate initiative dedicated to supporting
            orphanages in our local community. At Help a Friend, we believe in
            the power of collective kindness to make a significant impact in the
            lives of those in need.
          </div>
        </div>
        <div className="dp-section-two">
          <h2 className="dp-heading-font-family">Donate Now</h2>
          <h5 className="dp-heading-font-family dashed-border">
            One Time Payment
          </h5>
          <h5 className="dp-heading-font-family">Orphanage</h5>
          <input className="dp-input" value={"Children Of Gwarinpa"}></input>
          <h5 className="dp-heading-font-family">Enter the Donation Amount</h5>
          <input
            className="dp-input"
            type="number"
            placeholder="#30,000"
          ></input>
          <input
            className="dp-heading-font-family dp-submit"
            type="submit"
            value={"Help A Friend"}
          ></input>
        </div>
      </div>
    </div>
  );
}
