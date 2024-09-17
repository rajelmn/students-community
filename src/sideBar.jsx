import {users} from './users'
import { Link } from 'react-router-dom';
import {useState} from 'react'
import { FaHashtag } from "react-icons/fa";
export default function SideBar() {
    const [user, setUser] = useState(users)
    const [channels, setChannels] = useState([]);
    function handleDelete(user) {
        setUser(prev => prev.filter(item => item.id !== user.id))
    }
    return(
        <div className="side-bar flex flex-col text-white items-start bg-[#2B2D31] w-[20vw] h-[100vh]">
       
        {/* <input type="search" className='bg-[#1E1F22]' placeholder='hello'/> */}
        <div className='w-[100%] h-[60%]'>
            {users.map((user, id) => 
            <Link to={'/user/' + user.id} key={id}>         
            <div className='flex justify-between items-center mt-4' key={user.id}>
               <div className='flex items-center text-white'>
                <img src={user.url} className='rounded-full w-9 mr-1' alt="" />
                <p >{user.name}</p>
               </div> 
               {/* <p onClick={() => handleDelete(user)}>x</p> */}
            </div>
            </Link>
            )}
        </div>
        <Link to='/channel/discussion' className='flex justify-start items-center no-underline ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>discussion</p>
        </Link>
        <Link to='/channel/math' className='flex justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Mathematics</p>
        </Link>
        <Link to='/channel/physics' className='flex justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Physics</p>
        </Link>
        <Link to='/channel/science' className='flex justify-start items-center no-underline mt-4 ml-4 w-full hover:bg-black'>
       <FaHashtag /> <p className='ml-2'>Science</p>
        </Link>
        <div>
            <h1>help channels</h1>
        </div>
    </div>
    )
}