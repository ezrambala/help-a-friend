import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { db , auth} from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"
import Spinner from "../../components/Spinner";
import "./forum.css";
export default function Forum() {
  const [user, setUser] = useState(null);
  const [forumList, setForumList] = useState(null)
  const navigate = useNavigate();


  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    getForums();
  }, []);

  const getForums = async () => {
    const allForums = await getDocs(collection(db, "forums"));
    const ForumData = allForums.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setForumList(ForumData);
  };

if (!user || !forumList){return <Spinner/>}

  return (
    <div className="forum-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL}/>
      <div className="forum-page-heading">
        <h3 className="dp-heading-font-family">Welcom To Our Forum</h3>
      </div>

      <div className="forum-list">
      {forumList?.map((forum) => (
        <div className="forum-card">
          <div>
            <div className="forum-card-image">
              <img src={forum.photoUrl} alt=""></img>
            </div>
          </div>
          <div className="forum-card-sec-two">
            <Link to={"/forumchat/" + forum.id} className="forum-card-title dp-heading-font-family">
              <h8>
                {forum.name}
              </h8>
            </Link>
            <div className="forum-creator-tags dp-heading-font-family">
              <div className="forum-ct-one">
                <div>Created By:</div>
                <div> {forum.creatorDisplayName}</div>
                <div className="forum-tag-img">
                  <img width={"32px"} src={forum.creatorUrl} alt=""></img>
                </div>
              </div>
              <div  className="forum-ct-two"> 
                <div>150 Members</div>
                <button className="forum-card-button">JOIN</button>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
