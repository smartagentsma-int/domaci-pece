'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Users, Briefcase, Award, HeartHandshake } from 'lucide-react';

const stats = [
  { label: 'Let zkušeností', value: '15+', icon: Briefcase },
  { label: 'Spokojených pacientů', value: '2,500+', icon: Users },
  { label: 'Odborný tým', value: '48', icon: HeartHandshake },
  { label: 'Certifikace', value: '12', icon: Award },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Profesionální pečovatelka"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-medical-900/20 to-transparent" />
          </motion.div>

          {/* Text side */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="text-medical-600 font-semibold tracking-wide text-sm uppercase"
            >
              O nás
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light mt-2 mb-6 text-gray-900"
            >
              Kvalitní péče s <span className="font-semibold">lidským srdcem</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg leading-relaxed mb-8"
            >
              Poskytujeme komplexní domácí zdravotní péči pacientům všech věkových kategorií.
              Naším posláním je umožnit lidem zůstat v domácím prostředí, které znají a milují,
              i když potřebují odbornou lékařskou pomoc nebo ošetřovatelskou péči.
            </motion.p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="glass-card rounded-2xl p-5 text-center"
                >
                  <stat.icon className="mx-auto text-medical-500 mb-3" size={32} />
                  <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
