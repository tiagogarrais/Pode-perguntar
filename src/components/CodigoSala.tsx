import copyImg from '../assets/images/copy.svg'
import '../styles/codigo-sala.scss'

type CodigoSalaProps = {
    codigo:string
}

export function CodigoSala(props:CodigoSalaProps){

    function copiarCodigoSalaClipboard(){
        navigator.clipboard.writeText(props.codigo)
    }

    return(
        <button className="codigo-sala" onClick={copiarCodigoSalaClipboard}>
            <div>
                <img src={copyImg} alt="Copiar o código da sala" />
            </div>
            <span>Sala {props.codigo} </span>
        </button>
    )
}