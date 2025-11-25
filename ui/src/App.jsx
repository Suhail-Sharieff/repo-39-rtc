import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Route,Routes} from 'react-router-dom'
import { Lobby } from "./pages/Lobbby.jsx";
import { Room } from './pages/Room.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
        <Route path='/' element={<Lobby />}></Route>
        <Route path='/room/:room_id' element={<Room/>}></Route>
      </Routes> 
    </>
  )
}

export default App
