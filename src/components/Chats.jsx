import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [status, setStatus] = useState(window.innerWidth);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const navigate = useNavigate();

  const handleResize = () => {
    setStatus(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          if (doc.exists()) {
            setChats(doc.data());
          } else {
            console.error("Document does not exist");
          }
        },
        (error) => {
          console.error("Error getting document:", error);
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    status <= 768 ? navigate("/chat") : navigate("/");
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => {
              handleSelect(chat[1].userInfo);
            }}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
