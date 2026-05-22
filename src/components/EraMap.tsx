import { useState } from 'react';
import { MapPin, Globe, Compass, Landmark, Info } from 'lucide-react';
import { musicians } from '../data/composers';
import { playNote } from '../utils/audioSynth';

interface CountryData {
  id: string;
  name: string;
  flag: string;
  desc: string;
  composers: string[];
  x: number; // percentage coordinate for map overlay
  y: number;
}

const countries: CountryData[] = [
  {
    id: 'germany',
    name: '독일 (Germany)',
    flag: '🇩🇪',
    desc: '음악의 규칙과 뼈대를 만든 바흐와 고난을 이겨낸 베토벤, 대성한 헨델을 낳은 클래식 음악의 종주국 중 하나예요. 오르간 음악과 교향곡이 발달했답니다.',
    composers: ['바흐', '베토벤', '헨델'],
    x: 35,
    y: 38
  },
  {
    id: 'austria',
    name: '오스트리아 (Austria)',
    flag: '🇦🇹',
    desc: '수도인 빈(Vienna)은 클래식 음악의 고향과 같은 곳이에요. 천재 모차르트와 가곡의 왕 슈베르트가 이곳에서 수많은 보석 같은 선율을 창조해 냈어요.',
    composers: ['모차르트', '슈베르트'],
    x: 48,
    y: 48
  },
  {
    id: 'italy',
    name: '이탈리아 (Italy)',
    flag: '🇮🇹',
    desc: '음악에 계절의 옷을 입힌 비발디의 고향이자, 피아노와 바이올린 같은 오늘날 악기들이 탄생하고 오페라가 시작된 낭만과 예술의 나라예요.',
    composers: ['비발디'],
    x: 40,
    y: 72
  },
  {
    id: 'poland',
    name: '폴란드 (Poland)',
    flag: '🇵🇱',
    desc: '조국을 너무나 사랑했던 피아노의 시인 쇼팽의 고향이에요. 러시아의 침공 속에서도 조국 폴란드의 춤곡을 음악 속에 고스란히 간직해 냈어요.',
    composers: ['쇼팽'],
    x: 60,
    y: 30
  },
  {
    id: 'russia',
    name: '러시아 (Russia)',
    flag: '🇷🇺',
    desc: '발레 음악의 왕 차이콥스키가 태어난 곳이에요. 광활한 대지와 눈 덮인 겨울, 러시아인들 특유의 가슴 시린 애수와 화려한 선율이 돋보입니다.',
    composers: ['차이콥스키'],
    x: 82,
    y: 20
  }
];

export default function EraMap() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country);
    playNote('E5', 'sine', 0.15);
  };

  return (
    <div className="max-w-5xl mx-auto bg-amber-50/20 rounded-3xl border-4 border-amber-900/60 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-amber-950 flex items-center justify-center gap-2">
          <Globe className="w-8 h-8 text-amber-700" />
          클래식 음악 유럽 지도 🌍
        </h2>
        <p className="text-amber-800 text-sm md:text-base mt-2">
          지도 위의 마커나 아래 나라 이름을 눌러 위대한 작곡가들이 탄생하고 자란 배경을 알아보세요!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-7 bg-amber-950/80 rounded-2xl p-4 relative border-2 border-amber-800 flex flex-col justify-between min-h-[300px] md:min-h-[380px] overflow-hidden select-none">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between text-amber-200 text-xs">
            <span className="flex items-center gap-1">
              <Compass className="w-4 h-4 animate-spin-slow" />
              유럽 고전음악 지도 (초등 교육용 간략 지도)
            </span>
            <span className="bg-amber-900/50 px-2 py-0.5 rounded border border-amber-800">17세기 ~ 19세기</span>
          </div>

          {/* Simple Vector Background Outline representation of Europe */}
          <div className="absolute inset-x-6 top-16 bottom-6 flex items-center justify-center opacity-25">
            <svg viewBox="0 0 800 500" className="w-full h-full text-amber-300 stroke-amber-500 fill-transparent stroke-2">
              {/* Abstract borders mimicking Europe */}
              {/* Germany-ish */}
              <path d="M 280 180 L 380 160 L 400 240 L 320 280 Z" />
              {/* Poland-ish */}
              <path d="M 400 160 L 520 180 L 500 280 L 400 240 Z" />
              {/* Austria-ish */}
              <path d="M 380 250 L 460 270 L 440 310 L 370 290 Z" />
              {/* Italy-ish */}
              <path d="M 350 310 L 410 320 L 460 420 L 420 440 L 380 360 Z" />
              {/* Russia-ish */}
              <path d="M 520 100 L 700 80 L 680 320 L 500 280 Z" />
            </svg>
          </div>

          {/* Location Pins Overlay */}
          <div className="relative w-full h-[220px] md:h-[280px] mt-6">
            {countries.map((c) => {
              const isSelected = selectedCountry.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCountryClick(c)}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all z-20 cursor-pointer ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  {/* Pin Circle */}
                  <div className={`p-1.5 rounded-full shadow-lg border transition-all ${
                    isSelected 
                      ? 'bg-amber-400 border-white text-amber-950 scale-125 ring-4 ring-amber-500/30' 
                      : 'bg-amber-900 border-amber-700 text-amber-200'
                  }`}>
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  </div>
                  {/* Flag and Label */}
                  <span className={`mt-1.5 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold border transition-colors ${
                    isSelected
                      ? 'bg-amber-300 text-amber-950 border-white shadow'
                      : 'bg-amber-950 text-amber-200 border-amber-800'
                  }`}>
                    {c.flag} {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compass & Scale */}
          <div className="relative z-10 flex justify-between items-end text-[10px] text-amber-300/70">
            <span>북해 & 대서양 방면</span>
            <span>지도 비율: 클래식 거점 중심 축척</span>
          </div>
        </div>

        {/* Selected Country Details */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white/80 border-2 border-amber-900/10 rounded-2xl p-5 shadow-sm space-y-4 flex-1">
            {/* Country Title */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-amber-950">{selectedCountry.name}</h3>
                <span className="text-xs text-amber-700 font-semibold bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
                  클래식 주요 거점
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-amber-950 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-900/5">
              {selectedCountry.desc}
            </p>

            {/* Country Composers Title */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                이 나라 출신 대표 음악가 ({selectedCountry.composers.length}명)
              </h4>

              <div className="space-y-2">
                {selectedCountry.composers.map((name) => {
                  const comp = musicians[name];
                  if (!comp) return null;

                  return (
                    <div 
                      key={comp.id}
                      className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-800/15 shadow-sm"
                    >
                      <img 
                        src={comp.photo} 
                        alt={comp.name} 
                        className="w-10 h-10 rounded-full object-cover border border-amber-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-bold text-amber-950">{comp.name}</span>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">{comp.era}</span>
                        </div>
                        <p className="text-[10px] text-amber-800/80 truncate font-medium">🎵 {comp.nickname}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick country selection tags */}
          <div className="bg-amber-900/10 rounded-xl p-3 border border-amber-900/5">
            <p className="text-[10px] font-bold text-amber-900 mb-2 flex items-center gap-1 select-none">
              <Info className="w-3.5 h-3.5" /> 다른 나라도 확인해 보세요:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {countries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCountryClick(c)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                    selectedCountry.id === c.id
                      ? 'bg-amber-900 text-white border-amber-950 shadow-sm'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/30'
                  }`}
                >
                  {c.flag} {c.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
