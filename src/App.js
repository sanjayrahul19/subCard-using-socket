import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Parent from "./Parent";
import { useSocketContext } from "./socket/Socket"
import Home from './Home';

const App = () => {

  const navigate = useNavigate();
  const socket = useSocketContext();

  localStorage.setItem("user","656f0cdd2285517eeeefbad7")

  const handleCreateButton = async () => {
    try {

      socket.emit("ADD_CARD", {
        title: "",
        user_id: localStorage.getItem("user"),
        category_id: "6569cc3d580f55d42b911956",
      });

      socket.once("ADD_CARD", (data) => {
        console.log(data, "AddCardEvent");

        localStorage.setItem("cardId", data?._id);

        socket.emit("ADD_SUB_CARD", {
          title: "",
          description: "",
          option: "text",
          cardId: data?._id, 
        });
        
        socket.once("ADD_SUB_CARD", (data) => {
          localStorage.setItem("subcardId", data._id)
          // console.log(data, "SubCardEvent");
      });

      });
      setTimeout(()=>{
        navigate("/create-card/6569cc3d580f55d42b911956")
      },1000)
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateButton}>Create Card</button>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={"/create-card/6569cc3d580f55d42b911956"} element={<Parent />} />
      </Routes>
    </div>
  )
}

export default App