import Header from './header';
import SideBar from './sideBar';
import App from './App';
import './App.css';
import {useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
// import { socket } from './socket';
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";

export default function Math() {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    
    const socket = io('/', {
    transports: ['websocket'],
    path: '/socket.io'
    });
    const input = useRef(null);
    if(!document.cookie) {
        console.log('doesnt have a cookie')
        navigate('/register');
    };
    // console.log(document.cookie)
    const name = document.cookie ? document.cookie.split(';')[0].split('=')[1] : '' ;
    const url = document.cookie ? document.cookie.split(';')[1].split('=')[1] : '';

    async function storeMessagesInDb(message ,date) {
        try {
        await fetch('/api/storemessage', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
              },
            body:JSON.stringify({message, name, url, date})
            })
       } catch(err) {
        console.error(err);
      }
   };
    function handleSubmit(e) {
        e.preventDefault();
        const date = new Date() ;
        // setDate(date.toLocaleTimeString('en-mr', { hour: 'numeric', minute: 'numeric', hour12: true }));
        const currentDate = date.toLocaleTimeString('en-mr', { hour: 'numeric', minute: 'numeric', hour12: true })
        socket.emit('message', {message: e.target.text.value, name, url, date: currentDate });
        storeMessagesInDb(e.target.text.value, currentDate);
        input.current.value = '';
 };

 useEffect(() => {
    console.log('trying to connect to socket');
    async function loadMessagesFromDb() {
        const messages = await fetch('/api/getdata')
                                .then(res => res.json())
                                .catch((err) => console.error(err));
        setMessages(messages);
        console.log(messages);
    }

    
    
    function onConnection() {
        console.log('connection');
        socket.on('chat', (msg) => {
            // console.log('socket') // (*)
            setMessages(prev => [...prev, msg]);
        })
    }
    console.log('mount');

    loadMessagesFromDb();
    socket.connect();
    socket.on('connect', onConnection);
    return () => {
        socket.disconnect();
        socket.off('connect', onConnection);
        socket.off('chat');
    }
 }, [])
    return(
        <div className="flex bg-background h-screen">
            <SideBar />
            <div className='w-full flex flex-col '>
            <Header />
            <div className="messages mb-5 overflow-y-auto h-[calc(100vh_-_55px)] bg-black pb-5">
            {messages && messages.map((message, index) => 
                <div className='message w-full px-3 flex text-white'>
                    {(index > 0 && messages[index - 1].name ) === messages[index].name ? (
                        <>
                        {/* <img className='rounded-[50%] w-12 block mr-3 invisible'/> */}
                        <p className='break-all ml-[79px]'>{message.message}</p>
                        </>
                    ): (
                        <>
                        <img src={message.url} className='rounded-[50%] w-12 block mr-3'/>
                    <div>
                        <p> {message.date} </p>
                        <p>{message.name}</p>
                        <p className='break-all'>{message.message}</p>
                    </div>
                    </>
                    )}
                    
                </div>
            )}
            </div>
            <div className='w-full bg-background p-4'>
            <form onSubmit={handleSubmit} className='flex w-full items-center justify-between bg-gray-700 '>
            <input type="text" name='text' ref={input} placeholder='write message' className='outline-none bg-gray-700 text-white transparent w-[90%] px-4 py-2 rounded-l-md' />
            {/* <IoMdSend className='text-white cursor-pointer text-2xl' onClick={handleSubmit}/> */}
            <button type='submit'><IoMdSend className='text-white cursor-pointer text-2xl'/></button>
            </form>
            </div>
            </div>
        </div>
    )
}
