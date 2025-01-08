import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import { EditingContext, UserContext } from "../lib/context"
import { firestore, getListWithID } from "../lib/firebase";
import {AiOutlineEdit, AiOutlineDelete} from "react-icons/ai"
import {ImCheckboxChecked, ImCheckboxUnchecked} from "react-icons/im"
import TodoForm from "./TodoForm";
import { DragDropContext, Droppable, Draggable} from "@hello-pangea/dnd";
import { styled } from "@xstyled/styled-components";

export default function TodoList({ }) {
    
    const {todoID, setTodoID} = useContext(UserContext);
    const [isEditing, setEditing] = useState(false)
    const [items, setItems] = useState([{}])
    const [currentEdit, setCurrentEdit] = useState({})
    // const [isDragging, setDragging] = useState(false)

    // TODO: Create editing functionality
    async function handleToggle(id, done){
        // console.log(id, message, done)
        const docRef = doc(firestore, "todo", todoID, "items", id)
        await updateDoc(docRef, {
            done: !done,
        })
    }

    async function handleRemove(id){
        const docRef = doc(firestore, "todo", todoID, "items", id)
        await deleteDoc(docRef);
    }

    function handleEditing(_message, _uid){
        setEditing(!isEditing)
        setCurrentEdit({
            uid: _uid,
            message: _message,
        })
    }

    //Pull data from firestore and updates renders realtime. Removing and Editing functionalities are easy since realtime updates appends the whole new list of items again.
    useEffect(() => {
        const itemsRef = query(collection(firestore, "todo", todoID, "items"), orderBy("updatedAt", "desc"))

        const unsubscribe = onSnapshot(itemsRef, (querySnapshot) => {
            const _items = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                updatedAt: doc.data().updatedAt?.toDate().toDateString()
            }));
            setItems(_items)
        });
        
        return unsubscribe
        
    }, [])

    const onDragEnd = (result) => {
        const {source, destination} = result
        if (!destination) return
    
        const todos = Array.from(items)
        const [newOrder] = todos.splice(source.index, 1)
        todos.splice(destination.index, 0, newOrder)
        setItems(todos)

        //TODO update item index, maybe upon dropping run through list and search which index the uid is at, and update accordingly
      }

    const Items = styled.li`
        box-shadow: ${props => (props.isDragging ? "0px 0px 15px #272727":"")};
        transition: .5s;
        transition-timing-function: ${props => (props.isDropAnimating ? "ease-in-out" : "")}
    `

    return (
        <div className="flex flex-col">
        <span key="goBack_span" className="mx-10 mb-20"><button key="goBack" type="button" onClick={() => setTodoID("")} className="btn-dark">Go back</button></span>
        <DragDropContext onDragEnd={onDragEnd}>
            <div key="todoList_appContainer" className="todoApp-container">
                {isEditing? <div key="edit_container" className="form-container"><TodoForm key="edit_input" message={currentEdit.message} id={currentEdit.uid} isEditing={isEditing} setEditing={setEditing} setCurrentEdit={setCurrentEdit}/></div> : <div key="form_container" className="form-container"><TodoForm key="form_input"/></div>}
                    <Droppable droppableId="items_droppable_container">
                        {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef}
                            key="item_container" className="items-container">
                            {items ? 
                            items.filter(({uid}) => uid != null).map(({uid, message, done}, index) => 
                            <Draggable draggableId={uid} key={uid} index={index}>
                                {(provided, snapshot) => (
                                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} 
                                    key={"div_" + uid} className="items-wrapper group">
                                    <Items key={uid} className={done? "items-done items":"items"} isDragging={snapshot.isDragging && !snapshot.isDropAnimating} >
                                        {message}
                                    </Items>
                                    <span key={"span1_" + uid} onClick={() => handleEditing(message, uid)} className="edit_icon duration-300 group/edit"><AiOutlineEdit key={"edit_" + uid} className="opacity-0 text-gray-700 group-hover:opacity-100 group-hover/edit:text-blue-500 text-xl"/></span>
                                    <span key={"span2_" + uid} onClick={() => handleRemove(uid)}className="delete_icon group/delete duration-300"><AiOutlineDelete key={"del_" + uid} className="text-gray-700 group-hover/delete:text-red-500 text-xl"/></span>
                                    <span key={"span3_" + uid} onClick={() => handleToggle(uid, done)}className="check_boxes hover:brightness-200 duration-100">
                                        <ImCheckboxUnchecked key={"unchecked_" + uid} className={done ? "opacity-0 hidden":" text-gray-700 opacity-100 block"}/>
                                        <ImCheckboxChecked key={"checked_" + uid} className={done ? "text-green-500 opacity-100 block":" opacity-0 hidden"}/>
                                    </span>
                                </li>
                                )}
                            </Draggable>)
                            : 
                            null
                            }
                            {provided.placeholder}
                        </ul>
                        )}
                    </Droppable>
                    {/* <div>
                        {items?
                        items.filter(({uid}) => uid != null).map(({}, index) => 
                            <li className="list-none text-white">{index+1}</li>
                        ) : null }
                    </div> */}
                </div>
            </DragDropContext>
        </div>
    )
}