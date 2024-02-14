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
  getDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Input = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [img, setImg] = useState(null);
  const { data } = useContext(ChatContext);
  const [mess, setMess] = useState("en");
  const [currLang, setCurrLang] = useState("en");
  const currentUser = useRef(useContext(AuthContext));
  const User = data.chatId.split("_");
  const Lang = currentUser.current.currentUser.uid;
  const ChatBot = `Cnl7m6MFDcUpzFKqAM1kOcc2BUw2`;
  const uploadProgress = document.getElementById("uploadProgress");
  const Compare = User[0] === Lang ? User[1] : User[0];
  const MicStyleOn = {
    color: "white",
    cursor: "pointer",
    backgroundColor: "red",
    padding: "0.5rem",
    borderRadius: "50%",
  };
  const MicStyle = {
    color: "white",
    cursor: "pointer",
    padding: "0.5rem",
  };
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert("Browser doesn't support speech recognition");
  }

  useEffect(() => {
    setText1(transcript);
  }, [listening]);

  const record = async () => {
    await getDoc(doc(db, "users", Lang)).then((docData) => {
      if (docData.exists()) {
        setCurrLang(docData.data().language);
      }
    });
    SpeechRecognition.startListening({ language: currLang });
  };

  useEffect(() => {
    const User = data.chatId.split("_");
    const Lang = currentUser.current.currentUser.uid;
    const Compare = User[0] === Lang ? User[1] : User[0];
    const unSub = onSnapshot(doc(db, "users", Compare), (doc) => {
      doc.exists() && setMess(doc.data().language);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  const data1 = async () => {
    try {
      if (text1 !== null) {
        const options = {
          method: "POST",
          url: "https://microsoft-translator-text.p.rapidapi.com/translate",
          params: {
            "to[0]": mess,
            "api-version": "3.0",
            profanityAction: "NoAction",
            textType: "plain",
          },
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "d3f2a73630msh77a72c11fa67812p192a81jsnfac40ec223e3", //9faa440e04msh2376eafc3338da7p1596e9jsn67a9be944760
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
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setText2("Translation Error");
    }
  };

  data1();

  const handleSend = async (e) => {
    e.preventDefault();

    if (text1 !== null && Compare === ChatBot) {
      const chatbot = async () => {
        const response = await axios.get(
          `http://localhost:5000/message/${text1}`
        );

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            user1: User[0],
            user2: User[1],
            text1: response.data,
            text2: response.data,
            senderId: Compare,
            date: Timestamp.now(),
          }),
        });
      };
      chatbot();
    }

    if (img) {
      const storageRef = ref(storage, uuid());
      try {
        uploadBytesResumable(storageRef, img).on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.style.display = "block";
            uploadProgress.value = progress;
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            console.log("Image uploaded successfully");
            uploadProgress.style.display = "none";
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
          }
        );
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
      <MicIcon style={listening ? MicStyleOn : MicStyle} onClick={record} />
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
        <progress
          id="uploadProgress"
          value="0"
          max="100"
          style={{ display: "none" }}
        ></progress>
        <button onClick={handleSend}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default Input;
