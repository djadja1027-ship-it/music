import { useState } from 'react';
import { 
  Music, Globe, Trophy, BookOpen, Compass, Search, Filter, Volume2
} from 'lucide-react';
import { eraGroups, musicians, Composer } from './data/composers';
import ComposerChat from './components/ComposerChat';
import ComposerCardGame from './components/ComposerCardGame';
import EraMap from './components/EraMap';
import QuizArena from './components/QuizArena';
import StudyGuides from './components/StudyGuides';
import { playNote, getAudioContext } from './utils/audioSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'quiz' | 'game' | 'study'>('home');
  const [selectedComposer, setSelectedComposer] = useState<Composer | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [eraFilter, setEraFilter] = useState('all');
  
  // Sound states
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize Audio Context on click
  const initAudio = () => {
    if (!audioInitialized) {
      try {
        getAudioContext();
        setAudioInitialized(true);
        // Play a warm welcome chime
        playNote('C5', 'sine', 0.15);
        setTimeout(() => playNote('E5', 'sine', 0.15), 100);
        setTimeout(() => playNote('G5', 'sine', 0.3), 200);
      } catch (e) {
        console.error('AudioContext could not be initialized:', e);
      }
    }
  };

  // Change tab helper
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSelectedComposer(null);
    initAudio();
    playNote('D5', 'sine', 0.1);
  };

  const handleSelectComposer = (name: string) => {
    initAudio();
    const comp = musicians[name];
    if (comp) {
      setSelectedComposer(comp);
      playNote('G5', 'sine', 0.1);
    }
  };

  // Filter composers
  const allComposers = Object.values(musicians);
  const filteredComposers = allComposers.filter(comp => {
    const matchesSearch = 
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (eraFilter === 'all') return matchesSearch;
    if (eraFilter === 'baroque') return matchesSearch && comp.era === '바로크 시대';
    if (eraFilter === 'classical') return matchesSearch && comp.era === '고전주의 시대';
    if (eraFilter === 'transition') return matchesSearch && comp.era === '고전주의에서 낭만주의로 넘어간 시대';
    if (eraFilter === 'romantic') return matchesSearch && comp.era === '낭만주의 시대';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-amber-100/40 to-orange-100/60 text-amber-950 font-sans flex flex-col justify-between selection:bg-amber-900 selection:text-white">
      {/* Top Banner / Audio Initializer helper if needed */}
      {!audioInitialized && (
        <div 
          onClick={initAudio}
          className="bg-amber-900 hover:bg-amber-950 text-amber-50 px-4 py-2.5 text-center text-xs md:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md select-none border-b border-amber-950 shrink-0"
        >
          <Volume2 className="w-4 h-4 animate-bounce" />
          <span>여기를 터치해 효과음과 피아노 사운드를 켜보세요! (음악 모드 활성화)</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-900/10 sticky top-0 z-30 shrink-0 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabChange('home')}>
            <span className="text-3xl md:text-4xl">🎻</span>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-2">
                시대별 클래식 음악관
                <span className="text-xs bg-amber-800 text-amber-100 border border-amber-900 px-2 py-0.5 rounded-full font-medium">
                  초등 음악 교실
                </span>
              </h1>
              <p className="text-[10px] md:text-xs text-amber-700/80 font-medium">역사 속 위대한 음악가와 가상 채팅하고 놀며 배워요</p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="flex bg-amber-900/5 p-1 rounded-2xl border border-amber-900/10 select-none">
            <button
              onClick={() => handleTabChange('home')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'text-amber-900/85 hover:bg-amber-950/5'
              }`}
            >
              <Music className="w-4 h-4" />
              메인관
            </button>
            <button
              onClick={() => handleTabChange('map')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'map' 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'text-amber-900/85 hover:bg-amber-950/5'
              }`}
            >
              <Globe className="w-4 h-4" />
              유럽 음악 지도
            </button>
            <button
              onClick={() => handleTabChange('quiz')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'quiz' 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'text-amber-900/85 hover:bg-amber-950/5'
              }`}
            >
              <Trophy className="w-4 h-4" />
              퀴즈 아레나
            </button>
            <button
              onClick={() => handleTabChange('game')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'game' 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'text-amber-900/85 hover:bg-amber-950/5'
              }`}
            >
              <Compass className="w-4 h-4" />
              시대 매칭 게임
            </button>
            <button
              onClick={() => handleTabChange('study')}
              className={`px-3 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'study' 
                  ? 'bg-amber-900 text-white shadow-md' 
                  : 'text-amber-900/85 hover:bg-amber-950/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              학습지원관
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        
        {/* VIEW 1: HOME (Composers List / Eras) */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* If a composer is selected, show the Chat room */}
            {selectedComposer ? (
              <ComposerChat 
                composer={selectedComposer} 
                onBack={() => setSelectedComposer(null)} 
              />
            ) : (
              <>
                {/* Hero section */}
                <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-amber-50 rounded-3xl p-6 md:p-8 text-center relative border-4 border-double border-amber-400/60 shadow-xl overflow-hidden select-none">
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute -left-10 -top-10 text-9xl opacity-10 font-serif">🎼</div>
                  <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 font-serif">🎻</div>

                  <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                    <span className="bg-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black border-2 border-white shadow-md">
                      ✨ 초등 음악 교과 연계 체험 프로그램
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                      시대별 클래식 음악가와 채팅하기 🎻
                    </h2>
                    <p className="text-xs md:text-base text-amber-200/90 leading-relaxed font-medium">
                      바흐부터 차이콥스키까지! 교과서에 나오는 위대한 음악가 사진을 누르면 대화가 시작됩니다.<br />
                      재미있는 일화, 시그니처 멜로디 연주, 퀴즈 배지 모으기까지 다양하게 즐겨보세요!
                    </p>
                  </div>
                </div>

                {/* Quick Interactive Mini-Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 border border-amber-900/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-900 font-bold text-lg select-none">🌍</div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950">유럽 음악 지도 연계</h4>
                      <p className="text-xs text-amber-800">나라별 작곡가 고향을 지도에서 한눈에 탐험해보세요.</p>
                    </div>
                  </div>
                  <div className="bg-white/80 border border-amber-900/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-900 font-bold text-lg select-none">🏆</div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950">디지털 퀴즈 배지</h4>
                      <p className="text-xs text-amber-800">음악가 퀴즈 3문제를 모두 맞춰 명예 배지를 잠금 해제하세요.</p>
                    </div>
                  </div>
                  <div className="bg-white/80 border border-amber-900/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-900 font-bold text-lg select-none">🎹</div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950">미니 피아노 놀이터</h4>
                      <p className="text-xs text-amber-800">모차르트, 베토벤 등 유명 멜로디를 건반으로 쉽게 따라 연주해요.</p>
                    </div>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/90 border border-amber-900/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-700" />
                    <input
                      type="text"
                      placeholder="음악가 이름, 별명, 국가 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-amber-50/50 border border-amber-800/20 focus:border-amber-900 focus:outline-none pl-9 pr-4 py-2 text-xs rounded-xl"
                    />
                  </div>

                  {/* Era filter selector */}
                  <div className="flex flex-wrap items-center gap-1.5 select-none w-full md:w-auto">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5" /> 시대별 필터:
                    </span>
                    <button
                      onClick={() => setEraFilter('all')}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                        eraFilter === 'all' ? 'bg-amber-900 text-white border-amber-950' : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/10'
                      }`}
                    >
                      전체 보기
                    </button>
                    <button
                      onClick={() => setEraFilter('baroque')}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                        eraFilter === 'baroque' ? 'bg-amber-900 text-white border-amber-950' : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/10'
                      }`}
                    >
                      바로크
                    </button>
                    <button
                      onClick={() => setEraFilter('classical')}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                        eraFilter === 'classical' ? 'bg-amber-900 text-white border-amber-950' : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/10'
                      }`}
                    >
                      고전주의
                    </button>
                    <button
                      onClick={() => setEraFilter('transition')}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                        eraFilter === 'transition' ? 'bg-amber-900 text-white border-amber-950' : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/10'
                      }`}
                    >
                      고전-낭만
                    </button>
                    <button
                      onClick={() => setEraFilter('romantic')}
                      className={`text-xs px-3 py-1 rounded-full font-bold transition-all border cursor-pointer ${
                        eraFilter === 'romantic' ? 'bg-amber-900 text-white border-amber-950' : 'bg-white hover:bg-amber-100 text-amber-900 border-amber-800/10'
                      }`}
                    >
                      낭만주의
                    </button>
                  </div>
                </div>

                {/* Eras & Composer Grid */}
                <div className="space-y-6">
                  {eraGroups.map((group) => {
                    // Filter musicians in this era group matching search/filters
                    const composersInGroup = filteredComposers.filter(
                      c => group.musicians.includes(c.name)
                    );

                    // Skip displaying this era group if no composers match the filter
                    if (composersInGroup.length === 0) return null;

                    return (
                      <div 
                        key={group.id}
                        className="bg-white/80 border-2 border-amber-900/10 hover:border-amber-900/30 rounded-3xl p-5 shadow-sm space-y-4 transition-all"
                      >
                        {/* Era Title */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-amber-100 pb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{group.icon}</span>
                            <h3 className="font-extrabold text-amber-950 text-base md:text-lg">{group.era}</h3>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                              {group.period}
                            </span>
                          </div>
                          <p className="text-xs text-amber-800/80 max-w-md text-left sm:text-right">
                            {group.desc}
                          </p>
                        </div>

                        {/* Musicians Grid inside this era */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {composersInGroup.map((comp) => (
                            <div
                              key={comp.id}
                              onClick={() => handleSelectComposer(comp.name)}
                              className="bg-amber-50/50 hover:bg-amber-100/40 border-2 border-amber-900/20 hover:border-amber-900 hover:-translate-y-1 rounded-2xl p-4 text-center transition-all cursor-pointer shadow-sm flex flex-col justify-between items-center group"
                            >
                              <div className="relative">
                                <img
                                  src={comp.photo}
                                  alt={comp.name}
                                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-amber-800/30 group-hover:border-amber-900/60 transition-colors shadow"
                                />
                                <span className="absolute bottom-0 right-1 text-2xl select-none">
                                  {comp.country === '독일' ? '🇩🇪' : comp.country === '이탈리아' ? '🇮🇹' : comp.country === '오스트리아' ? '🇦🇹' : comp.country === '폴란드' ? '🇵🇱' : '🇷🇺'}
                                </span>
                              </div>

                              <div className="mt-3.5">
                                <h4 className="font-extrabold text-amber-950 text-sm md:text-base group-hover:text-amber-900 transition-colors">
                                  {comp.name}
                                </h4>
                                <p className="text-[10px] text-amber-800 font-semibold">{comp.nickname}</p>
                              </div>

                              <div className="mt-4 w-full flex flex-col gap-2 border-t border-amber-800/10 pt-2.5">
                                <div className="flex justify-between items-center text-[10px] text-amber-700/85">
                                  <span>{comp.country}</span>
                                </div>
                                <span className="bg-amber-900 text-amber-50 text-[10px] py-1 rounded font-bold group-hover:bg-amber-950 transition-colors text-center w-full block">
                                  이야기 나누기 💬
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* VIEW 2: MAP */}
        {activeTab === 'map' && <EraMap />}

        {/* VIEW 3: QUIZ ARENA */}
        {activeTab === 'quiz' && <QuizArena />}

        {/* VIEW 4: MATCH GAME */}
        {activeTab === 'game' && <ComposerCardGame />}

        {/* VIEW 5: STUDY WORKSPACE */}
        {activeTab === 'study' && <StudyGuides />}

      </main>

      {/* Decorative Musical note floater for kids classroom theme */}
      <div className="fixed bottom-4 right-4 z-40 select-none pointer-events-none opacity-40 animate-pulse text-lg md:text-2xl">
        🎶 🎹 🎻
      </div>

      {/* Global Footer */}
      <footer className="bg-amber-950 text-amber-200/80 text-xs py-6 border-t-2 border-amber-900 mt-8 select-none shrink-0">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-amber-100">🎼 시대별 클래식 음악관 (초등 음악 시뮬레이터)</p>
            <p className="text-[10px] text-amber-300/60">본 시뮬레이터는 초등 음악 교과서의 바로크, 고전주의, 낭만주의 연계 교재 자료입니다.</p>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-amber-100 cursor-pointer" onClick={() => handleTabChange('home')}>메인관</span>
            <span className="hover:text-amber-100 cursor-pointer" onClick={() => handleTabChange('map')}>유럽 지도</span>
            <span className="hover:text-amber-100 cursor-pointer" onClick={() => handleTabChange('quiz')}>퀴즈 아레나</span>
            <span className="hover:text-amber-100 cursor-pointer" onClick={() => handleTabChange('study')}>학습자료</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
