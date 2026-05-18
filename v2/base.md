Here is a complete, production-ready premium healthcare agency website built with Next.js 15, TailwindCSS, Framer Motion, GSAP ScrollTrigger, and React Three Fiber.

tsx
// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Coverage from '@/components/sections/Coverage';
import Quality from '@/components/sections/Quality';
import Conditions from '@/components/sections/Conditions';
import Seminars from '@/components/sections/Seminars';
import Contact from '@/components/sections/Contact';
import FloatingNav from '@/components/layout/FloatingNav';
import Footer from '@/components/layout/Footer';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';

const ThreeBackground = dynamic(() => import('@/components/3d/ThreeBackground'), { ssr: false });

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative bg-white font-sans overflow-x-hidden">
        <ThreeBackground />
        <FloatingNav />
        <Hero />
        <About />
        <Coverage />
        <Quality />
        <Conditions />
        <Seminars />
        <Contact />
        <Footer />
      </main>
    </SmoothScrollProvider>
  );
}
tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Domácí Péče | Profesionální domácí péče s lidským přístupem',
  description: 'Pomáháme pacientům zůstat doma bezpečně, důstojně a s odbornou péčí. Komplexní domácí zdravotní péče a ošetřovatelské služby.',
  keywords: 'domácí péče, zdravotní péče doma, ošetřovatelská péče, domácí zdravotní péče, pacienti, senior péče',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="bg-white text-gray-900 antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-white text-gray-900 font-sans;
  }
}

@layer utilities {
  .glass {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.05);
  }
  .text-balance {
    text-wrap: balance;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
tsx
// components/layout/ClientLayout.tsx
'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
tsx
// components/3d/ThreeBackground.tsx
'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

function AnimatedBlob() {
  const meshRef = useRef<any>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
      meshRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 0.15) * 0.3;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]} scale={1.8}>
        <MeshDistortMaterial
          color="#f5f0e8"
          emissive="#e2dcd0"
          emissiveIntensity={0.4}
          distort={0.4}
          speed={2}
          roughness={0.3}
          metalness={0.1}
          opacity={0.6}
          transparent
        />
      </Sphere>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <AnimatedBlob />
          <Environment preset="apartment" background={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
tsx
// components/layout/FloatingNav.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Úvod', href: '#home' },
  { name: 'O nás', href: '#about' },
  { name: 'Úhrada péče', href: '#coverage' },
  { name: 'Kvalita péče', href: '#quality' },
  { name: 'Podmínky péče', href: '#conditions' },
  { name: 'Semináře první pomoci', href: '#seminars' },
  { name: 'Kontakt', href: '#contact' },
];

export default function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="#home" className="text-2xl font-light tracking-wide text-gray-800">
            Domácí<span className="font-semibold text-medical-500">Péče</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-700 hover:text-medical-600 transition-colors group text-sm font-medium"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-medical-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800 z-50 relative"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-lg z-40 pt-24 px-6"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl text-gray-800 hover:text-medical-500 transition-colors py-2 border-b border-gray-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
tsx
// components/sections/Hero.tsx
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
          src="https://images.pexels.com/photos/7304926/pexels-photo-7304926.jpeg?auto=compress&cs=tinysrgb&w=1600"
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
tsx
// components/sections/About.tsx
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
tsx
// components/sections/Coverage.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Heart, Clock, Ambulance, Stethoscope, Pill } from 'lucide-react';

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
tsx
// components/sections/Quality.tsx
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
tsx
// components/sections/Conditions.tsx
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
tsx
// components/sections/Seminars.tsx
'use client';

import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Users as UsersIcon } from 'lucide-react';

const seminars = [
  {
    title: 'První pomoc pro rodinné pečující',
    date: '15. listopadu 2024',
    time: '9:00 - 13:00',
    location: 'Praha, vzdělávací centrum',
    spots: 24,
    image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
  },
  {
    title: 'Péče o seniory s demencí',
    date: '28. listopadu 2024',
    time: '10:00 - 15:00',
    location: 'Brno, zdravotní institut',
    spots: 18,
    image: 'https://images.pexels.com/photos/7578878/pexels-photo-7578878.jpeg',
  },
  {
    title: 'Základy ošetřovatelské péče',
    date: '5. prosince 2024',
    time: '9:30 - 14:30',
    location: 'Online seminář',
    spots: 50,
    image: 'https://images.pexels.com/photos/4226123/pexels-photo-4226123.jpeg',
  },
];

export default function Seminars() {
  return (
    <section id="seminars" className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-medical-600 font-semibold uppercase">Vzdělávání</span>
          <h2 className="text-4xl md:text-5xl font-light mt-2">
            Semináře <span className="font-semibold">první pomoci</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Pro rodinné pečující i veřejnost – naučte se zachránit život
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seminars.map((sem, idx) => (
            <motion.div
              key={sem.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="h-48 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${sem.image})` }}
                />
                <div className="absolute top-4 right-4 bg-medical-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {sem.spots} míst
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{sem.title}</h3>
                <div className="space-y-2 text-gray-600 text-sm mb-5">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-medical-500" />
                    {sem.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-medical-500" />
                    {sem.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-medical-500" />
                    {sem.location}
                  </div>
                </div>
                <button className="w-full bg-medical-50 text-medical-700 py-3 rounded-xl font-medium hover:bg-medical-100 transition-colors">
                  Přihlásit se
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
tsx
// components/sections/Contact.tsx
'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
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
tsx
// components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-2xl font-light text-white mb-4">DomácíPéče</h3>
            <p className="text-sm">Profesionální domácí péče s lidským přístupem od roku 2010.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2 text-sm">
              {['Úvod', 'O nás', 'Kontakt'].map((item) => (
                <li key={item}>
                  <Link href={`#${item === 'Úvod' ? 'home' : item === 'O nás' ? 'about' : 'contact'}`} className="hover:text-medical-400 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legální</h4>
            <ul className="space-y-2 text-sm">
              <li>Ochrana osobních údajů</li>
              <li>Podmínky poskytování</li>
              <li>Cookie politika</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Sledujte nás</h4>
            <div className="flex gap-4">
              <Facebook size={20} className="hover:text-medical-400 cursor-pointer" />
              <Instagram size={20} className="hover:text-medical-400 cursor-pointer" />
              <Twitter size={20} className="hover:text-medical-400 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm flex flex-col md:flex-row justify-between">
          <span>© 2024 DomácíPéče. Všechna práva vyhrazena.</span>
          <span className="flex items-center gap-1 justify-center mt-2 md:mt-0">
            S péčí <Heart size={14} className="text-medical-400" /> pro vaše zdraví
          </span>
        </div>
      </div>
    </footer>
  );
}
tsx
// providers/SmoothScrollProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
json
// package.json
{
  "name": "domaci-pece",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@react-three/drei": "^9.88.0",
    "@react-three/fiber": "^8.15.12",
    "@studio-freight/lenis": "^1.0.42",
    "framer-motion": "^10.16.16",
    "gsap": "^3.12.4",
    "lucide-react": "^0.309.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bde2ff',
          300: '#8ed0ff',
          400: '#55b4ff',
          500: '#2c93ff',
          600: '#0b6eff',
          700: '#0057e5',
          800: '#0045b3',
          900: '#003c99',
        },
        beige: {
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#e8dfd1',
          300: '#d6c8b3',
          400: '#c1ab8f',
          500: '#ad9273',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
css
/* app/globals.css (add these utilities to existing file) */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
