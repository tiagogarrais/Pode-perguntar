import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import { Button } from '../components/Button'
import { CodigoSala } from '../components/CodigoSala'
import { useHistory, useParams } from 'react-router-dom'
import { MostrarPergunta } from '../components/MostrarPergunta'
import { UseSala } from '../hooks/useSala'
import '../styles/sala.scss'
import { database } from '../services/firebase'

type RoomParams = {
    id: string
}

export function AdminSala() {

    const params = useParams<RoomParams>()
    const salaId = params.id
    const { perguntas, titulo } = UseSala(salaId)
    const history = useHistory()

    async function handleFinalizaSala() {
        await database.ref(`salas/${salaId}`).update({
            salaFinalizada: new Date(),
        })
        
        history.push('/');
    }


    async function handleDeletaPergunta(perguntaId: string) {
        if (window.confirm("Tem certeza que deseja excluir esta pergunta?")) {
            await database.ref(`salas/${salaId}/perguntas/${perguntaId}`).remove()
        }
    }



    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <a href="/">
                        <img
                            src={logoImg}
                            alt="Pode perguntar"
                        />
                    </a>
                    <div>
                        <CodigoSala codigo={salaId} />
                        <Button
                            isOutlined
                            onClick={handleFinalizaSala}
                        >
                            Encerrar sala
                        </Button>

                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {titulo} </h1>
                    {perguntas.length > 0 && <span> {perguntas.length} pergunta(s)</span>}
                </div>

                <div className="listagem-questoes">
                    {perguntas.map(pergunta => {
                        return (
                            <MostrarPergunta
                                key={pergunta.id}
                                duvida={pergunta.duvida}
                                autor={pergunta.autor}
                            >
                                <button
                                    type='button'
                                    onClick={() => handleDeletaPergunta(pergunta.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />

                                </button>

                            </MostrarPergunta>
                        )
                    })}
                </div>
            </main>

        </div>
    )
}