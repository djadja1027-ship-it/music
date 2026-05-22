import { useState } from 'react';
import { 
  FileText, Printer, Check, BookOpen, Heart, Music, Baby, Skull, HandHeart, Coffee, Sparkles
} from 'lucide-react';
import { musicians } from '../data/composers';
import { playNote } from '../utils/audioSynth';

export default function StudyGuides() {
  const allComposers = Object.values(musicians);

  // States
  const [selectedComposerName, setSelectedComposerName] = useState<string>(allComposers[0].name);
  const [hasCopiedWorksheet, setHasCopiedWorksheet] = useState(false);

  const selectedComposer = musicians[selectedComposerName];

  const handleCopyWorksheet = () => {
    const text = `
[초등 음악 감상 보고서]

학번: __________  이름: __________

1. 내가 조사한 음악가: ${selectedComposer.name}
2. 음악가의 별명: ${selectedComposer.nickname}
3. 음악가가 살았던 시대: ${selectedComposer.era}
4. 음악가의 대표곡: ${selectedComposer.famousSongs.join(', ')}
5. 시대적 특징 한 줄 요약: ${selectedComposer.eraInfo}
6. 가장 인상 깊었던 이야기: ${selectedComposer.funStory}
    `;
    navigator.clipboard.writeText(text);
    setHasCopiedWorksheet(true);
    setTimeout(() => setHasCopiedWorksheet(false), 2000);
  };

  // Detailed biographical content for each composer
  const getBioDetails = (id: string) => {
    switch (id) {
      case 'bach':
        return {
          childhood: `바흐는 독일 아이제나흐의 유서 깊은 음악가 집안에서 태어났어. 할아버지, 아버지, 삼촌들까지 온 가족이 음악가였지. 10살 때 부모님을 여의고 오르가니스트였던 형 요한 크리스토프 밑에서 자랐어. 형이 악보를 빌려주지 않자 밤에 달빛을 보며 몰래 악보를 필사하다가 눈이 나빠지기 시작했다는 슬픈 이야기도 있어. 🌙`,
          composing: `바흐는 매주 일요일 예배에 쓸 칸타타(종교 칸타타)를 하나씩 새로 써야 했어! 무려 3년 동안 매주 한 곡씩 작곡해서 총 200곡이 넘는 칸타타를 남겼지. 한 번은 밤새 악보를 쓰다가 "Soli Deo Gloria(오직 하나님의 영광을 위하여)"라고 적으며 펜을 내려놓는 습관이 있었단다. ✝️`,
          personal: `두 번 결혼했고 20명의 자녀를 두었어! 첫 아내 마리아 바르바라가 갑자기 세상을 떠났을 때 바흐는 멀리 출장 중이라 마지막도 못 봤단다. 이후 가수 안나 막달레나와 재혼했고, 그녀를 위해 직접 가정용 음악 수첩(안나 막달레나 바흐의 노트)을 만들어 주었어. 거기에는 가족이 함께 연주할 수 있는 아름다운 소품들이 가득했지. 💕`,
          death: `말년에 백내장으로 눈이 멀어가는 고통 속에서도 구술로 작곡을 이어갔어. 1750년, 엉터리 안과 의사 존 테일러에게 백내장 수술을 받고 실명했으나, 세상을 떠나기 직전 시력이 잠깐 돌아왔을 때 가장 먼저 한 일은 아내에게 찬송가 선율을 불러준 것이었단다. 65세로 눈을 감았어. 😢`,
          legacy: `바흐가 죽고 80년 동안 그의 음악은 거의 잊혀졌어. 그러다 1829년, 19세의 멘델스존이 《마태 수난곡》을 다시 연주하면서 전 세계가 "우리가 바흐를 잊고 있었다!"며 놀라게 되었지. 이후 모든 음악가들이 "음악의 아버지"라고 부르며 존경하기 시작했단다. 👑`,
          habits: `바흐는 엄청난 커피 애호가였어. 당시 독일에서 유행하던 커피 칸타타까지 직접 썼을 정도야! ☕ 또 다른 도시의 오르간을 구경하러 400km를 걸어서 여행한 일화도 유명해. 부크스테후데의 연주를 들으러 뤼베크까지 걸어갔다 왔지.`
        };
      case 'vivaldi':
        return {
          childhood: `비발디는 1678년 베네치아에서 태어났어. 태어나던 날 베네치아에 큰 지진이 있었는데, 어머니가 놀라서 갓난아이였던 비발디를 급히 세례(기독교 의식) 받게 했다는 이야기가 전해진단다. 아버지는 산 마르코 대성당의 바이올리니스트였고, 아들에게 일찍부터 바이올린을 가르쳤지. 🎻`,
          composing: `비발디는 《사계》의 각 계절마다 직접 14행시(소네트)를 썼어! 봄의 시에는 "새들이 즐겁게 노래하고, 시냇물이 졸졸 흐르다가 갑자기 천둥번개가 친다"는 내용이 있는데, 비발디는 이 모든 장면을 바이올린으로 완벽히 묘사했지. 당시로는 매우 혁신적인 시도였어. 🌸`,
          personal: `비발디는 평생 독신 사제로 살았지만, 피에타 고아원의 소녀 오케스트라를 가족처럼 아꼈어. 소녀들을 위해 500곡이 넘는 협주곡을 썼단다! 또 가수 안나 지로와 오랫동안 동행했는데, 둘의 관계에 대해 여러 소문이 돌았지만 평생 순수한 동료로 지냈다고 해. 🎻`,
          death: `말년에 비발디의 인기는 급격히 시들해졌어. 베네치아에서 잊혀지자 오스트리아 빈으로 이사했지만, 후원자였던 카를 6세가 갑자기 사망하며 후원자를 잃었지. 1741년 7월, 비발디는 63세의 나이로 가난 속에서 쓸쓸히 세상을 떠났고, 장례식도 초라하게 치러졌단다. 😢`,
          legacy: `비발디는 죽고 200년 동안 완전히 잊혀졌어! 20세기 초반에야 다시 재발견되어 《사계》가 전 세계적으로 연주되기 시작했지. 오늘날 사계는 클래식 음악 중 가장 많이 연주되고 녹음된 곡이 되었단다. 🌍`,
          habits: `비발디는 "빨간 머리 신부"라는 별명답게 붉은 머리카락을 자랑했어. 천식 때문에 미사 중에도 숨이 차서 연주를 멈출 때가 있었는데, 이 때문에 신부 일을 접고 음악에 전념하게 되었단다. 또 베네치아 극장의 화려한 오페라 무대를 직접 감독하고 연출하는 것도 즐겼지! 🎭`
        };
      case 'handel':
        return {
          childhood: `헨델의 아버지는 이발사이자 외과 의사였어. 아들이 법률가가 되기를 원해서 집에 악기를 두는 것조차 금지했지. 하지만 7살 어린 헨델은 밤마다 몰래 다락방에 숨겨둔 작은 쳄발로를 꺼내 연주했단다. 이 소리를 들은 작센바이센펠스 공작이 "이 아이에게 음악을 시키라"고 아버지를 설득해 주었어! 🎹`,
          composing: `헨델은 《메시아》를 불과 24일 만에 완성했어! 하인들이 방에 들어가 보면 헨델이 눈물을 흘리며 악보를 쓰고 있었고, 식사를 가져가도 손도 대지 않았다고 해. "할렐루야" 부분을 쓸 때는 "나는 천국이 열리는 것을 보았다"고 말했단다. 🎶`,
          personal: `헨델은 평생 독신으로 살았지만, 사교적이고 활달한 성격으로 런던 사교계의 인기인이었어. 맛있는 음식을 엄청 좋아했고 체구도 컸지. 한번은 레스토랑에서 두 사람分の 음식을 주문했는데, 친구가 "누구랑 같이 먹어요?"라고 묻자 "나 혼자"라고 답했다는 유명한 일화가 있단다. 🍖`,
          death: `말년에 백내장으로 눈이 멀어가는 고통 속에서도 작곡과 지휘를 멈추지 않았어. 1759년 4월 14일, 《메시아》 공연을 지휘하던 중 쓰러졌고, 74세로 세상을 떠났어. 3,000명이 참석한 장례식 후 영국의 웨스트민스터 사원에 묻혔는데, 영국인들이 외국 태생 음악가에게 이런 영예를 준 것은 이례적인 일이었어. 🇬🇧`,
          legacy: `헨델은 영국 음악의 황금기를 열었어. 《할렐루야 합창》이 연주될 때 왕이 먼저 일어나서 모든 관객이 기립하는 전통은 오늘날까지 이어지고 있지. 베토벤조차 헨델을 "역사상 가장 위대한 작곡가"라고 평가했단다. 👑`,
          habits: `헨델은 커피와 초콜릿을 매우 좋아했고, 런던의 유명한 커피하우스 "White's Chocolate House"의 단골이었어. ☕ 또 도박을 좋아해서 한동안 큰돈을 잃기도 했고, 오페라 사업으로 큰 부자가 되었다가 파산하기도 했단다. 파산 후에도 씩씩하게 다시 일어난 강인한 성격이었지!`
        };
      case 'mozart':
        return {
          childhood: `모차르트는 3살 때 누나 난네를이 피아노 치는 것을 보고 혼자 건반을 눌러 멜로디를 연주했어. 5살에 첫 곡을 작곡하고, 6살 때 아버지와 누나와 함께 유럽 전역을 돌며 왕 앞에서 연주했지. 오스트리아 황후 앞에서 넘어졌을 때, 공주 마리 앙투아네트가 일으켜주자 "커서 나랑 결혼해요!"라고 말한 유명한 일화도 있단다. 👑`,
          composing: `모차르트는 악보를 거의 지우지 않고 한 번에 완성했어! 마치 머릿속에 이미 음악이 완성되어 있는 것처럼 악보에 바로 옮겼지. 교향곡 40번, 피가로의 결혼 같은 명작도 며칠 만에 써냈단다. 죽기 직전에 누군가가 찾아와 "레퀴엠(진혼곡)을 써달라"고 주문했는데, 모차르트는 "이건 나를 위한 곡이야"라며 눈물 흘렸어. 실제로 그 곡을 완성하지 못한 채 세상을 떠났지. 😭`,
          personal: `모차르트는 26살에 콘스탄체와 결혼했어. 아버지 레오폴트는 반대가 심했지만, 두 사람은 사랑으로 결혼했지. 콘스탄체와의 사이에 6명의 아이가 태어났지만 가난과 병으로 2명만 살아남았단다. 모차르트는 아내에게 사랑의 편지를 쓰며 농담을 많이 했어. 실제로 아내에게 보낸 편지에는 매우 장난스럽고 유치한 내용들이 가득했지! 💕`,
          death: `1791년 12월 5일, 모차르트는 35세의 젊은 나이에 갑자기 세상을 떠났어. 당시에는 독살설이 돌았지만, 오늘날은 급성 류마티스열이나 신부전증으로 추정돼. 장례식은 초라하게 치러졌고, 빈의 공동묘지에 묻혔지만 정확한 무덤 위치는 지금도 모른단다. 마지막 순간까지 레퀴엠을 흥얼거리며 완성하지 못한 것을 아쉬워했다고 해. 😢`,
          legacy: `모차르트는 35년이라는 짧은 생애 동안 무려 600곡이 넘는 작품을 남겼어! 교향곡 41곡, 오페라 22편, 피아노 협주곡 27곡... 오늘날까지도 가장 많이 연주되는 작곡가 중 한 명이지. 베토벤은 "모차르트의 음악을 들으면 하늘이 보인다"고 했단다. 🌟`,
          habits: `모차르트는 당구와 카드 게임을 무척 좋아했고, 고양이도 사랑했어. 🐱 또 밝은 색 옷을 좋아해서 화려한 분홍색 코트를 즐겨 입었지. 초콜릿과 오렌지를 좋아했고, 밤에 작곡하는 것을 선호했어. 친구들에게 장난을 치는 것도 좋아해서 웃긴 편지를 자주 썼단다! 😜`
        };
      case 'beethoven':
        return {
          childhood: `베토벤의 아버지는 아들을 제2의 모차르트 신동으로 키우고 싶었어. 어린 베토벤을 술에 취해 밤중에 깨워서 피아노를 치게 했고, 맞으며 연습해야 했지. 7살 때 첫 연주회를 가졌지만 큰 성공은 못 거두었어. 하지만 천재성은 이미 빛나고 있었고, 22살에 빈으로 가서 하이든에게 배우기 시작했단다. 🔥`,
          composing: `베토벤은 26살부터 서서히 귀가 안 들리기 시작했어! 음악가에게 청력 상실은 죽음보다 끔찍한 일이지. 한때 자살까지 생각했지만, "내 안에 있는 음악을 세상에 내놓지 않고는 죽을 수 없다"고 결심했어. 완전히 귀가 들리지 않게 된 후에는 피아노 다리에 막대를 대고 이를 깨물어 진동으로 음악을 느꼈단다. 이런 고통 속에서 《운명 교향곡》과 《합창 교향곡》을 쓴 거야! 😭`,
          personal: `베토벤은 평생 결혼하지 않았어. 귀족 여성들을 사랑했지만 신분 차이로 이루어지지 못했지. 세상을 떠난 후 서랍에서 발견된 '불멸의 연인에게'라는 편지는 3일 동안 쓴 애절한 연애편지였는데, 상대가 누구인지는 지금도 미스터리란다. 💌 또 조카 카를의 후견권을 두고 동생 며느리와 치열한 법정 싸움을 벌이기도 했지.`,
          death: `1827년 3월 26일, 빈에서 세상을 떠났어. 사망 직전 천둥번개가 치는 벼락 소리에 눈을 뜨고 하늘을 향해 주먹을 치켜들었다는 일화가 있어. 장례식에는 2만 명의 빈 시민이 몰려왔고, 모든 학교가 휴교했단다. 프란츠 슈베르트도 관을 메는 사람 중 하나였지. 🖤`,
          legacy: `베토벤은 9개의 교향곡을 남겼어. 9라는 숫자에 대한 집착이 있었는데, 슈베르트, 드보르자크, 말러 등 많은 작곡가들이 "9번의 저주"를 두려워했단다. 교향곡 9번의 "환희의 송가"는 오늘날 유럽 연합의 공식 노래가 되었어. 🌍`,
          habits: `베토벤은 매일 아침 원두 60알을 정확히 세어 커피를 내렸어. ☕ 하루에 한 번씩 숲속을 산책하며 악상을 떠올렸고, 주머니에 항상 악보 종이를 넣고 다녔지. 방은 엉망진창이었고, 목욕통에 물을 끼얹으며 흥얼거려서 아랫집에 물이 새기도 했어. 또 모자를 절대 벗지 않았고, 귀족 앞에서도 모자를 쓰고 다녔단다! 🎩`
        };
      case 'chopin':
        return {
          childhood: `쇼팽은 1810년 폴란드에서 태어났어. 아버지는 프랑스 출신 교사였고 어머니는 폴란드 귀족이었지. 7살 때 이미 폴로네이즈(폴란드 춤곡)를 작곡했고, 8살 때는 바르샤바 귀족 사회에서 "제2의 모차르트"로 불리며 연주했어. 어린 시절부터 시를 쓰고 그림도 그리는 등 다재다능했단다. 🎹`,
          composing: `쇼팽은 거의 모든 곡을 피아노만을 위해 썼어. 교향곡이나 오페라는 거의 작곡하지 않았지. 《강아지 왈츠》는 연인 조르주 상드의 강아지 마르키스가 자기 꼬리를 물고 빙빙 도는 모습을 보고 1분 만에 즉석에서 작곡했단다! 《빗방울 전주곡》은 마요르카 섬에서 비가 오는 소리를 들으며 우울한 마음으로 썼어. 🌧️`,
          personal: `쇼팽은 28살 때 6살 연상의 여류 소설가 조르주 상드와 사랑에 빠졌어. 상드는 남장(남자 옷을 입는 것)을 하고 담배를 피우는 파격적인 여성이었지. 두 사람은 9년간 연인으로 지냈고, 쇼팽의 가장 위대한 작품들이 이 시기에 탄생했어. 하지만 상드의 자녀들과의 갈등으로 결국 헤어졌고, 이후 쇼팽의 건강은 급격히 나빠졌단다. 💔`,
          death: `쇼팽은 평생 결핵(폐병)을 앓았어. 1849년 10월 17일, 파리에서 39세의 나이에 세상을 떠났지. 마지막 순간에 누나가 폴란드에서 날아와 옆에 있었고, 쇼팽은 "고향의 흙을 내 관에 뿌려 달라"고 유언했어. 유언대로 심장은 바르샤바의 성 십자가 교회 기둥 속에 안치되어 있고, 몸은 파리의 페르 라셰즈 묘지에 묻혔단다. 🇵🇱`,
          legacy: `쇼팽은 "피아노의 시인"으로 불려. 피아노라는 악기가 할 수 있는 가장 섬세하고 시적인 표현을 극한까지 끌어올렸지. 폴란드 사람들은 쇼팽을 국민적 영웅으로 여겨. 5년마다 바르샤바에서 열리는 쇼팽 국제 피아노 콩쿠르는 세계 3대 피아노 콩쿠르 중 하나란다. 🎹`,
          habits: `쇼팽은 perfumes(향수)를 매우 좋아했고, 옷차림에도 세심한 신경을 썼어. 큰 연주회보다는 작은 살롱에서 가까운 친구들에게 연주하는 것을 선호했지. 일생 동안 공개 연주회는 고작 30회 정도밖에 하지 않았단다. 또 장갑을 여러 켤레 가지고 다녔고, 밤에 작곡하는 것을 좋아했어. 🌙`
        };
      case 'schubert':
        return {
          childhood: `슈베르트는 1797년 빈 근교에서 가난한 교사의 아들로 태어났어. 아버지는 학교 선생님이었고, 형들로부터 바이올린과 피아노를 배웠지. 11살에 빈 궁정 소년 합창단에 들어갔고, 그곳에서 살리에리(모차르트의 라이벌로 알려진)에게 작곡을 배웠단다. 🎵`,
          composing: `슈베르트는 31년의 짧은 생애 동안 600곡이 넘는 가곡을 썼어! 하루에 8곡씩 쓴 적도 있다고 해. 《마왕》은 18세 때 괴테의 시를 읽고 단숨에 작곡했지. 《송어》는 친구들과 여행 중 시냇물에서 헤엄치는 송어를 보고 즉흥적으로 만들었단다. 🐟 악보가 부족해서 친구들의 모자 안쪽에까지 악상을 적어두었어.`,
          personal: `슈베르트는 평생 결혼하지 못했어. 너무 가난해서 여자를 만날 엄두도 못 냈지. 대신 "슈베르티아데"라는 이름의 친한 친구 모임이 있었어. 화가, 시인, 음악가 친구들이 슈베르트의 집에 모여 밤새 그의 새 곡을 듣고 맥주를 마셨단다. 슈베르트는 친구들 사이에서 "버섯"이라는 별명으로 불렸는데, 키가 작고 둥글둥글한 외모 때문이었어. 🍄`,
          death: `1828년 11월 19일, 슈베르트는 31세의 나이에 세상을 떠났어. 매독과 장티푸스가 원인이었지. 죽기 직전에도 음악 공부를 하고 싶다고 말하며, 대위법 선생님을 불러달라고 했단다. 유언대로 베토벤의 무덤 옆에 묻혔고, 무덤비에는 "음악이 여기 최고의 보물과 가장 아름다운 희망을 묻었다"라고 적혀 있어. 🌸`,
          legacy: `슈베르트는 살아생전 거의 유명하지 않았어. 가난하게 살다가 세상을 떠난 후, 로베르트 슈만 같은 후대 음악가들이 그의 악보를 발견하고 "세상에 이런 천재가!"라고 놀랐지. 오늘날 《송어》와 《아베 마리아》는 가장 사랑받는 클래식 곡 중 하나란다. ✨`,
          habits: `슈베르트는 안경을 쓰고 잠을 잤어! 아침에 일어나면 바로 작곡할 수 있도록 말이지. 🤓 또 담배를 무척 좋아했고, 술집에서 친구들과 밤새도록 이야기하는 것을 즐겼어. 주머니에 항상 악보 종이를 넣고 다니며 아이디어가 떠오르면 바로 적었단다.`
        };
      case 'tchaikovsky':
        return {
          childhood: `차이콥스키는 1840년 러시아 보트킨스크에서 태어났어. 아버지는 광산 관리자였고 어머니는 프랑스계 러시아인이었지. 5살 때부터 피아노를 배우기 시작했고, 어머니가 노래해 주는 러시아 민요를 들으며 자랐어. 어머니가 14살 때 콜레라로 세상을 떠나자 엄청난 충격을 받았고, 평생 그 슬픔이 음악에 배어있단다. 😢`,
          composing: `차이콥스키는 《호두까기 인형》을 쓸 때 프랑스 파리에서 갓 발명된 "첼레스타"라는 악기를 비밀리에 수입했어. 다른 러시아 작곡가(림스키코르사코프)가 먼저 쓰기 전에 자신의 작품에 사용하려고 했지! 이 신비로운 악기 소리가 바로 《사탕 요정의 춤》에서 들리는 영롱한 방울 소리란다. 🍬《백조의 호수》는 사실 초연 때 대실패했지만, 차이콥스키 사후에 재발견되어 오늘날 가장 사랑받는 발레가 되었어. 🩰`,
          personal: `차이콥스키는 37살에 안토니나 밀류코바라는 여성과 결혼했지만, 단 2주 만에 이혼했어. 그 후 부유한 미망인 "폰 메크 부인"이 13년 동안 매달 큰돈을 후원해 주었지. 하지만 두 사람은 평생 단 한 번도 직접 만나지 않았어! 오직 편지로만 수백 통을 주고받았단다. 이런 독특한 관계가 차이콥스키의 외로움을 달래주었지. 💌`,
          death: `1893년 11월 6일, 차이콥스키는 53세의 나이에 갑자기 세상을 떠났어. 《교향곡 6번 비창》을 초연한 지 불과 9일 만이었지. 공식적으로는 콜레라(오염된 물을 마셔서 걸리는 병)에 걸렸다고 하지만, 독살설 등 여러 의혹이 있어. 그의 무덤은 상트페테르부르크의 티흐빈 묘지에 있단다. 🖤`,
          legacy: `차이콥스키는 러시아 음악을 세계적으로 유명하게 만든 최초의 작곡가야. 발레 음악 3대 걸작(백조의 호수, 잠자는 숲속의 미녀, 호두까기 인형)은 지금도 전 세계 발레단의 필수 레퍼토리란다. 특히 크리스마스 시즌에는 《호두까기 인형》이 전 세계에서 가장 많이 공연되지. 🎄`,
          habits: `차이콥스키는 매일 아침 정확히 9시부터 작곡을 시작했고, 오후에는 2시간 동안 꼭 산책을 했어. 🌲 산책 중에는 모자를 절대 벗지 않았는데, "머리를 식히면 감기에 걸린다"고 믿었기 때문이란다. 또 차(茶)를 매우 좋아했고, 카드 게임도 즐겼지. 신경이 예민해서 연주회 지휘를 할 때 왼손으로 머리를 받치고 있어야 머리가 떨어지지 않을 것 같았다고 해. 🎼`
        };
      default:
        return {
          childhood: '',
          composing: '',
          personal: '',
          death: '',
          legacy: '',
          habits: ''
        };
    }
  };

  const details = getBioDetails(selectedComposer.id);

  return (
    <div className="max-w-5xl mx-auto bg-amber-50/20 rounded-3xl border-4 border-amber-900/60 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-amber-900/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-950 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-amber-700" />
            음악가 이야기 책 📖
          </h2>
          <p className="text-amber-800 text-xs md:text-sm mt-1">
            교과서에 나오는 위대한 작곡가들의 삶과 음악 이야기를 자세히 알아보세요!
          </p>
        </div>
      </div>

      {/* Composer List + Detail View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* List panel */}
        <div className="md:col-span-4 bg-white/80 border border-amber-900/10 rounded-2xl p-4 shadow-sm space-y-2 max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-amber-900 mb-2">🎻 작곡가 선택하기</h3>
          {allComposers.map((comp) => (
            <button
              key={comp.id}
              onClick={() => {
                setSelectedComposerName(comp.name);
                playNote('C5', 'sine', 0.1);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                selectedComposerName === comp.name
                  ? 'bg-amber-900 border-amber-950 text-white'
                  : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-800/10'
              }`}
            >
              <img
                src={comp.photo}
                alt={comp.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs md:text-sm truncate">{comp.name}</h4>
                <p className={`text-[10px] truncate ${selectedComposerName === comp.name ? 'text-amber-300' : 'text-amber-700'}`}>
                  {comp.nickname}
                </p>
                <p className={`text-[9px] ${selectedComposerName === comp.name ? 'text-amber-200' : 'text-amber-500'}`}>
                  {comp.era}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Detail View */}
        {selectedComposer && (
          <div className="md:col-span-8 bg-white/90 border-2 border-amber-400 rounded-3xl p-6 shadow-md space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-amber-200 pb-4">
              <div className="relative shrink-0">
                <img
                  src={selectedComposer.photo}
                  alt={selectedComposer.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 text-2xl select-none">
                  {selectedComposer.era.includes('바로크') ? '👑' : selectedComposer.era.includes('고전') ? '🏛️' : '🌙'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-extrabold text-amber-950 flex items-center gap-2 flex-wrap">
                  {selectedComposer.name}
                  <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                    {selectedComposer.era}
                  </span>
                </h3>
                <p className="text-xs text-amber-700 font-bold mt-1">🎵 {selectedComposer.nickname}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] bg-amber-900 text-amber-100 px-2 py-0.5 rounded border border-amber-950">
                    🌍 {selectedComposer.country}
                  </span>
                  <span className="text-[10px] bg-amber-900 text-amber-100 px-2 py-0.5 rounded border border-amber-950">
                    🎼 {selectedComposer.famousSongs.length}개 대표곡
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Details Sections */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {/* Childhood */}
              <section className="bg-gradient-to-br from-pink-50 to-amber-50 border border-pink-200 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Baby className="w-5 h-5 text-pink-600" />
                  👶 어린 시절 이야기
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.childhood}</p>
              </section>

              {/* Composing Stories */}
              <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Music className="w-5 h-5 text-amber-600" />
                  🎼 작곡할 때 이야기
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.composing}</p>
              </section>

              {/* Personal Life */}
              <section className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-300" />
                  💕 개인적인 이야기 (사랑과 가족)
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.personal}</p>
              </section>

              {/* Habits & Quirks */}
              <section className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  ☕ 재미있는 습관과 취미
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.habits}</p>
              </section>

              {/* Death */}
              <section className="bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-300 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Skull className="w-5 h-5 text-slate-600" />
                  🕊️ 생의 마지막 순간
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.death}</p>
              </section>

              {/* Legacy */}
              <section className="bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-400 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <HandHeart className="w-5 h-5 text-amber-700" />
                  ✨ 후대에 남긴 유산
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{details.legacy}</p>
              </section>

              {/* Famous Works */}
              <section className="bg-white border border-amber-900/10 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  🎵 대표곡 리스트
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedComposer.famousSongs.map((song, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-900 text-amber-50 text-xs px-3 py-1.5 rounded-full border border-amber-950"
                    >
                      🎶 {song}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-amber-800 mt-3 leading-relaxed italic bg-amber-50/50 p-3 rounded-lg">
                  💡 <strong>음악 스타일:</strong> {selectedComposer.style}
                </p>
              </section>

              {/* Fun Story Highlight */}
              <section className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl p-4">
                <h4 className="font-extrabold text-amber-950 text-sm flex items-center gap-2 mb-2">
                  ✨ 재미있는 이야기 하이라이트
                </h4>
                <p className="text-xs md:text-sm text-amber-950 leading-relaxed">{selectedComposer.funStory}</p>
              </section>
            </div>

            {/* Action Row */}
            <div className="flex gap-2 justify-end border-t border-amber-100 pt-3">
              <button
                onClick={handleCopyWorksheet}
                className="flex items-center gap-1 px-4 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-900/20 text-amber-950 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                {hasCopiedWorksheet ? <Check className="w-4 h-4 text-green-700" /> : <FileText className="w-4 h-4" />}
                {hasCopiedWorksheet ? '복사 완료!' : '활동지 텍스트 복사'}
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" /> 인쇄하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
