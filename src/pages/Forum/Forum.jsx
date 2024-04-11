import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { db , auth} from "../../firebase/config";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"
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

  // useEffect(() => {
  //   getForums();
  // }, []);

  const getForums = async () => {
    const allForums = await getDocs(collection(db, "forums"));
    const ForumData = allForums.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setForumList(ForumData);
  };



  return (
    <div className="forum-container">
      <Header />
      <div className="forum-page-heading">
        <h3 className="dp-heading-font-family">Welcom To Our Forum</h3>
      </div>

      <div className="forum-list">
      {forumList.map((forum) => (
        <div className="forum-card">
          <div>
            <div className="forum-card-image">
              <img src="https://media.istockphoto.com/id/1162593060/vector/diverse-people-team-with-social-chat-bubbles.jpg?s=612x612&w=0&k=20&c=kGsZHfA5QhB4vkZPB2DX-m2MPu0V-3mqVXPABQk5ZVA=" alt=""></img>
            </div>
          </div>
          <div className="forum-card-sec-two">
            <div className="forum-card-title dp-heading-font-family">
              <h8>
                {forum.name}
              </h8>
            </div>
            <div className="forum-creator-tags dp-heading-font-family">
              <div className="forum-ct-one">
                <div>Created By:</div>
                <di> {forum.creatorDisplayName}</di>
                <div className="forum-tag-img">
                  <img src="" alt=""></img>
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
