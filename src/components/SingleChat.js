import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal';
import { UpdateGroupModal } from './miscellaneous/UpdateGroupModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import animationData from '../animations/typing.json'
import Lottie from "react-lottie"

const ENDPOINT="http://localhost:5000"
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setfetchAgain}) => {
  const [messages,setmessages]=useState([]);
  const [loading,setloading]=useState(false);
  const [newMessage,setnewMessage]=useState("");
  const [socketConnected,setsocketConnected] = useState(false);
  const [typing,settyping]=useState(false);
  const [isTyping,setisTyping]=useState(false);

  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice",
    }
  }


  const toast=useToast();
  const {user,selectedchat,setselectedchat,notification,setnotifications}=ChatState();
  const fetchMessages=async()=>{
    if(!selectedchat){
      return ;
    }
    try {
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      setloading(true);
      const {data}=await axios.get(`/api/message/${selectedchat._id}`,config)
      
      setmessages(data);
      setloading(false);
      socket.emit('join chat',selectedchat._id)
    } catch (error) {
      toast({
        title:"Error Occured",
        description:"Failed to load the message in a chat",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
    }

  }
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected",()=>setsocketConnected(true));
    socket.on("typing",()=>setisTyping(true));
    socket.on("stop typing",()=>setisTyping(false));

  },[]) 
  useEffect(()=>{
    fetchMessages()
    selectedChatCompare=selectedchat;
  },[selectedchat])
  console.log(notification,'-------------');
  useEffect(()=>{
    socket.on('message received',(newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
        if(!notification.includes(newMessageReceived)){
          setnotifications([newMessageReceived,...notification]);
          setfetchAgain(!fetchAgain);
        }
      }
      else{
        setmessages([...messages,newMessageReceived])
      }
    })
  })

  const sendMess=async(event)=>{
   if(event.key==="Enter" && newMessage){
    socket.emit("stop typing",selectedchat._id)
    try {
      const config={
        headers:{
        "Content-type":"application/json",
        Authorization: `Bearer ${user.token}`,
      },
    }
    const {data}=await axios.post("/api/message",{
      content:newMessage,
      chatID:selectedchat._id,
    },config)
    
    socket.emit("new message",data);
    setnewMessage(""); 
    setmessages([...messages,data]) 
   } catch (error) {
      toast(
        {
          title:"Error Occured",
          description:"Failed to send the message",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        }
      )
    }
   }
  }

  const typehandling=(e)=>{
    setnewMessage(e.target.value);
    if(!socketConnected){
      return ;
    }
    if(!typing){
      settyping(true);
      socket.emit("typing",selectedchat._id);

    }
    let lastTypingTime=new Date().getTime();
    var timerLength=3000;
    setTimeout(()=>{
      var timenow=new Date().getTime();
      var timeDiff=timenow-lastTypingTime;
      if(timeDiff>=timerLength && typing){
        socket.emit('stop typing',selectedchat._id);
        settyping(false);
      }
    },timerLength)
  }

 
  return <>
  {selectedchat?(
    <>
    <Text fontSize={{base:"28px",md:"30px"}} pb={3} px={2} w={"100%"} fontFamily="Work sans" display={"flex" } justifyContent={{base:"space-between"}} alignItems="center">
     <IconButton display={{base:"flex",md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setselectedchat("")}>
     </IconButton>
     {!selectedchat.isGroupChat?(<>
     {getSender(user,selectedchat.users)}
     <ProfileModal user={getSenderFull(user,selectedchat.users)}/>
     </>
     ):
     (
     <>{selectedchat.chatName.toUpperCase()}
     <UpdateGroupModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages={fetchMessages}/>
     </>)}
    </Text>
    <Box display={"flex"} flexDir="column" justifyContent={"flex-end"} p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius={"lg"} overflow="hidden">
    {loading?(<Spinner color='skyblue' thickness='4px' size={"xl"} w={"20"} h={20} alignSelf={"center"} margin={"auto"}/>):(
    <div className='messages'>
      <ScrollableChat messages={messages}/>
    </div>
    )}
    <FormControl onKeyDown={sendMess} isRequired mt={3}>
      {isTyping?<div>
        <Lottie options={defaultOptions} width={70} style={{marginBottom:15,marginLeft:0}}>
        </Lottie> 
      </div>:<></>}
    <Input variant={"filled"} bg="#E0E0E0" placeholder="Enter the message" onChange={typehandling} value={newMessage}/>
    </FormControl>
    </Box>
    </>
  ):<Box display={"flex"} alignItems="center" justifyContent={"center"} h="100%">
     <Text fontSize={"3xl"} pb={3} fontFamily="Work sans">
     Click on a user to start chatting
     </Text>
    </Box>}
  </>
}

export default SingleChat