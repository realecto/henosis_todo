import '@/styles/globals.css'
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './lib/context'
import { firestore } from './lib/firebase';
import { useTodoID } from './lib/hooks';
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [todoID, setTodoID] = useState("");
  const value = {todoID, setTodoID};

  return (
    <UserContext.Provider value={value}>
      <Component {...pageProps} />
      <ToastContainer/>
    </UserContext.Provider>
  )
}
