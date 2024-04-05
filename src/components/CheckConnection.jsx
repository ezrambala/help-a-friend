import React from "react";
import { Detector } from "react-detect-offline";
import { HashLoader } from "react-spinners";
import { useState } from "react";

const CheckConnection = (props) => {
  let [color, setColor] = useState("#688865");
  const smiley = "=(";
  return (
    <>
      <Detector
        render={({ online }) =>
          online ? (
            props.children
          ) : (
            <div className="spinner-container">
              <div className="spinner-content">
                <h3
                  style={{ color: color }}
                  className="spinner-header dp-heading-font-family"
                >
                  No Connection... Friend {smiley}
                </h3>
                <HashLoader color={color} size={"300px"} />
                <div style={{ marginLeft: "500px" }} className="spinner-tsec">
                  <div
                    style={{ color: color }}
                    className=" dp-heading-font-family tsechead"
                  >
                    Change Color:
                  </div>
                  <input
                    style={{ marginLeft: "10px" }}
                    value={color}
                    type="color"
                    onChange={(input) => setColor(input.target.value)}
                    placeholder="Color of the loader"
                  ></input>
                </div>
              </div>
            </div>
          )
        }
      />
    </>
  );
};

export default CheckConnection;
