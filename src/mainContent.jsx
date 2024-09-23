import Header from './header'
import { useParams, Link } from 'react-router-dom'
import { users } from './users';
export default function Main() {
    const {userId} = useParams();
    // const BlockMath = ReactKaTeX.BlockMath;
    let test = users.find(user => user.id === 3) // user
    console.log(test)
    const theUser = users.find(item => item.id == userId);
    console.log(theUser) // undefined
    return(
        <div className="container bg-background ml-auto  h-[100vh] text-white">
            {
            theUser? (
                    <>
                    {/* <Header url={theUser.url} userName={theUser.userName}/> */}
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
                    <h1 className='text-3xl font-bold'>Welcome to our community</h1>
                    {/* <Header /> */}
                    <ul>
    
                    <li className='mt-6'>visit {<Link className="text-[orange]" to="/channel/math">#math</Link>} for math discussion</li>
                    <li className='mt-6'> visit {<Link className="text-[orange]" to="/channel/physics">#physics</Link>} for physics discussion</li>
                    <BlockMath math="\\int_0^\\infty x^2 dx"/>
                    </ul>
                </>
            )  }

        </div>
    )
}
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';
// import { useState } from 'react';

// export default function Main () {
//     const [latex, setLatex] = useState([]);
    
//     function handleSubmit(e) {
//         e.preventDefault();
//         console.log(e.target.input.value);
//         if(e.target.input.value.match(/[$]/gi)?.length !== 2) {
//             return alert('mf thats wrong')
//         }
//         const text = e.target.input.value;
//         console.log(text)
//         // console.log(e.target.input.value.replace(/[$]/gi, ''))
//         if(!e.target.input.value.match(/[$]/gi)){
//             console.log('condition is met weee');
//             return
//         }
//         setLatex(prev => [
//             ...prev, 
//             e.target.input.value.replace(/[$]/gi, '')
//         ])
//     }
//     return(
//         <div className='text-white flex flex-col overflow-auto justify-between text-2xl'>
//             <div className='h-[calc(100vh-80px)]'>
//         {latex.map((text) => 
//         <BlockMath math={text} />
//         )}
//             </div>
//         <form onSubmit={handleSubmit}>
//         <input type="text" name='input' className='absolue z-10 text-black w-full h-6 outline-none' />
//         </form>
//         </div>
//     )
// }