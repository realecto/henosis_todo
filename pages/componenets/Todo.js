import { collection, onSnapshot, query } from "firebase/firestore"
import { useContext } from "react"
import { UserContext } from "../lib/context"
import { firestore } from "../lib/firebase"
import TodoDates from "./TodoDates"
import TodoList from "./TodoList"


export default function Todo() {
    const {todoID} = useContext(UserContext)
    
    return (
        <>  
            {todoID ?
                <TodoList/>
                :
                <TodoDates />
            }
        </>
    )
}