import { useContext, useEffect } from 'react';


import AppContext from '../context/App-context';


const Streams = () => {

    const appCxt = useContext(AppContext)

    // const setUp = appCxt.broadcastSetup 
    useEffect(()=>{
      appCxt.broadcastSetup()

    },[])
    const myVideo = appCxt.myVideo


  return (
    <>

      <video autoPlay={true} height={'100%'} width={'100%'} ref={myVideo} muted={true} ></video>
    </>
  );

}


export default Streams