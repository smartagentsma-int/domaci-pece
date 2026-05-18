'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Děkujeme za zprávu, ozveme se vám do 24 hodin.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-28 px-6 bg-gradient-to-br from-beige-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-medical-600 font-semibold uppercase">Kontaktujte nás</span>
          <h2 className="text-4xl md:text-5xl font-light">Jsme tu pro <span className="font-semibold">vás</span></h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-6">Kontaktní informace</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Phone className="text-medical-500" size={24} />
                  <div>
                    <p className="font-medium">+420 777 123 456</p>
                    <p className="text-sm text-gray-500">Non-stop 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-medical-500" size={24} />
                  <div>
                    <p>info@domaci-pece.cz</p>
                    <p className="text-sm text-gray-500">Odpovídáme do 2 hodin</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-medical-500" size={24} />
                  <div>
                    <p>Na Příkopě 15, Praha 1</p>
                    <p className="text-sm text-gray-500">Pondělí - Pátek 8-16h</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-64 rounded-2xl overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.296654657503!2d14.427586!3d50.087086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b944f2f0f0f0f%3A0x0!2zNTDCsDUnMTMuNSJOIDE0wrAyNSczOS4zIkU!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-semibold mb-6">Napište nám</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Vaše jméno"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-medical-400 transition"
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-medical-400 transition"
                required
              />
              <textarea
                rows={5}
                placeholder="Vaše zpráva"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-medical-400 transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-medical-600 text-white py-3 rounded-xl font-medium hover:bg-medical-700 transition flex items-center justify-center gap-2"
              >
                Odeslat zprávu <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
