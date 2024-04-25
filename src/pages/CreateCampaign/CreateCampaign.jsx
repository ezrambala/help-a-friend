import React, { useEffect, useState } from "react";
import "./createcampaign.css";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Spinner from "../../components/Spinner";

export default function CreateCampaign() {
  const [spinner, setSpinner] = useState(false);
  const [tags, setTags] = useState([
    { value: "Food" },
    { value: "Shelter" },
    { value: "Education" },
    { value: "Health" },
    { value: "Sanitation" },
    { value: "Clothing" },
  ]);
  const [catergory, setCategory] = useState({
    Food: false,
    Shelter: false,
    Education: false,
    Health: false,
    Sanitation: false,
    Clothing: false,
  });
  const [selectedTags, setSelectedTags] = useState({
    valueString: "",
  });
  const [formInfo, setFormInfo] = useState({
    title: "",
    description: "",
    locationBased: "",
    generalBased: false,
  });
  const [showLocationInput, setShowLocationInput] = useState(false);
  useEffect(() => {
    const categoryArray = Object.entries(catergory).map(([cat, value]) => ({
      name: cat,
      value: value,
    }));
    categoryArray.map((cate) => {
      if (cate.value) {
        if (
          selectedTags.valueString
            .toLowerCase()
            .includes(cate.name.toLowerCase())
        ) {
        } else {
          setSelectedTags((prev) => ({
            valueString: prev.valueString + cate.name.toLowerCase() + ",",
          }));
        }
      }
      if (!cate.value) {
        if (
          selectedTags.valueString
            .toLowerCase()
            .includes(cate.name.toLowerCase())
        ) {
          setSelectedTags((prev) => ({
            valueString: prev.valueString.replace(
              cate.name.toLowerCase() + ",",
              ""
            ),
          }));
        }
      }
    });
  }, [catergory]);

  async function handleSubmit(event) {
    setSpinner(true);
    event.preventDefault();
    if (formInfo.generalBased || formInfo.locationBased.length > 0) {
      if (selectedTags.valueString.length > 0) {
        await addDoc(collection(db, "campaigns"), {
          title: formInfo.title,
          description: formInfo.description,
          locationBasis: formInfo.locationBased,
          generalBasis: formInfo.generalBased,
          categoryTags: selectedTags.valueString,
          createdAt: serverTimestamp(),
        }).then(() => {
          setSpinner(false);
          alert("created succefully");
          setFormInfo({
            title: "",
            description: "",
            locationBased: "",
            generalBased: false,
          });
          setSelectedTags({
            valueString:"",
          })
        });
      } else {
        setSpinner(false);
        alert("enter at least one tag");
      }
    } else {
      setSpinner(false);
      alert("select between general or location based");
    }
  }
  if (spinner) {
    return <Spinner />;
  }

  return (
    <div className="create-campaign-container">
      <div className="create-campaign-header">
        <h3>Create Campaign</h3>
      </div>
      <div className="create-camapaign-info">
        Campaigns are created for the purpose of helping orphanages collectively
        solve a particular issue on a scale. An example would be creating a
        campiagn to assist a group of orphanages in Katampe to access better
        Health Care.
      </div>
      <form className="create-campaign-form" onSubmit={handleSubmit}>
        <div>Title</div>
        <input
          type="text"
          value={formInfo.title}
          placeholder="Education For The Homes in Gwarinpa"
          required
          onChange={(event) => {
            setFormInfo((prev) => ({
              ...prev,
              title: event.target.value,
            }));
          }}
        ></input>
        <div>Description</div>
        <textarea
          className="form-description"
          rows="6"
          type="text"
          placeholder="Education For The Homes in Gwarinpa"
          required
          value={formInfo.description}
          onChange={(event) => {
            setFormInfo((prev) => ({
              ...prev,
              description: event.target.value,
            }));
          }}
        ></textarea>
        <div className="campaign-tags">
          <h5>Campaign Tags</h5>
          <div className="campaign-tag-description">
            This tags will make your campaigns visibile under different
            Categories. Use Tags that Pertain to Your campaign purpose. Click on
            these different categories to add or remove them.
          </div>
          <div className="campaign-tag-box">
            {tags.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="campaign-tag-selector"
                  onClick={() => {
                    setCategory((prev) => ({
                      ...prev,
                      [tag.value]: !prev[tag.value],
                    }));
                  }}
                >
                  {tag.value}
                </div>
              );
            })}
          </div>
          <input
            className="tag-display"
            value={selectedTags.valueString}
            readOnly
          ></input>
        </div>
        <input
          type="radio"
          id="location-based"
          name="basis"
          value="Location Based"
          onChange={(event) => {
            setShowLocationInput(true);
            setFormInfo((prev) => ({
              ...prev,
              generalBased: false,
            }));
          }}
        ></input>
        <label className="create-campaign-radio-btnn" for="location-based">
          Location Based
        </label>
        <input
          type="radio"
          id="all-orphanages"
          name="basis"
          value="All Orphanages"
          onChange={(event) => {
            setShowLocationInput(false);
            setFormInfo((prev) => ({
              ...prev,
              generalBased: true,
              locationBased: "",
            }));
          }}
        ></input>
        <label className="create-campaign-radio-btnn" for="all-orphanages">
          All Orphanages
        </label>
        <br></br>
        {showLocationInput ? (
          <>
            <input
              placeholder="Enter Region or Location"
              value={formInfo.locationBased}
              onChange={(event) => {
                setFormInfo((prev) => ({
                  ...prev,
                  locationBased: event.target.value,
                }));
              }}
            ></input>
            <br></br>
          </>
        ) : (
          <></>
        )}
        <button type="submit" className="create-cam-form-submit">
          Submit
        </button>
      </form>
    </div>
  );
}
