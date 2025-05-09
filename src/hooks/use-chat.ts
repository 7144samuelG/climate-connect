import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

const useChat = () => {
    const chat = useAction(api.gemini.chat)

    return async (text:string, noteId: Id<'note'>) => {
        const dochat = await chat({text, noteId})

        return dochat
    }
}

export default useChat