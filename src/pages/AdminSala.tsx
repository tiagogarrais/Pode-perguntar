import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import deleteImg from '../assets/images/delete.svg'


import { Button } from '../components/Button'
import { MostrarPergunta } from '../components/MostrarPergunta'
import { CodigoSala } from '../components/CodigoSala'
import { UseSala } from '../hooks/useSala'
import { database } from '../services/firebase'

import '../styles/sala.scss'

type RoomParams = {
    id: string
}

export function AdminSala() {

    const history = useHistory()
    const params = useParams<RoomParams>()
    const salaId = params.id
    
    const { perguntas, titulo } = UseSala(salaId)
 
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

    async function handleMarcarPerguntaComoRespondida(perguntaId: string) {
            await database.ref(`salas/${salaId}/perguntas/${perguntaId}`).update({
                respondida: true,
            })
    }

    async function handleDarDestaquePergunta(perguntaId: string) {
        await database.ref(`salas/${salaId}/perguntas/${perguntaId}`).update({
            emDestaque: true,
        })
}



    return (
        <div id="page-room">
            <header>
                <div className="content">
                        <img src={logoImg} alt="Pode perguntar"/>
                    <div>
                        <CodigoSala codigo={salaId} />
                        <Button isOutlined onClick={handleFinalizaSala}>Encerrar sala</Button>
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
                                    onClick={() => handleMarcarPerguntaComoRespondida(pergunta.id)}
                                >
                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button>

                                <button
                                    type='button'
                                    onClick={() => handleDarDestaquePergunta(pergunta.id)}
                                >
                                    <img src={answerImg} alt="Dar destaque à pergunta" />
                                </button>

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