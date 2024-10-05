import {useState} from 'react';
import { MdDelete,MdModeEdit,MdOutlineAddReaction,MdVerified } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import DynamicDate from './DynamicDate';
import {BlockMath} from 'react-katex';
import { FaReply } from "react-icons/fa";
import { CiCircleRemove } from "react-icons/ci";
// message, messages, userData, handleAnsweringMessage, handleDeleteMessage, han
export function LatexMessage({
    message,
    messages,
    index,
    userData,
    handleAnsweringMessage,
    handleDeleteMessage,
    handleSubmitEdit,
    handleEdit
}) {

  return(
    <>
    <div className={`relative message w-full hover:bg-[#151617]  px-3 my-3 flex text-white`}>
                      <img
                        src={message.url}
                        className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
                      />
                      <div className="flex flex-col justify-start">
                      <p> <DynamicDate date={new Date(message.date)} /> </p>
                        <p className = {`${
                            messages.filter((item) => item.name === message.name).length > 80
                          ? 'text-red-400'
                          : messages.filter((item) => item.name === message.name).length > 120
                          ? 'text-[purple]'
                          : messages.filter((item) => item.name === message.name).length > 40
                          ? 'text-pink-400'
                          : messages.filter((item) => item.name === message.name).length > 10
                          ? 'text-blue-400'
                          : 'text-white'
                      }`}>{message.name}</p>
                        {message.isEdit ? (
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitEdit(e.target.edit.value, message.messageId)
                          }}>
                            <input
                              defaultValue={message.message}
                              name="edit"
                              className="max-w-[68vw] min-w-[50vw] break-all text-white outline-none bg-background"
                              type="text"
                            />
                          </form>
                        ) : (
                          <>
                          
                        <p>{message.message}</p>
                            {message.isEdit === false && <p className="relative text-xs">(edited)</p>}
                          </>
                        )}
                         {console.log(message.userName, userData)}
                        <img src={message.image} className="w-[50%] phone-class bg-white" />
                      </div>
                      <div className="absolute hidden pl-3 menu items-center justify-between bg-[#313338] right-0 top-0 cursor-pointer">
                        <MdOutlineAddReaction className="mr-2" />

                        <FaReply onClick={() => handleAnsweringMessage(message)} className="m-2" />
                        {message.userName === userData.userName && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
                        {message.userName === userData.userName && <MdModeEdit className="m-2" onClick={() => handleEdit(message.messageId)} />} 
                      </div>
                    </div>
                    <div className={`relative message w-full overflow-x-auto hover:bg-[#151617] px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '' : 'mb-4'} flex text-white`}>
                      <img
                        src="../images/new-logo.png"
                        className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
                      />
                      <div>
                        <span>mauriTeX</span> <MdVerified className="inline" /> 
                        <span className="text-xs ml-1 text-orange-500">used by {message.name}</span>
                        <span className="text-5xl overflow-auto break-all">
                          <BlockMath math={message.message.replace(/[$]/gi, '')}/>
                        </span>
                      </div>
                    </div>
              </>
  )
}

export function LineMessage({ message, messages, handleSubmitEdit, userData, index, handleAnsweringMessage, handleEdit, handleDeleteMessage }) {

    return(
        <div
        key={message.messageId}
        className={`message w-full px-3 relative hover:bg-background${
          messages[index + 1] &&
          messages[index + 1].name === messages[index].name
          ? ""
          : "mb-4"
          } flex flex-col text-white`}
          >
          {/* {message.answering && <p>replying to : {message.answering}</p>} */}

          {message.isEdit ? (
               <form onSubmit={(e) => {
                 e.preventDefault();
                 handleSubmitEdit(e.target.edit.value, message.messageId)
               }}>
                 <input
                   defaultValue={message.message}
                   name="edit"
                   className="max-w-[68vw] min-w-[50vw] ml-[83px] w-[calc(100%-95px)] break-all text-white outline-none bg-background"
                   type="text"
                 />
               </form>
             ) : (
               <>
               
               <p className="ml-[83px] break-all">{message.message}</p>
                 {message.isEdit === false && <p className="relative text-xs">(edited)</p>}
               </>
             )}
             {console.log(message.userName, userData)}
             
          <img
            src={message.image}
            className="unstyle-images w-[50%] phone-class ml-[5em] block"
          />
           <div className="absolute hidden pl-3 menu items-center justify-between bg-[#313338] right-0 top-0 cursor-pointer">
              <MdOutlineAddReaction className="mr-2" />
              <FaReply onClick={() => handleAnsweringMessage(message)} className="m-2" />
              {message.userName === userData.userName && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
              {message.userName === userData.userName && <MdModeEdit className="m-2" onClick={() => handleEdit(message.messageId)} />} 
            </div>
        </div>
    )
}

export function RegularMessage({
  messages,
  message,
  index,
  userData,
  handleSubmitEdit,
  handleAnsweringMessage,
  handleDeleteMessage,
  handleEdit
}) {

  return(
    <div className={`relative message w-full hover:bg-[#151617] px-3 ${messages[index + 1] && messages[index + 1].name === messages[index].name ? '' : 'mb-4'} flex text-white`}>
    <img
      src={message.url}
      className="rounded-[50%] w-[70px] block max-h-[72px] mr-3"
    />
    <div className="flex flex-col justify-start">
    <p> <DynamicDate date={new Date(message.date)} /> </p>
      <p className={`${
          messages.filter((item) => item.name === message.name).length > 80
        ? 'text-red-400'
        : messages.filter((item) => item.name === message.name).length > 120
        ? 'text-[purple]'
        : messages.filter((item) => item.name === message.name).length > 40
        ? 'text-pink-400'
        : messages.filter((item) => item.name === message.name).length > 10
        ? 'text-blue-400'
        : 'text-white'
      }`}>{message.name}</p>
      {message.isEdit ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmitEdit(e.target.edit.value, message.messageId)
        }}>
          <input
            defaultValue={message.message}
            name="edit"
            className="max-w-[68vw] min-w-[50vw] break-all text-white outline-none bg-background"
            type="text"
          />
        </form>
      ) : (
        <>
          <p className="break-all">{message.message}</p>
          {message.isEdit === false && <p className="relative text-xs">(edited)</p>}
        </>
      )}
      {console.log(message.userName, userData)}
      <img src={message.image} className="w-[50%] phone-class bg-white" />
    </div>
    <div className="absolute hidden pl-3 menu items-center justify-between bg-[#313338] right-0 top-0 cursor-pointer">
      <MdOutlineAddReaction className="mr-2" />

      <FaReply onClick={() => handleAnsweringMessage(message)} className="m-2" />
      {message.userName === userData.userName && <MdDelete className="m-2 hover:text-[red]" onClick={() => handleDeleteMessage(message.messageId)}/>}  
      {message.userName === userData.userName && <MdModeEdit className="m-2" onClick={() => handleEdit(message.messageId)} />} 
    </div>
  </div>
  )
}