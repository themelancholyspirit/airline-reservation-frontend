import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPlane, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import backgroundVideo from '../assets/videos/travel-background.mp4';
import { useAuth } from '../AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReverse, setIsReverse] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (!isReverse && video.currentTime >= video.duration - 0.1) {
          video.playbackRate = -1;
          setIsReverse(true);
        } else if (isReverse && video.currentTime <= 0.1) {
          video.playbackRate = 1;
          setIsReverse(false);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [isReverse]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setName('');
      setEmail('');
      setPassword('');
      setIsLoggedIn(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during signup. Please try again.');
        console.error(err);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signupAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  if (showAnimation) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaPlane className="text-white text-8xl" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-white text-4xl font-bold text-center"
        >
          Welcome aboard, {name}!
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ delay: 1, duration: 1.5 }}
          className="h-1 bg-white mt-4 rounded-full"
        />
      </motion.div>
    );
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={signupAnimation}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-white">Join AirlineReservation</h1>
          <p className="text-xl text-gray-300 max-w-sm mx-auto">
            Create your account to start booking flights and enjoying exclusive member benefits.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-white border-opacity-20">
          <div className="space-y-6">
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <label htmlFor="name" className="block mb-2 text-sm font-semibold text-white">Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                  placeholder="Enter your name"
                  autoComplete="off"
                />
              </div>
            </motion.div>
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-white">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                  placeholder="Enter your email"
                  autoComplete="off"
                />
              </div>
            </motion.div>
            <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-white">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {error}
                </motion.div>
              )}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-green-500 text-sm mt-2"
                >
                  {successMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(59, 130, 246)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full"
                />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </div>
          <div className="mt-6">
            <p className="text-center text-white mb-4">Or sign up with</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-red-600 text-white p-2 rounded-full"
              >
                <FaGoogle />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-600 text-white p-2 rounded-full"
              >
                <FaFacebook />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-black text-white p-2 rounded-full"
              >
                <FaApple />
              </motion.button>
            </div>
          </div>
        </form>
        <div className="mt-8 text-center text-gray-300">
          <p>
            Already have an account? <Link to="/login" className="text-white hover:underline font-semibold">Login</Link>
          </p>
          <Link
            to="/"
            className="mt-4 text-white hover:underline flex items-center justify-center mx-auto"
          >
            <FaHome className="mr-2" /> Return to Main Page
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
