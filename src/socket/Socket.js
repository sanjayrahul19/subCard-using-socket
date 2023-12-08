import React, { createContext, useEffect,useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

const user=localStorage.getItem("user");
const Socket = ({ children }) => {
  const socket = io(`http://104.248.15.243:4005/?id=${user}`,{
    reconnection: true,         // Enable reconnection
    reconnectionAttempts: 5,   // Number of reconnection attempts
    reconnectionDelay: 1000,   // Delay between reconnection attempts (in milliseconds)
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to the server");
    });

    socket.on("addContact",(data)=>{
      console.log(data)
    })

    return () => {
      socket.off("addContact")
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default Socket;