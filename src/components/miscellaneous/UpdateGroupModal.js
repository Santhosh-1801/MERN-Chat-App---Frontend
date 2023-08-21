import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

export const UpdateGroupModal = ({fetchAgain,setfetchAgain,fetchMessages}) => {
  const {isOpen,onOpen,onClose}=useDisclosure();
  const {selectedchat,setselectedchat,user}=ChatState();
  const [groupchatname,setgroupchatname]=useState("");
  const [search,setsearch]=useState("");
  const [searchResult,setsearchResult]=useState([]);
  const [loading,setloading]=useState(false);
  const [renameloading,setrenameloading]=useState(false); 
  const toast=useToast();
  const handleRemove=async(user1)=>{
    if(selectedchat.groupAdmin._id!==user._id && user1._id!==user._id){
        toast({
            title:"Only admins can remove the user",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        return ;
    }
    try {
        setloading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/groupremove',{
            chatID:selectedchat._id,
            userID:user1._id,
        },config)
        user1._id===user._id?setselectedchat():setselectedchat(data);
        setfetchAgain(!fetchAgain);
        fetchMessages();
        setloading(false);
    } catch (error) {
        toast({
            title:"Error occured",
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        setloading(false);
    }
  }
  const handleRename=async()=>{
    if(!groupchatname){
        return ;
    }
    try{
        setrenameloading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/rename',{
            chatID:selectedchat._id,
            chatName:groupchatname,
        },config);
        setselectedchat(data);
        setfetchAgain(!fetchAgain);
        setrenameloading(false);

    }
    catch(error){
     toast({
        title:"Error Occured",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
     })
     setrenameloading(false);
    }
    setgroupchatname("")
  }
  const handleSearch=async(query)=>{
  setsearch(query);
  if(!query){
    return ;
  }
  try {
    setloading(true);
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        },
    };
    const {data}=await axios.get(`/api/user?search=${search}`,config);
    console.log(data);
    setloading(false);
    setsearchResult(data);
  } catch (error) {
    toast({
        title:"Error occured",
        description:"Failed to load the results",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
    });
    setloading(false);
  }
  }
  const handleAddUser=async(user1)=>{
    if(selectedchat.users.find((u)=>u._id===user1._id)){
        toast({
            title:"User already in group",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        return ;
    }
    if(selectedchat.groupAdmin._id!==user._id){
        toast({
            title:"Only admins can add someone",
            status:"error",
            duration:5000,
            isClosable:true,
            position:'bottom',
        })
        return ;
    }
    try {
        setloading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            },
        };
        const {data}=await axios.put('/api/chat/groupadd',{
            chatID:selectedchat._id,
            userID:user1._id
        },config);
        setselectedchat(data);
        setfetchAgain(!fetchAgain);
        setloading(false);
    } catch (error) {
        toast({
            title:"Error occured",
            description:error.response.data.message,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        setloading(false);
        
    }
  }

  return (
    <>
    <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen} ></IconButton>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    {selectedchat.chatName}
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Box w={"100%"} display="flex" flexWrap={"wrap"} pb={3}>
                        {selectedchat.users.map((u)=>(
                            <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>
                        ))}
                    </Box>
                    <FormControl display={"flex"}>
                        <Input placeholder="Chat Name" mb={3} value={groupchatname} onChange={(e)=>setgroupchatname(e.target.value)}/>
                        <Button variant={"solid"} color="teal" ml={1} isLoading={renameloading} onClick={handleRename}>
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input placeholder='Add users to group' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
                    </FormControl>
                    {loading?(
                        <Spinner size="lg"/>
                    ):(
                        searchResult.slice(0,6)?.map((user)=>(
                            <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={()=>handleRemove(user)} background={"red"} color={"white"}>
                        Leave Group
                    </Button>
                </ModalFooter>
                <ModalFooter>
                    <Button color='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>

                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    </Modal>
    </>
  )
}
