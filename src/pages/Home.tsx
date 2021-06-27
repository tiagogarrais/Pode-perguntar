import { useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.scss'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'


export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()
    const [codigoSala, setCodigoSala] = useState('')

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/salas/criarnovasala')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (codigoSala.trim() === '') {
            alert("É necessário incluir um nome para criar a sala")
            return
        }

        const roomRef = await database.ref(`salas/${codigoSala}`).get()

        if (!roomRef.exists()) {
            alert("Esta sala não existe!")
            return
        }

        if(roomRef.val().salaFinalizada){
            alert("Esta sala foi encerrada")
            return
        }

        if(roomRef.val().authorID === user?.id){
            history.push(`/admin/salas/${codigoSala}`)
            return
        }

        console.log(roomRef.val())

        history.push(`/salas/${codigoSala}`)
    }


    return (
        <div id="page-auth">
            <aside>
                <img
                    src={illustrationImg}
                    alt="Ilustração simbolizando perguntas e respostas"
                />
                <strong>Crie salas de perguntas e respostas ao vivo</strong>
                <p>Tire as dúvidas dos seus seguidores em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                        <img
                            src={logoImg}
                            alt="Pode perguntar"
                            //onClick={()=> (history.push('/'))}
                        />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logomarca do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            value={codigoSala}
                            onChange={event => setCodigoSala(event.target.value)}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}