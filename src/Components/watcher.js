import React, { useContext, useEffect } from "react";
import AppContext from '../context/App-context';



const Watcher = () => {

  const appCxt = useContext(AppContext)

  useEffect(() =>{
    appCxt.watcherSetup()
      console.log(appCxt.watcherVid)

  },[])

  const watcherVid = appCxt.watcherVid

  return (
    <>
      watcher
      <video autoPlay={true} height={'100%'} width={'100%'} ref={watcherVid} muted={true} ></video>

    </>
  )
}

export default Watcher;