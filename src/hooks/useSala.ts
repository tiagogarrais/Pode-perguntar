import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"


type PerguntasType = {
    id: string,
    autor: {
        nome: string;
        avatar: string;
    }

    duvida: string;
    respondida: boolean;
    emDestaque: boolean;
    numeroLikes: number;
    likeId: string | undefined;
}

type PerguntasArmazenadas = Record<string, {
    autor: {
        nome: string;
        avatar: string;
    }

    duvida: string;
    respondida: boolean;
    emDestaque: boolean;
    likes: Record<string, {
        autorId: string,
        data: string,
    }>
}>



export function UseSala(salaId: string) {
    const [perguntas, setPerguntas] = useState<PerguntasType[]>([])
    const [titulo, setTitulo] = useState('')
    const {user} = useAuth()

    useEffect(() => {
        const roomRef = database.ref(`salas/${salaId}`)
    
    
        roomRef.on('value', sala => {
            const databaseRoom = sala.val()
            const perguntasArmazenadas: PerguntasArmazenadas = databaseRoom.perguntas ?? {}
    
            const parsedQuestions = Object.entries(perguntasArmazenadas).map(([key, value]) => {
                return {
                    id: key,
                    duvida: value.duvida,
                    autor: value.autor,
                    emDestaque: value.emDestaque,
                    respondida: value.respondida,
                    numeroLikes: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.autorId === user?.id)?.[0]
                }
            })
            setTitulo(databaseRoom.title)
            setPerguntas(parsedQuestions)
        })

        return()=>{
            roomRef.off('value')
        }

    }, [salaId, user?.id])

    return{ perguntas, titulo }
}
