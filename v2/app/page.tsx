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
