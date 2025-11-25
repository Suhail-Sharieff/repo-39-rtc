import { createContext, useContext, useMemo } from "react";
import {io} from 'socket.io-client'
const SocketContext=createContext(null)
export const useSocket=()=>{
    const socket=useContext(SocketContext)
    return socket
}
export const SocketProvider=(props)=>{
    const socket=useMemo(()=>io('https://n5pdppx0-6969.inc1.devtunnels.ms'),[])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}