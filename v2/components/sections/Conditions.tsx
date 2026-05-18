'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ClipboardList, Clock, Home, Users } from 'lucide-react';

const faqs = [
  {
    question: 'Jaké jsou podmínky pro poskytování domácí péče?',
    answer: 'Pacient musí mít stabilní zdravotní stav umožňující péči v domácím prostředí. Vyžadujeme doporučení ošetřujícího lékaře a uzavření smlouvy o poskytování zdravotních služeb.',
    icon: ClipboardList,
  },
  {
    question: 'Jaká je minimální doba úvazku péče?',
    answer: 'Minimální návštěva je 2 hodiny, maximální frekvence je 4x denně dle potřeb pacienta. Dlouhodobá péče je možná 24/7 s přestávkami.',
    icon: Clock,
  },
  {
    question: 'Mohu péči kdykoliv ukončit?',
    answer: 'Ano, výpovědní lhůta je 14 dní. V případě akutního zhoršení stavu zajišťujeme předání do nemocniční péče.',
    icon: Home,
  },
  {
    question: 'Je možná kombinace s rodinnou péčí?',
    answer: 'Rozhodně, aktivně spolupracujeme s rodinnými příslušníky a proškolujeme je v základní ošetřovatelské péči.',
    icon: Users,
  },
];

export default function Conditions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="conditions" className="py-28 px-6 bg-beige-50/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-medical-600 font-semibold uppercase">Podmínky péče</span>
          <h2 className="text-4xl font-light mt-2">Často kladené <span className="font-semibold">otázky</span></h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left"
              >
                <div className="flex gap-4 items-center">
                  <faq.icon className="text-medical-500" size={24} />
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5 text-gray-600 border-t border-gray-100"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
