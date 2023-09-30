import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
  const [status, setStatus] = useState(window.innerWidth);
  const handleResize = () => {
    setStatus(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {status <= 768 ? (
        <div className="home">
          <div className="container">
            <Sidebar />
          </div>
        </div>
      ) : (
        <div className="home">
          <div className="container">
            <Sidebar />
            <Chat />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
