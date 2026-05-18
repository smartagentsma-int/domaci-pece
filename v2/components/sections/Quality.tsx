'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Shield, Star, Award, Leaf, Users } from 'lucide-react';

const timeline = [
  { year: '2024', title: 'Nejvyšší standard kvality', desc: 'Certifikace ISO 9001:2024', icon: Award },
  { year: '2023', title: 'Tým odborníků', desc: 'Navýšení týmu o 20 specialistů', icon: Users },
  { year: '2022', title: 'Inovace v domácí péči', desc: 'Spuštění telemedicíny', icon: Shield },
  { year: '2021', title: 'Certifikace', desc: 'Akreditace MZČR', icon: CheckCircle },
];

export default function Quality() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="quality" ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-medical-600 font-semibold uppercase tracking-wide">Kvalita péče</span>
          <h2 className="text-4xl md:text-5xl font-light mt-2 text-gray-900">
            Naše <span className="font-semibold">certifikace</span> a standardy
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-medical-200" />

          {timeline.map((item, idx) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: idx * 0.15 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="flex-1 bg-beige-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <item.icon className="text-medical-500 mb-3" size={32} />
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
              <div className="flex-shrink-0 w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center z-10 mx-auto md:mx-0">
                <span className="font-bold text-medical-700">{item.year}</span>
              </div>
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {['Proškolený personál', 'Individuální plány péče', '24/7 podpora'].map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 justify-center p-4 rounded-xl bg-medical-50"
            >
              <Star className="text-medical-500 fill-medical-200" size={20} />
              <span className="font-medium">{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
