
interface CardPropriedades {
    titulo: string;
    descricao: string;
}


export function Cards({ titulo, descricao }: CardPropriedades) {

    return (
        <>
            <div className="flex flex-col items-center justify-center bg-amber-300 w-96 h-96 rounded-xl gap-4 p-6 hover:bg-amber-400 transition-colors">
                <div className="text-zinc-900 text-4xl text-center mb-2">
                    <p> {titulo} </p>
                </div>
                <div className="items-center px-4 text-xl text-zinc-900 text-center">
                    <p>{descricao}</p>
                </div>
            </div>
        </>
    )
}