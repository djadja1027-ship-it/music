import { useState, useEffect } from 'react';
import { 
  Award, Trophy, RefreshCw, HelpCircle, 
  Star, ShieldAlert, Sparkles, BookOpen, Clock
} from 'lucide-react';
import { musicians, Composer } from '../data/composers';
import { playSuccessSound, playFailureSound, playNote } from '../utils/audioSynth';

interface Badge {
  id: string;
  title: string;
  composerName: string;
  icon: string;
  description: string;
  color: string;
}

const BADGES_INFO: Record<string, Omit<Badge, 'id'>> = {
  bach: { title: '음악의 아버지 배지', composerName: '바흐', icon: '🎹', description: '바로크 대위법의 신비를 모두 맞혔어요!', color: 'from-blue-600 to-indigo-700' },
  vivaldi: { title: '사계의 묘사 왕 배지', composerName: '비발디', icon: '🎻', description: '사계와 계절 묘사의 고수예요!', color: 'from-emerald-500 to-teal-700' },
  handel: { title: '할렐루야 거장 배지', composerName: '헨델', icon: '🎵', description: '수상 음악과 메시아를 완벽 이해했어요!', color: 'from-red-500 to-pink-700' },
  mozart: { title: '클래식 신동 배지', composerName: '모차르트', icon: '🌟', description: '모차르트 천재성의 비밀을 다 알아요!', color: 'from-amber-400 to-yellow-600' },
  beethoven: { title: '운명 극복 악성 배지', composerName: '베토벤', icon: '🔥', description: '청력을 극복한 의지를 보여줬어요!', color: 'from-orange-600 to-red-800' },
  chopin: { title: '피아노의 시인 배지', composerName: '쇼팽', icon: '🎹', description: '시적인 선율과 폴란드 사랑에 답했어요!', color: 'from-purple-500 to-indigo-600' },
  schubert: { title: '가곡의 왕 배지', composerName: '슈베르트', icon: '🐟', description: '송어와 가곡의 깊이를 전부 알아요!', color: 'from-sky-500 to-blue-700' },
  tchaikovsky: { title: '발레 음악의 왕 배지', composerName: '차이콥스키', icon: '🩰', description: '백조의 호수와 호두까기 인형 스페셜리스트!', color: 'from-pink-500 to-rose-700' }
};

export default function QuizArena() {
  const allComposers = Object.values(musicians);

  // States
  const [activeTab, setActiveTab] = useState<'individual' | 'grand'>('individual');
  const [selectedComposer, setSelectedComposer] = useState<Composer | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  
  // Individual Composer Quiz state
  const [currentCompQuestionIdx, setCurrentCompQuestionIdx] = useState(0);
  const [compQuizAnswers, setCompQuizAnswers] = useState<number[]>([]); // selected answers
  const [compQuizFinished, setCompQuizFinished] = useState(false);
  const [compQuizScore, setCompQuizScore] = useState(0);

  // Grand Mix Quiz state
  const [grandQuizStarted, setGrandQuizStarted] = useState(false);
  const [grandQuizQuestions, setGrandQuizQuestions] = useState<{
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[]>([]);
  const [currentGrandIdx, setCurrentGrandIdx] = useState(0);
  const [grandQuizFinished, setGrandQuizFinished] = useState(false);
  const [grandScore, setGrandScore] = useState(0);
  const [timer, setTimer] = useState(60); // seconds limit for grand quiz

  // Load badges from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('classical_quiz_badges');
    if (saved) {
      setUnlockedBadges(JSON.parse(saved));
    }
  }, []);

  // Timer effect for Grand Quiz
  useEffect(() => {
    let interval: number;
    if (grandQuizStarted && !grandQuizFinished && timer > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setGrandQuizFinished(true);
            playFailureSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [grandQuizStarted, grandQuizFinished, timer]);

  // Start grand mix quiz
  const startGrandQuiz = () => {
    // Collect all quiz questions from all 8 composers
    const pool: typeof grandQuizQuestions = [];
    allComposers.forEach(c => {
      pool.push(...c.quiz);
    });

    // Shuffle and pick 10 questions
    const selected = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    
    setGrandQuizQuestions(selected);
    setCurrentGrandIdx(0);
    setGrandScore(0);
    setTimer(90); // 90 seconds
    setGrandQuizStarted(true);
    setGrandQuizFinished(false);
    playNote('C5', 'sine', 0.15);
  };

  const handleSelectComposerQuiz = (compName: string) => {
    const comp = musicians[compName];
    if (!comp) return;
    setSelectedComposer(comp);
    setCurrentCompQuestionIdx(0);
    setCompQuizAnswers([]);
    setCompQuizFinished(false);
    setCompQuizScore(0);
    playNote('E5', 'sine', 0.1);
  };

  // Submit answer for Composer Quiz
  const handleCompAnswerSubmit = (optionIdx: number) => {
    if (!selectedComposer) return;
    const currentQuestion = selectedComposer.quiz[currentCompQuestionIdx];
    const isCorrect = optionIdx === currentQuestion.answer;

    // Play sounds
    if (isCorrect) {
      playNote('C5', 'sine', 0.08);
      setTimeout(() => playNote('E5', 'sine', 0.08), 80);
      setTimeout(() => playNote('G5', 'sine', 0.2), 160);
      setCompQuizScore(prev => prev + 1);
    } else {
      playNote('Eb4', 'triangle', 0.3);
    }

    const updatedAnswers = [...compQuizAnswers, optionIdx];
    setCompQuizAnswers(updatedAnswers);

    // Navigate or complete
    if (currentCompQuestionIdx + 1 < selectedComposer.quiz.length) {
      setCurrentCompQuestionIdx(prev => prev + 1);
    } else {
      // Completed!
      setCompQuizFinished(true);
      const finalScore = isCorrect ? compQuizScore + 1 : compQuizScore;
      
      // Award badge if score is perfect (3/3)
      if (finalScore === 3) {
        const badgeId = selectedComposer.id;
        if (!unlockedBadges.includes(badgeId)) {
          const newBadges = [...unlockedBadges, badgeId];
          setUnlockedBadges(newBadges);
          localStorage.setItem('classical_quiz_badges', JSON.stringify(newBadges));
          setTimeout(() => playSuccessSound(), 400);
        }
      }
    }
  };

  // Submit answer for Grand Mix Quiz
  const handleGrandAnswerSubmit = (optionIdx: number) => {
    const currentQuestion = grandQuizQuestions[currentGrandIdx];
    const isCorrect = optionIdx === currentQuestion.answer;

    // Play sounds
    if (isCorrect) {
      playNote('C5', 'sine', 0.08);
      setTimeout(() => playNote('E5', 'sine', 0.08), 80);
      setTimeout(() => playNote('G5', 'sine', 0.2), 160);
      setGrandScore(prev => prev + 1);
    } else {
      playNote('Eb4', 'triangle', 0.25);
    }

    if (currentGrandIdx + 1 < grandQuizQuestions.length) {
      setCurrentGrandIdx(prev => prev + 1);
    } else {
      // Finish
      setGrandQuizFinished(true);
      setTimeout(() => playSuccessSound(), 400);
    }
  };

  const resetGrandQuiz = () => {
    setGrandQuizStarted(false);
    setGrandQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-amber-50/20 rounded-3xl border-4 border-amber-900/60 p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-amber-950 flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-300" />
          음악 퀴즈 아레나 🏆
        </h2>
        <p className="text-amber-800 text-sm md:text-base mt-2">
          음악가별 퀴즈를 풀고 특별한 디지털 명예 배지를 모아보세요!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-amber-900/10 p-1.5 rounded-xl border border-amber-900/5 max-w-md mx-auto select-none">
        <button
          onClick={() => {
            setActiveTab('individual');
            setSelectedComposer(null);
            resetGrandQuiz();
            playNote('C5', 'sine', 0.1);
          }}
          className={`flex-1 py-2 rounded-lg font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'individual' 
              ? 'bg-amber-900 text-white shadow-sm' 
              : 'text-amber-900/70 hover:bg-amber-900/5'
          }`}
        >
          👤 음악가별 개별 퀴즈
        </button>
        <button
          onClick={() => {
            setActiveTab('grand');
            setSelectedComposer(null);
            resetGrandQuiz();
            playNote('E5', 'sine', 0.1);
          }}
          className={`flex-1 py-2 rounded-lg font-bold text-xs md:text-sm transition-all cursor-pointer ${
            activeTab === 'grand' 
              ? 'bg-amber-900 text-white shadow-sm' 
              : 'text-amber-900/70 hover:bg-amber-900/5'
          }`}
        >
          ⚡ 전범위 랜덤 모의고사
        </button>
      </div>

      {/* 1. Tab: Individual Composer Quizzes */}
      {activeTab === 'individual' && (
        <div className="space-y-6">
          {!selectedComposer ? (
            <div className="space-y-6">
              {/* Badges showcase section */}
              <div className="bg-white/80 border border-amber-900/10 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-amber-950 mb-3 flex items-center gap-1.5 justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                  나의 디지털 명예 배지 보관함 ({unlockedBadges.length} / 8)
                </h3>

                {unlockedBadges.length === 0 ? (
                  <p className="text-xs text-amber-800/60 italic text-center py-4 bg-amber-50/30 rounded-lg border border-dashed border-amber-200">
                    아직 획득한 배지가 없어요. 음악가를 선택해 퀴즈 3문제를 모두 맞히면 영광스러운 배지를 얻을 수 있어요! 🎖️
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {unlockedBadges.map((badgeId) => {
                      const badge = BADGES_INFO[badgeId];
                      if (!badge) return null;
                      return (
                        <div 
                          key={badgeId} 
                          className={`bg-gradient-to-br ${badge.color} text-white rounded-xl p-3 text-center shadow-md flex flex-col items-center justify-between border-2 border-white/20 relative group overflow-hidden`}
                        >
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]" />
                          <span className="text-3xl mb-1.5">{badge.icon}</span>
                          <div>
                            <h4 className="text-xs font-black truncate">{badge.title}</h4>
                            <p className="text-[9px] text-white/80 mt-0.5 leading-snug">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Music List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> 퀴즈를 풀 음악가를 선택하세요:
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allComposers.map((comp) => {
                    const hasBadge = unlockedBadges.includes(comp.id);
                    return (
                      <button
                        key={comp.id}
                        onClick={() => handleSelectComposerQuiz(comp.name)}
                        className={`rounded-2xl border-2 p-3 text-center transition-all bg-white hover:bg-amber-50/70 border-amber-900/10 hover:border-amber-900 cursor-pointer flex flex-col justify-between items-center relative ${
                          hasBadge ? 'ring-2 ring-amber-400' : ''
                        }`}
                      >
                        {hasBadge && (
                          <span className="absolute -top-1.5 -right-1.5 text-lg" title="배지 보유!">
                            🎖️
                          </span>
                        )}
                        <img
                          src={comp.photo}
                          alt={comp.name}
                          className="w-14 h-14 rounded-full object-cover mx-auto border border-amber-200"
                        />
                        <div className="mt-2">
                          <h4 className="font-bold text-amber-950 text-xs md:text-sm">{comp.name}</h4>
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 block mt-1">
                            {comp.nickname.split(' ')[0]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Quiz Active UI
            <div className="bg-white/90 border-2 border-amber-900/10 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4 shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedComposer.photo} 
                    alt={selectedComposer.name} 
                    className="w-8 h-8 rounded-full object-cover border border-amber-200"
                  />
                  <div>
                    <h3 className="font-bold text-amber-950 text-sm md:text-base">{selectedComposer.name}의 퀴즈</h3>
                    <p className="text-[10px] text-amber-600">완벽하게 다 맞히면 특별 배지가 열려요!</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedComposer(null)}
                  className="text-xs text-amber-900/60 hover:text-amber-950 font-bold bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  음악가 목록으로
                </button>
              </div>

              {!compQuizFinished ? (
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-800 font-bold select-none">
                      <span>문제 {currentCompQuestionIdx + 1} / {selectedComposer.quiz.length}</span>
                      <span>현재 점수: {compQuizScore}점</span>
                    </div>
                    <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-900 h-full transition-all duration-300"
                        style={{ width: `${((currentCompQuestionIdx) / selectedComposer.quiz.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm md:text-base leading-relaxed">
                        {selectedComposer.quiz[currentCompQuestionIdx].question}
                      </h4>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedComposer.quiz[currentCompQuestionIdx].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCompAnswerSubmit(idx)}
                        className="w-full text-left p-3.5 bg-white hover:bg-amber-50 border-2 border-amber-900/10 hover:border-amber-900 rounded-xl text-xs md:text-sm font-bold text-amber-950 transition-all cursor-pointer"
                      >
                        {idx + 1}. {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // Quiz Finish UI
                <div className="text-center py-6 space-y-4">
                  {compQuizScore === 3 ? (
                    <div className="space-y-3">
                      <Sparkles className="w-14 h-14 text-amber-500 mx-auto animate-pulse" />
                      <h3 className="text-xl md:text-2xl font-black text-amber-950">🎉 만점 축하합니다! 🎉</h3>
                      <p className="text-amber-800 text-sm max-w-md mx-auto">
                        모든 질문에 정답을 기록하여 <strong>'{BADGES_INFO[selectedComposer.id].title}'</strong>를 획득하였습니다. 보관함에 안전하게 추가해 두었어요!
                      </p>

                      <div className="inline-flex justify-center items-center mt-3">
                        <div className={`bg-gradient-to-br ${BADGES_INFO[selectedComposer.id].color} text-white rounded-2xl p-4 text-center shadow-lg border-2 border-white/20 flex flex-col items-center justify-between w-48`}>
                          <span className="text-4xl mb-2">{BADGES_INFO[selectedComposer.id].icon}</span>
                          <h4 className="text-sm font-black">{BADGES_INFO[selectedComposer.id].title}</h4>
                          <p className="text-[10px] text-white/80 mt-1">{BADGES_INFO[selectedComposer.id].description}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ShieldAlert className="w-14 h-14 text-amber-600 mx-auto" />
                      <h3 className="text-xl font-bold text-amber-950">퀴즈 결과 ({compQuizScore} / 3)</h3>
                      <p className="text-amber-800 text-sm">
                        조금 더 공부하면 명예 배지를 모을 수 있어요. 다시 한번 도전해보세요!
                      </p>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      onClick={() => setSelectedComposer(null)}
                      className="px-6 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-900/20 text-amber-950 text-xs md:text-sm font-bold rounded-lg cursor-pointer"
                    >
                      목록으로
                    </button>
                    <button
                      onClick={() => handleSelectComposerQuiz(selectedComposer.name)}
                      className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs md:text-sm font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> 다시 풀기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Tab: Grand Mix Quiz */}
      {activeTab === 'grand' && (
        <div className="space-y-6">
          {!grandQuizStarted ? (
            <div className="bg-white/80 border-2 border-amber-900/10 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-5">
              <Star className="w-14 h-14 text-amber-500 fill-amber-300 mx-auto animate-pulse" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-amber-950">전범위 믹스 클래식 음악고사</h3>
                <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                  모든 음악가들의 퀴즈 풀에서 랜덤하게 10개의 문제를 뽑아 채점합니다.<br />
                  제한 시간 90초 이내에 가장 정밀하고 민첩하게 답을 맞추어 최우수 성적표를 획득해보세요!
                </p>
              </div>
              <button
                onClick={startGrandQuiz}
                className="w-full py-3.5 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                모의고사 시작하기 📝
              </button>
            </div>
          ) : grandQuizFinished ? (
            // Grand Quiz Finish
            <div className="bg-white/90 border-4 border-amber-400 rounded-3xl p-6 md:p-8 text-center max-w-2xl mx-auto shadow-lg space-y-6">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-amber-950">클래식 모의고사 채점 결과</h3>
                <p className="text-amber-800 text-sm">
                  10문제 중 최종적으로 <span className="font-bold text-amber-900 text-lg">{grandScore}문제</span>를 맞히셨습니다.
                </p>
              </div>

              {/* Award Certificate Box */}
              <div className="bg-amber-50 border-2 border-double border-amber-700/60 rounded-2xl p-6 max-w-md mx-auto space-y-4">
                <span className="text-amber-800 font-serif text-sm tracking-widest block uppercase font-bold">- 수 료 증 -</span>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-amber-950">클래식 음악 퀴즈 이수자</h4>
                  <p className="text-xs text-amber-800 font-medium">귀하는 17~19세기 위대한 클래식 작곡가들에 대한 지식 평가를 성공적으로 통과하였으므로 이 증서를 수여합니다.</p>
                </div>
                <div className="flex justify-between items-end border-t border-amber-900/10 pt-4 text-left">
                  <div>
                    <p className="text-[10px] text-amber-700 font-semibold">평가 등급: {grandScore >= 9 ? '👑 특등급 마스터' : grandScore >= 7 ? '✨ 우수 클래시스트' : '👍 이수 통과'}</p>
                    <p className="text-[9px] text-amber-800/80 mt-0.5">발급기관: 시대별 음악가 체험 학습 아레나</p>
                  </div>
                  <span className="text-3xl select-none">🎼</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4 select-none">
                <button
                  onClick={resetGrandQuiz}
                  className="px-6 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-900/20 text-amber-950 text-xs md:text-sm font-bold rounded-lg cursor-pointer"
                >
                  초기 화면
                </button>
                <button
                  onClick={startGrandQuiz}
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs md:text-sm font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> 다시 시험보기
                </button>
              </div>
            </div>
          ) : (
            // Grand Quiz Active Question
            <div className="bg-white/90 border-2 border-amber-900/10 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
              {/* Stats & Timer Bar */}
              <div className="flex items-center justify-between border-b border-amber-100 pb-3 shrink-0 select-none">
                <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-amber-950">
                  <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                  <span>남은 시간:</span>
                  <span className="text-amber-800 font-mono text-sm">{timer}초</span>
                </div>
                <div className="text-xs font-bold text-amber-950">
                  진행도: {currentGrandIdx + 1} / 10
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden shrink-0">
                <div 
                  className="bg-amber-900 h-full transition-all duration-300"
                  style={{ width: `${((currentGrandIdx) / 10) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm md:text-base leading-relaxed">
                    {grandQuizQuestions[currentGrandIdx]?.question}
                  </h4>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {grandQuizQuestions[currentGrandIdx]?.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGrandAnswerSubmit(idx)}
                    className="w-full text-left p-3.5 bg-white hover:bg-amber-50 border-2 border-amber-900/10 hover:border-amber-900 rounded-xl text-xs md:text-sm font-bold text-amber-950 transition-all cursor-pointer"
                  >
                    {idx + 1}. {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
