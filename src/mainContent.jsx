import Header from './header'
import { useParams } from 'react-router-dom'
import { users } from './users';
export default function Main() {
    const {userId} = useParams();
    let test = users.find(user => user.id === 3) // user
    console.log(test)
    const theUser = users.find(item => item.id == userId);
    console.log(theUser) // undefined
    return(
        <div className="container bg-background ml-auto w-[80vw] h-[100vh] text-white">
            {
            theUser? (
                <>
                <Header url={theUser.url} userName={theUser.userName}/>
                <div className='mt-9 flex flex-col items-start ml-4'>
            <img src={theUser.url} className='rounded-full w-24' />
            <p className='font-bold text-4xl ml-4 mt-1 '>{theUser.name}</p>
            <p className='ml-4 mt-2 text-[24px]'>{theUser.userName}</p>
            <p className="ml-4 mt-4">this is the beginning of your direct message history with <b>{theUser.name}</b></p>
            <div className='flex w-[50%] justify-between items-center'>
                <span>2 mutual servers</span>
                <div>
                    <button>Add Freind</button>
                    <button>Block</button>
                    <button>Report Spam</button>
                </div>
            </div>
           </div>
                </>
            )  :  (
                <>
                <Header />
                
                </>
            )  }
            
        </div>
    )
}