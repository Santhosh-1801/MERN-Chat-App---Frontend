import { useHighlight } from "@chakra-ui/react";
import {createContext, useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

const ChatContext=createContext();

const ChatProvider=({children})=>{
const [user,setuser]=useState();
const history=useHistory();
const [selectedchat,setselectedchat]=useState();
const [chats,setchats]=useState([]);
const [notification,setnotifications]=useState([]);

useEffect(() => {
 const userInfo=JSON.parse(localStorage.getItem("userInfo"))
 setuser(userInfo)
 if (!userInfo) 
 history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);



return(
    <ChatContext.Provider value={{user,setuser,selectedchat,setselectedchat,chats,setchats,notification,setnotifications}}>
     {children}
    </ChatContext.Provider>
)
}
export const ChatState=()=>{
    return useContext(ChatContext)
}
export default ChatProvider