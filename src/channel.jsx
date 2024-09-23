import Header from "./header";
import SideBar from "./sideBar";
import App from "./App";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import {  useNavigate,useParams } from "react-router-dom";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { io } from "socket.io-client";
import { FaUpload } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import { MdDelete,MdModeEdit,MdOutlineAddReaction,MdVerified } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

export default function Channel() {
  const [messages, setMessages] = useState([]);
  const [channels , setChannels] = useState([]);
  const [isClickedOnMenu, setIsClickedOnMenu] = useState(true);
  const navigate = useNavigate();
  const elem = useRef(null);
  const { id } = useParams();
  console.log(messages)

  const socket = io("/", {
    transports: ["websocket"],
    path: "/socket.io",
  });
  const input = useRef(null);
  if (!document.cookie) {
    console.log("doesnt have a cookie");
    navigate("/register");
  }

  const name = document.cookie
    ? document.cookie.split(";")[0].split("=")[1]
    : "";
  const url = document.cookie
    ? document.cookie.split(";")[1].split("=")[1]
    : "";


  async function storeMessagesInDb(message, date, file, messageId, isLatex) {
    const user = JSON.stringify({ message, name, url, date,  id , messageId, isLatex})
    const formData = new FormData();
    formData.append('user', user);
    formData.append('file',file )
    try {
       const response = await fetch("/storemessage", {
        method: "post",
        body: formData,
      });
      console.log(response.ok);
      const image = await response.json();
      console.log(image);
      return image
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteMessage(messageId) {
    try {
      const deletedMessage = messages.filter((message) => message.messageId === messageId);
      console.log(deletedMessage)
      socket.emit('delete',deletedMessage, id);
    } catch(err){
      console.log(err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let image;
    let file = e.target.image.files[0];
    const date = new Date();
    const currentDate = date.toLocaleTimeString("en-mr", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const isLatex = e.target.text.value.match(/[$]/gi)?.length === 2
    const messageId = crypto.randomUUID();
    if(file) {
      image = await storeMessagesInDb(e.target.text.value, currentDate , file, isLatex);
    }
    else {
      storeMessagesInDb(e.target.text.value, currentDate,undefined, messageId, isLatex)
    }
  //   if(e.target.text.value.match(/[$]/gi)?.length === 2) {
  //     // socket.emit('message', {
  //     //   isLatex:true,
  //     //   message: e.target.text.value.replace(/[$]/gi, ''),
  //     //   image,
  //     // }, id)
  //     // return
  //     setMessages(prev => [...prev, {
  //       isLatex: true,
  //       message:e.target.text.value.replace(/[$]/gi, '')
  //     }])
  //     return
  // }
    socket.emit("message", {
      isLatex,
      message: e.target.text.value,
      name,
      url,
      date: currentDate,
      image,
      messageId
    },  id);
    input.current.value = "";
    e.target.image.value = '';
  }

  useEffect(() => {
    // elem.current.scrollIntoView()
    // window.scrollBy(0, -30)
    socket.emit('join',  id)
    async function loadMessagesFromDb() {
      const messages = await fetch("/getdata", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  id }),
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));
      setMessages(messages);
    }

    

    function onConnection() {
      console.log("connection");
      socket.on('channels', (channelDetail) => {
        console.log('on channels')
        setChannels(prev => [
          ...prev,
          channelDetail
        ])
      })
      socket.on("chat", (msg) => {
        console.log('on chat messages')
        setMessages((prev) => [...prev, msg]);
      });
      socket.on('delete', (msg) => {
        console.log(msg)
        console.log(msg[0].messageId)
        setMessages((prevMessages) => {
          console.log(prevMessages.filter((message) => message.messageId !== msg[0].messageId));
          return prevMessages.filter((message) => message.messageId !== msg[0].messageId);
        });
        console.log('deleting');
      });
    }

    loadMessagesFromDb();
    socket.connect();
    socket.on("connect", onConnection);
    return () => {
      socket.off("connect", onConnection);
      socket.off("chat");
      socket.off('delete'); 
      socket.disconnect();
      socket.disconnect()
    };
  }, [id]);
  
  // useEffect(() => {
  //   elem.current.scrollIntoView()
  // },[])

  return (
    
    <div className="flex bg-background h-screen ">
      {/* {isClickedOnMenu && (
      // <SideBar handleCreatingChannels={handleCreatingChannels} channels={channels} inputSubject={inputSubject} />
      )} */}
      <div className=" flex w-full flex-col ">
        {/* <Header channelName={id.length > 20? channels.owner : id}/> */}
        <div ref={elem} className="messages w-full overflow-y-auto h-[calc(100vh-(55px+100px))] bg-black pb-5">
          {messages &&
            messages.map((message, index) => (
              <>
              {/* {console.log(message)} */}
                {(!message.isLatex && index > 0 && messages[index - 1].name) ===
                messages[index].name && messages[index - 1].date === messages[index].date ? (
                  <div key={crypto.randomUUID()} className={`message relative w-full px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? 'mb-0': 'mb-4'} hover:bg-[#151617] flex flex-col text-white`}>
                    <p className="break-all ml-[79px]">{message.message}</p>
                    <img src={message.image} className="unstyle-images w-[50%] phone-class ml-[5em] block"/>
                    <div className="absolute hidden pl-3 menu items-center justify-between  bg-[#313338] right-0 top-0 cursor-pointer">
                      <MdOutlineAddReaction className="mr-2"/>
                      <FaReply className="m-2" />
                      {message.name === name && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
                      <MdModeEdit className="m-2" />
                    </div>
                  </div>
                ) : message.isLatex ? (
                  <>
                  <div className={` relative message w-full hover:bg-[#151617]  px-3 my-3 flex text-white`}>
                  <img
                      src={message.url}
                      className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
                    />
                    <div className="flex flex-col justify-start">
                      <p className="font-thic text-xs"> {message.date} </p>
                      <p>{message.name}</p>
                      <p className="break-all">{message.message}</p>
                      <img src={message.image} className="w-[50%] phone-class bg-white"/>
                    </div>
                    <div className="absolute hidden pl-3 menu items-center justify-between  bg-[#313338] right-0 top-0 cursor-pointer">
                    <MdOutlineAddReaction className="mr-2" />
                      <FaReply className="m-2" />
                    {message.name === name && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
                      <MdModeEdit className="m-2" />
                    </div>
                  </div>
                  <div className={` relative message w-full hover:bg-[#151617]  px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '': 'mb-4'} flex text-white`}>
                    <img
                      src="../images/new-logo.png"
                      className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
                    />
                    <div className="">
                      <span>mauriTeX</span> <MdVerified className="inline" /> 
                      {console.log(message)}
                      <span className="text-xs ml-1 text-orange-500">used by {message.name}</span>
                      <span className="text-5xl overflow-auto break-all">
                      <BlockMath math={message.message.replace(/[$]/gi, '')}/>
                      </span>
                    </div>
                  </div>
                  </>
                ):
                 (
                  <div className={` relative message w-full hover:bg-[#151617]  px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '': 'mb-4'} flex text-white`}>
                    <img
                      src={message.url}
                      className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
                    />
                    <div className="flex flex-col justify-start">
                      <p className="font-thic text-xs"> {message.date} </p>
                      <p>{message.name}</p>
                      <p className="break-all">{message.message}</p>
                      <img src={message.image} className="w-[50%] phone-class bg-white"/>
                    </div>
                    <div className="absolute hidden pl-3 menu items-center justify-between  bg-[#313338] right-0 top-0 cursor-pointer">
                    <MdOutlineAddReaction className="mr-2" />
                      <FaReply className="m-2" />
                    {message.name === name && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
                      <MdModeEdit className="m-2" />
                    </div>
                  </div>
                )}
              </>
            
            ))}
        </div>
        <div className="form-test w-full bg-background remove-padding p-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center justify-between bg-gray-700 "
          >
            <div className="upload-image pl-4">
              <label htmlFor="upload-file">
            <FaUpload className="text-white text-2xl" />
              </label>
            <input type="file" id="upload-file" className="hidden" name="image"/>
            </div>
            
            <input
              type="text"
              name="text"
              ref={input}
              placeholder="write message"
              className="outline-none bg-gray-700 text-white transparent w-[90%] py-2 rounded-l-md"
            />
            {/* <IoMdSend className='text-white cursor-pointer text-2xl' onClick={handleSubmit}/> */}
            <button type="submit">
              <IoMdSend className="text-white cursor-pointer text-2xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


//border-[3px] border-solid border-white