import React, { useRef } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const peerConnections = {};

const AppContext = React.createContext({
  config: {},
  //socket: {},
  myVideo: null,
  watcherVid: null,
  broadcastSetup: () => {},
  watcherSetup: () => {}
});

export const AppContextProvider = ({ children }) => {

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  };
  const myVideo = useRef(null);
  const watcherVid = useRef()

  const broadcastSetup = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        //socket.id
        socket.emit("broadcaster");
      })
      .catch((error) => console.error(error));
    socket.on("watcher", (id) => {
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      let stream = myVideo.current.srcObject;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
      //console.log(stream)

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
    });

    socket.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", (id) => {
      peerConnections[id].close();
      delete peerConnections[id];
    });
  };

  const watcherSetup = () =>{

    socket.on("offer", (id, description) => {
      let peerConnection;
      peerConnection = new RTCPeerConnection(config);
      peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("answer", id, peerConnection.localDescription);
        });
      peerConnection.ontrack = event => {
        watcherVid.current.srcObject = event.streams[0];
      };
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };
      socket.on("candidate", (id, candidate) => {
        peerConnection
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
      });
      
      socket.on("connect", () => {
        socket.emit("watcher");
      });
      
      socket.on("broadcaster", () => {
        socket.emit("watcher");
      });
      
      window.onunload = window.onbeforeunload = () => {
        socket.close();
        peerConnection.close();
      };
      
    });
    
  } 


  const contextValue = {
    config: config,
    //socket:socket,
    myVideo: myVideo,
    watcherVid: watcherVid,
    broadcastSetup: broadcastSetup,
    watcherSetup: watcherSetup
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
export default AppContext;

// socket.emit('tryout', 'pussy is the goal', 100)

// socket.on('recieve-try', (msg, num) =>{
//   console.log(msg, num)
// })

// socket.on("connect", () => {
//   socket.emit("watcher");
// });

// socket.on("broadcaster", () => {
//   socket.emit("watcher");
// });
