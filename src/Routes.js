import Home from "./Components/home";
import Watcher from "./Components/watcher"; 
import Streams from "./Components/streams";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const routes = () => {
    return (
        <Router>
            <Routes>
                <Route path="streams" element={<Streams />} />
                <Route path="/watcher" element={<Watcher />} />
                <Route path="/" element={<Home />}/>
            </Routes>
        </Router>
    );
};
export default routes;