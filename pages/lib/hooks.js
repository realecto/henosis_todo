import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "./firebase";

export function useTodoID(uid){

    const [todoID, setTodoID] = useState(null);
    
    useEffect(() => {
        if (uid) {
            const docRef = doc(firestore, "todo", uid)
            unsubscribe = onSnapshot(docRef, (snapshot) => {
                setTodoID(snapshot.data()?.uid);
                console.log("uid valid")
            });
        } else {
            setTodoID(null)
                console.log("uid not found")
        }
    }, [])

    return {todoID}
}