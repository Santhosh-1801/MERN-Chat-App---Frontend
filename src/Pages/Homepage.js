import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'

const Homepage = () => {
  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('userInfo'));
    if(user){
      history.push("/chats")
    }
  },[history])
  return (
    <Container maxW="xl" centerContent style={{margin:"auto"}}> 
    <Box d="flex" justifyContent='center' p={3} bg={"white"} w="100%" m="40px 0 15px 0" borderRadius="lg"
    borderWidth="1px">
    <Text fontSize={"4xl"} fontFamily="Fasthand" textAlign={"center"}>Letschat</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
    <Tabs variant='soft-rounded' >
  <TabList mb={"1em"}>
    <Tab width={"50%"}>Login</Tab>
    <Tab width={"50%"}>Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
    </Container>
  )
}

export default Homepage