//import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
//import { ChatContext } from "../context/ChatContext";
//import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      senderId: "HWgTzRiQfuXAkpkJyXJyMbG9fl72",
      text1: "Hii Kishan",
      text2: "Hii Kishan",
    },
    {
      senderId: "0IfkyiKSTPTyIQBhUKbA64Z86Lr2",
      text1: "Hello Raghav",
      text2: "Hello Raghav",
    },
    {
      senderId: "HWgTzRiQfuXAkpkJyXJyMbG9fl72",
      text1: "how are you?",
      text2: "how are you?",
    },
    {
      senderId: "0IfkyiKSTPTyIQBhUKbA64Z86Lr2",
      text1: "Good! Getting ready for Ganesh Chaturthi. You?",
      text2: "Good! Getting ready for Ganesh Chaturthi. You?",
    },
    {
      senderId: "HWgTzRiQfuXAkpkJyXJyMbG9fl72",
      text1: "Cool! We're celebrating at my place. Join us?",
      text2: "Cool! We're celebrating at my place. Join us?",
      img: "ganesh.jpg",
    },
    {
      senderId: "0IfkyiKSTPTyIQBhUKbA64Z86Lr2",
      text1: "Sounds fun! When's that?",
      text2: "Sounds fun! When's that?",
    },
    {
      senderId: "HWgTzRiQfuXAkpkJyXJyMbG9fl72",
      text1: "Drop by anytime!",
      text2: "Drop by anytime!",
    },
    {
      senderId: "0IfkyiKSTPTyIQBhUKbA64Z86Lr2",
      text1: "Nice! What should I bring?",
      text2: "Nice! What should I bring?",
    },
    {
      senderId: "HWgTzRiQfuXAkpkJyXJyMbG9fl72",
      text1: "Your presence, or sweets if you'd like.",
      text2: "Your presence, or sweets if you'd like.",
    },
    {
      senderId: "0IfkyiKSTPTyIQBhUKbA64Z86Lr2",
      text1: "Awesome! Can't wait. See you then!",
      text2: "Awesome! Can't wait. See you then!",
    },
  ]);
  // const { data } = useContext(ChatContext);

  // useEffect(() => {
  //   const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
  //     doc.exists() && setMessages(doc.data().messages);
  //   });

  //   return () => {
  //     unSub();
  //   };
  // }, [data.chatId]);

  // console.log(messages);
  // const handleChange = async () => {
  //   //e.preventDefault();
  //   await updateDoc(doc(db, "chats", data.chatId), {
  //     messages: arrayUnion({ ...messages, date: "Kanhaaaa" }),
  //   });
  // // };
  // handleChange();
  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
