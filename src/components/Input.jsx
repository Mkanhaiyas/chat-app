import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [img, setImg] = useState(null);
  const { data } = useContext(ChatContext);
  const [mess, setMess] = useState([]);
  const currentUser = useRef(useContext(AuthContext));
  const User = data.chatId.split("_");
  const Lang = currentUser.current.currentUser.uid;

  useEffect(() => {
    const User = data.chatId.split("_");
    const Lang = currentUser.current.currentUser.uid;
    const Compare = User[0] === Lang ? User[1] : User[0];
    console.log(Compare);
    const unSub = onSnapshot(doc(db, "users", Compare), (doc) => {
      doc.exists() && setMess(doc.data());
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);
  const lag = mess.language;
  console.log(lag);

  const data1 = async () => {
    try {
      const options = {
        method: "POST",
        url: "https://microsoft-translator-text.p.rapidapi.com/translate",
        params: {
          "to[0]": lag,
          "api-version": "3.0",
          profanityAction: "NoAction",
          textType: "plain",
        },
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key":
            "d3f2a73630msh77a72c11fa67812p192a81jsnfac40ec223e3",
          "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
        },
        data: [
          {
            Text: text1,
          },
        ],
      };

      console.log(text1);

      const response1 = await axios.request(options);
      setText2(response1.data[0].translations[0].text);
      console.log(text2);
    } catch (error) {
      // Handle the error here
      console.error("An error occurred:", error);

      // You might want to set a default value or take other actions in case of an error
      setText2("Translation Error");
    }
  };

  data1();

  const handleSend = async (e) => {
    e.preventDefault();

    if (img) {
      const storageRef = ref(storage, uuid());

      try {
        await uploadBytesResumable(storageRef, img);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            user1: User[0],
            user2: User[1],
            text1: User[0] === Lang ? text1 : text2,
            text2: User[0] === Lang ? text2 : text1,
            senderId: currentUser.current.currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          user1: User[0],
          user2: User[1],
          text1: User[0] === Lang ? text1 : text2,
          text2: User[0] === Lang ? text2 : text1,
          senderId: currentUser.current.currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.current.currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text1,
      },
      [data.chatId + ".date"]: serverTimestamp(),
      // [data.chatId + ".userInfo.language"]: props.language,
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text1,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText1("");
    setImg(null);
  };
  return (
    <div className="input">
      <MicIcon style={{ color: "white", cursor: "pointer" }} />
      <input
        type="file"
        style={{ display: "none" }}
        id="file"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <input
        className="text-message"
        type="text"
        placeholder="Type something..."
        onChange={(e) => {
          setText1(e.target.value);
        }}
        value={text1}
      />
      <div className="send">
        <label htmlFor="file" style={{ marginLeft: "20px", cursor: "pointer" }}>
          <AddPhotoAlternateOutlinedIcon style={{ color: "white" }} />
        </label>
        <button /*onClick={handleSend}*/>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Input;
