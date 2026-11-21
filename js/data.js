// 포트폴리오 콘텐츠. 내용 수정은 이 파일만 고치면 됩니다.
//
// visual: 챕터 배경 입자 장면의 소스
//   { image: 'src/...' }  이미지를 입자로 분해
//   { text: 'RAG' }       글자를 입자로 그림 (이미지가 아직 없을 때)
//   { draw: 'chat' }      선 그림을 입자로 그림 ('chat' 말풍선, 'bank' 은행 건물 — particles.js의 SHAPES)
// placeholder: true 이면 상세 화면에 "준비 중" 표시

export const profile = {
  name: '양승호',
  nameEn: 'Seung Ho Yang',
  role: 'Developer × PM × Architect',
  intro: [
    '건축가 출신의 열정적인 개발자입니다.',
    '9년+ 기간동안 Heerim, Midas IT, 글로우서울과 함께 했습니다.',
  ],
  contacts: [
    { label: 'Email', url: 'mailto:ckoje9@gmail.com', text: 'ckoje9@gmail.com' },
    { label: 'GitHub', url: 'https://github.com/ckoje9-dev', text: 'github.com/ckoje9-dev' },
  ],
  skills: [
    { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'HTML5', 'CSS'] },
    { group: 'Data · AI · Tools', items: ['PostgreSQL', 'LangChain', 'Git', 'Jira'] },
    { group: 'Design', items: ['Figma', 'Photoshop', 'Illustrator'] },
    { group: 'Architecture', items: ['AutoCAD', 'Revit', 'Rhinoceros'] },
  ],
  credentials: [
    { title: 'SK네트웍스 AI CAMP 수료', date: '2025.12' },
    { title: '정보처리기사', date: '2025.12' },
    { title: '이달의 베스트 인재상', date: '2023.10' },
    { title: '건축기사', date: '2016.08' },
    { title: 'OPIC AL', date: '2016.02' },
  ],
};

export const projects = [
  {
    id: 'ai-chatbot',
    title: '사내 AI 챗봇 서비스',
    subtitle: 'RAG 기반 사내 지식검색 시스템 기획 및 개발',
    period: '2026.03 – 2026.11',
    org: '글로우서울',
    visual: { draw: 'chat' },
    meta: [
      ['요약', '사내 FAQ, 취업규칙, 사규집, 프로젝트, 협력사 정보 등을 통합한 RAG 기반 사내 지식검색 시스템 (GLOW+)'],
      ['역할', '기획 및 개발'],
      ['소속', '글로우서울'],
    ],
    highlights: [
      '사내 FAQ, 취업규칙, 사규집, 프로젝트, 협력사 정보 등을 통합한 RAG 기반 사내 지식검색 시스템 구축',
      '보안, 운영비용 절감 및 데이터 통제권 확보를 위해 로컬 LLM(Gemma 4-e2b) 기반 사내 Mac mini 서버 구축',
      'Llama, PostgreSQL 기반 검색 파이프라인 구축 및 Notion·ERP 연동을 통한 지식베이스 업데이트 자동화',
      '기존 ERP에 웹앱 형태의 챗봇 UI 임베딩 및 서비스 운영',
      '100인 규모 조직에서 일 평균 10회 이상 사용하며 인사총무팀 반복 문의 업무 자동화',
    ],
    sections: [
      {
        title: '챗봇 화면',
        images: [
          ['src/p6_main.png', '첫 화면'],
          ['src/p6_chat.png', '질의응답 — 사내 규정 기반 답변'],
        ],
      },
      {
        title: '관리자 화면',
        images: [
          ['src/p6_dashboard.png', '사용 통계 대시보드'],
          ['src/p6_stats.png', '질문 워드 클라우드 및 답변·거절·되묻기 비율'],
          ['src/p6_board.png', '지식 베이스 ① 그룹웨어 게시판 — 주간 자동 동기화, 실명·개인 명단 글은 색인 제외'],
          ['src/p6_knowledge.png', '지식 베이스 ② Notion DB ③ 문서·FAQ 동기화'],
        ],
      },
    ],
  },
  {
    id: 'ai-space-planning',
    title: 'AI 기반 공간기획 서비스',
    subtitle: '로드뷰 이미지 기반 AI 공간 컨셉 이미지 생성 웹앱',
    period: '2026.03 – 2026.11',
    org: '',
    visual: { text: 'SPACE' },
    placeholder: true,
    meta: [
      ['요약', '건물 및 부동산 로드뷰 이미지에 브랜드 아이덴티티와 사용자 취향을 반영한 AI 공간 컨셉 이미지 생성 웹앱'],
      ['역할', '기획 및 개발'],
    ],
    highlights: [
      '건물 및 부동산 로드뷰 이미지에 브랜드 아이덴티티와 사용자 취향을 반영한 AI 공간 컨셉 이미지 생성 웹앱 개발',
      'Nano Banana, FLUX 및 LoRA 기반 이미지 생성 파이프라인 구축 및 비용 최적화',
      '계약 이전에 공간 디자인을 시각적으로 제안할 수 있도록 기존 초기 영업 프로세스 개선',
      '서비스 활용을 통해 실제 계약 5건 성사에 기여',
    ],
  },
  {
    id: 'global-tips',
    title: 'GLOBAL TIPS 연구개발과제 기획',
    subtitle: 'GLOW BRIDGE — K-브랜드의 글로벌 진출 코디네이팅을 위한 AI 기반 플랫폼',
    period: '2026.03 – 2026.11',
    org: '글로우서울',
    visual: { image: 'src/p8_bridge.jpg' },
    video: { src: 'src/p8_demo.mp4', poster: 'src/p8_poster.jpg', caption: 'GLOW BRIDGE 소개 영상', first: true },
    meta: [
      ['요약', '국내 브랜드의 해외 진출을 지원하는 글로벌 코디네이팅 플랫폼(GLOW BRIDGE) 기획'],
      ['역할', '과제 기획, 플랫폼 아키텍처 설계, 연구개발계획서 및 Tech-IR 발표자료 작성'],
      ['소속', '글로우서울'],
      ['결과', 'GLOBAL TIPS 연구개발과제 최종 선정'],
    ],
    highlights: [
      '국내 브랜드의 해외 진출을 지원하는 글로벌 코디네이팅 플랫폼 기획',
      '파트너 매칭, AI 입지분석, AI 공간기획, 원격 운영 AI 등 4대 핵심 서비스 및 End-to-End 플랫폼 아키텍처 설계',
      '서비스별 AI 기술 적용 방안, 기술 개발 목표, 세부 개발 범위 및 R&D 사업화 전략 수립',
      '약 50억 원 규모 GLOBAL TIPS 연구개발과제 사업계획서 작성 및 제출 (최종 선정)',
    ],
    sections: [
      {
        title: '문제 정의와 플랫폼 구조',
        images: [
          ['src/p8_barriers.jpg', '해외 진출을 가로막는 4가지 장벽과 대응 모듈'],
          ['src/p8_modules.jpg', '기술개발 목표 — 4대 모듈 (B2B 매칭 · 매장 관제 · 입지 분석 · 공간 기획)'],
          ['src/p8_architecture.jpg', '시스템 아키텍처'],
          ['src/p8_loop.jpg', '차별성 — 매장 성과로 다시 학습하는 순환 구조'],
        ],
      },
      {
        title: '4대 모듈',
        images: [
          ['src/p8_site.jpg', '입지분석 AI'],
          ['src/p8_matching.jpg', '매칭 브릿지 AI'],
          ['src/p8_space.jpg', '공간기획 AI'],
          ['src/p8_remote.jpg', '원격 경영'],
        ],
      },
    ],
  },
  {
    id: 'bank-onboarding',
    title: '은행 AI 온보딩 플랫폼',
    subtitle: '신입 은행원 대상 AI 고객 상담 훈련 및 퀴즈 학습 플랫폼',
    period: '2025.11 – 2025.12',
    org: 'SK네트웍스 AI CAMP',
    visual: { draw: 'bank' },
    meta: [
      ['요약', '은행 상담 AI 시뮬레이션, 퀴즈 학습, 챗봇 등을 통해 신입 은행원들의 온보딩을 돕는 교육 플랫폼'],
      ['인원', '6명'],
      ['역할', '학습 모듈, 서버 구축'],
      ['소속', 'SK네트웍스 AI CAMP'],
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/SKNETWORKS-FAMILY-AICAMP/SKN16-FINAL-3Team' },
    ],
    intro: [
      '본 플랫폼은 NCS, 은행 관련 법률, 하경은행 가상 상품 데이터를 활용한 RAG 기반 신입 은행원 온보딩 AI 서비스입니다.',
      '신입 은행원이 빠르게 실무 업무를 익히고 적응할 수 있도록, 3가지 핵심 기능을 제공합니다.',
    ],
    features: [
      {
        title: '은행 상담 AI 시뮬레이션',
        items: [
          '실제 창구 상황을 반영한 멀티 페르소나 고객 응대 시나리오 제공',
          'TTS, STT 기반 음성 입력과 RAG 연계 답변으로 실무형 상담 훈련 지원',
          '응답 품질 자동 평가, 점수화 및 개선 포인트 리포트 제공',
        ],
      },
      {
        title: '퀴즈 학습',
        items: [
          'NCS·법규·금융 용어 문서를 기반으로 LLM이 자동 생성한 문제 제공',
          '연습·중간·최종 평가와 자동 채점 및 피드백 지원',
          '개인별 취약 영역 분석을 통한 맞춤형 반복 학습 가능',
        ],
      },
      {
        title: '챗봇 및 일정관리',
        items: [
          'RAG 기반 챗봇으로 은행 실무 지식 및 규정 즉시 질의응답',
          '학습·훈련·시뮬레이션 일정 통합 관리',
          '멘토–멘티 스케줄 및 점심 매칭까지 지원',
        ],
      },
    ],
    sections: [
      {
        title: '아키텍처 및 핵심 기능',
        images: [
          ['src/p2_thumbnail.jpg', '온보딩 플랫폼'],
          ['src/p2_architecture.jpg', '아키텍처'],
          ['src/p2_corefeatures1.jpg', '핵심 기능 1'],
          ['src/p2_corefeatures2.jpg', '핵심 기능 2'],
          ['src/p2_corefeatures3.jpg', '핵심 기능 3'],
          ['src/p2_corefeatures4.jpg', '핵심 기능 4'],
          ['src/p2_corefeatures5.jpg', '핵심 기능 5'],
        ],
      },
    ],
    video: { src: 'src/p2_demo.mp4', caption: '시뮬레이션 시연 영상' },
  },
  {
    id: 'midas-cad',
    title: 'ArchiDesign, MidasCAD',
    subtitle: 'CAD 제품군 프로젝트 매니저',
    period: '2022.04 – 2024.07',
    org: 'Midas IT',
    visual: { image: 'src/p3_screen.jpg' },
    meta: [
      ['요약', 'ArchiDesign, MidasCAD 로드맵 수립, 기술기획 및 지원, 교육, 테스트 검증, 배포 등'],
      ['역할', '기술기획, 지원'],
      ['소속', 'Midas IT'],
    ],
    highlights: [
      'ICAD Studio 기획(MDWG의 DWG화)',
      'CAD 로드맵 수립',
      '버전 업데이트 및 배포 10+회(버전당 약 60개 issue 보고 및 검증), 핫픽스 대응',
      '기술지원 월 400건 및 오프라인 교육',
      '기술지원 GPT 및 챗봇 자동화 기획',
      'CAD 엔진 마이그레이션(ODA&ITC)',
    ],
    links: [
      { label: '제품 사이트', url: 'https://www.midasuser.com/ko/product/cad' },
      { label: '기술지원 사이트', url: 'https://support.midasuser.com/hc/ko' },
      { label: '사용자 카페', url: 'https://cafe.naver.com/midasarchidesign' },
    ],
    intro: [
      'MidasCAD는 정보 기반 설계를 통해 반복 입력과 편집을 최소화해 설계·제도 업무 효율을 극대화한 신개념 CAD입니다.',
      'MIDAS IT의 세계 최고 수준 건설 CAE 기술을 바탕으로 실무에 최적화된 4가지 핵심 기능을 제공합니다.',
    ],
    features: [
      { title: '자동 축척', items: ['뷰·시트 축척을 인식해 객체 크기/치수 자동 맞춤', '별도 스케일 계산 없이 즉시 도면 작성', '반복적인 스케일 편집을 최소화'] },
      { title: '정보 태그', items: ['객체에 면적·길이·문자 등 메타데이터 태그 부여', '정보 자동 추출로 물량·규격 검증 간소화', '객체 수정 시 태그 연동으로 변경 작업 감소'] },
      { title: '프로젝트 관리', items: ['시트 단위 버전/이력/이슈를 통합 관리', '탐색·목록·연속 출력 등 워크플로우 제공', '템플릿 공유로 팀 협업 시 결과물 통일'] },
      { title: '영역 참조', items: ['내부 영역을 참조 뷰로 연결해 외부 참조 관리 최소화', '참조 기반 파생도면을 신속히 작성/편집', '필요 시 기존 외부 참조도 병행 지원'] },
    ],
    sections: [
      { title: 'ArchiDesign 화면', images: [['src/p3_screen.jpg', 'ArchiDesign 화면']] },
      {
        title: '1. ICAD Studio 기획 (MDWG의 DWG화)',
        images: Array.from({ length: 11 }, (_, i) => [`src/p3_icadstudio${i + 1}.jpg`, `ICAD Studio ${i + 1}`]),
      },
      {
        title: '2. CAD 로드맵 수립',
        images: [2, 3, 4, 5].map((n) => [`src/p3_roadmap${n}.jpg`, `로드맵 ${n - 1}`]),
      },
      {
        title: '3. 버전 업데이트 및 배포 10+회',
        images: [['src/p3_roadmap1.jpg', '버전 업데이트 1'], ['src/p3_vc1.jpg', '버전 업데이트 2']],
      },
      {
        title: '4. 기술지원 및 교육',
        images: [['src/p3_techsupport.jpg', '기술지원'], ['src/p3_lessons.jpg', '교육']],
      },
    ],
  },
  {
    id: 'kwangdong-hq',
    title: '광동제약 신사옥 건축설계',
    subtitle: '과천지식정보타운 · 기본 및 실시설계 (24.10 준공)',
    period: '2021.04 – 2022.02',
    org: 'Heerim Architects',
    visual: { image: 'src/p4_persview.jpg' },
    meta: [
      ['요약', '과천지식정보타운 광동제약 신사옥 건축설계'],
      ['역할', '평입단면 계획, 수직 동선 계획, 상세도, 3D 모델링(BIM)'],
      ['소속', 'Heerim Architects'],
      ['위치', '경기 과천시 과천대로7다길 52'],
    ],
    links: [
      { label: '지도로 보기', url: 'https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%20%EA%B3%BC%EC%B2%9C%EC%8B%9C%20%EA%B3%BC%EC%B2%9C%EB%8C%80%EB%A1%9C7%EB%8B%A4%EA%B8%B8%2052' },
    ],
    sections: [
      {
        title: '도면 및 투시도',
        images: [
          ['src/p4_persview.jpg', '투시도'],
          ['src/p4_generalinfo.jpg', '개요'],
          ['src/p4_site.jpg', '대지'],
          ['src/p4_plan.jpg', '평면'],
          ['src/p4_elev.jpg', '입면'],
          ['src/p4_sect.jpg', '단면'],
          ['src/p4_mainlobby.jpg', '로비'],
        ],
      },
    ],
  },
  {
    id: 'incheon-airport',
    title: '인천공항 4단계 부대건물 건축설계',
    subtitle: 'T2 장기주차빌딩, ICT센터 등 30개동 · 기본 및 실시설계 (24.11 준공)',
    period: '2018.05 – 2020.10',
    org: 'Heerim Architects',
    visual: { image: 'src/p5_thumbnail.jpg' },
    meta: [
      ['요약', '인천공항 4단계 부대건물 건축설계'],
      ['역할', 'T2장기주차빌딩, ICT센터 등 30개동 부대건물 평입단면 계획, 상세도'],
      ['소속', 'Heerim Architects'],
      ['위치', '인천 중구 제2터미널대로 332'],
    ],
    links: [
      { label: '지도로 보기', url: 'https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%20%EC%A4%91%EA%B5%AC%20%EC%A0%9C2%ED%84%B0%EB%AF%B8%EB%84%90%EB%8C%80%EB%A1%9C%20332' },
    ],
    sections: [
      {
        title: '도면 및 사진',
        images: [
          ['src/p5_intro.jpg', '프로젝트 소개'],
          ['src/p5_concept.jpg', '컨셉'],
          ['src/p5_site.jpg', '대지 계획'],
          ['src/p5_detail.jpg', '디테일'],
          ['src/p5_ICT.jpg', 'ICT 센터'],
          ['src/p5_radar.jpg', '레이더 시설'],
        ],
      },
    ],
  },
];

// 마지막 챕터: About
export const about = {
  id: 'about',
  title: 'About',
  subtitle: '건축과 소프트웨어 사이에서 일합니다',
  visual: { text: 'Y' },
};
