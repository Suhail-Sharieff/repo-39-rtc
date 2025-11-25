import { Server } from 'socket.io'
const PORT = 6969

const io = new Server(PORT, {
    cors: {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            // Allow any origin
            return callback(null, true);
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});
// const io = new Server(PORT, { cors: { origin: "*" } })

const emailSocketMap = new Map()
const socketEmailMap = new Map()

io.on('connection', (socket) => {
    console.log(`Client connected `, socket.id);
    socket.on('join_room', (data) => {
        const { email, room_id } = data
        console.log(`${email} joined ${room_id}`);
        emailSocketMap.set(email, socket.id)
        socketEmailMap.set(socket.id, email)
        socket.join(room_id)
        socket.broadcast.to(room_id).emit('user_joined', { email: email, socket_id: socket.id })
    })

    socket.on('user:call', ({ to, offer }) => {
        io.to(to).emit('incoming_call', { from: socket.id, offer })
    })

    socket.on('call:accepted', ({ to, ans }) => {
        io.to(to).emit('call:accepted', { from: socket.id, ans })
    })

    socket.on('peer:nego:needed', ({ to, offer }) => {
        io.to(to).emit('peer:nego:needed', { from: socket.id, offer })
    })

    socket.on('peer:nego:done', ({ to, ans }) => {
        io.to(to).emit('peer:nego:final', { from: socket.id, ans })
    })
})