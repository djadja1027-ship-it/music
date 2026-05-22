import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Send, Sparkles, Volume2, VolumeX, Play, Pause, 
  HelpCircle, Music
} from 'lucide-react';
import { Composer } from '../data/composers';
import { playNote, playMelody, stopAllSounds, playChimeSound } from '../utils/audioSynth';

interface ComposerChatProps {
  composer: Composer;
  onBack: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ComposerChat({ composer, onBack }: ComposerChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number | null>(null);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: `안녕! 나는 ${composer.era}의 음악가, '${composer.nickname}' ${composer.name}란다. 😊\n\n${composer.simpleInfo}\n\n나와 나의 음악, 그리고 살았던 시대에 대해 궁금한 점이 있다면 무엇이든 물어보렴!`,
        timestamp: new Date()
      }
    ]);
    setIsPlayingMelody(false);
    setActiveNoteIdx(null);
    setActiveQuizQuestion(null);
    setQuizScore(0);
    stopAllSounds();

    return () => {
      stopAllSounds();
    };
  }, [composer]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTts = (text: string) => {
    if (!window.speechSynthesis) {
      alert('이 브라우저는 음성 합성(TTS) 기능을 지원하지 않습니다.');
      return;
    }
    
    // Stop any current speaking
    window.speechSynthesis.cancel();

    if (!isTtsEnabled) {
      setIsTtsEnabled(true);
      // Clean up text of emojis and special characters for cleaner TTS
      const cleanText = text.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ko-KR';
      
      // Pitch adjustment based on composer
      if (composer.id === 'mozart') {
        utterance.pitch = 1.3; // Youthful/higher pitch
        utterance.rate = 1.05;
      } else if (composer.id === 'beethoven') {
        utterance.pitch = 0.8; // Grumpy/lower pitch
        utterance.rate = 0.9;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      utterance.onend = () => {
        setIsTtsEnabled(false);
      };
      utterance.onerror = () => {
        setIsTtsEnabled(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setIsTtsEnabled(false);
    }
  };

  const playComposerMelody = () => {
    if (!composer.melody) return;

    if (isPlayingMelody) {
      stopAllSounds();
      setIsPlayingMelody(false);
      setActiveNoteIdx(null);
    } else {
      setIsPlayingMelody(true);
      playMelody(
        composer.melody.notes,
        composer.melody.bpm,
        (index) => {
          setActiveNoteIdx(index);
        },
        () => {
          setIsPlayingMelody(false);
          setActiveNoteIdx(null);
        }
      );
    }
  };

  // Generate answer based on user query keywords
  const generateBotResponse = (question: string): string => {
    const q = question.toLowerCase().replace(/\s+/g, '');

    // 1. Quizzes
    if (q.includes('퀴즈') || q.includes('문제') || q.includes('맞히기')) {
      const firstQuiz = composer.quiz[0];
      setActiveQuizQuestion(0);
      return `좋아! 그럼 너의 실력을 알아볼 수 있는 재미있는 음악 퀴즈를 내볼게. ❓\n\n[문제 1]\n${firstQuiz.question}\n\n아래 선택지 중에서 골라봐!\n1️⃣ ${firstQuiz.options[0]}\n2️⃣ ${firstQuiz.options[1]}\n3️⃣ ${firstQuiz.options[2]}\n4️⃣ ${firstQuiz.options[3]}`;
    }

    // 2. Famous songs
    if (q.includes('대표곡') || q.includes('유명한곡') || q.includes('노래') || q.includes('음악')) {
      return composer.qa['대표곡'];
    }

    // 3. Era & Style
    if (
      q.includes('시대') || q.includes('바로크') || q.includes('고전') || 
      q.includes('낭만') || q.includes('특징') || q.includes('스타일')
    ) {
      if (q.includes('바로크')) {
        return `바로크 음악은 화려하고 웅장한 느낌이 특징이야. 👑 궁전이나 대예배당에서 연주되었고, 여러 멜로디가 서로 어우러지는 대위법이 최고조에 달했지. 나와 연결해서 보면 이렇게 이해할 수 있단다:\n\n${composer.eraInfo}`;
      }
      if (q.includes('고전주의')) {
        return `고전주의 음악은 균형과 질서를 중요하게 생각해. 🏛️ 소나타 형식 같은 깔끔한 짜임새 덕분에 듣는 순간 조화롭고 편안한 기분이 들지. 나와 연결해서 보면:\n\n${composer.eraInfo}`;
      }
      if (q.includes('낭만주의')) {
        return `낭만주의 음악은 자유로운 감정과 문학적 상상력을 듬뿍 담았단다. 🌙 사랑, 슬픔, 신비로운 자연을 피아노와 웅장한 오케스트라 소리로 그렸어. 나와 연결해서 보면:\n\n${composer.eraInfo}`;
      }
      return `${composer.eraInfo}\n\n나의 음악 스타일은 ${composer.style}`;
    }

    // 4. Instruments
    if (q.includes('악기') || q.includes('연주') || q.includes('피아노') || q.includes('바이올린')) {
      return composer.qa['악기'] || `나는 주로 건반 악기와 오케스트라 편곡을 사랑했단다.`;
    }

    // 5. Personality / Bio
    if (q.includes('어떤사람') || q.includes('성격') || q.includes('사람이야') || q.includes('성향')) {
      return composer.qa['어떤 사람'];
    }

    // 6. Why famous
    if (q.includes('왜유명') || q.includes('유명한이유') || q.includes('훌륭한이유')) {
      return composer.qa['왜 유명'];
    }

    // 7. Fun stories
    if (q.includes('재미') || q.includes('이야기') || q.includes('일화') || q.includes('에피소드')) {
      return composer.qa['재미있는 이야기'];
    }

    // 8. Elementary class connection
    if (q.includes('초등') || q.includes('교과서') || q.includes('수업') || q.includes('학교')) {
      return composer.qa['초등'];
    }

    // 9. Location/Country
    if (q.includes('나라') || q.includes('어디') || q.includes('출신') || q.includes('고향')) {
      return `나는 ${composer.country} 출신 음악가란다. 🌍 그곳의 공기와 풍경이 내 음악에 큰 영감을 주었지.`;
    }

    // 10. Nickname
    if (q.includes('별명') || q.includes('호칭')) {
      return `사람들은 나를 '${composer.nickname}'이라고 부른단다. 마음에 드는 별명이야! ✨`;
    }

    // 10a. Why did you become a musician? (왜 음악가가 되었어?)
    if (q.includes('왜음악가') || q.includes('어떻게음악가') || q.includes('계기') || q.includes('음악가된이유')) {
      switch (composer.id) {
        case 'bach':
          return `나는 유서 깊은 음악가 가문에서 태어났단다. 할아버지, 아버지, 삼촌들 모두 음악가였지! 나에게 음악은 숨을 쉬는 것처럼 당연하고 자연스러운 운명이었고, 하나님의 영광을 위해 연주하고 곡을 쓰는 것이 가장 가치 있는 일이라 믿었기에 음악가가 되었단다. 🎹`;
        case 'vivaldi':
          return `나의 아버지는 베네치아의 뛰어난 바이올린 연주자이셨어. 아버지에게서 직접 바이올린을 배우며 음악의 짜릿함에 깊이 빠져들었지. 몸이 약해 일반적인 신부 일을 하기는 힘들었지만, 신기하게도 바이올린을 켜고 아이들을 가르치는 동안에는 누구보다 뜨거운 열정을 품게 되어 음악가의 길을 걷게 되었단다. 🎻`;
        case 'handel':
          return `사실 아버지는 내가 법률가가 되기를 바라며 집에서 악기를 만지지도 못하게 하셨단다. 하지만 음악이 너무 좋았던 나는 밤마다 몰래 다락방에 쳄발로를 숨겨두고 연습했지! 조지 공작이 우연히 내 연주를 듣고 음악 공부를 시키라고 아버지를 설득해준 덕분에, 비로소 내 꿈을 펼쳐 위대한 오페라와 오라토리오 작곡가가 될 수 있었단다. 🎶`;
        case 'mozart':
          return `나는 3살 무렵부터 아버지가 누나(난네를)에게 피아노를 가르쳐주시는 모습을 가만히 지켜보며 음의 조화를 저절로 익혔어. 너무나 당연하게 소리의 세상을 사랑하게 되었고, 내 머릿속에 끊임없이 떠오르는 보석 같은 멜로디를 악보로 옮겨 담아 세상에 전해주는 것이 나의 사명이자 태어난 이유라고 생각했단다! 🌟`;
        case 'beethoven':
          return `나의 아버지는 나를 모차르트처럼 유명한 신동으로 키우고 싶어하셨어. 밤늦게까지 억지로 연습을 시키시는 엄한 아버지 때문에 눈물 흘리기도 했지만, 점차 피아노와 작곡 속에서 나의 가장 뜨거운 감정과 영혼을 표현할 수 있음을 깨달았단다. 내면의 목소리를 음악에 쏟아내며 슬픔과 절망을 극복하는 무기가 되어 주었기에 진정한 음악가가 되었지. 🔥`;
        case 'chopin':
          return `나는 어릴 때부터 피아노 건반의 차갑고도 따뜻한 터치를 너무나 사랑했단다. 6살에 이미 시를 쓰듯 피아노를 가지고 놀았고, 내 마음속 섬세하고 여린 감정들과 조국 폴란드의 영혼을 가장 잘 담아낼 수 있는 유일한 도구가 피아노였기에 평생을 피아노와 살기로 마음먹었단다. 🎹`;
        case 'schubert':
          return `나는 시인들이 쓴 아름답고 슬픈 시에 생명을 불어넣어 노래로 만드는 일을 너무나 사랑했어. 피아노 반주가 흘러나오고 노랫소리가 얹히는 순간, 세상의 모든 쓸쓸함이 따뜻한 위로로 바뀌는 마법에 매료되었지. 비록 평생 가난했지만 나를 지지해주는 다정한 친구들과 함께 아름다운 멜로디를 노래하고자 작곡가가 되었단다. 🐟`;
        case 'tchaikovsky':
          return `사실 나는 처음에는 법률 학교를 졸업하고 정부 관청에서 일하는 공무원이었단다! 하지만 음악에 대한 나의 불타는 열정을 억누를 수가 없어서 20대라는 조금 늦은 나이에 정식 음악원에 들어가 작곡을 공부했지. 내 머릿속에 그려지는 백조들의 우아한 날갯짓과 과자 나라의 신비로운 춤을 표현하는 것보다 나를 가슴 뛰게 하는 일은 없었기 때문이란다. 🩰`;
        default:
          return `음악은 제 감정과 생각을 가장 솔직하게 표현할 수 있는 아름다운 도구였기에 평생을 바쳐 음악가가 되었답니다. ✨`;
      }
    }

    // 10b. When were you born? (언제 태어났어?)
    if (q.includes('언제태어') || q.includes('출생년도') || q.includes('태어난날') || q.includes('생일')) {
      switch (composer.id) {
        case 'bach':
          return `나는 1685년 3월 31일에 독일의 아이제나흐라는 아름다운 마을에서 태어났단다. 🇩🇪 헨델과 동갑내기 친구이자 동료 작곡가이기도 하지!`;
        case 'vivaldi':
          return `나는 1678년 3월 4일에 이탈리아의 물의 도시, 베네치아에서 태어났단다. 🇮🇹 베네치아의 출렁이는 곤돌라 물결처럼 경쾌한 선율이 가득한 곳이었지.`;
        case 'handel':
          return `나는 1685년 2월 23일에 독일의 할레라는 곳에서 태어났단다. 🇩🇪 바흐와는 동갑이지만 나는 나중에 영국의 런던으로 건너가서 본격적인 활동을 시작했지!`;
        case 'mozart':
          return `나는 1756년 1월 27일에 오스트리아의 잘츠부르크에서 태어났단다. 🇦🇹 산과 건물이 어우러진 아주 고풍스럽고 음악이 늘 넘치던 도시였지.`;
        case 'beethoven':
          return `나는 1770년 12월 17일경에 독일의 본(Bonn)이라는 라인강 유역의 도시에서 태어났단다. 🇩🇪 청력을 잃기 전, 어린 시절 그곳의 자연을 뛰어놀며 음악적 꿈을 키웠지.`;
        case 'chopin':
          return `나는 1810년 3월 1일에 폴란드의 젤라조바 볼라라는 평화로운 마을에서 태어났단다. 🇵🇱 그곳의 포근한 흙 냄새와 고국의 민속 춤곡 멜로디는 내 평생의 자양분이 되었지.`;
        case 'schubert':
          return `나는 1797년 1월 31일에 오스트리아의 리히텐탈(빈 근교)에서 태어났단다. 🇦🇹 모차르트와 베토벤의 자취가 깊이 남아있는 음악의 도시에서 자랐지.`;
        case 'tchaikovsky':
          return `나는 1840년 5월 7일에 러시아의 보트킨스크라는 금속 공업 도시에서 태어났단다. 🇷🇺 광활한 러시아의 하늘과 쓸쓸하고도 차가운 겨울 바람이 내 감수성을 키워주었지.`;
        default:
          return `저는 17~19세기 클래식 음악의 전성기에 활약했던 음악가랍니다. 🌍`;
      }
    }

    // 10c. What do you like? (좋아하는게 뭐야?)
    if (q.includes('좋아하는게') || q.includes('좋아하는것') || q.includes('취미') || q.includes('즐겨하는') || q.includes('좋아해')) {
      switch (composer.id) {
        case 'bach':
          return `나는 오르간의 건반을 누르며 거대한 파이프 울림을 느낄 때, 그리고 수십 명의 합창단원들과 함께 화음을 맞출 때 말할 수 없이 깊은 평화를 느낀단다. 또 사랑하는 아내와 20명의 귀여운 자녀들을 위해 다정한 편지와 연습곡을 만드는 가족들과의 시간도 참 좋아하지! 🎹`;
        case 'vivaldi':
          return `나는 당연히 나의 최고 파트너인 바이올린을 켜는 것을 가장 좋아한단다! 그리고 봄에 지저귀는 예쁜 새소리, 겨울 벽난로 가에서 타닥타닥 타오르는 불빛, 그리고 피에타 음악원의 착한 학생들이 내 음악에 맞춰 멋지게 합주할 때 온 세상을 얻은 것처럼 기쁘단다. 🎻`;
        case 'handel':
          return `나는 맛있는 음식을 먹고 사람들과 쾌활하게 어울려 떠들썩한 파티를 즐기는 것을 참 좋아했어! 🍖 또 내 오페라와 오라토리오 공연이 큰 극장에 꽉 차서 관객들이 손뼉 치며 환호할 때 심장이 쿵쾅거릴 만큼 행복하지. 조지 왕과 템스강에서 벌였던 수상 파티도 잊지 못할 추억이야. 🚢`;
        case 'mozart':
          return `나는 농담하고 웃기는 익살스러운 짓을 하는 걸 제일 좋아해! 😜 그리고 친구들과 카드 게임을 하거나 당구를 치는 것도 무척 좋아했단다. 무엇보다 건반 앞에 앉아 나만의 재미있고 유쾌한 멜로디를 쉬지 않고 쏟아내며 음악과 함께 호흡하는 모든 순간이 나에게는 가장 큰 선물이었지! 🌟`;
        case 'beethoven':
          return `나는 매일 아침 정확히 원두 60알을 직접 하나씩 세어 정성스레 우려내는 진한 커피 한 잔을 마시는 게 일상의 큰 낙이었단다. ☕ 그리고 헝클어진 머리로 조용히 숲길을 산책하며 운명의 소리를 생각하는 시간, 비록 귀는 들리지 않아도 내 머릿속에서 완벽하게 조화되는 오케스트라 화음을 느낄 때 가장 행복했지. 🔥`;
        case 'chopin':
          return `나는 아늑하고 아름다운 귀족들의 살롱 방에 촛불을 켜두고, 아주 가까운 친구들 앞에서 피아노 건반을 부드럽게 쓰다듬으며 연주하는 것을 가장 좋아했단다. 🌙 그리고 고국 폴란드의 전통 빵과 조르주 상드의 귀여운 강아지가 내 발 밑에서 꼬리를 흔들며 뛰노는 정다운 모습을 볼 때 큰 위로를 얻었어. 🐶`;
        case 'schubert':
          return `나는 시인 친구들이 모여서 밤늦도록 커피와 차를 마시며 시와 음악을 나눴던 "슈베르티아데"라는 다정한 모임 시간을 정말 좋아했어. ☕ 또 가만히 맑은 냇물을 들여다보며 힘차게 헤엄치는 송어들을 관찰하거나, 슬프고 아름다운 시집을 보며 머릿속으로 어울리는 멜로디를 붙일 때 가장 편안했단다. 🐟`;
        case 'tchaikovsky':
          return `나는 영롱한 물방울 소리를 내는 신비로운 악기 "첼레스타"의 건반을 만지는 걸 좋아해! 🍬 그리고 크리스마스 저녁의 환상적인 연극 무대, 호수 위를 고요하게 유영하는 우아한 백조들을 지켜보며 내면의 슬픔을 잊고 화려한 무대 음악을 그려볼 때 가장 큰 만족을 느꼈단다. 🩰`;
        default:
          return `저는 음악을 연주하고 작곡하는 일을 세상에서 가장 사랑하며, 여러분처럼 음악을 아끼는 분들과 이야기하는 것을 무척 좋아한답니다. 🎵`;
      }
    }

    // 10d. Death / How did they pass away? (사망 / 어떻게 죽었어?)
    if (q.includes('어떻게죽') || q.includes('사망') || q.includes('언제죽') || q.includes('몇살에죽') || q.includes('죽음') || q.includes('사인')) {
      switch (composer.id) {
        case 'bach':
          return `나는 평생 수많은 악보를 쓰고 촛불 밑에서 작업을 하느라 눈이 아주 나빠졌단다. 말년에 영국의 엉터리 안과 의사(존 테일러)에게 백내장 수술을 받았는데, 수술이 실패해서 결국 실명하게 되었고 1750년 7월 28일, 65세의 나이로 뇌졸중과 수술 후유증으로 눈을 감았단다. 😢`;
        case 'vivaldi':
          return `나는 말년에 고향 베네치아에서 인기가 시들해지자 오스트리아 빈으로 건너갔단다. 하지만 나를 후원해주려던 카를 6세 황제가 갑자기 사망하면서 일자리를 얻지 못했고, 1741년 7월 28일에 빈의 가난한 집방에서 빈곤 속에서 급사했어. 63세였지. 당시 가난해서 아주 조촐하게 장례가 치러졌단다. ⛪`;
        case 'handel':
          return `나는 평생 바쁘게 일하다가 말년에 실명하는 등 어려움을 겪었어. 하지만 영국 대중의 큰 존경을 받으며 1759년 4월 14일에 74세의 나이로 세상을 떠났지. 영국인들이 나를 너무나 사랑해주어서, 영국의 가장 명예로운 국립 묘지인 Westminster Abbey(웨스트민스터 사원)에 묻히는 영광을 안았단다. 🇬🇧`;
        case 'mozart':
          return `나는 1791년 12월 5일, 겨우 35세라는 너무나 이른 나이에 오스트리아 빈에서 세상을 떠났단다. 당시 마지막 미완성 곡인 《레퀴엠(진혼곡)》을 쓰던 중 열병과 신부전증으로 쓰러졌지. 당대에는 가난하고 바빠서 공동 묘지에 묻히는 바람에 내 무덤의 정확한 위치를 지금도 아무도 모른다는 슬픈 비밀이 있어. 😭`;
        case 'beethoven':
          return `나는 1827년 3월 26일에 56세의 나이로 오스트리아 빈에서 세상을 떠났단다. 평생 귓병뿐만 아니라 심한 복통과 간 경화증으로 앓아누웠었지. 내 장례식에는 빈 시민 2만 명이 몰려와 거리를 가득 채웠고, 내 시신이 지나갈 때 학교들이 휴교를 할 정도로 온 빈 시민이 눈물로 배웅해 주었단다. 😭`;
        case 'chopin':
          return `나는 평생 결핵(폐병)을 앓아서 몸이 아주 마르고 병약했단다. 결국 1849년 10월 17일, 프랑스 파리에서 39세의 젊은 나이로 숨을 거두었지. 내가 타지에서 눈을 감을 때 내 조국 폴란드를 얼마나 그리워했는지, 내 심장만은 폴란드 바르샤바의 성 십자가 교회에 묻어달라고 유언을 남겼단다. 🇵🇱`;
        case 'schubert':
          return `나는 평생 지독한 가난과 몸의 병(장티푸스와 매독)에 시달리다가 1828년 11월 19일에 겨우 31세라는 어린 나이로 눈을 감았단다. 내가 평소 너무나 존경하고 사모했던 베토벤 선생님의 무덤 바로 옆에 묻어달라고 유언하여, 지금은 빈 중앙묘지의 베토벤 선생님 곁에 나란히 잠들어 있단다. 🌸`;
        case 'tchaikovsky':
          return `나는 1893년 11월 6일, 53세의 나이로 러시아 상트페테르부르크에서 갑자기 사망했단다. 🇷🇺 당시 유행하던 콜레라(오염된 물을 마셔서 걸리는 병)에 걸렸다는 설이 가장 유력한데, 내 비창 교향곡 초연을 지휘한 지 불과 며칠 뒤였기에 온 러시아가 슬픔에 빠졌단다.`;
        default:
          return `저는 음악가로서 남은 삶을 성실히 채우고 세상을 떠났답니다. 그들의 영혼은 여전히 악보 속에 살아 숨쉬고 있지요. 💫`;
      }
    }

    // 10e. Family & Marriage (가족 / 결혼 / 아내)
    if (q.includes('가족') || q.includes('결혼') || q.includes('아내') || q.includes('자식') || q.includes('부인') || q.includes('남편') || q.includes('결혼했')) {
      switch (composer.id) {
        case 'bach':
          return `나는 평생 두 번 결혼했단다. 첫 아내 마리아 바르바라가 세상을 떠난 후, 재능 있는 가수였던 안나 막달레나와 재혼했지. 나는 아이가 무려 20명이나 되었단다! 👨‍👩‍👧‍👦 그 중 여러 아들(C.P.E. 바흐, J.C. 바흐 등)이 훌륭한 클래식 음악가로 성공해 가문의 영광을 이어갔단다.`;
        case 'vivaldi':
          return `나는 로마 가톨릭 성당의 신부(사제)였기 때문에 평생 결혼을 하지 않고 독신으로 살았단다. 대신 피에타 고아원의 수많은 고아 소녀들을 내 친딸처럼 아끼며 바이올린을 정성껏 가르쳤고, 그것이 내 평생의 가족이자 행복이었지. 🎻`;
        case 'handel':
          return `나는 평생 결혼을 하지 않고 오직 음악과 오페라 사업에 온 에너지를 쏟으며 독신으로 살았단다. 비록 아내와 자식은 없었지만, 영국 런던에서 나를 후원해주던 수많은 귀족들과 나를 좋아해준 대중들이 모두 내 소중한 가족이었단다! 🎶`;
        case 'mozart':
          return `나는 오스트리아 빈에서 콘스탄체 베버라는 여성과 열정적인 사랑에 빠져 결혼했단다! 콘스탄체와의 사이에서 6명의 자녀를 두었지만 안타깝게도 어릴 때 병으로 잃고 2명의 아들만 살아남았지. 당시 우리 부부는 돈 관리를 잘 못해서 늘 가난하고 사치스러운 삶을 살았다는 일화가 있단다. 💸`;
        case 'beethoven':
          return `나는 평생 결혼하지 않고 독신으로 살았단다. 내가 사랑했던 여인들은 대부분 신분이 높은 귀족이어서 이루어질 수 없는 아픈 사랑을 많이 겪었지. 내가 세상을 떠난 후 서랍에서 발견된 '불멸의 연인에게' 보내는 편지들은 내 평생 숨겨둔 애틋한 사랑의 흔적이었단다. 💌`;
        case 'chopin':
          return `나는 결혼을 하지 않았지만, 프랑스의 여류 소설가이자 아주 개성 넘치는 여성인 '조르주 상드'와 약 10년 동안 깊은 사랑을 나누었단다. 상드는 몸이 아프고 예민한 나를 위해 요양지(마요르카 섬)를 함께 가주는 등 어머니처럼 따뜻하게 돌봐주었고, 그 시기에 내 명곡들이 많이 탄생했지. 🌙`;
        case 'schubert':
          return `나는 평생 결혼을 하지 못하고 수줍게 독신으로 살았단다. 수입이 거의 없고 가난해서 가정을 꾸릴 형편이 안 되었지. 대신 나에게는 돈을 빌려주고 방을 나누어 쓰던 가난한 예술가 친구들(슈베르티아데)이 있었는데, 그들이 내 유일하고 소중한 가족이었단다. 🐟`;
        case 'tchaikovsky':
          return `나는 안토니나 밀류코바라는 여인과 짧은 결혼 생활을 했으나 성격 차이로 몇 주 만에 파경을 맞이했단다. 내 인생에서 가장 큰 힘이 되어준 사람은 얼굴 한 번 마주치지 않고 편지로만 교류하며 나를 거액으로 후원해 준 '폰 메크 부인'이었는데, 그녀가 내 마음의 든든한 가족이자 동반자였단다. 🩰`;
        default:
          return `작곡가들의 가족 관계와 러브 스토리는 그들의 명곡 뒤에 숨겨진 인간적인 슬픔과 기쁨을 고스란히 담고 있답니다. 👨‍👩‍👧‍👦`;
      }
    }

    // 10f. Friends & Rivals (친구 / 라이벌)
    if (q.includes('친구') || q.includes('라이벌') || q.includes('아는음악가') || q.includes('사이') || q.includes('관계')) {
      switch (composer.id) {
        case 'bach':
          return `나는 동갑내기 헨델을 평생 꼭 한 번 만나보고 싶어했지만, 안타깝게도 서로 일정이 엇갈려 한 번도 직접 마주치지 못했단다. 대신 비발디의 바이올린 협주곡 악보를 구해 오르간 곡으로 편곡하며 큰 영감을 받았고, 그들을 마음속 진정한 라이벌이자 동료로 생각했단다. 🎹`;
        case 'vivaldi':
          return `나는 당시 독일의 바흐가 내 협주곡 악보들을 필사하며 공부했다는 소식을 듣고 내심 무척 뿌듯해했단다. 또 베네치아 극장가에서는 오페라 대본 작가들과 친하게 지내며 매 시즌마다 관객들의 피드백을 주고받는 활발한 소통을 즐겼지! 🎻`;
        case 'handel':
          return `나는 바흐와 1685년생 동갑내기였지만 성향은 정반대였단다. 바흐가 교회 음악에 전념했다면 나는 런던에서 이탈리아 극장들과 라이벌 관계를 맺으며 대중 오페라 경쟁을 벌였지! 또 영국의 킹 조지 1세와 돈독한 우정을 자랑하며 왕실 행사의 주인공으로 활약했어. 👑`;
        case 'mozart':
          return `오스트리아 빈 왕실의 궁정 음악가 '안토니오 살리에리'가 나의 강력한 라이벌로 유명하단다! (나를 질투해 독살했다는 루머까지 돌았지.) 하지만 실제로는 서로 연주를 관람하고 칭찬해주는 존경하는 사이였어. 그리고 하이든 선생님을 제2의 아버지처럼 존경하며 함께 현악 사중주를 연주하기도 했단다. 🎻`;
        case 'beethoven':
          return `나는 청년 시절 오스트리아 빈에 와서 하이든 선생님께 직접 작곡 지도를 받았단다. 성격이 너무 달라서 티격태격하기도 했지만 평생 존경했지. 또 모차르트 선생님 앞에서 즉흥 연주를 선보였을 때 모차르트가 "이 청년을 주목하라, 세상을 놀라게 할 것이다"라고 예언해 준 것은 내 평생의 자부심이었단다! 🔥`;
        case 'chopin':
          return `나는 헝가리 출신의 불세출의 피아노 귀재 '프란츠 리스트'와 아주 절친한 친구이자 선의의 라이벌이었단다! 🎹 리스트는 초인적인 기교로 청중을 매료시키는 화려한 연주를 했고, 나는 살롱에서 섬세하고 시적인 연주를 즐겼지. 우리는 서로의 음악에 큰 자극을 받으며 낭만주의 피아노 시대를 이끌었단다.`;
        case 'schubert':
          return `나는 베토벤 선생님을 신처럼 존경하여 평생 그분의 뒷모습만 바라보고 살았단다. 죽기 직전에야 겨우 내 악보를 전해드릴 기회가 있었는데, 베토벤 선생님께서 내 곡을 보시고 "이 가난한 젊은이에게 신성한 영감이 깃들어 있다"고 찬사를 보내 주셨을 때 눈물이 날 만큼 기뻤단다. 😭`;
        case 'tchaikovsky':
          return `나는 러시아 민속 음악을 극단적으로 강조하던 '러시아 5인조(무소륵스키, 림스키코르사코프 등)' 음악가들과 선의의 경쟁 관계였단다. 그들은 내 음악이 서양 스타일이라며 비판하기도 했지만, 나중에는 결국 서로의 탁월한 관현악 실력을 인정하고 존경하는 좋은 음악적 동료가 되었지. 🇷🇺`;
        default:
          return `클래식의 거장들은 서로 편지를 주고받고 칭찬을 건네며, 때로는 치열하게 경쟁하며 더 위대한 명곡들을 탄생시켰답니다. ✨`;
      }
    }

    // 10g. Food & Diet (음식 / 먹을거)
    if (q.includes('음식') || q.includes('먹을') || q.includes('커피') || q.includes('식사') || q.includes('좋아하는음식') || q.includes('술')) {
      switch (composer.id) {
        case 'bach':
          return `나는 아주 성실하게 일했기 때문에, 예배를 마친 뒤 마시는 따뜻한 맥주 한 잔과 독일 전통 소시지, 감자 요리를 참 좋아했단다. 🍺 묵직하고 든든한 음식이 내 긴 창작 활동을 지탱해 주는 에너지가 되었지!`;
        case 'vivaldi':
          return `나는 베네치아 출신이라 지중해의 신선한 생선 요리와 해산물 파스타를 즐겨 먹었단다. 🐟 하지만 평생 기관지 질환(천식)으로 몸이 항상 약했기 때문에, 자극적인 음식보다는 따뜻한 수프나 허브 티를 더 자주 마시며 몸을 돌봤지.`;
        case 'handel':
          return `나는 당대 유럽에서 엄청나게 뚱뚱하고 덩치가 큰 대식가로 소문이 났었단다! 🍖 고기와 달콤한 디저트, 풍성하게 차려진 연회 음식을 거절하지 않고 마음껏 즐겼지. 먹는 즐거움은 내 폭발적인 오페라 사업의 원동력이기도 했단다.`;
        case 'mozart':
          return `나는 기름진 오스트리아식 슈니첼(돈까스와 비슷한 고기 튀김)과 달콤한 초콜릿 케이크를 정말 사랑했단다! 🍰 친구들과 맥주를 마시며 밤새 수다를 떠는 것도 좋아했고, 늘 맛있는 음식을 함께 나누는 즐거움을 아꼈단다.`;
        case 'beethoven':
          return `내 커피 사랑은 역사상 가장 유별났단다. ☕ 매일 아침 커피 한 잔을 끓일 때 반드시 원두 60알을 한 알 한 알 세어서 내렸어. 그리고 따뜻하고 걸쭉한 브레드 수프(빵 수프)와 맥주 한 잔, 신선한 생선 요리를 좋아했단다.`;
        case 'chopin':
          return `나는 평생 소화기관과 폐가 좋지 않아서 늘 자극적인 음식을 피해야 했단다. 😭 신선한 야채와 가볍게 끓인 맑은 국물 요리를 조금씩 먹었지. 연인 상드가 마요르카 섬에서 나를 위해 정성껏 끓여주던 부드러운 타피오카 수프가 내 인생의 가장 달콤하고 소중한 음식이었단다.`;
        case 'schubert':
          return `나는 평생 돈이 없어서 늘 허름한 선술집에서 가난한 예술가 친구들과 함께 저렴한 맥주와 감자 수프, 호밀빵을 나누어 먹었단다. 🥔 비록 비싼 음식을 먹지는 못했지만 친구들과 함께 둘러앉아 웃으며 먹던 소박한 밥상이 그 어떤 진수성찬보다 맛있었단다.`;
        case 'tchaikovsky':
          return `나는 러시아식 따뜻한 보르시(비트 수프)와 고기 만두인 펠메니를 먹으며 상트페테르부르크의 꽁꽁 얼어붙은 추위를 녹이곤 했단다. 🇷🇺 그리고 생각을 정리할 때 들이켜는 따뜻한 홍차 한 잔이 내 우울했던 기분을 달래주는 훌륭한 친구였지.`;
        default:
          return `작곡가들도 각자 고향의 입맛에 따라 소박한 빵과 따뜻한 커피, 혹은 화려한 연회 음식을 즐겨 먹으며 음악에 대한 영감을 떠올렸답니다. 🍎`;
      }
    }

    // 11. Greeting & Polite questions
    if (q.includes('안녕') || q.includes('반가워') || q.includes('하이') || q.includes('hello')) {
      return `안녕! 다시 만나서 정말 기뻐. 무엇이든 물어보렴. 내가 살았던 시대의 흥미진진한 음악 세계를 알려줄게! 🎻`;
    }

    if (q.includes('고마워') || q.includes('감사') || q.includes('선생님')) {
      return `천만에! 음악에 관심을 가져주어 내가 더 고마운걸. 너의 음악 수업과 감상 활동을 항상 응원할게! 🎼`;
    }

    // Default fall-back response
    return `좋은 질문이구나! 😊\n\n나는 '${composer.name}'에 대해 이런 내용들을 더 자세히 들려줄 수 있어.\n\n🎵 내 대표곡: ${composer.famousSongs.join(', ')}\n🏛️ 나의 음악 시대: ${composer.era}\n🌍 나의 조국: ${composer.country}\n✨ 음악의 느낌: ${composer.style}\n\n대표곡, 시대 특징, 잘 다뤘던 악기, 재미있는 이야기, 또는 나와 퀴즈 풀기 중에서 골라 질문해줘!`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsgText = inputText;
    setInputText('');

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate composer thinking
    setTimeout(() => {
      const replyText = generateBotResponse(userMsgText);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      playChimeSound();
    }, 850);
  };

  const handleQuizAnswer = (selectedOptionIndex: number) => {
    if (activeQuizQuestion === null) return;

    const currentQuiz = composer.quiz[activeQuizQuestion];
    const isCorrect = selectedOptionIndex === currentQuiz.answer;
    
    // Play sound effects
    if (isCorrect) {
      playNote('C5', 'sine', 0.1);
      setTimeout(() => playNote('E5', 'sine', 0.1), 80);
      setTimeout(() => playNote('G5', 'sine', 0.1), 160);
      setTimeout(() => playNote('C6', 'sine', 0.3), 240);
    } else {
      playNote('F4', 'triangle', 0.25);
      setTimeout(() => playNote('Db4', 'triangle', 0.35), 200);
    }

    const newScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(newScore);

    const feedbackText = isCorrect 
      ? `🎉 정답이야! 멋진걸?\n\n${currentQuiz.explanation}` 
      : `😢 아쉽지만 틀렸어.\n\n정답은 [${currentQuiz.options[currentQuiz.answer]}] 란다!\n\n💡 설명: ${currentQuiz.explanation}`;

    const botFeedbackMsg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: feedbackText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botFeedbackMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const nextIndex = activeQuizQuestion + 1;
      if (nextIndex < composer.quiz.length) {
        setActiveQuizQuestion(nextIndex);
        const nextQuiz = composer.quiz[nextIndex];
        const nextQuizMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `[문제 ${nextIndex + 1}]\n${nextQuiz.question}\n\n1️⃣ ${nextQuiz.options[0]}\n2️⃣ ${nextQuiz.options[1]}\n3️⃣ ${nextQuiz.options[2]}\n4️⃣ ${nextQuiz.options[3]}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextQuizMsg]);
      } else {
        // Quiz completed
        setActiveQuizQuestion(null);
        const finalMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `축하해! 모든 퀴즈가 끝났어! 🏆\n총 3문제 중에서 [${newScore}문제]를 맞혔단다.\n\n더 알고 싶은 이야기가 있거나 퀴즈를 다시 풀고 싶다면 언제든 물어봐줘!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalMsg]);
      }
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickPrompts = [
    { text: '🎵 대표곡 설명해줘', query: '대표곡에 대해 설명해줘' },
    { text: '🏛️ 시대 음악 특징', query: '이 시대 음악 특징은 뭐야?' },
    { text: '😊 어떤 사람이었어?', query: '어떤 사람이야?' },
    { text: '✨ 재미있는 이야기', query: '재미있는 이야기 알려줘' },
    { text: '🏫 초등 음악 수업', query: '초등학교 음악 수업이랑 어떻게 연결되나요?' },
    { text: '❓ 퀴즈 내줘!', query: '퀴즈 내줘' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-amber-50/30 rounded-3xl border-4 border-amber-900/60 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[78vh]">
      {/* Sidebar: Composer Stats / Info */}
      <div className="w-full md:w-80 bg-gradient-to-b from-amber-900 to-amber-950 text-amber-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r-4 border-amber-900/60">
        <div>
          {/* Header Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors text-sm font-medium mb-6 bg-white/10 px-3 py-1.5 rounded-full self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            메인 목록으로
          </button>

          {/* Photo & Basic Details */}
          <div className="text-center">
            <div className="relative inline-block">
              <img 
                src={composer.photo} 
                alt={composer.name}
                className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-amber-400 mx-auto shadow-lg"
              />
              <span className="absolute bottom-1 right-2 text-3xl">
                {composer.era.includes('바로크') ? '👑' : composer.era.includes('고전') ? '🏛️' : '🌙'}
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4 text-amber-200">{composer.name}</h2>
            <p className="text-sm text-amber-300 font-semibold">{composer.nickname}</p>
            
            <div className="flex justify-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-amber-800 text-amber-200 text-xs rounded border border-amber-700">{composer.country}</span>
              <span className="px-2 py-0.5 bg-amber-800 text-amber-200 text-xs rounded border border-amber-700">{composer.era}</span>
            </div>
          </div>

          {/* Core Info Bulletins */}
          <div className="mt-6 space-y-3 text-xs md:text-sm text-amber-100/90 bg-black/20 p-4 rounded-xl border border-amber-800/40">
            <div className="flex gap-2">
              <span className="font-bold text-amber-300 shrink-0">스타일:</span>
              <span>{composer.style}</span>
            </div>
            <div className="flex gap-2 border-t border-amber-800/40 pt-2">
              <span className="font-bold text-amber-300 shrink-0">대표곡:</span>
              <span>{composer.famousSongs.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Melody Player Inside Sidebar */}
        {composer.melody && (
          <div className="mt-6 pt-4 border-t border-amber-800/40">
            <div className="bg-amber-950/60 border border-amber-400/30 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-amber-300 mb-2 flex items-center justify-center gap-1">
                <Music className="w-3.5 h-3.5 animate-pulse" />
                대표곡 시그니처 멜로디 듣기
              </p>
              <h4 className="text-xs font-bold text-white mb-3 truncate px-1">
                {composer.melody.title}
              </h4>
              
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={playComposerMelody}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow ${
                    isPlayingMelody 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
                  }`}
                >
                  {isPlayingMelody ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> 정지
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> 재생
                    </>
                  )}
                </button>
              </div>

              {/* Note Visualizer when playing melody */}
              {isPlayingMelody && (
                <div className="mt-3 flex items-center justify-center gap-1 h-8 bg-black/30 rounded border border-amber-900/80 px-2 overflow-x-auto">
                  {composer.melody.notes.map((item, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-mono px-1 rounded transition-all shrink-0 ${
                        activeNoteIdx === idx 
                          ? 'bg-amber-400 text-amber-950 font-bold scale-110 shadow-glow' 
                          : 'text-amber-400/50'
                      }`}
                    >
                      {item.note}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-amber-50/20">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white/70 border-b border-amber-900/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎼</span>
            <div>
              <h3 className="font-bold text-amber-950 text-base md:text-lg flex items-center gap-1.5">
                {composer.name}와 나누는 음악 이야기
                <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-normal">
                  AI 시뮬레이터
                </span>
              </h3>
              <p className="text-xs text-amber-700/80">대화창 하단의 질문 키워드 버튼을 누르면 더 쉽게 대화할 수 있어요.</p>
            </div>
          </div>
          
          {/* TTS Button */}
          <button
            onClick={() => handleTts(messages[messages.length - 1]?.text || '')}
            title="마지막 답변 읽어주기"
            className={`p-2 rounded-full border transition-all ${
              isTtsEnabled 
                ? 'bg-amber-500 border-amber-600 text-white animate-pulse' 
                : 'bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800'
            }`}
          >
            {isTtsEnabled ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Warning Indicator */}
        <div className="bg-amber-100/70 px-4 py-2 border-b border-amber-200 text-amber-800 text-[11px] font-medium leading-relaxed shrink-0">
          ⚠️ <strong>음악 교실 안내:</strong> 이 대화는 초등 음악 교육 과정과 역사적 사실을 토대로 구성한 AI 시뮬레이터입니다. 더 풍성한 사실들은 교과서와 백과사전을 확인해 보아요!
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm border ${
                msg.sender === 'user' 
                  ? 'bg-amber-900 border-amber-950 text-white rounded-tr-none' 
                  : 'bg-white border-amber-900/10 text-amber-950 rounded-tl-none'
              }`}>
                {/* Message Header (If Composer, show title) */}
                {msg.sender === 'bot' && (
                  <div className="text-[10px] font-semibold text-amber-700 mb-1 flex items-center gap-1 select-none">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {composer.name} ({composer.nickname})
                  </div>
                )}
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-1 text-right select-none ${
                  msg.sender === 'user' ? 'text-amber-300' : 'text-amber-500'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-amber-900/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-amber-900/10 bg-amber-50/40 shrink-0">
          <p className="text-[11px] font-bold text-amber-800 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> 자주 묻는 질문들:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(btn.query);
                  // Trigger immediately after small delay for better user flow
                  setTimeout(() => handleSend(), 50);
                }}
                disabled={isTyping}
                className="text-xs px-2.5 py-1 rounded-full border border-amber-800/35 bg-white hover:bg-amber-100 hover:border-amber-900/60 text-amber-900 transition-all font-medium select-none cursor-pointer disabled:opacity-50"
              >
                {btn.text}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Multiple-Choice Quiz Panel if active */}
        {activeQuizQuestion !== null && (
          <div className="px-4 py-3 bg-amber-100 border-t border-amber-900/20 shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-800" />
              <span className="text-xs font-bold text-amber-900">
                퀴즈 답안 고르기 (현재 문제 {activeQuizQuestion + 1} / {composer.quiz.length})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {composer.quiz[activeQuizQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  className="px-3 py-2 bg-white hover:bg-amber-50 border border-amber-800/30 text-amber-950 text-xs md:text-sm font-semibold rounded-xl text-left transition-colors cursor-pointer"
                >
                  {idx + 1}. {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input Form */}
        <div className="p-4 bg-white/70 border-t border-amber-900/10 flex gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="궁금한 내용을 입력해보세요. (예: 어떤 악기를 잘 연주했어?)"
            className="flex-1 bg-white border-2 border-amber-900/20 focus:border-amber-950 focus:outline-none px-4 py-3 rounded-2xl text-amber-950 text-sm placeholder:text-amber-800/40"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-amber-900 hover:bg-amber-950 text-white p-3 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
