import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';



const socket = io('https://basic-chat-74h4.onrender.com/');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null); 

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));

    // Obtener mensajes guardados en localStorage
    const savedMessages = JSON.parse(localStorage.getItem('chat_messages')) || [];
    setMessages(savedMessages);

    socket.on('chat_message', (data) => {
      setMessages((messages) => {
        const updatedMessages = [...messages, data];
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages)); // Guardar mensajes en localStorage
        return updatedMessages;
      });
    });

    // API para obtener usuarios aleatorios
   

    return () => {
      socket.off('connect');
      socket.off('chat_message');
    };
  }, []);

  useEffect(() => {
    // Desplazar hacia el último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); 
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('chat_message', {
      user: socket.id,
      message: newMessage,
    });
    setNewMessage('');
  };

  return (
    <>
      <h1 className='text-center mt-12 font-bold h-full'>{isConnected ? 'Usuario Conectado' : 'No conectado'}</h1>

      <div className='m-0 h-[90vh] py-12 grid grid-rows-1 place-content-center'>
        <section className='border-2 rounded-md overflow-hidden w-[350px] h-full relative'>
          <ul className='m-0 p-0 overflow-y-scroll pb-12 h-full scroll-smooth'>
            {messages.map((mensaje) => (
              <li className='p-2 odd:bg-slate-200' key={mensaje.user}>
                {mensaje.message}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
          <form className='bottom-0 flex h-12 left-0 right-0 absolute p-1'>
            <input
              value={newMessage}
              className='border-2 p-2 rounded-md flex-1 m-1'
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className='border-0 pr-5' type='submit' onClick={sendMessage}>Enviar</button>
          </form>
        </section>
      </div>
    </>
  );
}

export default App;
