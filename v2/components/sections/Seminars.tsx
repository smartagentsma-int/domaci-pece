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
