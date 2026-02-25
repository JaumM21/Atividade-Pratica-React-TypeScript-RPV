import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


interface TipoTarefa extends TipoFormulario {
    id: string
}

interface IAjustarTarefa {
    id: string
    tipo: "ATUALIZAR" | "EXCLUIR"
}

const regrasTarefas = z.object({
    titulo: z.string().min(5, "Campo obrigatório").max(20, "Máximo de 20 caracteres"),
    categoria: z.enum(["Trabalho", "Pessoal", "Urgente"]),
    descricao: z.string().min(1, "Campo obrigatório").max(100, "Máximo de 100 caracteres"),
    ativo: z.boolean(),
    concluido: z.boolean()
})

type TipoFormulario = z.infer<typeof regrasTarefas>



export function TaskMaster() {
    const [tarefas, setTarefas] = useState<TipoTarefa[]>([])
    const [mostrarModal, setMostrarModal] = useState(false)
    const [idTarefaSelecionada, setIdTarefaSelecionada] = useState("")

    useEffect(() => {
        const tarefasArmazenadas = localStorage.getItem('tarefas')
        if (tarefasArmazenadas === null) {
            return setTarefas([])
        }
        setTarefas(JSON.parse(tarefasArmazenadas))
    }, [])

    const configFormulario = {
        resolver: zodResolver(regrasTarefas),
        defaultValues: {
            ativo: true,
            concluido: false,
        }
    }

    const { handleSubmit, register, reset, formState: { errors } } = useForm<TipoFormulario>(configFormulario)

    function enviaFormulario(valoresInput: TipoFormulario) {
        const novaTarefa: TipoTarefa = {
            ...valoresInput,
            id: Math.random().toString(36).replace(/^0\./, '').slice(0, 8)
        }
        const novasTarefas = [...tarefas, novaTarefa]
        setTarefas(novasTarefas)
        localStorage.setItem('tarefas', JSON.stringify(novasTarefas))
        reset()
        console.log("Tarefa adicionada:", novaTarefa)
    }

    function ajustarTarefa({ id, tipo }: IAjustarTarefa) {
        if (tipo === "ATUALIZAR") {
            const novoArrayTarefas = tarefas.map(tarefa => {
                if (tarefa.id === id) {
                    return { ...tarefa, concluido: !tarefa.concluido }
                }
                return tarefa
            })
            setTarefas(novoArrayTarefas)
            localStorage.setItem('tarefas', JSON.stringify(novoArrayTarefas))
        }
        if (tipo === "EXCLUIR") {
            const novoArrayTarefas = tarefas.filter(tarefa => tarefa.id !== id)
            setTarefas(novoArrayTarefas)
            localStorage.setItem('tarefas', JSON.stringify(novoArrayTarefas))
        }
    }

    return (
        <div className="flex flex-col w-screen items-center justify-center p-6 bg-zinc-600 min-h-screen">
            <h1 className="text-3xl font-bold mb-6"> TaskMaster </h1>
            <form onSubmit={handleSubmit(enviaFormulario)} className="space-y-4">

                <div>
                    <label htmlFor="titulo" className="flex flex-col gap-2 w-full h-25">Título
                        <input type="text" className="p-2 border" placeholder="Título da tarefa" {...register("titulo")} /> {errors.titulo && (
                            <span className="text-red-500 text-sm">{errors.titulo.message}</span>)}</label>

                </div>

                <div>
                    <label htmlFor="categoria" className="flex flex-col gap-2 w-full h-25"> Categoria
                        <select {...register("categoria")} className="w-full p-2 border ">
                            <option value="Trabalho">Trabalho</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Urgente">Urgente</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="descricao" className="flex flex-col gap-2 w-full h-25">Descrição
                        <input type="text" className="p-2 border " placeholder="Descrição da tarefa" {...register("descricao")} /> {errors.descricao && (<span className="text-red-500 text-sm">
                            {errors.descricao.message}</span>)}
                    </label>
                </div>
                <div className="flex justify-end gap-8 ">
                    <button type="reset" className="bg-red-500 text-zinc-50 px-4 py-2 rounded-md w-[100px] hover:bg-red-600" > Limpar </button>
                    <button type="submit" className="bg-amber-300 text-zinc-900 px-4 py-2 rounded-md w-[100px] hover:bg-amber-400" > Adicionar </button>
                </div>
            </form>


            <div className="mt-8">
                {tarefas.map((tarefa) => (
                    <div key={tarefa.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded gap-8">
                        <div className="flex flex-col">
                            <p className={`text-lg ${tarefa.concluido ? 'line-through' : ''}`}>Título : {tarefa.titulo}</p>
                            <p className={`text-lg ${tarefa.concluido ? 'line-through' : ''}`}>Descrição : {tarefa.descricao}</p>
                            <p className={`text-lg ${tarefa.concluido ? 'line-through' : ''}`}>Categoria: {tarefa.categoria}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className={`px-3 py-1 rounded-md text-zinc-50 ${tarefa.concluido ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500'}`}
                                onClick={() => ajustarTarefa({ id: tarefa.id, tipo: "ATUALIZAR" })}
                                disabled={tarefa.concluido}>
                                Concluir
                            </button>
                            <button className="bg-red-500 text-zinc-50 px-3 py-1 rounded-md" onClick={() => {
                                setIdTarefaSelecionada(tarefa.id)
                                setMostrarModal(true)
                            }}>Apagar</button>
                        </div>
                    </div>
                ))}
            </div>


            {mostrarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4">
                        <h2 className="text-xl font-bold">Confirmar exclusão</h2>
                        <p>Deseja realmente apagar esta tarefa?</p>
                        <div className="flex justify-end gap-4">
                            <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setMostrarModal(false)}>Não</button>
                            <button className="bg-red-500 text-zinc-50 px-4 py-2 rounded-md"
                                onClick={() => {
                                    ajustarTarefa({ id: idTarefaSelecionada, tipo: "EXCLUIR" })
                                    setMostrarModal(false)
                                }}> Sim</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
