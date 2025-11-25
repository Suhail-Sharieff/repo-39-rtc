import { use, useCallback, useEffect, useState } from "react"
import { useSocket } from "../context/SocketContext"
import { data, useNavigate } from "react-router-dom"

export const Lobby=()=>{

    const socket=useSocket()
    const navigate=useNavigate()

    const [email,setEmail]=useState("")
    const [room,setRoom]=useState("")
    const handleJoin=useCallback((e)=>{
        e.preventDefault()
        socket.emit('join_room',{email:email,room_id:room}) 
        navigate(`/room/${room}`)
    },[email,room,socket])

    useEffect(()=>{

        return ()=>{
            socket.off('join_room',handleJoin)
        }
    })

    return (
        <>
            <h1>Lobbby</h1>

            <form>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={email}  onChange={(e)=>setEmail(e.target.value)}/>
                <label htmlFor="room">RoomID</label>
                <input type="text" name="room" id="room" value={room} onChange={(e)=>setRoom(e.target.value)}/>
                <button onClick={handleJoin}>Join</button>
            </form>

        </>
    )
}