import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaPaperPlane, FaTimes, FaUser, FaSun, FaMoon, FaRobot, FaCheck, FaCheckDouble } from 'react-icons/fa';

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: string; time: string; status: 'sent' | 'delivered' | 'seen' }[]>([
    { text: "Hello! How can we help you today?", sender: "Support Agent", time: "2:30 PM", status: 'seen' }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Speak the greeting when the chat is opened
      const utterance = new SpeechSynthesisUtterance("Hello, how can we help you");
      window.speechSynthesis.speak(utterance);
    }
  };
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:8080/ws');

      socketRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      socketRef.current.onmessage = (event) => {
        const receivedMessage = JSON.parse(event.data);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setChatMessages(prevMessages => [...prevMessages, {
            text: receivedMessage.text,
            sender: receivedMessage.sender,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'seen'
          }]);
        }, 1500);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !socketRef.current) return;

    const newMessage = {
      text: message,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const
    };

    socketRef.current.send(JSON.stringify(newMessage));
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setChatMessages(prevMessages =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 ? { ...msg, status: 'delivered' as const } : msg
        )
      );
    }, 1000);

    // Simulate message seen
    setTimeout(() => {
      setChatMessages(prevMessages =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1 ? { ...msg, status: 'seen' as const } : msg
        )
      );
    }, 2000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const chatVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-gradient-to-r from-blue-400 to-teal-500'} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComments size={28} />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-24 right-6 w-96 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl overflow-hidden z-50`}
          >
            <motion.div 
              className={`${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-indigo-700' : 'bg-gradient-to-r from-blue-500 to-teal-600'} text-white p-4 flex justify-between items-center`}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-bold text-lg">Live Chat Support</h3>
              <div className="flex items-center">
                <motion.button 
                  onClick={toggleDarkMode} 
                  className="text-white hover:text-gray-200 focus:outline-none mr-2"
                  whileHover={{ rotate: 180, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </motion.button>
                <motion.button 
                  onClick={toggleChat} 
                  className="text-white hover:text-gray-200 focus:outline-none"
                  whileHover={{ rotate: 90, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>
            </motion.div>
            <div ref={chatContainerRef} className={`h-96 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              {chatMessages.map((msg, index) => (
                <motion.div 
                  key={index} 
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}
                  variants={messageVariants}
                >
                  <motion.div 
                    className={`max-w-3/4 ${msg.sender === 'You' 
                      ? (isDarkMode ? 'bg-indigo-700 text-white' : 'bg-blue-100 text-blue-800') 
                      : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-white')} p-3 rounded-lg shadow-md`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <div className="flex items-center mt-2 justify-between">
                      <div className="flex items-center">
                        {msg.sender === 'You' ? <FaUser className={`${isDarkMode ? 'text-indigo-300' : 'text-blue-500'} mr-1`} size={12} /> : <FaRobot className={`${isDarkMode ? 'text-green-300' : 'text-green-500'} mr-1`} size={12} />}
                        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{msg.sender}, {msg.time}</p>
                      </div>
                      {msg.sender === 'You' && (
                        <div className="ml-2">
                          {msg.status === 'sent' && <FaCheck className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={12} />}
                          {msg.status === 'delivered' && <FaCheckDouble className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={12} />}
                          {msg.status === 'seen' && <FaCheckDouble className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={12} />}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  className="flex justify-start mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-3 rounded-lg shadow-md`}>
                    <div className="flex space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-300'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <form onSubmit={handleSubmit} className={`p-4 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-grow p-3 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300'} border rounded-l-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-indigo-500' : 'focus:ring-blue-500'} focus:border-transparent transition-colors duration-300`}
                />
                <motion.button
                  type="submit"
                  className={`${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700' : 'bg-gradient-to-r from-blue-400 to-teal-500 hover:from-blue-500 hover:to-teal-600'} text-white p-3 rounded-r-lg transition-colors duration-300 focus:outline-none`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;