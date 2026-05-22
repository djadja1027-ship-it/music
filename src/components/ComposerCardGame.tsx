import { useState, useEffect } from 'react';
import { 
  Trophy, RotateCcw, CheckCircle, AlertCircle, Info, Sparkles, Star, Award
} from 'lucide-react';
import { musicians, eraGroups } from '../data/composers';
import { playSuccessSound, playFailureSound, playNote } from '../utils/audioSynth';

interface ScoreEntry {
  name: string;
  score: number;
  time: number;
  date: string;
}

export default function ComposerCardGame() {
  const allComposers = Object.values(musicians);
  
  // Game states
  const [deck, setDeck] = useState<typeof allComposers>([]);
  const [selectedComposerId, setSelectedComposerId] = useState<string | null>(null);
  const [sortedMap, setSortedMap] = useState<Record<string, string>>({}); // composerId -> eraId
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [highScores, setHighScores] = useState<ScoreEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [savedScore, setSavedScore] = useState(false);

  // Load high scores
  useEffect(() => {
    const scores = localStorage.getItem('classical_match_highscores');
    if (scores) {
      setHighScores(JSON.parse(scores));
    }
  }, []);

  // Timer
  useEffect(() => {
    let interval: number;
    if (gameStarted && !gameFinished) {
      interval = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameFinished]);

  const initGame = () => {
    // Shuffle the deck of composers
    const shuffled = [...allComposers].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setSelectedComposerId(null);
    setSortedMap({});
    setScore(0);
    setAttempts(0);
    setTimeElapsed(0);
    setGameStarted(true);
    setGameFinished(false);
    setFeedback(null);
    setSavedScore(false);
    playNote('C5', 'sine', 0.2);
  };

  const handleSelectComposer = (id: string) => {
    if (sortedMap[id]) return; // already sorted
    setSelectedComposerId(id);
    setFeedback(null);
    playNote('G4', 'sine', 0.1);
  };

  const handleSelectEra = (eraId: string) => {
    if (!selectedComposerId) {
      setFeedback({ message: '먼저 분류할 음악가 카드를 선택해 주세요!', isError: true });
      playNote('D4', 'triangle', 0.2);
      return;
    }

    const composer = musicians[allComposers.find(c => c.id === selectedComposerId)?.name || ''];
    if (!composer) return;

    // Check if correct
    let isCorrect = false;
    if (eraId === 'baroque' && composer.era === '바로크 시대') isCorrect = true;
    if (eraId === 'classical' && composer.era === '고전주의 시대') isCorrect = true;
    if (eraId === 'transition' && composer.era === '고전주의에서 낭만주의로 넘어간 시대') isCorrect = true;
    if (eraId === 'romantic' && composer.era === '낭만주의 시대') isCorrect = true;

    setAttempts(prev => prev + 1);

    if (isCorrect) {
      playNote('C5', 'sine', 0.1);
      setTimeout(() => playNote('E5', 'sine', 0.15), 100);
      
      const newSorted = { ...sortedMap, [composer.id]: eraId };
      setSortedMap(newSorted);
      setScore(prev => prev + 10);
      setFeedback({ message: `참 잘했어요! ${composer.name}은(는) ${composer.era} 음악가입니다. ✨`, isError: false });
      setSelectedComposerId(null);

      // Check if finished
      if (Object.keys(newSorted).length === allComposers.length) {
        setGameFinished(true);
        setTimeout(() => playSuccessSound(), 400);
      }
    } else {
      playFailureSound();
      setScore(prev => Math.max(0, prev - 3));
      setFeedback({ message: `앗! ${composer.name}은(는) 그 시대 음악가가 아니에요. 다시 한 번 생각해보세요! 😢`, isError: true });
    }
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return;

    const newEntry: ScoreEntry = {
      name: playerName.trim(),
      score: score,
      time: timeElapsed,
      date: new Date().toLocaleDateString('ko-KR')
    };

    const newScores = [...highScores, newEntry]
      .sort((a, b) => b.score - a.score || a.time - b.time)
      .slice(0, 5); // top 5

    setHighScores(newScores);
    localStorage.setItem('classical_match_highscores', JSON.stringify(newScores));
    setSavedScore(true);
    playNote('G5', 'sine', 0.2);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  const getAccuracy = () => {
    if (attempts === 0) return 0;
    return Math.round((allComposers.length / attempts) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto bg-amber-50/20 rounded-3xl border-4 border-amber-900/60 p-6 shadow-xl">
      {/* Title & Instructions */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-amber-950 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-300" />
          도전! 시대별 음악가 매칭 게임 🎻
        </h2>
        <p className="text-amber-800 text-sm md:text-base mt-2">
          음악가 카드를 선택한 후, 해당 음악가가 속한 시대의 박스를 눌러 올바르게 분류해 주세요!
        </p>
      </div>

      {!gameStarted ? (
        <div className="bg-white/80 border-2 border-amber-900/20 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <Award className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-amber-950 mb-2">게임 시작 준비 완료</h3>
          <p className="text-xs md:text-sm text-amber-800 mb-6">
            모든 음악가들(8명)을 알맞은 음악 시대에 가장 적은 오답과 가장 빠른 속도로 분류하여 명예의 전당에 이름을 올려보세요!
          </p>
          <button
            onClick={initGame}
            className="w-full py-3.5 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl shadow-md transition-all text-sm md:text-base cursor-pointer"
          >
            게임 시작하기 🎮
          </button>

          {/* Mini High Scores Display */}
          {highScores.length > 0 && (
            <div className="mt-8 pt-6 border-t border-amber-100 text-left">
              <h4 className="text-sm font-bold text-amber-950 mb-3 flex items-center gap-1.5 justify-center">
                <Star className="w-4 h-4 text-amber-500 fill-amber-300" /> 명예의 전당 (Top 5)
              </h4>
              <div className="space-y-1.5 max-w-xs mx-auto">
                {highScores.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-amber-900 bg-amber-50/50 p-2 rounded border border-amber-900/10">
                    <span className="font-bold">{i + 1}등. {h.name}</span>
                    <span className="font-mono text-amber-800">{h.score}점 ({formatTime(h.time)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : gameFinished ? (
        <div className="bg-white/90 border-4 border-amber-400 rounded-3xl p-6 md:p-8 text-center max-w-2xl mx-auto shadow-lg">
          <Sparkles className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-spin" />
          <h3 className="text-2xl font-black text-amber-950 mb-2">🎉 미션 컴플리트!</h3>
          <p className="text-amber-800 text-sm mb-6">
            축하합니다! 8명의 위대한 음악가들을 시대별로 완벽하게 분류해 냈습니다.
          </p>

          {/* Results Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">최종 점수</p>
              <p className="text-lg md:text-2xl font-black text-amber-900">{score}점</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">소요 시간</p>
              <p className="text-lg md:text-2xl font-black text-amber-900">{formatTime(timeElapsed)}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">분류 정확도</p>
              <p className="text-lg md:text-2xl font-black text-amber-900">{getAccuracy()}%</p>
            </div>
          </div>

          {/* Save High Score Form */}
          {!savedScore ? (
            <div className="bg-amber-100/50 border border-amber-900/10 rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-amber-900 mb-2">명예의 전당에 점수 저장하기</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  placeholder="이름 입력 (예: 홍길동)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-800"
                />
                <button
                  onClick={saveHighScore}
                  disabled={!playerName.trim()}
                  className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-green-700 font-bold mb-6">✅ 명예의 전당에 점수가 저장되었습니다!</p>
          )}

          {/* Restart */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setGameStarted(false)}
              className="px-6 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-900/30 text-amber-950 text-xs md:text-sm font-bold rounded-lg cursor-pointer transition-colors"
            >
              메인으로
            </button>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs md:text-sm font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> 다시 하기
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Game Stats Bar */}
          <div className="flex items-center justify-between bg-amber-900/10 rounded-xl p-3 border border-amber-900/5 text-xs md:text-sm font-bold text-amber-950 shrink-0 select-none">
            <div className="flex items-center gap-1">
              <span>점수:</span>
              <span className="text-amber-800 font-mono">{score}점</span>
            </div>
            <div className="flex items-center gap-1">
              <span>남은 카드:</span>
              <span className="text-amber-800 font-mono">{allComposers.length - Object.keys(sortedMap).length}장</span>
            </div>
            <div className="flex items-center gap-1">
              <span>경과 시간:</span>
              <span className="text-amber-800 font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <button
              onClick={initGame}
              className="p-1 hover:bg-amber-200 rounded transition-colors text-amber-900"
              title="게임 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className={`p-3 rounded-lg flex items-center gap-2 border text-xs font-semibold ${
              feedback.isError 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              {feedback.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 1. Composer Deck (To Be Classified) */}
          <div>
            <h3 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> 아래 음악가 카드 중 하나를 선택하세요:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {deck.map((composer) => {
                const isSorted = !!sortedMap[composer.id];
                const isSelected = selectedComposerId === composer.id;
                
                return (
                  <button
                    key={composer.id}
                    onClick={() => handleSelectComposer(composer.id)}
                    disabled={isSorted}
                    className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                      isSorted
                        ? 'bg-amber-900/10 border-transparent opacity-40 grayscale cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-200 border-amber-900 scale-105 shadow-md'
                        : 'bg-white hover:bg-amber-50/70 border-amber-900/20 hover:border-amber-900 cursor-pointer'
                    }`}
                  >
                    <img
                      src={composer.photo}
                      alt={composer.name}
                      className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-amber-800/40"
                    />
                    <h4 className="font-bold text-amber-950 text-xs md:text-sm mt-1.5">{composer.name}</h4>
                    <p className="text-[10px] text-amber-800/80 mt-0.5 truncate">{composer.nickname}</p>

                    {/* Badge if sorted */}
                    {isSorted && (
                      <span className="absolute top-1.5 right-1.5 text-xs bg-green-100 text-green-800 font-bold border border-green-200 px-1.5 py-0.5 rounded-md">
                        완료
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Era Buckets (Drop Targets) */}
          <div className="pt-4 border-t border-amber-900/10">
            <h3 className="text-xs font-bold text-amber-900 mb-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 알맞은 음악 시대 박스를 선택해 카드를 쏘아 올리세요!
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eraGroups.map((group) => {
                // Find all composers sorted into this bucket
                const sortedComposersInBucket = allComposers.filter(
                  (c) => sortedMap[c.id] === group.id
                );

                return (
                  <div
                    key={group.id}
                    onClick={() => handleSelectEra(group.id)}
                    className="bg-white/80 hover:bg-white border-2 border-amber-900/20 hover:border-amber-900/50 rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-950 text-sm md:text-base flex items-center gap-1">
                          <span>{group.icon}</span>
                          <span>{group.era}</span>
                        </h4>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          {group.period}
                        </span>
                      </div>
                      <p className="text-xs text-amber-800/90 mt-1.5 leading-relaxed">
                        {group.desc}
                      </p>
                    </div>

                    {/* Nested sorted card names */}
                    <div className="mt-4 pt-3 border-t border-amber-100 min-h-12 flex flex-wrap gap-1.5 items-center">
                      {sortedComposersInBucket.length === 0 ? (
                        <span className="text-[10px] text-amber-800/40 italic">이 시대로 분류된 음악가 카드가 비어 있습니다.</span>
                      ) : (
                        sortedComposersInBucket.map((comp) => (
                          <div
                            key={comp.id}
                            className="bg-green-50 border border-green-200 rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm select-none"
                          >
                            <img
                              src={comp.photo}
                              alt={comp.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-green-900">{comp.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
