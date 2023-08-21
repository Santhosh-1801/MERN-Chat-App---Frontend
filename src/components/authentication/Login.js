import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import { warning } from 'framer-motion';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';


const Login = () => {
const [email,setEmail]=useState("");
const [password,setpassword]=useState("");
const [show,setShow]=useState(false);
const [loading,setLoading]=useState(false);
const toast=useToast();
const history=useHistory();


const handleClick=()=>{
    setShow(!show)
}

const submitHandler=async()=>{
    setLoading(true);
    if(!email || !password){
        toast({
            title:"Please fill the required details",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
        setLoading(false);
        return ;
    }
    try {
        const config={
            headers:{
                "Content-type":"application/json",
            },
        };

        const {data}=await axios.post("/api/user/login",{email,password},config)

        toast({
            title:"Login Successful",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
        setLoading(false);
        localStorage.setItem("userInfo",JSON.stringify(data));
         history.push("/chats")
         window. location. reload();
        
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        
    }

}
  return (
    <VStack>

        <FormControl isRequired id="email">
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' value={email}onChange={(e)=>(
                setEmail(e.target.value)
            )}></Input>
        </FormControl>
        <FormControl isRequired id="password">
            <FormLabel >Password</FormLabel>
            <InputGroup>
            <Input type={show?"text":"password"} value={password} placeholder='Enter your password' onChange={(e)=>setpassword(e.target.value)}>
            </Input>
            <InputRightElement width={"4.5rem"}>
                <Button h="1.75rem" size="sm" onClick={handleClick}> 
                 {show?"Hide":"Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button  color={"blue"} width="100%" style={{marginTop:15}} onClick={submitHandler}>Sign in</Button>
        <Button variant={"solid"} color="red" width={"100%"} onClick={()=>{
            setEmail("guest@example")
            setpassword("123456")
        }}>Get user credentials</Button>
    </VStack>
  )
}

export default Login