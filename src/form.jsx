
// import { useStore } from "./store"
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import './index.css';
export default function FormPage() {
    const [file , setFile] = useState(null);
    const [error, setError] = useState(false);
    const form = useRef(null);
    const userNameInput = useRef(null);
    const navigate = useNavigate()
    
   async function handleSubmit(e){
        e.preventDefault();
        const user = {name: e.target.name.value, password: e.target.password.value, userName: e.target.userName.value}
        const formData = new FormData();
        formData.append('file', e.target.myImage.files[0])
        formData.append('user', JSON.stringify(user));    
        const regex = /[!@#$%^&*(),.?":{}|<>]/g;
        if((user.name.trim().length <= 3 || user.userName.trim().length <= 3) || user.password.trim().length <= 6) {
            return alert('please enter valid username , password')
        } else if(regex.test(user.name)) {
            return alert('user name shouldnt have any special charecters')
        }
        console.log(e.target.myImage.files[0])
        try {
            const res = await fetch('/register', {
                method: "POSt", 
                body: formData,
                credentials: "include",
            })
            console.log(res.ok)
           if(res.ok) {
            console.log('ok')
               navigate('/');
           }

            
        }
        catch(err) {
            console.error(err);
        }
   }

   return(
        <div className="wrapper flex flex-col justify-center  text-black bg-[#eee] h-screen w-screen items-center">
            <h1 className="mb-6 text-3xl ">Welcome to our <span className="text-orange-400">community</span> </h1>
               <div className="bg-white shadow-sm rounded-md p-5 pb-0">
                <h1 className="mb-2">register</h1>
            <form className="w-80" ref={form} onSubmit={handleSubmit}>
                <div className="mt-8">
                <label htmlFor="userName">name</label>
                <input type="text" id="name" minLength="3" name="name" className="block w-full p-2 focus:outline-none focus:ring-0 focus:border-[orange] border-solid border-[1px] border-slate-950" placeholder="enter your name" required/>
                </div>
                <div className="mt-8">
                <label htmlFor="userName" style={{outline: error? 'red' : 'black'}}>user name</label>
                <input type="text" minLength="3" ref={userNameInput} id="userName"  name="userName" className="block w-full p-2 focus:outline-none focus:ring-0 focus:border-[orange] border-solid border-[1px] border-slate-950" placeholder="enter your name" required/>
                </div>
                <div className="mt-8">
                <label htmlFor="password">password</label>
                <input type="password" minLength="6" id="password" name="password"  className="block p-2 w-full focus:outline-none focus:ring-0 focus:border-[orange] border-solid border-[1px] border-slate-950" placeholder="enter your password" required/>
                </div>
                <label className="mt-4 block">Your profile image
                    <input type="file" name="myImage" accept="image/png, image/jpg, image/jpeg" required />
                </label>
                <button className="block mt-2 text-white w-20 h-8 bg-orange-500 rounded-lg" type="submit">register</button>
                <>{error && 'user name already exist , try another one'}</>
            </form>
        </div>
        <form />
        </div> )
}




// function DisplayUser() {
//     const user = useStore((state) => state.user)
//     return <h1>{user} around here...</h1>
// }

// function SetUser() {
//     const setUser = useStore((state) => state.setUser)
//     return <button onClick = {() => setUser('brahim')} >set user</button>
// }

// export  function Form() {
//     return(
//         <>
//         <SetUser />
//         <DisplayUser />
//         </>

//     )
// }
