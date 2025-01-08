import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react"
import { AiOutlineEnter } from "react-icons/ai"
import { EditingContext, UserContext } from "../lib/context"
import { firestore } from "../lib/firebase";
import { v4 as uuidv4 } from "uuid"
import { toast, ToastContainer } from "react-toastify";

export default function TodoForm({message, id, isEditing, setEditing, setCurrentEdit}) {
    const [value, setValue] = useState("")
    const {todoID} = useContext(UserContext);
    const [_message, _setMessages] = useState("");
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const inputRef = useRef(null);

    async function handleFocus(){
        _setMessages(message)
        await delay(500)
        _setMessages("")
    }

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus()
        }

        if (_message){
            setValue(_message)
        }
    })

    const handleSubmit = (e, isEditing, id, message) => {
        //Write value to firestore
        e.preventDefault()

        if (isEditing) {
            if (value != message && value.length > 1) {
                const docRef = doc(firestore, "todo", todoID, "items", id)
                updateDoc(docRef, {
                    message: value,
                })
                setEditing(!isEditing)
                setCurrentEdit([])
                setValue("")
            } else {
                setValue("")
                setEditing(!isEditing)
                inputRef.current.blur()
                toast.error('Minimum character length is 2', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } else {
            const uuid = uuidv4()
            if (value.length > 1) {
                const docRef = setDoc(doc(firestore, "todo", todoID, "items", uuid), {
                    uid: uuid,
                    message: value,
                    done: false,
                    updatedAt: serverTimestamp(),
                })
                setValue("")
            } else {
                toast.error('Minimum character length is 2', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, isEditing, id, message)}>
            <div className="relative flex items-center justify-center w-full">
                <input type="text" maxLength="100" className="input-box peer" value={value} onFocus={() => handleFocus()} onChange={(e) => setValue(e.target.value)} ref={inputRef}/>
                <span className="absolute top-0 right-8 h-full flex items-center justify-center opacity-0 peer-focus:opacity-30 duration-75 pointer-events-none"><AiOutlineEnter className="relative top-[6px] stroke-[50] text-black"/></span>
                <span className={value ? 
                                        "placeholder opacity-0 peer-focus:opacity-0 duration-75 "
                                        : 
                                        message ? "placeholder opacity-100 peer-focus:opacity-0" : "placeholder opacity-60 peer-focus:opacity-0"
                                }>I am going to... </span>
                </div>          
        </form>
    )
}