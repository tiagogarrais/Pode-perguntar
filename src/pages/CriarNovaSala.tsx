import {FormEvent, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import {Button} from '../components/Button'
import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

export function CriarNovaSala(){
    const {user} = useAuth()
    const history = useHistory()

    const [novaSala, setNovaSala] = useState('')

    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault()
        if (novaSala.trim() ===''){
            return
        }

        const roomRef = database.ref('salas')

        const firebaseRoom = await roomRef.push({
            title: novaSala,
            authorID: user?.id,
        })

        history.push(`/salas/${firebaseRoom.key}`)
        
        
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de perguntas e respostas ao vivo</strong>
                <p>Tire as dúvidas dos seus seguidores em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Pode perguntar" />
                    <p>Bem vindo {user?.name}</p>
                    <img src={user?.avatar} alt="Foto do usuário logado no sistema" />
                    <h2>Crie uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Nome da sala"
                            value={novaSala}
                            onChange={event => setNovaSala(event.target.value)}

                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}