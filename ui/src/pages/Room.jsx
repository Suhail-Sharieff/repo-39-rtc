import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ReactPlayer from 'react-player'
import PeerService from '../service/PeerService'

export const Room = () => {
    const ps = useMemo(() => new PeerService(), []);
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);

    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const handleUserJoined = useCallback(({ email, socket_id }) => {
        console.log(`User joined: ${email} ${socket_id}`);
        setRemoteSocketId(socket_id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const offer = await ps.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
        console.log(`Incoming call from ${from}`, offer);
        const ans = await ps.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
    }, [socket]);

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            ps.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback(({ from, ans }) => {
        ps.setLocalDescription(ans);
        console.log("Call accepted!");
        sendStreams();
    }, [sendStreams]);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await ps.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    const handleNegoNeedIncoming = useCallback(async ({ from, offer }) => {
        const ans = await ps.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
    }, [socket]);

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await ps.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        ps.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        ps.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            ps.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    useEffect(() => {
        socket.on("user_joined", handleUserJoined);
        socket.on("incoming_call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncoming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user_joined", handleUserJoined);
            socket.off("incoming_call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncoming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedIncoming, handleNegoNeedFinal]);

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
            {myStream && <button onClick={sendStreams}>Send Stream</button>}
            {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
            {myStream && (
                <>
                    <h1>My Stream</h1>
                    <video
                        playsInline
                        muted
                        autoPlay
                        width="300px"
                        height="300px"
                        ref={(video) => {
                            if (video && myStream) {
                                video.srcObject = myStream;
                            }
                        }}
                    />
                </>
            )}
            {remoteStream && (
                <>
                    <h1>Remote Stream</h1>
                    <video
                        playsInline
                        autoPlay
                        width="300px"
                        height="300px"
                        ref={(video) => {
                            if (video && remoteStream) {
                                video.srcObject = remoteStream;
                            }
                        }}
                    />
                </>
            )}
        </div>
    );
};

