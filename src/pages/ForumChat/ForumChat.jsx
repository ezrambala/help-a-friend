import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import Header from "../../components/Header";
import "./forumchat.css";
import SendMessageChat from "../../svg/SendMessageSvg";
import Menusvg from "../../svg/Menusvg";
import Closesvg from "../../svg/Closesvg";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
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
  const [forumList, setForumList] = useState(null);
  const [testConnection, setTestConnection] = useState(false);
  const [buttonState, setButtonState] = useState(false);
  const [description, showDescription] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const forumId = params.forumid;
  const userId = user?.uid;
  const userPhoto = user?.photoURL;
  const userDisplayName = user?.displayName;
  const [formInfo, setFormInfo] = useState({
    text: "",
  });

  useEffect(() => {
    const getForum = async () => {
      try {
        const forum = await getDoc(doc(db, "forums", forumId));
        if (forum.exists()) {
          const forumData = forum.data();
          setForumList(forumData);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching orphanages:", error);
        setTestConnection(true);
      }
    };
    getForum();
  }, []);
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
      collection(db, "forums/" + forumId + "/chats"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(getMessageRef, async (querySnapshot) => {
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
      await addDoc(collection(db, "forums/" + forumId + "/chats"), {
        message: newForminfo,
        user_id: userId,
        user_photo: userPhoto,
        user_name: userDisplayName,
        createdAt: serverTimestamp(),
      })
        .then(() => {})
        .catch((error) => {});
    } else {
      alert("YOU CANT SEND EMPTY TEXTS!!!!!!!!!!!!!!!!!!!");
    }
  };
  if (!forumList) {
    return <Spinner />;
  }
  return (
    <div className="forum-chat-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
      {description ? (
        <div className="forum-chat-info-blocks">
          <div
            className="fcib-close"
            onClick={() => {
              showDescription(false);
            }}
          >
            <div className="fcib-close2">
              <Closesvg height={"28px"} width={"28px"}/>
            </div>
          </div>
          <div>
            <div className="forum-description dp-heading-font-family">
              <h5>Forum Description</h5>
              <div className="forum-description-text">
                {forumList.description}


              </div>
            </div>
          </div>
          <div>
            <div className="forum-rules forum-description dp-heading-font-family">
              <h5>Forum Rules!!!!</h5>
              <div className="forum-description-text">
                <ol>
                  <li>Do not be PRINCEWILL</li>
                  <li>
                    Do not use this platform for any other purpose than helping
                    orphans and children homes
                  </li>
                  <li>Do not use PROFAINE LANGUAGE or you will be BANNED</li>
                  <li>Do not spam the chat or else you will be BANNED</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

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
        <div
          onClick={() => {
            showDescription((prevSDes) => !prevSDes);
          }}
          className="forum-description-toggle send-chat-button "
        >
          <Menusvg height={"18px"} width={"18px"} />
        </div>
      </form>
    </div>
  );
}
