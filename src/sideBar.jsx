import {users} from './users'
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { IoTicketOutline } from "react-icons/io5";
import { FaHashtag, FaLess } from "react-icons/fa";
export default function SideBar({ handleCreatingChannels, channels, inputSubject, handleChangingMenuState }) {
    const [isCreatedChannel, setIsCreatedChannel] = useState(false);
    const user = document.cookie.split(";")[0].split("=")[1];
    return(
        <div className={`side-bar w-[27vw] min-w-[180px] h-screen flex flex-col overflow-y-auto overflow-x-hidden text-white items-start bg-[#2B2D31]`}>

        <div className='w-[100%] h-[47%]'>
            {users.map((user, id) => 
            <>
            <Link to={'/user/' + user.id} key={'phone-'+id} onClick={() => handleChangingMenuState(false)} className='phone-link' >         
            <div className='flex justify-between items-center mt-4'>
               <div className='flex items-center text-white'>
                <img src={user.url} className='rounded-full w-9 mr-1' alt="" />
                <p >{user.name}</p>
               </div> 
            </div>
            </Link>
            <Link to={'/user/' + user.id} key={'pc-'+id} className='pc-link'>         
            <div className='flex justify-between items-center mt-4' >
               <div className='flex items-center text-white'>
                <img src={user.url} className='rounded-full w-9 mr-1' alt="" />
                <p >{user.name}</p>
               </div> 
            </div>
            </Link>
            </>
            )}
        </div>
        {isCreatedChannel && (
            <>
        <div className="fixed z-50 inset-0 min-w-[293px] bg-black bg-opacity-50 flex items-center justify-center">
  <div className="w-3/5 bg-white rounded-lg shadow-xl p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-900">Create Ticket and ask</h2>
      <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsCreatedChannel(false)}>✕</button>
    </div>
    <div className="space-y-4">
      <div>
        <label htmlFor="popup-input" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
        <input type="text" id="popup-input" ref={inputSubject} className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => {
          const isUserAlreadyCreatedChannel = channels.find((item) => item.owner === user);
          setIsCreatedChannel(false)
          if(isUserAlreadyCreatedChannel) {
            alert('nigge you already created a channel');
            return;
          }
            handleCreatingChannels()
        }}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</div>
            </>
        )}
        <Link to='/channel/discussion' onClick={() => handleChangingMenuState(false)} className='flex phone-link  justify-start items-center no-underline ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>discussion</p>
        </Link>
        <Link to='/channel/math' onClick={() => handleChangingMenuState(false)} className='flex phone-link  justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Mathematics</p>
        </Link>
        <Link to='/channel/physics' onClick={() => handleChangingMenuState(false)} className='flex phone-link  justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Physics</p>
        </Link>
        <Link to='/channel/science' onClick={() => handleChangingMenuState(false)} className='flex phone-link  justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Science</p>
        </Link>..
        <Link to='/channel/discussion'  className='flex pc-link  justify-start items-center no-underline ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>discussion</p>
        </Link>
        <Link to='/channel/math'  className='flex pc-link justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Mathematics</p>
        </Link>
        <Link to='/channel/physics'  className='flex pc-link justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Physics</p>
        </Link>
        <Link to='/channel/science' className='flex pc-link justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Science</p>
        </Link>
        <div onClick={() => setIsCreatedChannel(true)} className='pl-4 flex items-center mt-4 w-full cursor-pointer hover:bg-[#747474]'>
        <IoTicketOutline/>
            <p>create help</p>
        </div>
        <div>
        
        {channels && channels.map( (channel) =>
        <>
        <Link to={`/channel/${channel.id}`} key={'phone-'+ channel.id} onClick={() => handleChangingMenuState(false)} className='flex phone-link w-full justify-start items-center no-underline mt-4  hover:bg-black'>
        <FaHashtag /> <p className=' break-all'>{channel.subject} | {channel.owner}</p>
         </Link>
         <Link to={`/channel/${channel.id}`} key={'pc-'+ channel.id}  className='flex pc-link w-full justify-start items-center no-underline mt-4  hover:bg-black'>
        <FaHashtag /> <p className=' break-all'>{channel.subject} | {channel.owner}</p>
         </Link>
        </>
        )}
        </div>
    </div>
    )
}

//clamp(22px, 3vw, 30px)