
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
<div className="wrapper flex flex-col justify-center text-black bg-[#f5f5f5] min-h-screen w-full items-center">
  <h1 className="mb-6 text-4xl font-semibold text-gray-800 text-center">
    Welcome to our <span className="text-orange-500">community</span>
  </h1>
  <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md sm:w-96">
    <h2 className="mb-4 text-2xl font-medium text-gray-700">Register</h2>
    <form className="space-y-6" ref={form} onSubmit={handleSubmit}>
      <div className="mt-4">
        <label htmlFor="name" className="block text-gray-600 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="block w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-500 border-gray-300"
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="userName"
          className="block text-gray-600 font-medium"
          style={{ color: error ? 'red' : 'black' }}
        >
          Username
        </label>
        <input
          type="text"
          ref={userNameInput}
          id="userName"
          name="userName"
          className="block w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-500 border-gray-300"
          placeholder="Enter your username"
          required
        />
      </div>
      <div className="mt-4">
        <label htmlFor="password" className="block text-gray-600 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="block w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-500 border-gray-300"
          placeholder="Enter your password"
          required
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-600 font-medium">Your profile image</label>
        <input
          type="file"
          name="myImage"
          accept="image/png, image/jpg, image/jpeg"
          className="block w-full mt-2 p-3 border rounded-md bg-white focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-500 border-gray-300"
          required
        />
      </div>
      <button
        type="submit"
        className="block w-full h-12 mt-6 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-transform duration-300 ease-in-out transform hover:scale-105 active:scale-95"
        onClick={() => {
          document.querySelector("button").classList.add("animate-pulse");
        }}
        onAnimationEnd={() => {
          document.querySelector("button").classList.remove("animate-pulse");
        }}
      >
        Register
      </button>
      
    </form>
  </div>
</div>


    )
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
