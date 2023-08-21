import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {
const [name,setName]=useState();
const [email,setEmail]=useState();
const [password,setpassword]=useState();
const [confirmpassword,setconfirmpassword]=useState();
const [pic,setpic]=useState();
const [show,setShow]=useState(false);
const [loading,setLoading]=useState(false);
const toast=useToast()
const history=useHistory()


const handleClick=()=>{
    setShow(!show)
}
const postDetails=(pics)=>{
   setLoading(true);
   if(pics===undefined){
     toast({title:"Please add an image",status:"warning",duration:5000,isClosable:true,position:"bottom"})
     return ;
   }
   if(pics.type==="image/jpeg" || pics.type==="image/png"){
    const data=new FormData();
    data.append("file",pics);
    data.append("upload_preset","chat-app")
    data.append("cloud_name","datybyr7x")
    fetch("https://api.cloudinary.com/v1_1/datybyr7x/image/upload",{
        method:"post",
        body:data,
    }).then((res)=>res.json()).then(data=>{
        setpic(data.url.toString());
        console.log(data);
        setLoading(false);
    }).catch((err)=>{
        console.log(err);
        setLoading(false);
    })
   }
   else {
    toast({
        title:"Please select an image",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
    });
    setLoading(false);
    return ;
   }

}
const submitHandler=async()=>{
    setLoading(true);
    if(!name || !email ||!password ||! confirmpassword){
        toast({
            title:"Please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom"
        });
        setLoading(false);
        return ;
    }
    if(password!==confirmpassword){
        toast({
            title:"Password do not match",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        return ; 
    }
    try {
     const config={
        headers:{
            "Content-type":"application/json"
        },
     };
     const {data}=await axios.post("/api/user",{name,email,password,pic},config);
     toast({
        title:"Registration  successful",
        status:"success",
        duration:5000,
        isClosable:true,
        position:'bottom',
     })
     setLoading(false);
     localStorage.setItem("userInfo",JSON.stringify(data));
     history.push("/chats")
     window.location.reload();
    }
    catch(error){
    toast({
        title:"Error Occured!",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",

    });
    setLoading(false);
    }

}
  return (
    <VStack>
        <FormControl isRequired  id="full-name">
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>(
                setName(e.target.value)
            )}></Input>
        </FormControl>

        <FormControl isRequired id="email">
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e)=>(
                setEmail(e.target.value)
            )}></Input>
        </FormControl>
        <FormControl isRequired id="password">
            <FormLabel >Password</FormLabel>
            <InputGroup>
            <Input type={show?"text":"password"} placeholder='Enter your password' onChange={(e)=>setpassword(e.target.value)}>
            </Input>
            <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size="sm" onClick={handleClick}> 
                 {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl isRequired id="password">
            <FormLabel >Confirm Password</FormLabel>
            <InputGroup>
            <Input type={show?"text":"password"} placeholder='Enter your confirm password' onChange={(e)=>setconfirmpassword(e.target.value)}>
            </Input>
            <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size="sm" onClick={handleClick}> 
                 {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload your picture</FormLabel>
            <Input type={"file"} p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>
        <Button  color={"blue"} width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
}

export default Signup