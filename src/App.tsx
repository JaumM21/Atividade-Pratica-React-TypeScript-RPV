import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import { Menu } from "./components/navbar";
import { TaskMaster } from "./pages/taskMaster";
import { Home } from "./pages/home";
import { ConnectHub } from "./pages/connectHub";
import { MoneyFlow } from "./pages/moneyFlow";

export function App() {
 
  return (
    <>
      <BrowserRouter>
       <Menu/>
        <Routes>
            <Route path = "/" element= {<Home/>} />
            <Route path = "taskMaster" element = {<TaskMaster/>} />
            <Route path="connectHub" element = {<ConnectHub/>}/>
            <Route path="moneyFlow" element= {<MoneyFlow/>}/>
        </Routes>
       </BrowserRouter>
    </>
  )
}


