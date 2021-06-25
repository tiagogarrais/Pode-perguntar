import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { CodigoSala } from '../components/CodigoSala'
import { useParams } from 'react-router-dom'
import '../styles/sala.scss'
import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

type RoomParams = {
    id: string
}

type PerguntasArmazenadas = Record<string, {
    autor: {
        nome: string;
        avatar: string;
    }

    pergunta: string;
    respondida: boolean;
    emDestaque: boolean;
}>

type Perguntas = {
    id: string,
    autor: {
        nome: string;
        avatar: string;
    }

    pergunta: string;
    respondida: boolean;
    emDestaque: boolean;
}


export function Sala() {

    const params = useParams<RoomParams>()
    const salaId = params.id
    const [novaPergunta, setNovaPergunta] = useState('')
    const [perguntas, setPerguntas] = useState<Perguntas[]>([])
    const { user } = useAuth()
    const [titulo, setTitulo] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`salas/${salaId}`)


        roomRef.on('value', sala => {
            const databaseRoom = sala.val()
            const perguntasArmazenadas: PerguntasArmazenadas = databaseRoom.perguntas ?? {}

            const parsedQuestions = Object.entries(perguntasArmazenadas).map(([key, value]) => {
                return {
                    id: key,
                    pergunta: value.pergunta,
                    autor: value.autor,
                    emDestaque: value.emDestaque,
                    respondida: value.respondida,
                }
            })
            setTitulo(databaseRoom.title)
            setPerguntas(parsedQuestions)
        })
    }, [salaId])

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

                <p>{JSON.stringify(perguntas)}</p>
            </main>

        </div>
    )
}