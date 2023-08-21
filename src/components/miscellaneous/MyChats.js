import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {getSender} from '../../config/ChatLogic';
import { ChatState } from '../../Context/ChatProvider'
import ChatLoading from '../ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChats = ({fetchAgain}) => {
const [loggedUser,setLoggedUser]=useState("");
const {user,selectedchat,setselectedchat,chats,setchats}=ChatState();

  const toast=useToast();

  const fetchChat=async()=>{
    try{
    const config={
      headers:{
        Authorization:`Bearer ${user.token}`
      },
    };
    const {data}=await axios.get("/api/chat",config);
    console.log(data)
    setchats(data);
    }
    catch(error){
    toast({
      title:"Error Occured!!",
      description:"Failed to load the Chat",
      status:"error",
      duration:5000,
      isClosable: true,
      position: "bottom-left",
    })
    }
  }
  

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  },[fetchAgain,chats])
  return (
    <Box display={{base:selectedchat?"none":"flex",md:"flex"}} flexDir="column" alignItems={"center"} p="3" bg="white" w={{base:"100%", md:"31%"}} borderRadius="lg" borderWidth={"1px"}>
    <Box pb={3} px={3} fontSize={{base:"28px",md:"30px"}} fontFamily="Work sans" display={"flex"} w="100%" justifyContent={"space-between"} alignItems="center" >
    My Chats
    <GroupChatModal>
    <Button display={"flex"} fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={<AddIcon/>}>
      Create Group Chat
    </Button>
    </GroupChatModal>
    </Box>
    <Box display={"flex"} flexDir="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius={"lg"} overflowY="hidden">
    {chats?(
    <Stack overflowY={"scroll"}>
    {chats.map((chatind)=>(
      <Box onClick={()=>setselectedchat(chatind)} cursor="pointer" bg={selectedchat===chatind?"#38B2AC":"#E8E8E8"} color={selectedchat===chatind?"white":"black"} px={3} py={2} borderRadius="lg" key={chatind._id}>
      <Text>
        {!chatind.isGroupChat?getSender(loggedUser,chatind.users):chatind.chatName} 
      </Text>
      {chatind.latestMessage && (
        <Text fontSize="xs">
          <b>{chatind.latestMessage.sender.name}: </b>
          {chatind.latestMessage.content.length>50?chatind.latestMessage.content.substring(0,51)+"....":chatind.latestMessage.content}
        </Text>
      )}
      </Box>
    ))}
    </Stack>
    ):(
    <ChatLoading/>
    )}
    </Box>
    </Box>
  )
}

export default MyChats