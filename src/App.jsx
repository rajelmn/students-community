import {useState} from 'react';
import SideBar from './sideBar';
import './App.css';
import Main from './mainContent'
import { Outlet } from 'react-router-dom';

export default function App() {

  return(
   <div className='flex'>
    <SideBar />
    <Outlet />
   </div>
  )
}


// export function Root() {
//   return(
//     <div className='flex'>
//     <SideBar />
//     <Main />
//     </div>
//   )
// }