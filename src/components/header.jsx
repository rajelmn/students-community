import { MdAddIcCall} from "react-icons/md";
import { HiOutlineHashtag } from "react-icons/hi";
import { IoVideocam, IoPersonAdd } from "react-icons/io5";
import { TiPin } from "react-icons/ti";
import { FaUserCircle } from "react-icons/fa";
import { RiInboxFill } from "react-icons/ri";
import { CiMenuBurger, CiSquareRemove  } from "react-icons/ci";
import { FiHelpCircle } from "react-icons/fi"

export default function header({ channelName, handleBurgerMenu, isClickedOnMenu}) {

    return(
        <>
        <div className=" header h-[55px] p-4 flex justify-between shadow-md text-white">
            <div className="burger-menu flex items-center cursor-pointer" onClick={handleBurgerMenu}>
           {isClickedOnMenu ? <CiSquareRemove className="text-3xl"/> : <CiMenuBurger className="text-2xl" />}    
            </div>
            <div className="logo flex items-center">
                <HiOutlineHashtag className="text-orange-500 text-2xl"/>
                <p>{channelName}</p>
            </div>
            <div className="icons text-[#B5BAC1;] w-[60%] justify-between flex items-center text-white ">
                <MdAddIcCall className="cursor-pointer text-2xl "/>   
                <IoVideocam className="cursor-pointer text-2xl"/>
                <TiPin className="cursor-pointer text-2xl"/>
                <IoPersonAdd className="cursor-pointer text-2xl" />
                <FaUserCircle className="cursor-pointer text-2xl"/>
                <input type="search"className = "bg-black w-[10vw] text-white" />
                <RiInboxFill className="cursor-pointer text-2xl"/>
                <FiHelpCircle className="cursor-pointer text-2xl"/>
            </div>
        </div>
            {/* {children} */}
        </>
    )
}

