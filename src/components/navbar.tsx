import { NavLink, useLocation } from "react-router-dom";

export interface INavbar {
    rotaSelecionada:string
}


export function Menu ()
{
    const {pathname} = useLocation()
    const rotaSelecionada = pathname
    console.log("pathname", rotaSelecionada)

    return(<>
        <nav className="flex items-center bg-amber-300 w-screen h-16 px-16 py-2 text-zinc-900"> 
            <div className="flex items-center justify-between w-screen text-xl">
                 <li className="list-none flex items-center gap-2"><NavLink to= "/"><img className= "w-12 h-12" src="/logo.png" alt="Logo QuickTools" /><span className="text-xl font-bold"> QuickTools </span></NavLink></li>
            <ul className="flex flex-row gap-6 text-xl">
                <li className="hover:bg-amber-400 rounded-sm px-3 py-3"><NavLink to="/" >Home</NavLink></li>
                <li className="hover:bg-amber-400 rounded-sm px-3 py-3"><NavLink to="/taskMaster" >Task Master</NavLink></li>
                <li className="hover:bg-amber-400 rounded-sm px-3 py-3"><NavLink to="/connectHub">Connect Hub</NavLink></li>
                <li className="hover:bg-amber-400 rounded-sm px-3 py-3"><NavLink to="/moneyFlow">Money Flow</NavLink></li>
            </ul>
            </div>
        </nav>
    </>
    )
}