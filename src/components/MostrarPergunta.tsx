import '../styles/mostrar-pergunta.scss'
import {ReactNode} from 'react'

type MostrarPerguntaProps = {
    duvida: string;
    autor: {
        nome: string;
        avatar: string;
    };
    children?: ReactNode;
    respondida?: boolean;
    emDestaque?: boolean;
}


export function MostrarPergunta({
    duvida,
    autor,
    respondida = false,
    emDestaque = false,
    children,
}: MostrarPerguntaProps) {

    return (
        <div className="mostrar-pergunta">
            <p>
                {duvida}
            </p>

            <footer>
                <div className="user-info">
                    <img src={autor.avatar} alt={autor.nome} />
                    <span>{autor.nome}</span>
                </div>
                    {children}
            </footer>
        </div>
    )
}