// ⓪ 이름 장면 — HELLO I'M → YG → YOUNG GI(시간으로 저절로) → 휠 한 번에 커튼이 위로 걷히며 EDUCATION
import { useEffect, useRef } from "react";
import { PROFILE } from "@/data/profile";
import { ABOUT_TEXT } from "@/data/site";
import { scrollToY, SCROLL_EVENT, SCROLL_DONE_EVENT } from "@/utils/scrollToY";
import { coverState, FACTS_COVER_EVENT } from "./aboutShared";
import styles from "./About.module.scss";

// ⓪ 이름 장면 — 스크롤에 따라 세 단계 (구역 높이만큼 스크롤하는 동안 화면에 붙어 있음)
//   1) "HI, MY NAME IS"가 화면 폭을 꽉 채울 만큼 크게 가운데
//   2) 인사 글자가 작아지며 위로, 아래에서 YG가 튀어 오름 — 이때 배경이 검정으로 뒤집힘
//   3) 조금 더 스크롤하면 Y·G 사이가 저절로 벌어지며 OUNG · I가 하나씩 튀어 올라 YOUNG GI
//   4) 장면 끝에서 배경이 다시 흰색 → 아래 About으로 자연스럽게
const NAME_PARTS = [
  { text: "Y" }, { text: "OUNG", hidden: true }, { text: " ", hidden: true },
  { text: "G" }, { text: "I", hidden: true },
];
// 인사 → YG → YOUNG GI는 시간으로 저절로 이어짐 — 풀네임이 다 펼쳐질 때까지는 스크롤해도 넘어가지 않음(장면 맨 위에 멈춤)
// 그 뒤 아래로 한 번 굴리면 커튼이 위로 걷힘(화면이 내려가지 않음) / EDUCATION 맨 위에서 위로 굴리면 커튼이 다시 내려옴
const HI_MS = 2200;     // 1) 배경이 검게 + "HELLO / I'M" 타이핑 — 천천히
const HI_HOLD = 1000;   //    다 친 뒤 "HELLO I'M"을 이만큼 보여준 다음 YG로 (ms)
const SHOW_MS = 1100;   // 2) 인사 글자가 작아지며 위로 + YG가 튀어 오름
const OPEN_MS = 1400;   // 3) YOUNG GI로 펼쳐짐
const SETTLE_MS = 600;  //    커튼이 다 움직인 뒤 이만큼은 휠을 굴려도 그대로 (관성으로 바로 내려가지 않게)
const SETTLE_GAP = 300; //    그 사이 휠이 계속 들어오면, 휠이 이만큼 멈출 때까지 계속 그대로 (새로 굴려야 움직임)
const CURTAIN_MS = 1100; // 4) 풀네임이 다 나온 뒤 아래로 한 번 굴리면: 검은 화면이 커튼처럼 위로 걷히며 EDUCATION이 드러남
const TYPE_FROM = 0.2;   // 인사 시간 중 이만큼 지난 뒤부터 타이핑 (배경이 조금 어두워진 뒤)
const LETTER_STEP = 0.1; // 글자끼리 등장 시차 (단계 안에서의 비율)
const RISE = 0.5;       // 튀어 오르기 전 아래 위치 (글자 크기 배수)
const BLUR = 12;        // 처음 흐림 (px)

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeOut = (k) => 1 - (1 - k) ** 3;          // 처음엔 빠르게, 끝에서 천천히
const easeBack = (k) => 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2; // 살짝 넘쳤다 돌아옴(통통)

const NameIntro = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const boxes = [...scene.querySelectorAll("[data-name-box]")];       // 숨은 칸
    const initials = [...scene.querySelectorAll("[data-name-initial]")]; // Y · G
    const letters = [...scene.querySelectorAll("[data-name-letter]")];   // 숨은 칸 속 글자 (등장 순서)
    const typed = [...scene.querySelectorAll("[data-type-ch]")];         // 인사 글자 (타이핑 순서)
    const hello = scene.querySelector("[data-hello]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 글자 하나 — t(0~1)에 맞춰 아래에서 튀어 오르며 흐림 → 또렷
    const pop = (el, t) => {
      el.style.opacity = String(easeOut(t));
      el.style.transform = `translateY(${((1 - easeBack(t)) * RISE).toFixed(3)}em)`;
      el.style.filter = t < 1 ? `blur(${((1 - easeOut(t)) * BLUR).toFixed(1)}px)` : "";
    };
    // 여러 글자를 시차를 두고 차례로
    const popAll = (list, k) => {
      const span = 1 - LETTER_STEP * (list.length - 1);
      list.forEach((el, i) => pop(el, clamp01((k - i * LETTER_STEP) / span)));
    };

    // 숨은 칸의 원래 폭 — 글꼴 크기가 화면 폭 따라 바뀌니 크기 바뀔 때마다 다시 잼
    let widths = [];
    const name = scene.querySelector("[data-name]");
    const stage = name.parentElement;
    const measure = () => {
      // 인사 글자를 처음에 화면 가운데로 내리는 거리 = (이름 줄 높이 + 사이 간격) / 2
      const gap = parseFloat(getComputedStyle(name.parentElement).rowGap) || 0;
      scene.style.setProperty("--hi-shift", `${(name.offsetHeight + gap) / 2}px`);

      widths = boxes.map((el) => {
        el.style.maxWidth = "none";
        return el.scrollWidth;
      });
    };

    // 2) YG 등장 · 3) 펼치기 — 스크롤 위치가 아니라 시간으로
    // 정해진 지점을 넘으면 목표 1(나타남/펼침)로, 되돌아가면 0으로, ms 동안 저절로 진행
    const makeTween = (ms, apply) => {
      const t = { now: 0, target: 0, frame: 0, last: 0 };
      const step = (time) => {
        const dt = time - t.last;
        t.last = time;
        const dir = Math.sign(t.target - t.now);
        t.now = clamp01(t.now + (dir * dt) / ms);
        if ((dir > 0 && t.now > t.target) || (dir < 0 && t.now < t.target)) t.now = t.target;
        apply(t.now);
        t.frame = t.now === t.target ? 0 : requestAnimationFrame(step);
        // 끝나면 다음 단계로 넘어가도 되는지 다시 확인 (스크롤을 멈춘 채 타이핑이 끝나도 YG가 이어서 나오게)
        if (!t.frame) onScroll();
      };
      t.set = (target) => {
        if (target === t.target && (t.frame || t.now === target)) return;
        t.target = target;
        if (reduced) { t.now = target; apply(target); return; }
        if (!t.frame) {
          t.last = performance.now();
          t.frame = requestAnimationFrame(step);
        }
      };
      t.stop = () => cancelAnimationFrame(t.frame);
      // 연출 없이 바로 그 상태로 (메뉴로 장면을 건너뛸 때)
      t.jump = (v) => {
        cancelAnimationFrame(t.frame);
        t.frame = 0;
        t.now = v;
        t.target = v;
        apply(v);
      };
      return t;
    };
    // YG가 튀어 오르고, 인사 글자가 작아지며 위로 (--show)
    const showTween = makeTween(SHOW_MS, (k) => {
      popAll(initials, k);
      scene.style.setProperty("--show", easeOut(k).toFixed(3));
      if (k === 1) onScroll(); // 다 나오면 다음 단계(펼치기)를 할 수 있는지 다시 확인
    });
    // Y·G 사이가 벌어지며 YOUNG GI
    const applyOpen = (k) => {
      boxes.forEach((el, i) => { el.style.maxWidth = `${widths[i] * easeOut(k)}px`; });
      popAll(letters, k);
    };
    const openTween = makeTween(OPEN_MS, applyOpen);

    // 1) 인사 — 장면에 조금만 들어오면(HI_AT) 저절로: 배경이 검게 바뀌며 한 글자씩 타이핑 (HI_MS 동안)
    let light = 0; // 장면 끝에서 막이 걷히는 정도 (스크롤)
    let pinned = false; // 장면이 화면 맨 위에 붙었는지 (첫 화면과 겹친 동안은 투명)
    const paint = (hiK) => {
      scene.style.setProperty("--hi-in", easeOut(hiK).toFixed(3)); // 인사 등장 (모서리 글자)
      // 타이핑 — 배경이 조금 어두워진 뒤부터 한 글자씩, 커서는 마지막 글자 뒤 (다 치면 깜빡임)
      const count = Math.round(clamp01((hiK - TYPE_FROM) / (1 - TYPE_FROM)) * typed.length);
      typed.forEach((el, i) => {
        el.classList.toggle(styles.chOn, i < count);
        el.classList.toggle(styles.chLast, i === count - 1);
      });
      hello.classList.toggle(styles.helloDone, count === typed.length);
      // 배경 검정 정도 — 글자가 다 사라진 뒤에 걷힘(회색 위 회색 글자가 안 생기게)
      // 첫 화면이 검게 끝나며 넘어오므로, 장면이 화면 맨 위에 붙은 순간부터 바로 검정
      // 커튼이 올라가는 동안에도 검정 그대로 (색이 옅어지지 않고 판째로 올라감)
      const dark = reduced ? 0 : (pinned && light < 1 ? 1 : 0);
      scene.style.setProperty("--dark", dark.toFixed(3));
      // 검정 구간에선 헤더 글자도 흰색으로 — 커튼 아래 끝이 헤더를 지나가면 검정 글자로
      const theme = dark && (1 - light) * window.innerHeight > 36 ? "dark" : "light";
      if (stage.dataset.headerTheme !== theme) {
        stage.dataset.headerTheme = theme;
        // 헤더는 스크롤 때 색을 고름 — 이 값이 그 뒤(다음 프레임)에 바뀌므로 한 번 더 알려 줌 (안 하면 멈췄을 때 이전 색으로 남음)
        window.dispatchEvent(new Event("scroll"));
      }
      // 막이 투명할 때만 마우스가 통과 — 아래 숫자 줄을 누를 수 있게
      // (CSS로 늘 통과시키면 헤더 색을 고르는 훅이 이 장면을 못 찾아 검은 화면 위 헤더가 흰색이 됨)
      stage.style.pointerEvents = dark > 0.02 ? "auto" : "none";
    };
    let hiDoneAt = 0; // 타이핑이 끝난 시각 — HI_HOLD 동안은 YG로 넘어가지 않음
    let holdTimer = 0;
    const hiTween = makeTween(HI_MS, (k) => {
      paint(k);
      if (k === 1 && !hiDoneAt) {
        hiDoneAt = performance.now();
        clearTimeout(holdTimer);
        holdTimer = setTimeout(onScroll, HI_HOLD); // 머문 뒤 다음 단계(YG)를 할 수 있는지 다시 확인
      }
      if (k < 1) hiDoneAt = 0;
    });
    const hiHeld = () => reduced || (hiDoneAt > 0 && performance.now() - hiDoneAt >= HI_HOLD);

    let frame = 0;
    let locked = false; // 풀네임이 펼쳐지기 전 — 아래로 못 내려감
    let top = 0;        // 장면 맨 위(멈추는 곳)
    let end = 0;        // EDUCATION 맨 위
    // 커튼 — 검은 무대가 위로 걷힘 (0: 덮음, 1: 다 걷힘)
    const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
    // EDUCATION이 커튼에 가려 있는지 바뀌면 알려 줌 (숫자 연출은 다 걷힌 뒤에)
    const tellCover = () => {
      const cover = !reduced && pinned && light < 1 && window.scrollY <= end + 2;
      if (cover !== coverState.covered) {
        coverState.covered = cover;
        window.dispatchEvent(new CustomEvent(FACTS_COVER_EVENT, { detail: cover }));
      }
    };
    const curtain = makeTween(CURTAIN_MS, (k) => {
      light = k;
      tellCover();
      scene.style.setProperty("--curtain", easeInOut(k).toFixed(4));
      paint(hiTween.now);
      if (k === 0 && closing) { closing = false; scrollToY(top, { smooth: false }); } // 다 내려오면 장면 맨 위로
      if (k === 0 || k === 1) settleUntil = performance.now() + SETTLE_MS;
    });
    let settleUntil = 0; // 커튼이 다 걷히거나 내려온 직후 — 이어서 들어오는 휠(터치패드 관성)에 바로 움직이지 않게
    let closing = false;
    // 메뉴(Projects · Contact 등)로 이동하는 중 — 장면을 막지 않고 그대로 지나감 (이동이 끝나면 풀림)
    let passing = false;
    let passTimer = 0;
    const PASS_MAX = 8000; // 끝났다는 알림이 안 와도 이만큼 지나면 풀림 (ms)
    const endPass = () => {
      if (!passing) return;
      passing = false;
      clearTimeout(passTimer);
      // 장면 맨 위(About)에 도착하면 커튼을 내려 처음부터
      if (window.scrollY <= top + 2 && curtain.now !== 0) curtain.jump(0);
      onScroll();
    };
    const onNavigate = (e) => {
      if (reduced || !e.detail.smooth) return; // 장면이 스스로 하는 즉시 이동은 제외
      passing = true;
      clearTimeout(passTimer);
      passTimer = setTimeout(endPass, PASS_MAX);
      // 장면 맨 위보다 아래로 가면(About → EDUCATION, Projects …) 커튼을 미리 걷어 둠 — 검은 화면에 걸리지 않고 그대로 지나감
      if (e.detail.top > top + 2) { closing = false; curtain.jump(1); }
    };
    // 아래로: 풀네임이 다 나왔고 장면 맨 위에 있으면 → EDUCATION 자리로 순간 이동(커튼에 가려 안 보임) + 커튼 걷기
    const settling = () => performance.now() < settleUntil && Math.abs(window.scrollY - (curtain.now === 1 ? end : top)) <= 2;
    const goDown = () => {
      if (locked) return true;
      if (curtain.frame || settling()) return true;
      if (pinned && openTween.now === 1 && curtain.now === 0 && Math.abs(window.scrollY - top) <= 2) {
        scrollToY(end, { smooth: false });
        curtain.set(1);
        return true;
      }
      return false;
    };
    // 위로: EDUCATION 맨 위에서 → 커튼을 내리고 장면 맨 위로
    const goUp = () => {
      if (curtain.frame || settling()) return true;
      if (curtain.now === 1 && Math.abs(window.scrollY - end) <= 2) {
        closing = true;
        curtain.set(0);
        return true;
      }
      return false;
    };
    const update = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = reduced ? 1 : clamp01(-rect.top / (range || 1));
      pinned = rect.top <= 1;
      top = rect.top + window.scrollY;
      end = top + range; // EDUCATION 맨 위 (장면 마지막 한 화면과 겹쳐 있어서 커튼 바로 뒤에 있음)

      const navigating = passing;

      hiTween.set(pinned ? 1 : 0);
      // 앞 단계가 다 끝나면 저절로 다음 단계 (장면 위로 되돌아가면 바로 접힘)
      showTween.set(pinned && hiTween.now === 1 && hiHeld() ? 1 : 0);
      openTween.set(pinned && showTween.now === 1 ? 1 : 0);
      if (!navigating && !pinned && curtain.target === 1) curtain.set(0); // 장면 위로 벗어나면 커튼은 내려 둠
      tellCover();
      // 풀네임이 다 펼쳐지기 전에는 장면 맨 위에서 더 내려가지 않게 (관성으로 미끄러져도 되돌림)
      locked = !reduced && !navigating && pinned && openTween.now < 1 && p < 0.5;
      if (locked && window.scrollY > top + 2) scrollToY(top, { smooth: false });
      // 커튼이 닫힌 채 장면 안이면 맨 위 / 열린 채 장면 안으로 미끄러져 올라오면 EDUCATION 맨 위로 (어중간한 곳에 멈추지 않게)
      const y = window.scrollY;
      if (!reduced && !navigating && pinned && !curtain.frame && y > top + 2 && y < end - 2) {
        scrollToY(curtain.now === 1 ? end : top, { smooth: false });
      }
      paint(hiTween.now); // 막이 걷히는 정도(light)는 스크롤로 바뀌므로 매번 다시 칠함
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onResize = () => { measure(); applyOpen(openTween.now); update(); };
    // 휠 · 키 · 터치 — 커튼 열기/닫기 또는 잠긴 동안 막기 (그 외에는 보통 스크롤)
    const handle = (dir, e) => {
      if (reduced || passing) return;
      if (e.target.closest?.("[data-chat]")) return; // 챗봇 창 안의 휠 · 터치 · 키는 장면과 상관없음
      // 커튼이 움직이는 중 · 막 멈춘 뒤에 이어서 들어오는 휠은 한 번의 손짓으로 봄 → 손짓이 멈출 때까지(SETTLE_GAP) 계속 그대로
      if (curtain.frame || settling()) settleUntil = Math.max(settleUntil, performance.now() + SETTLE_GAP);
      if (dir > 0 ? goDown() : goUp()) e.preventDefault();
    };
    const onWheel = (e) => { if (!e.ctrlKey && e.deltaY) handle(Math.sign(e.deltaY), e); };
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea")) return;
      if ([" ", "PageDown", "ArrowDown"].includes(e.key) && !e.shiftKey) handle(1, e);
      else if (["PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey)) handle(-1, e);
    };
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 6) handle(Math.sign(dy), e);
    };

    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener(SCROLL_EVENT, onNavigate);
    window.addEventListener(SCROLL_DONE_EVENT, endPass);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    document.fonts?.ready.then(onResize); // 글꼴이 늦게 오면 폭이 달라지므로
    return () => {
      cancelAnimationFrame(frame);
      hiTween.stop();
      clearTimeout(holdTimer);
      showTween.stop();
      openTween.stop();
      curtain.stop();
      clearTimeout(passTimer);
      window.removeEventListener(SCROLL_EVENT, onNavigate);
      window.removeEventListener(SCROLL_DONE_EVENT, endPass);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div ref={sceneRef} className={styles.intro}>
      {/* 로고 · About 메뉴로 왔을 때 멈추는 곳 — 빈 흰 화면이 아니라 인사가 다 나온 지점 */}
      <span data-about-start className={styles.introStart} aria-hidden="true" />
      <div className={styles.introStage} data-header-theme="light">
        {/* 모서리 작은 글자 (장식) */}
        <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true">{ABOUT_TEXT.introHello.corners.topRight}</span>
        <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true">{ABOUT_TEXT.introHello.corners.bottomLeft}</span>
        {/* 아래로 내려가라는 화살표 — 첫 화면(Hero)과 같은 모양, 계속 통통 튐 */}
        <span className={styles.introCue} aria-hidden="true">
          <svg viewBox="0 0 24 40">
            <path d="M12 2 V36 M3 27 L12 37 L21 27" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        {/* 인사 — 두 줄(HELLO / I'M), 한 글자씩 타이핑 (data-type-ch) */}
        <p className={styles.hi} data-hello aria-label={`${ABOUT_TEXT.introHello.strong} ${ABOUT_TEXT.introHello.light}`}>
          {[["strong", ABOUT_TEXT.introHello.strong], ["light", ABOUT_TEXT.introHello.light]].map(([kind, line]) => (
            <span key={kind} className={kind === "strong" ? styles.hiStrong : styles.hiLight} aria-hidden="true">
              {[...line].map((ch, i) => <span key={i} data-type-ch className={styles.ch}>{ch}</span>)}
            </span>
          ))}
        </p>
        <p className={styles.bigName} aria-label={PROFILE.nameEn} data-name>
          {NAME_PARTS.map((part, i) => (part.hidden ? (
            <span key={i} data-name-box className={styles.nameHidden} aria-hidden="true">
              {[...part.text].map((ch, j) => (
                <span key={j} data-name-letter className={styles.nameLetter}>{ch}</span>
              ))}
            </span>
          ) : (
            <span key={i} data-name-initial className={styles.nameLetter} aria-hidden="true">{part.text}</span>
          )))}
        </p>
      </div>
    </div>
  );
};

export default NameIntro;
