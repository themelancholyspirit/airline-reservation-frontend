import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaLock, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import { SiAmericanexpress, SiVisa, SiMastercard } from 'react-icons/si';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface StripePaymentFormProps {
  amount: number;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onPaymentComplete, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('Please log in to proceed with payment.');
      navigate('/login');
      return;
    }
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  if (!isLoggedIn) {
    return null;
  }

  const paymentMethods = [
    { id: 'visa', icon: <SiVisa className="text-2xl" /> },
    { id: 'mastercard', icon: <SiMastercard className="text-2xl" /> },
    { id: 'amex', icon: <SiAmericanexpress className="text-2xl" /> },
    { id: 'paypal', icon: <FaPaypal className="text-2xl" /> },
    { id: 'applepay', icon: <FaApplePay className="text-2xl" /> },
    { id: 'googlepay', icon: <FaGooglePay className="text-2xl" /> },
  ];

  const handleOtherPaymentMethod = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full m-4"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center justify-between">
          <span className="flex items-center">
            <FaCreditCard className="mr-2 text-blue-600" /> Secure Payment
          </span>
          <span className="text-sm font-normal text-gray-600">Amount: ${amount.toFixed(2)}</span>
        </h2>
        <div className="mb-6 flex justify-between items-center">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-lg transition-all ${
                paymentMethod === method.id
                  ? 'bg-blue-100 text-blue-600 shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {method.icon}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {paymentMethod === 'visa' && (
            <motion.form
              key="visa-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="card-number">
                  Card Number
                </label>
                <input
                  type="text"
                  id="card-number"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="expiry">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="cvc">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" /> Pay with Visa
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
          {paymentMethod === 'mastercard' && (
            <motion.form
              key="mastercard-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="card-number">
                  Card Number
                </label>
                <input
                  type="text"
                  id="card-number"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="5555 5555 5555 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="expiry">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="cvc">
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" /> Pay with Mastercard
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
          {paymentMethod === 'amex' && (
            <motion.form
              key="amex-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="card-number">
                  Card Number
                </label>
                <input
                  type="text"
                  id="card-number"
                  className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="3782 822463 10005"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={17}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="expiry">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="cvc">
                    CID
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="1234"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock className="mr-2" /> Pay with American Express
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
          {paymentMethod === 'paypal' && (
            <motion.div
              key="paypal-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtherPaymentMethod}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaPaypal className="mr-2" /> Pay with PayPal
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
          {paymentMethod === 'applepay' && (
            <motion.div
              key="applepay-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <p className="text-gray-600 mb-4">Complete your payment using Apple Pay.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtherPaymentMethod}
                  className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaApplePay className="mr-2" /> Pay with Apple Pay
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
          {paymentMethod === 'googlepay' && (
            <motion.div
              key="googlepay-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <p className="text-gray-600 mb-4">Complete your payment using Google Pay.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleOtherPaymentMethod}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all flex items-center border border-gray-300"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaGooglePay className="mr-2" /> Pay with Google Pay
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-xs text-gray-500 mt-6 text-center">
          Your payment information is encrypted and secure. We do not store your card details.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StripePaymentForm;