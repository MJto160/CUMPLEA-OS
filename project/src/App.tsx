import miFondoMovil from './pocoyo.jpg';
import miFondo from './fondo.jpg';
import miFondoMov from './estaes.jpg';
import foto1 from './foto1.jpeg';
import foto2 from './foto2.jpeg';
import foto3 from './foto3.jpeg';
import foto4 from './foto4.jpeg';
import foto5 from './foto5.jpeg';
import foto6 from './foto6.jpeg';
import foto7 from './foto7.jpeg';
import foto8 from './foto8.jpeg';
import foto9 from './foto9.jpeg';
import musicaPocoyo from './audio.mp3'; // Usa el nombre exacto de tu archivo mp3

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Gift,
  Cake,
  PartyPopper,
  MessageCircle,
  Check,
  X,
  Users,
  Heart,
  Music,
  Star,
  Sparkles,
  Trophy,
  Play,
  RotateCcw,
} from 'lucide-react';
import { supabase, type Rsvp } from '@/lib/supabase';

// ====== CONFIGURACIÓN DE LA FIESTA ======
const PARTY = {
  childName: 'Benjamín',
  age: 1,
  date: '2026-08-22T14:30:00',
  dateLabel: 'Sábado 22 de Agosto, 2026',
  timeLabel: '2:30 PM',
  place: 'Jardin de eventos el INJERTAL',
  address: 'Diagonal Sur 14, San Juan del Obispo',
  whatsappNumber: '3744 0925', // formato internacional, sin + ni espacios
  mapUrl: 'https://maps.app.goo.gl/8FgENLMDcZe8ZvkB7',
  adminPassword: 'benjamin2026', // contraseña para la vista privada de la anfitriona
};

const waLink = (text: string) =>
  `https://wa.me/${PARTY.whatsappNumber}?text=${encodeURIComponent(text)}`;

// ========================================

type Section = 'hero' | 'details' | 'countdown' | 'rsvp' | 'game' | 'gallery' | 'guests';

function useCountdown(target: string) {
  const targetMs = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

const POCOYO_COLORS = {
  blue: '#3CA8E0',
  yellow: '#F5D547',
  red: '#E8472D',
  green: '#7BC043',
  orange: '#F7941E',
  pink: '#F49AC4',
  navy: '#1B2A4A',
  cream: '#FFFDF5',
};

// Floating background shapes (Pocoyo-style simple geometry)
function FloatingShapes() {
  const shapes = [
    { type: 'circle', color: POCOYO_COLORS.yellow, size: 60, top: '8%', left: '6%', delay: '0s' },
    { type: 'star', color: POCOYO_COLORS.red, size: 50, top: '18%', left: '85%', delay: '1.2s' },
    { type: 'triangle', color: POCOYO_COLORS.green, size: 70, top: '60%', left: '4%', delay: '0.6s' },
    { type: 'circle', color: POCOYO_COLORS.pink, size: 45, top: '75%', left: '90%', delay: '2s' },
    { type: 'star', color: POCOYO_COLORS.blue, size: 40, top: '40%', left: '92%', delay: '0.3s' },
    { type: 'circle', color: POCOYO_COLORS.orange, size: 55, top: '88%', left: '20%', delay: '1.5s' },
    { type: 'triangle', color: POCOYO_COLORS.yellow, size: 50, top: '5%', left: '70%', delay: '0.9s' },
  ];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {shapes.map((s, i) => (
        <div
          key={i}
          className="absolute opacity-40 animate-float"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          {s.type === 'circle' && (
            <div
              style={{ width: s.size, height: s.size, background: s.color, borderRadius: '9999px' }}
            />
          )}
          {s.type === 'star' && <Star size={s.size} color={s.color} fill={s.color} />}
          {s.type === 'triangle' && (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${s.size / 2}px solid transparent`,
                borderRight: `${s.size / 2}px solid transparent`,
                borderBottom: `${s.size}px solid ${s.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Confetti burst
function Confetti({ fire }: { fire: boolean }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (fire) setPieces(Array.from({ length: 80 }, (_, i) => i));
  }, [fire]);
  if (!fire) return null;
  const colors = [
    POCOYO_COLORS.blue,
    POCOYO_COLORS.yellow,
    POCOYO_COLORS.red,
    POCOYO_COLORS.green,
    POCOYO_COLORS.pink,
    POCOYO_COLORS.orange,
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const color = colors[i % colors.length];
        const size = 8 + Math.random() * 8;
        return (
          <div
            key={i}
            className="absolute top-0 animate-confetti"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              borderRadius: i % 3 === 0 ? '9999px' : '2px',
            }}
          />
        );
      })}
    </div>
  );
}

// Balloon pop game
function BalloonGame() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [playing, setPlaying] = useState(false);
  const [balloons, setBalloons] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (!playing) return;
    if (time <= 0) {
      setPlaying(false);
      setBest((b) => Math.max(b, score));
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [playing, time, score]);

  useEffect(() => {
    if (!playing) return;
    const colors = [
      POCOYO_COLORS.blue,
      POCOYO_COLORS.yellow,
      POCOYO_COLORS.red,
      POCOYO_COLORS.green,
      POCOYO_COLORS.pink,
      POCOYO_COLORS.orange,
    ];
    const spawn = setInterval(() => {
      setBalloons((prev) => {
        const next = [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 85,
            y: Math.random() * 70,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
        ];
        return next.slice(-8);
      });
    }, 700);
    return () => clearInterval(spawn);
  }, [playing]);

  const start = () => {
    setScore(0);
    setTime(30);
    setBalloons([]);
    setPlaying(true);
  };

  const pop = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl border-4 border-[#3CA8E0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-black text-[#1B2A4A] flex items-center gap-2">
          <PartyPopper className="text-[#E8472D]" /> Revienta Globos
        </h3>
        <div className="flex gap-3 text-sm font-bold">
          <span className="bg-[#F5D547] px-3 py-1 rounded-full text-[#1B2A4A]">
            Puntos: {score}
          </span>
          <span className="bg-[#7BC043] px-3 py-1 rounded-full text-white">Tiempo: {time}s</span>
        </div>
      </div>

      <div className="relative w-full h-64 rounded-2xl bg-gradient-to-b from-[#BFE9F7] to-[#E8F6FB] overflow-hidden border-2 border-[#3CA8E0]/40">
        {!playing && time === 30 && (
          <button
            onClick={start}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#1B2A4A] font-black text-xl"
          >
            <Play size={48} className="text-[#3CA8E0]" />
            ¡Toca para jugar!
          </button>
        )}
        {!playing && time === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#1B2A4A]">
            <Trophy size={40} className="text-[#F5D547]" />
            <p className="text-2xl font-black">¡Lograste {score} puntos!</p>
            {best > 0 && <p className="text-sm font-bold">Récord: {best}</p>}
            <button
              onClick={start}
              className="mt-2 flex items-center gap-2 bg-[#E8472D] text-white px-5 py-2 rounded-full font-bold hover:scale-105 transition"
            >
              <RotateCcw size={18} /> Jugar de nuevo
            </button>
          </div>
        )}
        {playing &&
          balloons.map((b) => (
            <button
              key={b.id}
              onClick={() => pop(b.id)}
              className="absolute animate-pop"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div className="relative">
                <div
                  className="w-12 h-14 rounded-full rounded-bl-none rounded-br-none"
                  style={{ background: b.color }}
                />
                <div className="w-px h-3 bg-[#1B2A4A]/40 mx-auto" />
              </div>
            </button>
          ))}
      </div>
      <p className="text-center text-sm text-[#1B2A4A]/70 mt-3 font-medium">
        Toca todos los globos que puedas en 30 segundos
      </p>
    </div>
  );
}

// RSVP form
function RsvpForm({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe tu nombre.');
      return;
    }
    setSaving(true);
    setError(null);
    
      const { error: err } = await supabase.from('rsvps').insert([
      {
        guest_name: name.trim(),
        attending,
        guests_count: Math.max(1, count),
        message: message.trim() || null,
      }
    ]);


    setSaving(false);
    if (err) {
      setError('No se pudo guardar. Inténtalo de nuevo.');
      return;
    }
    setDone(true);
    onSaved();
  };

  if (done) {
    const waText = `¡Hola! Soy ${name}. ${
      attending
        ? `Confirmo mi asistencia a la fiesta de ${PARTY.childName} (${count} persona(s)).`
        : `Lamentablemente no podré asistir a la fiesta de ${PARTY.childName}.`
    }${message ? ` Mensaje: ${message}` : ''}`;
    return (
      <div className="rounded-3xl bg-white/90 backdrop-blur p-8 shadow-xl border-4 border-[#7BC043] text-center">
        <div className="w-16 h-16 rounded-full bg-[#7BC043] mx-auto flex items-center justify-center mb-4">
          <Check className="text-white" size={36} />
        </div>
        <h3 className="text-2xl font-black text-[#1B2A4A] mb-2">¡Gracias, {name}!</h3>
        <p className="text-[#1B2A4A]/80 mb-5 font-medium">
          {attending
            ? '¡Tu confirmación quedó registrada! Te esperamos en la fiesta.'
            : 'Lamentamos que no puedas venir. ¡Gracias por avisar!'}
        </p>
        <a
          href={waLink(waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition shadow-lg"
        >
          <MessageCircle size={20} /> También confirmar por WhatsApp
        </a>
        <button
          onClick={() => {
            setDone(false);
            setName('');
            setMessage('');
            setCount(1);
            setAttending(true);
          }}
          className="block mx-auto mt-4 text-sm font-bold text-[#3CA8E0] hover:underline"
        >
          Registrar otra confirmación
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white/90 backdrop-blur p-8 shadow-xl border-4 border-[#F5D547]"
    >
      <h3 className="text-2xl font-black text-[#1B2A4A] mb-4 flex items-center gap-2">
        <Gift className="text-[#E8472D]" /> Confirma tu asistencia
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-[#1B2A4A] mb-1">Tu nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#3CA8E0]/30 focus:border-[#3CA8E0] outline-none font-medium text-[#1B2A4A]"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#1B2A4A] mb-2">¿Asistirás?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                attending
                  ? 'bg-[#7BC043] text-white shadow-lg'
                  : 'bg-gray-100 text-[#1B2A4A]/60'
              }`}
            >
              <Check size={20} /> ¡Sí, voy!
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                !attending ? 'bg-[#E8472D] text-white shadow-lg' : 'bg-gray-100 text-[#1B2A4A]/60'
              }`}
            >
              <X size={20} /> No puedo
            </button>
          </div>
        </div>
        {attending && (
          <div>
            <label className="block text-sm font-bold text-[#1B2A4A] mb-1">
              ¿Cuántas personas? (incluyéndote)
            </label>
                      <div className="flex items-center justify-center gap-4 mt-2">
            {/* Botón de Menos */}
            <button
              type="button"
              onClick={() => setCount(Math.max(1, count - 1))}
              className="w-12 h-12 bg-slate-100 rounded-full font-bold text-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
            >
              -
            </button>
            
            {/* El número de personas grande */}
            <span className="text-2xl font-black w-12 text-center text-slate-800">
              {count}
            </span>

            {/* Botón de Más */}
            <button
              type="button"
              onClick={() => setCount(Math.min(10, count + 1))} // El límite máximo es 10 igual que tenía tu input viejo
              className="w-12 h-12 bg-sky-100 rounded-full font-bold text-2xl flex items-center justify-center text-sky-600 hover:bg-sky-200 active:scale-95 transition"
            >
              +
            </button>
          </div>

          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-[#1B2A4A] mb-1">
            Mensaje para {PARTY.childName} (opcional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="¡Feliz cumpleaños!"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#3CA8E0]/30 focus:border-[#3CA8E0] outline-none font-medium text-[#1B2A4A] resize-none"
          />
        </div>
        {error && <p className="text-[#E8472D] font-bold text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#3CA8E0] text-white py-4 rounded-xl font-black text-lg hover:bg-[#2A8FC0] transition shadow-lg disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Confirmar'}
        </button>
      </div>
    </form>
  );
}

// Public totals only — no names, no messages
function GuestTotals({ refreshKey }: { refreshKey: number }) {
  const [stats, setStats] = useState<{ families: number; people: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvps')
        .select('guests_count')
        .eq('attending', true);
      if (active) {
        const rows = (data as { guests_count: number }[]) ?? [];
        setStats({
          families: rows.length,
          people: rows.reduce((s, r) => s + r.guests_count, 0),
        });
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshKey]);
    return null;
}

// Private admin view — full guest list protected by password
function AdminGuestList({ refreshKey }: { refreshKey: number }) {
  const [guests, setGuests] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });
      if (active) {
        setGuests((data as Rsvp[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const attending = guests.filter((g) => g.attending);
  const notAttending = guests.filter((g) => !g.attending);
  const totalPeople = attending.reduce((sum, g) => sum + g.guests_count, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl border-4 border-[#1B2A4A]">
        <h3 className="text-2xl font-black text-[#1B2A4A] mb-4 flex items-center gap-2">
          <Trophy className="text-[#F5D547]" /> Panel de la anfitriona
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#7BC043]/15 rounded-2xl p-3 text-center">
            <p className="text-3xl font-black text-[#7BC043]">{attending.length}</p>
            <p className="text-xs font-bold text-[#1B2A4A]/70">Van a ir</p>
          </div>
          <div className="bg-[#3CA8E0]/15 rounded-2xl p-3 text-center">
            <p className="text-3xl font-black text-[#3CA8E0]">{totalPeople}</p>
            <p className="text-xs font-bold text-[#1B2A4A]/70">Personas</p>
          </div>
          <div className="bg-[#E8472D]/15 rounded-2xl p-3 text-center">
            <p className="text-3xl font-black text-[#E8472D]">{notAttending.length}</p>
            <p className="text-xs font-bold text-[#1B2A4A]/70">No pueden</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-[#1B2A4A]/60 font-medium py-4">Cargando...</p>
        ) : guests.length === 0 ? (
          <p className="text-center text-[#1B2A4A]/60 font-medium py-4">
            Aún no hay confirmaciones.
          </p>
        ) : (
          <div className="space-y-4">
            {attending.length > 0 && (
              <div>
                <p className="text-sm font-black text-[#7BC043] mb-2">CONFIRMARON ASISTENCIA</p>
                <div className="space-y-2">
                  {attending.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-start gap-3 bg-[#FFFDF5] rounded-xl p-3 border-2 border-[#7BC043]/30"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#7BC043] flex items-center justify-center text-white font-black flex-shrink-0">
                        {g.guest_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1B2A4A]">{g.guest_name}</p>
                        <p className="text-xs text-[#1B2A4A]/60 font-medium">
                          {g.guests_count} persona(s)
                          {g.message ? ` · "${g.message}"` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {notAttending.length > 0 && (
              <div>
                <p className="text-sm font-black text-[#E8472D] mb-2">NO PUEDEN ASISTIR</p>
                <div className="space-y-2">
                  {notAttending.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-start gap-3 bg-[#FFFDF5] rounded-xl p-3 border-2 border-[#E8472D]/30"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#E8472D] flex items-center justify-center text-white font-black flex-shrink-0">
                        {g.guest_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1B2A4A]">{g.guest_name}</p>
                        <p className="text-xs text-[#1B2A4A]/60 font-medium">
                          {g.message ? `"${g.message}"` : 'Sin mensaje'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Photo gallery (Pocoyo-style stock illustrations from Pexels)
function Gallery() {
  const photos = [foto1, foto2, foto3, foto4, foto5, foto6, foto7, foto8, foto9];
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl border-4 border-[#F7941E]">
      <h3 className="text-2xl font-black text-[#1B2A4A] mb-4 flex items-center gap-2">
        <Sparkles className="text-[#F7941E]" /> Galería de momentos
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(src)}
            className="aspect-square rounded-2xl overflow-hidden border-2 border-[#F7941E]/30 hover:scale-105 transition"
          >
            <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <img src={active} alt="Ampliada" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}
    </div>
  );
}

// Password gate for the admin (anfitriona) view
function AdminLogin({ refreshKey }: { refreshKey: number }) {
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PARTY.adminPassword) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked) {
    return (
      <>
        <AdminGuestList refreshKey={refreshKey} />
        <button
          onClick={() => {
            setUnlocked(false);
            setInput('');
          }}
          className="block mx-auto text-sm font-bold text-[#3CA8E0] hover:underline"
        >
          Cerrar vista de anfitriona
        </button>
      </>
    );
  }

  return (
    <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl border-4 border-[#1B2A4A]/30">
      <h3 className="text-lg font-black text-[#1B2A4A] mb-2 flex items-center gap-2">
        <Star className="text-[#F5D547]" /> Vista de la anfitriona
      </h3>
      <p className="text-sm text-[#1B2A4A]/70 font-medium mb-4">
        Ingresa la contraseña para ver la lista completa de confirmaciones.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Contraseña"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-[#1B2A4A]/20 focus:border-[#1B2A4A] outline-none font-medium text-[#1B2A4A]"
        />
        <button
          type="submit"
          className="bg-[#1B2A4A] text-white px-5 py-3 rounded-xl font-black hover:bg-[#2A3A5A] transition"
        >
          Entrar
        </button>
      </form>
      {error && <p className="text-[#E8472D] font-bold text-sm mt-2">Contraseña incorrecta.</p>}
    </div>
  );
}

// Pocoyo-style mascot drawn with CSS/SVG
function PocoyoMascot({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-lg">
      {/* body */}
      <ellipse cx="60" cy="95" rx="28" ry="18" fill="#3CA8E0" />
      {/* head */}
      <circle cx="60" cy="50" r="34" fill="#3CA8E0" />
      {/* face area */}
      <ellipse cx="60" cy="55" rx="24" ry="22" fill="#FFFDF5" />
      {/* eyes */}
      <circle cx="50" cy="46" r="6" fill="#1B2A4A" />
      <circle cx="70" cy="46" r="6" fill="#1B2A4A" />
      <circle cx="52" cy="44" r="2" fill="#fff" />
      <circle cx="72" cy="44" r="2" fill="#fff" />
      {/* smile */}
      <path d="M50 62 Q60 70 70 62" stroke="#1B2A4A" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* hat brim */}
      <ellipse cx="60" cy="22" rx="30" ry="6" fill="#1B2A4A" />
      {/* hat top */}
      <ellipse cx="60" cy="16" rx="14" ry="10" fill="#1B2A4A" />
      <circle cx="60" cy="10" r="4" fill="#E8472D" />
    </svg>
  );
}

export default function App() {
// ====== CÓDIGO DE ENTRADA POCOYÓ CORREGIDO ======
  const [mostrarInvitacion, setMostrarInvitacion] = useState(false);
  // ====== FIN CÓDIGO DE ENTRADA CORREGIDO ======
  const [section, setSection] = useState<Section>('hero');
  const [confetti, setConfetti] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const cd = useCountdown(PARTY.date);

//MODIFIQUE AUDIO
  const segundaSeccionRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
    // Si la invitación ya está visible en pantalla (usuario hizo clic en Celebrar)
    if (mostrarInvitacion) {
      audioRef.current = new Audio(musicaPocoyo);
      audioRef.current.loop = true;
      
      audioRef.current.play().catch(err => {
        console.log("El navegador bloqueó el audio:", err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [mostrarInvitacion]);



  const nav: { id: Section; label: string; icon: typeof Cake }[] = [
    { id: 'hero', label: 'Inicio', icon: Cake },
    { id: 'details', label: 'Detalles', icon: MapPin },
    { id: 'countdown', label: 'Cuenta', icon: Clock },
    { id: 'rsvp', label: 'Confirmar', icon: Gift },
    { id: 'game', label: 'Juego', icon: PartyPopper },
    { id: 'gallery', label: 'Galería', icon: Sparkles },
    { id: 'guests', label: 'Invitados', icon: Users },
  ];
  const fireConfetti = () => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4000);
  };

  // DISEÑO ADAPTATIVO CON DOS IMÁGENES PROPIAS (MÓVIL Y LAPTOP)
  // ========================================================
  if (!mostrarInvitacion) {
    const esMovil = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
      <div style={{
        // Si es móvil carga tu foto vertical; si es laptop carga tu banner acostado
        backgroundImage: esMovil 
          ? `url(${miFondoMovil})` 
          : `url(${miFondo})`,
        backgroundSize: '100% 100%', // Encaja exacta en cualquier pantalla
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between', // Separa los títulos del botón
        fontFamily: 'Arial, sans-serif',
        padding: esMovil ? '60px 20px' : '40px 20px',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        boxSizing: 'border-box'
      }}>
        {/* Globos flotando en las esquinas */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '40px', animation: 'float 3s ease-in-out infinite' }}>🎈</div>
        <div style={{ position: 'absolute', top: '30px', right: '30px', fontSize: '45px', animation: 'float 4s ease-in-out infinite' }}>🎈</div>

        {/* TÍTULOS SUPERIORES */}
        <div style={{ zIndex: 2 }}>
          <h1 style={{
            color: '#009be1',
            fontSize: esMovil ? '2.2rem' : '2.5rem',
            fontWeight: 'bold',
            marginBottom: '5px',
            textTransform: 'uppercase',
            textShadow: '2px 2px 4px rgba(255,255,255,0.9)' // Sombra blanca gruesa por si tu imagen tiene colores fuertes
          }}>
            ¡Una Nueva Sorpresa!
          </h1>
          
          <p style={{ 
            color: '#555555', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            margin: 0,
            textShadow: '1px 1px 2px rgba(255,255,255,0.9)'
          }}>
            Mira quién cumple años...
          </p>
        </div>

        {/* NOTA: Dejamos el espacio del centro totalmente vacío para que luzcan los personajes de tu foto 'pocoyo.jpg' */}
        {esMovil && <div style={{ height: '20px' }}></div>}

        {/* BOTÓN INTERACTIVO INFERIOR */}
        <div 
          onClick={() => setMostrarInvitacion(true)}
          style={{
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            padding: '12px 50px',
            color: '#ffffff',
            backgroundColor: '#ffc000',
            borderRadius: '50px',
            boxShadow: '0 8px 15px rgba(255, 192, 0, 0.5)',
            textTransform: 'uppercase',
            marginBottom: '20px',
            zIndex: 2
          }}
        >
          ✨ ¡UNETE A LA FIESTA! ✨
        </div>

        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}</style>
      </div>
    );
  }


      return (
    <div
      ref={segundaSeccionRef}
      className="min-h-screen font-sans text-[#1B2A4A]"
      style={{ background: `linear-gradient(180deg, #BFE9F7 0%, #E8F6FB 40%, #FFFDF5 100%)` }}
    >

      <FloatingShapes />
      <Confetti fire={confetti} />

      {/* Top nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-[#3CA8E0]/20">
        <div className="max-w-3xl mx-auto px-3 py-2 flex gap-1 overflow-x-auto no-scrollbar">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                  section === n.id
                    ? 'bg-[#3CA8E0] text-white shadow-md'
                    : 'text-[#1B2A4A]/70 hover:bg-[#3CA8E0]/10'
                }`}
              >
                <Icon size={16} /> {n.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 min-h-screen bg-cover bg-center"style={{ backgroundImage: `url(${miFondoMov})` }}>
          {/* HERO */} 
{section === 'hero' && ( 
  <div className="text-center -mt-6 mx-2 space-y-6 animate-fadein">
    <div className="inline-block bg-[#F5D547] px-6 py-2 rounded-full -rotate-2 shadow-md"> 
      <p className="font-black text-[#1B2A4A] text-lg">¡Estás invitado!</p> 
    </div> 

    <h1 
      className="text-5xl sm:text-7xl font-black leading-tight drop-shadow-lg" 
      style={{ 
        color: POCOYO_COLORS.navy,
        textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff, 4px 4px 8px rgba(0,0,0,0.5)'
      }} 
    > 
      ¡Fiesta de <span className="text-[#E8472D]">{PARTY.age}</span>{' '} 
      <br /> añito! 
    </h1> 

    <p 
      className="text-xl font-bold text-white tracking-wide"
      style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' }}
    > 
      Vamos a celebrar el cumpleaños de 
    </p> 

    <div className="inline-block bg-[#3CA8E0] text-white px-8 py-3 rounded-2xl rotate-1 shadow-lg border-2 border-white"> 
      <p className="text-3xl font-black">{PARTY.childName}</p> 
    </div> 

    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 px-4"> 
      <button onClick={() => setSection('rsvp')} className="bg-[#E8472D] text-white px-6 py-3 rounded-full font-black hover:scale-105 transition shadow-lg flex items-center justify-center gap-2 border-2 border-white" > 
        <Gift size={20} /> Confirmar asistencia 
      </button> 
      <button onClick={fireConfetti} className="bg-[#F5D547] text-[#1B2A4A] px-6 py-3 rounded-full font-black hover:scale-105 transition shadow-lg flex items-center justify-center gap-2 border-2 border-white" > 
        <PartyPopper size={20} /> ¡Celebrar! 
      </button> 
    </div> 

    <p 
      className="text-sm text-white font-black pt-2"
      style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9), -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' }}
    > 
      Desliza por el menú para ver todos los detalles 
    </p> 
  </div> 
)}


        {/* DETAILS */}
        {section === 'details' && (
          <div className="space-y-4 animate-fadein">
            <div className="rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl border-4 border-[#3CA8E0]">
              <h2 className="text-3xl font-black text-[#1B2A4A] mb-5 text-center flex items-center justify-center gap-2">
                <MapPin className="text-[#E8472D]" /> Detalles de la fiesta
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#3CA8E0] flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B2A4A]/60 uppercase">Cuándo</p>
                    <p className="font-bold text-[#1B2A4A]">{PARTY.dateLabel}</p>
                    <p className="text-sm text-[#1B2A4A]/70 font-medium">{PARTY.timeLabel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8472D] flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1B2A4A]/60 uppercase">Dónde</p>
                    <p className="font-bold text-[#1B2A4A]">{PARTY.place}</p>
                    <p className="text-sm text-[#1B2A4A]/70 font-medium">{PARTY.address}</p>
                  </div>
                </div>
                <a
                  href={PARTY.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#7BC043] text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition"
                >
                  Ver ubicación en el mapa
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-[#3CA8E0] p-6 shadow-xl text-center">
              <p className="text-white font-bold text-lg mb-3">¿Dudas o comentarios?</p>
              <a
                href={waLink(`¡Hola! Tengo una duda sobre la fiesta de ${PARTY.childName}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-black hover:scale-105 transition shadow-lg"
              >
                <MessageCircle size={20} /> Escribir por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {section === 'countdown' && (
          <div className="text-center space-y-6 animate-fadein">
            <h2 className="text-3xl font-black text-[#1B2A4A] flex items-center justify-center gap-2">
              <Clock className="text-[#3CA8E0]" /> Faltan poquito...
            </h2>
            {cd.done ? (
              <div className="rounded-3xl bg-[#F5D547] p-8 shadow-xl">
                <p className="text-4xl font-black text-[#1B2A4A]">¡Hoy es la fiesta!</p>
                <p className="text-lg font-bold text-[#1B2A4A]/80 mt-2">¡Nos vemos pronto!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { v: cd.days, l: 'Días' },
                  { v: cd.hours, l: 'Horas' },
                  { v: cd.minutes, l: 'Min' },
                  { v: cd.seconds, l: 'Seg' },
                ].map((u) => (
                  <div
                    key={u.l}
                    className="rounded-2xl bg-white/90 backdrop-blur p-4 shadow-lg border-4 border-[#3CA8E0]"
                  >
                    <p className="text-3xl sm:text-4xl font-black text-[#3CA8E0] tabular-nums">
                      {String(u.v).padStart(2, '0')}
                    </p>
                    <p className="text-xs font-bold text-[#1B2A4A]/70 uppercase">{u.l}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[#1B2A4A]/70 font-medium">
              La fiesta es el {PARTY.dateLabel} a las {PARTY.timeLabel.split(' - ')[0]}
            </p>
          </div>
        )}

        {/* RSVP */}
        {section === 'rsvp' && (
          <div className="space-y-5 animate-fadein">
            <RsvpForm onSaved={() => setRefreshKey((k) => k + 1)} />
            <div className="rounded-3xl bg-[#25D366] p-5 shadow-xl text-center">
              <p className="text-white font-bold mb-3">¿Prefieres confirmar por WhatsApp?</p>
              <a
                href={waLink(
                  `¡Hola! Quiero confirmar mi asistencia a la fiesta de ${PARTY.childName}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#25D366] px-6 py-3 rounded-full font-black hover:scale-105 transition shadow-lg"
              >
                <MessageCircle size={20} /> Confirmar por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* GAME */}
        {section === 'game' && (
          <div className="animate-fadein">
            <BalloonGame />
          </div>
        )}

        {/* GALLERY */}
        {section === 'gallery' && (
          <div className="animate-fadein">
            <Gallery />
          </div>
        )}

        {/* GUESTS */}
        {section === 'guests' && (
          <div className="animate-fadein space-y-5">
            <GuestTotals refreshKey={refreshKey} />
            <AdminLogin refreshKey={refreshKey} />
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center py-8 space-y-2">
          <div className="flex justify-center gap-2 text-[#E8472D]">
            <Heart size={20} fill={POCOYO_COLORS.red} />
            <Heart size={20} fill={POCOYO_COLORS.pink} />
            <Heart size={20} fill={POCOYO_COLORS.red} />
          </div>
                <p 
        className="text-xl font-black text-white px-4"
        style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' }}
      >
        ¡Te esperamos en la fiesta de {PARTY.childName}!
      </p>
      <p 
        className="text-xs font-bold text-white mt-1 opacity-90"
        style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9), -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000' }}
      >
        Hecho con cariño para los invitados
      </p>

        </footer>
      </main>
    </div>
  );
}
