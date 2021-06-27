import '../styles/mostrar-pergunta.scss'
import {ReactNode} from 'react'
import cx from 'classnames'

type MostrarPerguntaProps = {
    duvida: string;
    autor: {
        nome: string;
        avatar: string;
    };
    respondida?:boolean;
    emDestaque?:boolean;
    children?: ReactNode;
}


export function MostrarPergunta({
    duvida,
    autor,
    respondida = false,
    emDestaque = false,
    children,
}: MostrarPerguntaProps) {

    return (
        <div className={cx('mostrar-pergunta',
        {respondida: respondida},
        {emdestaque: emDestaque && !respondida}
        )}>
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