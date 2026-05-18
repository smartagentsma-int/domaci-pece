'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Calendar, Heart, Shield } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.to(parallaxRef.current, {
      y: 200,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  const floatingIcons = [
    { icon: Heart, delay: 0, x: -100, y: -50 },
    { icon: Calendar, delay: 2, x: 120, y: 80 },
    { icon: Shield, delay: 1, x: -50, y: 150 },
  ];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <div ref={parallaxRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-beige-100/50 to-white/90 z-10" />
        <Image
          src="https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"
          alt="Elderly care professional"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Floating 3D icons */}
      {floatingIcons.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute z-20 hidden lg:block text-medical-400/30"
          style={{ left: `calc(50% + ${item.x}px)`, top: `calc(50% + ${item.y}px)` }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <item.icon size={64} strokeWidth={0.8} />
        </motion.div>
      ))}

      <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 leading-[1.1] mb-6 text-balance"
        >
          Profesionální domácí péče
          <br />
          <span className="font-semibold text-medical-600">s lidským přístupem</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Pomáháme pacientům zůstat doma bezpečně, důstojně a s odbornou péčí.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-5 justify-center"
        >
          <button className="bg-medical-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-medical-700 transition-all hover:shadow-lg hover:-translate-y-1">
            Kontaktujte nás
          </button>
          <button className="border-2 border-medical-600 text-medical-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-medical-50 transition-all hover:-translate-y-1">
            Zjistit více
          </button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <ArrowDown className="text-gray-500" size={32} />
        </motion.div>
      </div>
    </section>
  );
}
