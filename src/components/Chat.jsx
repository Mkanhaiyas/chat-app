import React, { useContext, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
// import Cam from "../img/cam.png";
// import Add from "../img/add.png";
// import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [lang, setLang] = useState("en");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBackward = () => {
    navigate("/");
  };

  const handleChange = async () => {
    try {
      await updateDoc(doc(db, "users", currentUser.uid), { language: lang });
      alert("Set Successfully");
      // const colRef = collection(db, "users");
      // const snapshots = await getDocs(colRef);
      // const docs = snapshots.docs.map((doc) => doc.data());
      // console.log(docs);
      // getDoc(doc(db, "users", "HWgTzRiQfuXAkpkJyXJyMbG9fl72")).then(
      //   (docData) => {
      //     if (docData.exists()) {
      //       console.log(docData.data());
      //     }
      //   }
      // );
      //console.log(Info.data());
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
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" /> */}
          <select name="Language" onChange={(e) => setLang(e.target.value)}>
            <option value="hi">Hindi</option>
            <option value="en">English</option>
            <option value="zh-Hans">Chinese</option>
          </select>
          <button onClick={handleChange}>
            <CheckCircleIcon />
          </button>
        </div>
      </div>
      <Messages />
      <Input language={lang} />
    </div>
  );
};

export default Chat;
