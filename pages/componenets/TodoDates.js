import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { dateToJSON, firestore, toDate } from "../lib/firebase";
import {v4 as uuidv4} from "uuid"
import {TiDeleteOutline} from "react-icons/ti"
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

export default function TodoDates() {
    const [lists, setLists] = useState([{"uid": null, "createdDate": null}])
    const {todoID, setTodoID} = useContext(UserContext);

    function setContext(value){ 
        setTodoID(value);
    }

    function handleAdd(){
        const uuid = uuidv4()
        const docRef = setDoc(doc(firestore, "todo", uuid), {
            uid: uuid,
            createdDate: serverTimestamp()
        })
    }
    
    async function handleRemove(uid){
        const docRef = doc(firestore, "todo", uid)
        await deleteDoc(docRef);
    }

    useEffect(() => {
        const todoListQuery = query(collection(firestore, "todo"), orderBy("createdDate", "desc"))

        const unsubscribe = onSnapshot(todoListQuery, (snapshot) => {
            const lists = snapshot.docs.map(doc => ({
                ...doc.data(),
                createdDate: doc.data().createdDate?.toDate().toDateString()
            }));
            setLists(lists);

            if (lists.length != 1){
                const _lists = lists.slice(0)
                const _poo = _lists.shift()
                
                for (let i = 0; i < _lists.length; i++){
                    if (_lists[i].createdDate == lists[i].createdDate){
                        toast.warn("You sure you need more than 1 list a day?", {
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
        });

        return unsubscribe
    }, []);

    return (
        <div className="flex flex-col">
            <div key="todoDates_appContainer" className="todoApp-container">
                <ul key="todoDates_container" className="items-container">
                    <li key="input_box_todoDates" className="todoLists mb-5 text-center font-semibold text-opacity-50" onClick={handleAdd}>ADD NEW</li>
                    {lists ? 
                        lists.filter(({uid}) => uid != null).map(({uid, createdDate}, index) => 
                        <div key={"div_" + uid} className="relative flex align-middle justify-center items-center">
                        <li key={uid} className="todoLists w-full" onClick={() => setContext(uid)}>
                            {createdDate}
                        </li>
                        <span key={"span_" + uid} onClick={() => handleRemove(uid)} className="cursor-pointer absolute right-6 top-[22px] group"><AiOutlineDelete key={"del_" + uid} className="text-gray-50 opacity-20 text-2xl group-hover:text-red-500 group-hover:opacity-100"/></span>
                        </div>)
                    : null
                    }
                </ul>
            </div>
        </div>
    )
}
