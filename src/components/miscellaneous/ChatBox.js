import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import SingleChat from '../SingleChat';


const ChatBox = ({fetchAgain,setfetchAgain}) => {
  const {selectedchat}=ChatState();
  return (
    <Box display={{base:selectedchat?"flex":"none",md:"flex"}} alignItems="center" flexDir={"column"} p={3} bg="white" w={{base:"100%",md:"68%"}} borderRadius="lg" borderWidth={"1px"}>
    <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
    </Box>
  )
}

export default ChatBox