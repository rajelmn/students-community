import Header from "./header";
import SideBar from "./sideBar";
import App from "./App";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { FaUpload } from "react-icons/fa6";
// import { socket } from './socket';
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";

export default function Channel() {
  const [messages, setMessages] = useState([]);
  const [channels , setChannels] = useState([]);
  const navigate = useNavigate();
  const inputSubject = useRef(null);
  const { id } = useParams();

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

  async function storeMessagesInDb(message, date) {
    try {
      await fetch("/api/storemessage", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, name, url, date,  id }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleCreatingChannels() {
    socket.emit('channels', {
              owner: name,
              subject: inputSubject.current.value,
              id:crypto.randomUUID(),
             }, id)
  }

  function handleSubmit(e) {
    e.preventDefault();
    const date = new Date();
    const currentDate = date.toLocaleTimeString("en-mr", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    socket.emit("message", {
      message: e.target.text.value,
      name,
      url,
      date: currentDate,
    },  id);
    storeMessagesInDb(e.target.text.value, currentDate);
    input.current.value = "";
  }

  useEffect(() => {
    socket.emit('join',  id)
    async function loadMessagesFromDb() {
      const messages = await fetch("/api/getdata", {
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

    async function loadChannelsFromDb() {
      try {
        const res = await fetch('/api/getChannels');
        const allChannels = await res.json();
        setChannels(allChannels)
      } catch(err) {
        console.log('couldnt load channels');
        console.log(err)
      }
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
    }

    loadMessagesFromDb();
    loadChannelsFromDb();
    socket.connect();
    socket.on("connect", onConnection);
    return () => {
      socket.off("connect", onConnection);
      socket.off("chat");
      socket.disconnect()
    };
  }, [id]);

  return (
    <div className="flex bg-background h-screen">
      <SideBar handleCreatingChannels={handleCreatingChannels} channels={channels} inputSubject={inputSubject} />
      <div className="w-full flex flex-col ">
        <Header channelName={id.length > 20? channels.owner : id}/>
        <div className="messages overflow-y-auto h-[calc(100vh-(55px+100px))] bg-black pb-5">
          {messages &&
            messages.map((message, index) => (
              <>
                {(index > 0 && messages[index - 1].name) ===
                messages[index].name && messages[index - 1].date === messages[index].date ? (
                  <div className={`message w-full px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '': 'mb-4'} flex text-white`}>
                    <p className="break-all ml-[79px]">{message.message}</p>
                  </div>
                ) : (
                  <div className={`message w-full  px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '': 'mb-4'} flex text-white`}>
                    <img
                      src={message.url}
                      className="rounded-[50%] w-16 block mr-3"
                    />
                    <div>
                      <p className="font-thic text-xs"> {message.date} </p>
                      <p>{message.name}</p>
                      <p className="break-all">{message.message}</p>
                    </div>
                  </div>
                )}
              </>
            
            ))}
        </div>
        <div className="form-test w-full bg-background p-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center justify-between bg-gray-700 "
          >
            <div className="upload-image pl-4">
              <label htmlFor="upload-file">
            <FaUpload className="text-white text-2xl" />
              </label>
            <input type="file" id="upload-file" className="hidden"/>
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
