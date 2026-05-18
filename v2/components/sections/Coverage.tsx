'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Heart, Clock, Stethoscope, Pill } from 'lucide-react';

const plans = [
  {
    title: 'Základní ošetřovatelská péče',
    price: 'Hrazeno pojišťovnou',
    features: ['Převazy a ošetření ran', 'Podávání léků', 'Aplikace injekcí', 'Měření vitálních funkcí'],
    icon: Heart,
    color: 'from-medical-50 to-white',
  },
  {
    title: 'Specializovaná zdravotní péče',
    price: 'Částečná úhrada',
    features: ['Rehabilitační péče', 'Péče o stomie', 'Enterální výživa', 'Odběr krve'],
    icon: Stethoscope,
    color: 'from-beige-50 to-white',
  },
  {
    title: 'Komplexní 24/7 péče',
    price: 'Individuální plán',
    features: ['Nepřetržitý dohled', 'Paliativní péče', 'Lůžková péče doma', 'Psychologická podpora'],
    icon: ShieldCheck,
    color: 'from-medical-50 to-white',
  },
];

export default function Coverage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="coverage" ref={ref} className="py-28 px-6 bg-beige-50/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-medical-600 font-semibold uppercase tracking-wide">Úhrada péče</span>
          <h2 className="text-4xl md:text-5xl font-light mt-2 text-gray-900">
            Dostupná péče pro <span className="font-semibold">každého pacienta</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Nabízíme flexibilní možnosti úhrady od zdravotních pojišťoven až po individuální plány.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12, transition: { type: 'spring', stiffness: 300 } }}
              className={`bg-gradient-to-br ${plan.color} rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all`}
            >
              <plan.icon className="text-medical-500 mb-5" size={44} strokeWidth={1.2} />
              <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-medical-600 text-sm font-medium mb-6">{plan.price}</p>
              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-gray-700">
                    <Pill size={16} className="text-medical-400" />
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
