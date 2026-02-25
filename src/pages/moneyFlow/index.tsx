import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface TipoMovimento extends TipoFormulario {
    id: string
}

const regrasMovimento = z.object({
    descricao: z.string().min(1, "Campo obrigatório"),
    valor: z.number("Informe um valor válido").positive("O valor não pode ser zero ou negativo"),
    tipo: z.enum(["entrada", "saida"]),
})

type TipoFormulario = z.infer<typeof regrasMovimento>



export function MoneyFlow() {
    const [movimentos, setMovimentos] = useState<TipoMovimento[]>([])

    useEffect(() => {
        const movimentosArmazenados = localStorage.getItem('movimentos')
        if (movimentosArmazenados === null) {
            return setMovimentos([])
        }
        setMovimentos(JSON.parse(movimentosArmazenados))
    }, [])

    let saldoPositivo = 0
    let saldoNegativo = 0

    for (let i = 0; i < movimentos.length; i++) {
        if (movimentos[i].tipo === "entrada") {
            { saldoPositivo = saldoPositivo + movimentos[i].valor }
        }
        else { saldoNegativo = saldoNegativo + movimentos[i].valor }
    }

    const saldoTotal = saldoPositivo - saldoNegativo

    const { handleSubmit, register, reset, formState: { errors } } = useForm<TipoFormulario>({
        resolver: zodResolver(regrasMovimento),
        defaultValues: { tipo: "entrada" }
    })

    function enviaFormulario(valoresInput: TipoFormulario) {
        const novoMovimento: TipoMovimento = {
            ...valoresInput,
            id: Math.random().toString(36).replace(/^0\./, '').slice(0, 8)
        }
        const novosMovimentos = [...movimentos, novoMovimento]
        setMovimentos(novosMovimentos)
        localStorage.setItem('movimentos', JSON.stringify(novosMovimentos))
        reset()
    }

    return (
        <div className="flex flex-col w-screen items-center justify-center p-6 bg-zinc-600 min-h-screen">
            <div className="mb-6 text-center">
                <p className="text-lg text-gray-500">Saldo Total</p>
                <p className={`text-4xl font-bold ${saldoTotal >= 0 ? "text-green-600" : "text-red-500"}`}>
                    R$ {saldoTotal.toFixed(2)}
                </p>
            </div>

            <h1 className="text-3xl font-bold mb-6">MoneyFlow</h1>
            <form onSubmit={handleSubmit(enviaFormulario)} className="space-y-4">

                <div>
                    <label htmlFor="descricao" className="flex flex-col gap-2 w-full h-25">Descrição
                        <input type="text" className="p-2 border" placeholder="Salário" {...register("descricao")} />
                        {errors.descricao && (<span className="text-red-500 text-sm">{errors.descricao.message}</span>)}
                    </label>
                </div>

                <div>
                    <label htmlFor="valor" className="flex flex-col gap-2 w-full h-25">Valor
                        <input type="text" className="p-2 border" placeholder="R$ 0.00" {...register("valor", { valueAsNumber: true })} />
                        {errors.valor && (<span className="text-red-500 text-sm">{errors.valor.message}</span>)}
                    </label>
                </div>

                <div>
                    <label htmlFor="tipo" className="flex flex-col gap-2 w-full h-25">Tipo
                        <select {...register("tipo")} className="w-full p-2 border">
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </label>
                </div>

                <div className="flex justify-end gap-8">
                    <button type="reset" className="bg-red-500 text-zinc-50 px-4 py-2 rounded-md w-[100px] hover:bg-red-600">Limpar</button>
                    <button type="submit" className="bg-amber-300 text-zinc-900 px-4 py-2 rounded-md w-[100px] hover:bg-amber-400">Adicionar</button>
                </div>
            </form>

            <div className="mt-8">
                {movimentos.map((movimento) => (
                    <div key={movimento.id} className={`flex flex-col justify-center text-left p-3 mb-2 rounded ${movimento.tipo === "entrada" ? "bg-green-100" : "bg-red-100"}`}>
                        <p className="text-lg">Descrição: {movimento.descricao}</p>
                        <p className="text-lg">Valor: R$ {movimento.valor.toFixed(2)}</p>
                        <p className="text-lg">Tipo: {movimento.tipo === "entrada" ? "Entrada" : "Saída"}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}