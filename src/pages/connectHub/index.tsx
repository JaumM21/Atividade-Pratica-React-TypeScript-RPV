import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface IAjustarContato {
    id: string
    tipo: "EXCLUIR"
}

const regrasContato = z.object({
    nomeCompleto: z.string().min(1, "Campo obrigatório"),
    email: z.email("E-mail inválido"),
    telefone: z.string().regex(/^\d+$/, "Telefone deve conter apenas números").min(1, "Campo obrigatório"),
})

type TipoFormulario = z.infer<typeof regrasContato>

interface TipoContato {
    id: string
    nomeCompleto: string
    email: string
    telefone: string
}


export function ConnectHub() {
    const [contatos, setContatos] = useState<TipoContato[]>([])
    const [mostrarModal, setMostrarModal] = useState(false)
    const [idContatoSelecionado, setIdContatoSelecionado] = useState("")

    useEffect(() => {
        const contatosArmazenados = localStorage.getItem('contatos')
        if (contatosArmazenados === null) {
            return setContatos([])
        }
        setContatos(JSON.parse(contatosArmazenados))
    }, [])

    const { handleSubmit, register, reset, formState: { errors } } = useForm<TipoFormulario>({
        resolver: zodResolver(regrasContato),
    })

    function enviaFormulario(valoresInput: TipoFormulario) {
        const novoContato: TipoContato = {
            ...valoresInput,
            id: Math.random().toString(36).substring(2, 9)
        }
        const novosContatos = [...contatos, novoContato]
        setContatos(novosContatos)
        localStorage.setItem('contatos', JSON.stringify(novosContatos))
        reset()
    }

    function ajustarContato({ id, tipo }: IAjustarContato) {
        if (tipo === "EXCLUIR") {
            const novoArrayContatos = contatos.filter(contato => contato.id !== id)
            setContatos(novoArrayContatos)
            localStorage.setItem('contatos', JSON.stringify(novoArrayContatos))
        }
    }

    return (
        <div className="flex flex-col w-screen items-center justify-center p-6 bg-zinc-600 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">ConnectHub</h1>
            <form onSubmit={handleSubmit(enviaFormulario)} className="space-y-4">

                <div>
                    <label htmlFor="nomeCompleto" className="flex flex-col gap-2 w-full h-25">Nome Completo
                        <input type="text" className="p-2 border" placeholder="Fulano de Tal" {...register("nomeCompleto")} />
                        {errors.nomeCompleto && (<span className="text-red-500 text-sm">{errors.nomeCompleto.message}</span>)}
                    </label>
                </div>

                <div>
                    <label htmlFor="email" className="flex flex-col gap-2 w-full h-25">E-mail
                        <input type="text" className="p-2 border" placeholder="exemplo@email.com" {...register("email")} />
                        {errors.email && (<span className="text-red-500 text-sm">{errors.email.message}</span>)}
                    </label>
                </div>

                <div>
                    <label htmlFor="telefone" className="flex flex-col gap-2 w-full h-25">Telefone
                        <input type="text" className="p-2 border" placeholder="(00) 0000-0000" {...register("telefone")} />
                        {errors.telefone && (<span className="text-red-500 text-sm">{errors.telefone.message}</span>)}
                    </label>
                </div>

                <div className="flex justify-end gap-8">
                    <button type="reset" className="bg-red-500 text-zinc-50 px-4 py-2 rounded-md w-[100px] hover:bg-red-600">Limpar</button>
                    <button type="submit" className="bg-amber-300 text-zinc-900 px-4 py-2 rounded-md w-[100px] hover:bg-amber-400">Adicionar</button>
                </div>
            </form>

            <div className="mt-10">
                {contatos.map((contato) => (
                    <div key={contato.id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded gap-8">
                        <div className="flex flex-col">
                            <p className="text-lg">Nome: {contato.nomeCompleto}</p>
                            <p className="text-lg">E-mail: {contato.email}</p>
                            <p className="text-lg">Telefone: {contato.telefone}</p>
                        </div>
                        <button className="bg-red-500 text-zinc-50 px-3 py-1 rounded-md" onClick={() => {
                            setIdContatoSelecionado(contato.id)
                            setMostrarModal(true)
                        }}>Apagar</button>
                    </div>
                ))}
            </div>

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Confirmar exclusão</h2>
                        <p>Deseja realmente apagar este contato?</p>
                        <div className="flex justify-end gap-4">
                            <button className="bg-gray-300 px-4 py-2 rounded-md" onClick={() => setMostrarModal(false)}> Não</button>
                            <button className="bg-red-500 text-zinc-50 px-4 py-2 rounded-md"onClick={() => {
                                ajustarContato({ id: idContatoSelecionado, tipo: "EXCLUIR" }) 
                                 setMostrarModal(false)}}> Sim</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}