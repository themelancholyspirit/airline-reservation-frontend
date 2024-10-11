import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { name, email, message });
    // Reset form fields
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative bg-black text-white py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/contact-hero.jpg" 
            alt="Airplane in the sky" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <motion.h1 
            className="text-7xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <p className="text-2xl mb-12 text-center max-w-3xl mx-auto leading-relaxed">
            We're here to help. Get in touch with us for any inquiries or support.
          </p>
        </motion.div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-800">Get in Touch</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Have questions about your reservation, our services, or need assistance? 
                We're just a message away. Fill out the form, and our team will get back to you shortly.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-2xl text-blue-500" />
                  <span className="text-gray-700">support@airlinereservation.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FaPhone className="text-2xl text-blue-500" />
                  <span className="text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FaMapMarkerAlt className="text-2xl text-blue-500" />
                  <span className="text-gray-700">123 Airline Street, Sky City, 54321</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Email"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <FaPaperPlane />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Visit Our Office</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1842353696583!2d-73.98823492404045!3d40.757977838733246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1687134110150!5m2!1sen!2sus" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
