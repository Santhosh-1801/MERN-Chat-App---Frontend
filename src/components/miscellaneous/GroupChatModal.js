import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import  { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from "../UserAvatar/UserListItem"

const GroupChatModal = ({children}) => {
  const {isOpen,onOpen,onClose}=useDisclosure();
  const [groupChatName,setGroupChatName]=useState();
  const [selectedUser,setselectedUser]=useState([]);
  const [search,setSearch]=useState("");
  const [searchResult, setsearchResult] = useState([])
  const [loading,setLoading]=useState(false);

  const {user,chats,setchats}=ChatState();
  const toast=useToast();

  const handleSearch=async(query)=>{
    setSearch(query)
    if(!query){
      return ;
    }
    try {
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get(`/api/user?search=${search}`,config);
      console.log(data);
      setLoading(false);
      setsearchResult(data);
    } catch (error) {
      toast({
       title:"Error Occured!",
       description:"Failed to load the search result",
       status:"error",
       duration:5000,
       isClosable:true,
       position:"bottom-left"
      })
    }
  }
  const handleSubmit=async()=>{
       if(!groupChatName || !selectedUser){
        toast({
          title:"Please fill all the fields",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"top",
        })
        return ;
       }
       try {
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          },
        }
        const { data } = await axios.post("/api/chat/group",
         
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setchats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;


       } catch (error) {
        toast({
          title:"Failed to create a chat",
          description:error.response.data,
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom"
        })
       }
      
      
  }
  const handleGroup=(usertoAdd)=>{
   if(selectedUser.includes(usertoAdd)){
    toast({
      title:"User Already Added",
      status:"warning",
      duration:5000,
      isClosable:true,
      position:"top",
    })
    return ;
   }
   else {
    setselectedUser([...selectedUser,usertoAdd]);
   }
  }
  const handleDelete=(usertoDelete)=>{
    setselectedUser(selectedUser.filter((s)=>(
      s._id!==usertoDelete._id
    )))
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} fontFamily="Work sans" display={"flex"} justifyContent="center">Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
            <FormControl>
              <Input placeholder='Chat Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
              <Input placeholder='Add Users eg: Martin, Diana, Surya' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box w="100%" display="flex" flexWrap={"wrap"}>
            { selectedUser.map((u)=>(
            <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)}/>
          ))}
            </Box>
          {loading ?<div>loading</div>:(
            searchResult?.slice(0,4).map((user)=>(
              <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
            ))
          )} 
          </ModalBody>

          <ModalFooter>
            <Button background="skyblue"  _hover={{ bg: "teal.600" }} color='white' mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal