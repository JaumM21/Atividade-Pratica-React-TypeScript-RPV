import { NavLink } from "react-router-dom"
import { Cards } from "../../components/cads"

export function Home (){
    return(
        <>
        <div className="flex flex-col items-center px-16 py-16 bg-zinc-600 min-h-screen">
            <div className="flex flex-col items-center mb-10">
                <img src="/logo.png" alt="Logo QuickTools" className="w-12 h-12 mb-2" />
                <h2 className="text-2xl font-bold text-white">Boas vindas ao QuickTools</h2>
            </div>
            <div className="flex justify-center items-center gap-8">
                <NavLink to="/taskMaster" ><Cards titulo="Task Master" descricao= "Adição, listagem e remoção de tarefas"></Cards></NavLink>
                <NavLink to="/connectHub"><Cards titulo="Connect Hub" descricao="Cadastro de novos contatos"></Cards></NavLink>
                <NavLink to="/moneyFlow"><Cards titulo="Money Flow" descricao="Registro de entradas e saídas"></Cards></NavLink>
            </div>
        </div>
        </>
    )
}