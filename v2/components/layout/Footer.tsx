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
