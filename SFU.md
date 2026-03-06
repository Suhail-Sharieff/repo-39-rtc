- WKT websrtc p2p appraoch sucks for atleast more than 8 peers
- Solution is SFU(Single forwarding unit) arch and MCU(mutipoint control unit)
- SFU is based on relays ie just forwards whatever it gets hence very CPU freinfly and no complex setup, MCU combines as streams into one and bradcasts
## Mediasoup for SFU
- We need to have a signaling server(a node server for my case), using mediasoup library, it can create workers, workers creates routes
- Routes ensure that ppl of same room's media pass through same route
- Route can create Transport = SendTransport + RecvTransport
## Flow
- Alice clicks on call button(lets say audo only for now, same works for video too or combo)
- Alice forms a device using medisasoup client library
- Device has a transaport which also has send+recv transport
- Alice gets its ice candidates from ICE servers(interative connectivity establishment)
- Now alice forwards its ice candidates to 
