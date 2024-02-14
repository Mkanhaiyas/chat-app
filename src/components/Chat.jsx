import React, { useContext, useState, useRef, useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TranslateIcon from "@mui/icons-material/Translate";
import { useNavigate } from "react-router-dom";
import Messages from "./Messages";
import Input from "./Input";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [lang, setLang] = useState("en");
  const [toggle, setToggle] = useState(false);
  const currentUser = useRef(useContext(AuthContext));
  const Lang = currentUser.current.currentUser.uid;
  const navigate = useNavigate();

  const handleBackward = () => {
    navigate("/");
  };

  useEffect(() => {
    const updateLanguage = async () => {
      try {
        const docData = await getDoc(doc(db, "users", Lang));
        if (docData.exists()) {
          if (docData.data().language === "en") setLang("English");
          else if (docData.data().language === "hi") setLang("Hindi");
          else if (docData.data().language === "mr") setLang("Marathi");
          else setLang("Chinese");
        }
      } catch (error) {
        console.log(error);
      }
    };

    updateLanguage();
  }, [Lang]);

  const handleLanguage = async (data) => {
    try {
      setToggle(false);
      const getdata = data;
      await updateDoc(doc(db, "users", Lang), { language: getdata });
      alert("Set Successfully");
      await getDoc(doc(db, "users", Lang)).then((docData) => {
        if (docData.exists()) {
          if (docData.data().language === "en") setLang("English");
          else if (docData.data().language === "hi") setLang("Hindi");
          else if (docData.data().language === "mr") setLang("Marathi");
          else setLang("Chinese");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="photoid">
          <span className="back-button" onClick={handleBackward}>
            <KeyboardBackspaceIcon />
          </span>
          <img src={data.user?.photoURL} alt="" />
          <span>{data.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <span>{lang}</span>
          <div className="set_language">
            <TranslateIcon
              onClick={() => {
                setToggle(!toggle);
              }}
            />
            <div
              className="choose_language"
              style={toggle ? { display: "block" } : { display: "none" }}
            >
              <div
                className="specific-lan"
                onClick={() => handleLanguage("en")}
                value="en"
              >
                English
              </div>
              <div
                className="specific-lan"
                onClick={() => handleLanguage("hi")}
                value="hi"
              >
                Hindi
              </div>
              <div
                className="specific-lan"
                onClick={() => handleLanguage("mr")}
                value="mr"
              >
                Marathi
              </div>
              <div
                className="specific-lan"
                onClick={() => handleLanguage("zh-Hans")}
                value="zh-Hans"
              >
                Chinese
              </div>
            </div>
          </div>
        </div>
      </div>

      <Messages />
      <Input language={lang} />
    </div>
  );
};

export default Chat;
