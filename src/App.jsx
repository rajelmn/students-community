import {useEffect, useState} from 'react';
import Header from './header';
import SideBar from './sideBar';
import './App.css';
import { io } from "socket.io-client";
import Main from './mainContent'
import { Outlet, useParams } from 'react-router-dom';
import { useRef } from 'react';

export default function App() {
  const [isClickedOnMenu, setIsClickedOnMenu] = useState(true);
  const [channels, setChannels] = useState([]);
  // console.log(isClickedOnMenu, 'isclicked')
  const { id } = useParams();
  const inputSubject = useRef(null);
  const socket = io("/", {
    transports: ["websocket"],
    path: "/socket.io",
  });
  const name = document.cookie
    ? document.cookie.split(";")[0].split("=")[1]
    : "";
  // console.log(id)
  function handleBurgerMenu() {
    console.log('fires')
    // console.log(isClickedOnMenu)
    setIsClickedOnMenu(prev => !prev)
  }
  
  function handleCreatingChannels() {
    socket.emit('channels', {
              owner: name,
              subject: inputSubject.current.value,
              id:crypto.randomUUID(),
             }, id)
  }

  useEffect(() => {
    async function loadChannelsFromDb() {
      try {
        const res = await fetch('/getChannels');
        const allChannels = await res.json();
        setChannels(allChannels)
      } catch(err) {
        console.log('couldnt load channels');
        console.log(err)
      }
    }
    
    function onConnection() {
      // console.log("connection");
      socket.on('channels', (channelDetail) => {
        // console.log('on channels')
        setChannels(prev => [
          ...prev,
          channelDetail
        ])
      })
    }
    socket.connect();
    socket.on("connect", onConnection);
    
    loadChannelsFromDb();
    return () => {
      socket.off("connect", onConnection);
      socket.disconnect()
    };
  }, [])

  return(
   <div className='flex'>
    {isClickedOnMenu && (
    <SideBar channels={channels} inputSubject={inputSubject} handleCreatingChannels={handleCreatingChannels} handleChangingMenuState={setIsClickedOnMenu}/>
      )} 
    <div className='bg-background flex-grow-[1]'>
    <Header channelName={id?.length > 20? channels.owner : id} handleBurgerMenu={handleBurgerMenu} isClickedOnMenu={isClickedOnMenu}/>
    <Outlet/>
    </div>
   </div> 
  )
}
