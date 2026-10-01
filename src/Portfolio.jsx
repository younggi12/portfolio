import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Portfolio.module.scss";

const PROFILE_NAME = "이영기";

/* ============================================================
   🚪 로딩 인트로 설정 (영상 버전)
   - public/intro.mp4 영상을 재생하고, 재생 진행률이 그대로
     하단 로딩바 채움 정도가 됨(영상 100% = 바 100%)
   - 영상이 끝나면 잠깐 멈췄다가 메인 화면으로 페이드 전환
   - 클릭하거나 아무 키나 누르면 바로 건너뜀
   - 영상을 못 불러오거나 너무 오래 걸리면 자동으로 넘어감
   - 시스템에서 "동작 줄이기"를 켠 사용자는 인트로를 생략함
   - 영상을 바꾸려면 public/intro.mp4 파일만 교체하면 됨
   ============================================================ */
const LOADING_VIDEO = `${import.meta.env.BASE_URL}intro.mp4`; // GitHub Pages 하위 경로에서도 동작
const LOADING_POSTER = `${import.meta.env.BASE_URL}intro-poster.jpg`; // 영상 첫 프레임 캡처(없어도 됨)
const LOADING_PAUSE = 300; // 영상 끝난 뒤 멈춰 있는 시간(ms)
const LOADING_FADE = 450; // 페이드 아웃 시간(ms) — SCSS의 transition과 맞춤
const LOADING_MAX = 10000; // 안전장치: 이 시간이 지나면 영상 상태와 상관없이 넘어감(ms)

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   ✏️ 내용 수정은 여기만
   ============================================================ */
const PROFILE = {
  name: PROFILE_NAME,
  role: "Frontend Developer",
  tagline: "인터랙션으로 사용 경험을 만드는 프론트엔드 개발자",
  school: "이젠컴퓨터아카데미 안산 · 웹/프론트엔드 개발자 과정 (~2026.10)",
  github: "https://github.com/younggi12",
  email: "oosc76@naver.com",
};

// role: 팀/개인 + 담당 / points: 핵심 구현(2~3개) / stack: 기술 / links: 버튼(없으면 빈 배열)
const PROJECTS = [
  {
    name: "JAJAK — 전통주 AI 큐레이션 쇼핑몰",
    role: "5인 팀 프로젝트 · 인증, 고객센터, 위시리스트 담당",
    desc: "취향 설문을 바탕으로 전통주와 어울리는 안주를 추천하는 AI 큐레이션 쇼핑몰.",
    points: [
      "Firebase Authentication으로 로그인·회원가입·로그아웃 흐름 구현, 정지 계정 로그인 차단",
      "회원가입 직후 성공 모달이 뜨지 않던 문제를 추적해 Firestore 보안 규칙의 권한 문제임을 찾아내고 팀과 협의해 해결",
      "팀 규칙 문서(AGENTS.md)의 데이터 계약에 맞춰 로그아웃 시 장바구니 정리, 위시리스트는 상품 ID만 저장",
    ],
    stack: ["React", "Vite", "Firebase Auth", "Firestore", "SCSS Modules"],
    links: [
      { label: "사이트", href: "https://jajak-ten.vercel.app" },
      { label: "GitHub", href: "https://github.com/jiwoo1012/TeamProject2" },
    ],
  },
  {
    name: "F1 팬 사이트",
    role: "개인 프로젝트",
    desc: "드라이버 카드와 방명록이 있는 F1 팬 사이트. 공식 F1 카드 디자인을 참고해 다크 테마로 제작.",
    points: [
      "CSS 커스텀 속성으로 팀 컬러를 동적으로 적용한 드라이버 카드(레이싱 넘버, 사진 페이드)",
      "드라이버 캐릭터 선택, 팀 필터 탭, 페이지네이션이 있는 방명록",
      "IntersectionObserver 기반 스크롤 애니메이션",
    ],
    stack: ["React", "Vite", "Firebase", "Zustand", "SCSS Modules"],
    links: [
      { label: "사이트", href: "https://re008-tzii.vercel.app" },
      { label: "GitHub", href: "https://github.com/younggi12/re008" },
    ],
  },
  {
    name: "BlueLine 야구용품 쇼핑몰",
    role: "개인 프로젝트",
    desc: "라이브러리 없이 바닐라 HTML/CSS/JS로 만든 야구용품 쇼핑몰.",
    points: [
      "장바구니 담기·수량 변경과 배송비 계산 로직 직접 구현",
      "스크롤에 맞춰 등장하는 애니메이션",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    links: [{ label: "사이트", href: "https://younggi12.github.io/-4/" }],
  },
  {
    name: "멍냥허브 — 반려동물 용품 쇼핑몰",
    role: "팀 프로젝트",
    desc: "반려동물 용품을 판매하는 쇼핑몰 팀 프로젝트.",
    points: [
      "상품 옵션 선택에 따른 가격 계산",
      "localStorage/sessionStorage로 로그인 상태를 유지하고 모든 페이지 헤더에 반영",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "사이트", href: "https://projectmangryung.github.io/teamproject/" },
      { label: "GitHub", href: "https://github.com/projectMangRyung/teamproject" },
    ],
  },
];

const SKILLS = ["HTML5", "CSS3 / SCSS", "JavaScript", "React", "Vite", "Zustand", "Firebase", "Node.js", "Git"];

// 화면에 고정으로 들어가는 문구(라벨/안내)도 여기서만 관리
const UI_TEXT = {
  eyebrow: "PORTFOLIO",
  scrollHint: "SCROLL ↓",
  skipHint: "클릭하거나 아무 키나 누르면 건너뛰기",
  labels: {
    projects: "PROJECTS",
    skills: "SKILLS",
    contact: "CONTACT",
  },
};

/* ============================================================
   로딩 화면 컴포넌트
   ============================================================ */
function LoadingScreen({ onDone }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // 영상 재생 위치 → 로딩바 진행률
  useEffect(() => {
    let raf;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration) setProgress(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 영상이 끝나면 잠깐 멈췄다가 퇴장
  useEffect(() => {
    if (!ended) return;
    setProgress(1);
    const t = setTimeout(() => setLeaving(true), LOADING_PAUSE);
    return () => clearTimeout(t);
  }, [ended]);

  // 안전장치: 영상이 안 뜨거나 너무 길면 강제로 넘어감
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), LOADING_MAX);
    return () => clearTimeout(t);
  }, []);

  // 아무 키나 누르면 건너뛰기
  useEffect(() => {
    const skip = () => setLeaving(true);
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, []);

  // 페이드 아웃이 끝나면 완전히 제거
  useEffect(() => {
    if (!leaving) return;
    videoRef.current?.pause();
    const t = setTimeout(onDone, LOADING_FADE);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      className={`${styles.loading}${leaving ? ` ${styles.loadingLeave}` : ""}`}
      onClick={() => setLeaving(true)}
    >
      <video
        ref={videoRef}
        className={styles.loadingVideo}
        src={LOADING_VIDEO}
        poster={LOADING_POSTER}
        autoPlay
        muted // 모바일/크롬 자동재생 조건: 무음 필수
        playsInline // iOS에서 전체화면으로 튀지 않게
        preload="auto"
        onEnded={() => setEnded(true)}
        onError={() => setLeaving(true)} // 파일이 없거나 깨졌으면 바로 본문으로
        aria-hidden="true"
      />
      <div className={styles.loadingBarTrack}>
        <div className={styles.loadingBarFill} style={{ width: `${progress * 100}%` }} />
      </div>
      <p className={styles.loadingSkip}>{UI_TEXT.skipHint}</p>
    </div>
  );
}

/* ============================================================
   메인
   ============================================================ */
export default function Portfolio() {
  const [loading, setLoading] = useState(!prefersReducedMotion);
  const handleLoadingDone = useCallback(() => setLoading(false), []);

  // 로딩 중에는 뒤 페이지 스크롤 잠금
  useEffect(() => {
    if (!loading) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <div className={styles.root}>
      {loading && <LoadingScreen onDone={handleLoadingDone} />}

      {/* ── 1페이지: 자기소개 ── */}
      <section className={`${styles.page} ${styles.pageWhite}`}>
        <p className={styles.eyebrow}>{UI_TEXT.eyebrow}</p>
        <h1 className={styles.name}>{PROFILE.name}</h1>
        <p className={styles.role}>{PROFILE.role}</p>
        <p className={styles.tagline}>{PROFILE.tagline}</p>
        <p className={styles.school}>{PROFILE.school}</p>
        <p className={styles.hint}>{UI_TEXT.scrollHint}</p>
      </section>

      {/* ── 2페이지: 작품 / 스킬 / 연락처 ── */}
      <section className={`${styles.page} ${styles.pageContent}`}>
        <div className={styles.content}>
          <div className={styles.section}>
            <p className={styles.label}>{UI_TEXT.labels.projects}</p>
            <div className={styles.projectList}>
              {PROJECTS.map((p) => (
                <article className={styles.project} key={p.name}>
                  <h3>{p.name}</h3>
                  <p className={styles.projectRole}>{p.role}</p>
                  <p>{p.desc}</p>
                  <ul className={styles.projectPoints}>
                    {p.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className={styles.projectStack}>
                    {p.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {p.links.length > 0 && (
                    <div className={styles.projectLinks}>
                      {p.links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                          {l.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>{UI_TEXT.labels.skills}</p>
            <div className={styles.skillList}>
              {SKILLS.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>{UI_TEXT.labels.contact}</p>
            <div className={styles.contactLinks}>
              <a href={PROFILE.github} target="_blank" rel="noreferrer">
                {PROFILE.github}
              </a>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}