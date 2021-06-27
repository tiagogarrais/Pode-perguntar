import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { CodigoSala } from '../components/CodigoSala'
import { useParams } from 'react-router-dom'
import '../styles/sala.scss'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { MostrarPergunta } from '../components/MostrarPergunta'
import { UseSala } from '../hooks/useSala'

type RoomParams = {
    id: string
}

export function Sala() {

    const params = useParams<RoomParams>()
    const salaId = params.id
    const [novaPergunta, setNovaPergunta] = useState('')
    const { user } = useAuth()
    const { perguntas, titulo } = UseSala(salaId)



    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()

        if (novaPergunta.trim() === '') {
            return
        }

        if (!user) {
            throw new Error("Você precisa estar logado")
        }

        const pergunta = {
            duvida: novaPergunta,
            autor: {
                nome: user.name,
                avatar: user.avatar,
            },
            emDestaque: false,
            respondida: false,
        }

        await database.ref(`salas/${salaId}/perguntas`).push(pergunta)
        setNovaPergunta('')
    }

    async function handleLikeQuestion(perguntaId: string, likeId: string | undefined) {
        if (likeId) {
            await database.ref(`salas/${salaId}/perguntas/${perguntaId}/likes/${likeId}`).remove()
        } else {
            await database.ref(`salas/${salaId}/perguntas/${perguntaId}/likes`).push({
                autorId: user?.id,
                data: Date(),
            })
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
                    <CodigoSala codigo={salaId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {titulo} </h1>
                    {perguntas.length > 0 && <span> {perguntas.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="Sua pergunta aqui"
                        onChange={event => setNovaPergunta(event.target.value)}
                        value={novaPergunta}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                />

                                <span>
                                    {user.name}
                                </span>
                            </div>
                        )
                            :
                            (<span>Para enviar uma pergunta, <button>faça seu login</button></span>)}
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>

                <div className="listagem-questoes">
                    {perguntas.map(pergunta => {
                        return (
                            <MostrarPergunta
                                key={pergunta.id}
                                duvida={pergunta.duvida}
                                autor={pergunta.autor}
                                respondida={pergunta.respondida}
                                emDestaque={pergunta.emDestaque}
                            >
                                <button
                                    className={`like-button ${pergunta.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    onClick={() => handleLikeQuestion(pergunta.id, pergunta.likeId)}
                                >
                                    {pergunta.numeroLikes > 0 && <span>{pergunta.numeroLikes}</span>}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </MostrarPergunta>

                        )
                    })}
                </div>
            </main>

        </div>
    )
}