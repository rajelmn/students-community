import {useEffect, useState} from 'react';
import Header from './header';
import SideBar from './sideBar';
import './App.css';
import { io } from "socket.io-client";
import Main from './mainContent'
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import { useRef } from 'react';

export default function App() {
  const [isClickedOnMenu, setIsClickedOnMenu] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState({});
  const [channels, setChannels] = useState([]);
  const Navigate = useNavigate();
  // console.log(isClickedOnMenu, 'isclicked')
  const { id } = useParams();
  const inputSubject = useRef(null);
  const socket = io("/", {
    transports: ["websocket"],
    path: "/socket.io",
  });
  // console.log(id)
  function handleBurgerMenu() {
    console.log('fires')
    // console.log(isClickedOnMenu)
    setIsClickedOnMenu(prev => !prev)
  }
  
  function handleCreatingChannels() {
    console.log(channels)
    console.log(channels.filter(channel => channel.owner === 'userData.name'))
    if(channels.filter(channel => channel.owner === userData.name).length) {
      return alert('you already created a channel')
    }
    socket.emit('channels', {
              owner: userData.name,
              subject: inputSubject.current.value,
              id:crypto.randomUUID(),
             }, id)
  }

  useEffect(() => {
    async function loadChannelsFromDb() {
      console.log('hey')
      try {
        const res = await fetch('/api/getChannels', {
          method: 'get',
          credentials: "include",
        });
        const allChannels = await res.json();
        console.log(res.ok)
        if(!res.ok) {
          throw new Error('couldnt load channels')
        }
        setIsAuthenticated(true)
        setChannels(allChannels)
      } catch(err) {
        console.log('couldnt load channels');
        console.log(err);
        Navigate('/register')
      }
    }

     // temporarly until i use some react library to pass the state to other components
     async function getUserData() {
      try {
        const res = await fetch('/api/userData');

        if(res.ok)  {
          const userData = await res.json();
          setUserData(userData)
        }
      } catch(err) {
        console.log('oops', err)
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
    
    getUserData();
    loadChannelsFromDb();
    return () => {
      socket.off("connect", onConnection);
      socket.disconnect()
    };
  }, [])

  return(
    <>
    {isAuthenticated && (
   <div className='flex phone-view'>
    {isClickedOnMenu && (
    <SideBar channels={channels} inputSubject={inputSubject} handleCreatingChannels={handleCreatingChannels} handleChangingMenuState={setIsClickedOnMenu}/>
      )} 
    <div className='bg-background flex-grow-[1]'>
    <Header channelName={id?.length > 20? channels.owner : id} handleBurgerMenu={handleBurgerMenu} isClickedOnMenu={isClickedOnMenu}/>
    <Outlet/>
    </div>
   </div> 
    )}
    </>
  )
}
