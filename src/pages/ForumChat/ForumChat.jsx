import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import Header from "../../components/Header";
import "./forumchat.css";
import SendMessageChat from "../../svg/SendMessageSvg";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  serverTimestamp,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";

export default function ForumChat() {
  const [user, setUser] = useState(null);
  const [messageList, setMessageList] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const forumId = params.forumid
  const userId = user?.uid;
  const userPhoto = user?.photoURL;
  const [formInfo, setFormInfo] = useState({
    text: "",
  });
  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log(firebaseUser);
        setUser(firebaseUser);
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    const getMessageRef = query(
      collection(db, "forums"+forumId+"/chats"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const unsubscribe = onSnapshot(getMessageRef, async (querySnapshot) => {
      console.log(querySnapshot);
      const allMessages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessageList(allMessages);
    });

    return () => unsubscribe();
  }, []);

  const uploadMessage = async (event) => {
    event.preventDefault();
    if (formInfo.text !== "") {
      const newForminfo = formInfo.text;
      formInfo.text = "";
      await addDoc(collection(db, "forums/raPL1WmqIjG6d94xgvjr/chats"), {
        message: newForminfo,
        user_id: userId,
        user_photo: userPhoto,
        user_name: user?.displayName,
        createdAt: serverTimestamp(),
      })
        .then(() => {})
        .catch((error) => {});
    }else{
      alert("YOU CANT SEND EMPTY TEXTS!!!!!!!!!!!!!!!!!!!")
    }
  };

  return (
    <div className="forum-chat-container">
      <Header userId={user?.uid} />
      <div className="chat-box">
        {messageList?.map((msg) => {
          const textBoxcss = msg.user_id == userId ? "user" : "sender";

          return (
            <div>
              <div className={`${textBoxcss}-text-box-container`}>
                <div className={`${textBoxcss}-text-box`}>
                  <div className="text-message">{msg.message}</div>
                  <div className="text-box-sender-info dp-heading-font-family">
                    By: {msg.user_name}
                    <div className="text-box-user-img">
                      <img width={"22px"} src={msg.user_photo} alt=""></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form className="forum-chatform" onSubmit={uploadMessage}>
        <input
          value={formInfo.text}
          onChange={(event) => {
            setFormInfo((prevFormInfo) => ({
              ...prevFormInfo,
              text: event.target.value,
            }));
          }}
          className="chat-input"
          type="textarea"
        ></input>
        <button className="send-chat-button">
          <SendMessageChat height={"18px"} width={"18px"} />
        </button>
      </form>
    </div>
  );
}
