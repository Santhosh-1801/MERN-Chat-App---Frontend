import { Box } from "@chakra-ui/react"
import { useState } from "react"
import ChatBox from "../components/miscellaneous/ChatBox"
import MyChats from "../components/miscellaneous/MyChats"
import SideDrawer from "../components/miscellaneous/SideDrawer"
import { ChatState } from "../Context/ChatProvider"


const Chatpage = () => {
const {user}=ChatState() ;
const [fetchAgain,setfetchAgain]=useState(false);
  return <div style={{width:"100%"}}>
       {user && <SideDrawer/>}
       <Box display="flex" justifyContent={"space-between"} w="100%" h="91.5vh" p="10px"color={"black"}>
         {user && <MyChats fetchAgain={fetchAgain}/>}
         {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
       </Box>
  
    
        </div>

  
}

export default Chatpage