import React from "react";
import { Link } from "react-router-dom";
import ChatsvgGreen from "../svg/ChatsvgGreen";
import UserIcon from "../svg/UserIcon";
import imglogo from "../images/logo.png";

export default function Header({ userId }) {
  return (
    <div className="two-header">
      <div className="two-logo">
        <img src={imglogo} alt="logo" className="two-logo-img"></img>
      </div>

      <div className="two-header-icons">
        <div>
          <Link
            to={"/login"}
            className="orphanage-login-icon dp-heading-font-family"
          >
            LOGIN
          </Link>
        </div>

        <div>
          <Link
            to={"/register"}
            className="orphanage-login-icon dp-heading-font-family"
          >
            SIGN-UP
          </Link>
        </div>

        <div>
          {/* <ChatsvgGreen height={"44px"} width={"44px"} /> */}
          <Link
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
              <Link className="orphanage-login-dpdown  dp-heading-font-family" to={"/todonate/" + userId}>
                To Donate List
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
