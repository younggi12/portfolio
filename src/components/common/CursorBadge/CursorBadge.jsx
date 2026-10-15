// 마우스를 따라다니는 점 커서 (사이트 전체, SiteLayout에서 1회)
// - 기본 화살표 대신 작은 점이 마우스 위치에 붙어 다님
// - 색을 아래 화면과 뒤집어(mix-blend-mode: difference) 흰 바탕에선 검정, 어두운 사진 위에선 흰색
// - 작은 버튼 · 링크 위(자석): 점이 버튼 가운데로 빨려 들어가 사라지고, 버튼이 마우스 쪽으로 살짝 따라옴
// - 작품 사진 위: 큰 원(돋보기)이 되고 원 안에 보이는 부분만 흑백
// - 큰 링크(숫자 줄 · 카드 등) 위: 점이 커짐 / 누르는 순간: 작아짐 / 창 밖으로 나가면 사라짐
// - 마우스 기기에서만 (터치 화면 · 동작 줄이기 설정이면 없음 → 기본 커서 그대로)
import { useEffect, useRef } from "react";
import styles from "./CursorBadge.module.scss";

const INTERACTIVE = "a, button, [role='button'], label, summary, input, textarea, select";
const MAGNET_MAX_W = 320; // 이보다 작은 버튼 · 링크만 자석 (큰 줄 · 카드는 제외)
const MAGNET_MAX_H = 100;
const MAGNET_PULL = 0.3;  // 버튼이 마우스 쪽으로 따라오는 정도 (마우스와 가운데 거리의 30%)
const MAGNET_EASE = 0.18; // 따라오는 부드러움 (작을수록 천천히)

// 자석 대상인지 — 작은 크기 + 입력칸 아님 + data-no-magnet 없음
const isMagnet = (el, rect) => el
  && !el.matches("input, textarea, select")
  && !el.closest("[data-no-magnet]")
  && rect.width <= MAGNET_MAX_W
  && rect.height <= MAGNET_MAX_H;

const CursorBadge = () => {
  const rootRef = useRef(null);
  const moverRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const mover = moverRef.current;
    const canUse = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || !canUse) return undefined;

    const html = document.documentElement;
    html.classList.add(styles.noCursor); // 기본 커서 숨김

    // 자석 상태 — 지금 붙은 버튼, 버튼이 가야 할 위치(target) · 지금 위치(now)
    const magnet = { el: null, target: { x: 0, y: 0 }, now: { x: 0, y: 0 }, frame: 0, leaving: [] };

    // 버튼을 매 프레임 목표 위치로 조금씩 옮김 — CSS transition을 건드리지 않으려고 JS로
    const tick = () => {
      const { el, target, now } = magnet;
      if (el) {
        now.x += (target.x - now.x) * MAGNET_EASE;
        now.y += (target.y - now.y) * MAGNET_EASE;
        el.style.translate = `${now.x}px ${now.y}px`;
      }
      // 떨어진 버튼들은 제자리로 돌아감
      magnet.leaving = magnet.leaving.filter((item) => {
        item.x += (0 - item.x) * MAGNET_EASE;
        item.y += (0 - item.y) * MAGNET_EASE;
        if (Math.abs(item.x) < 0.1 && Math.abs(item.y) < 0.1) {
          item.el.style.translate = "";
          return false;
        }
        item.el.style.translate = `${item.x}px ${item.y}px`;
        return true;
      });
      magnet.frame = el || magnet.leaving.length ? requestAnimationFrame(tick) : 0;
    };
    const run = () => { if (!magnet.frame) magnet.frame = requestAnimationFrame(tick); };

    const release = () => {
      if (!magnet.el) return;
      magnet.leaving.push({ el: magnet.el, x: magnet.now.x, y: magnet.now.y });
      magnet.el = null;
      root.classList.remove(styles.stuck);
      run();
    };

    const onMove = (e) => {
      root.classList.add(styles.shown);
      const el = e.target.closest?.(INTERACTIVE) ?? null;

      if (el && el !== magnet.el) {
        // 원래 위치 기준으로 재야 해서 지금 따라온 만큼은 빼고 계산
        const rect = el.getBoundingClientRect();
        if (isMagnet(el, rect)) {
          release();
          const back = magnet.leaving.find((item) => item.el === el); // 돌아가던 중이면 이어서
          magnet.leaving = magnet.leaving.filter((item) => item.el !== el);
          magnet.el = el;
          magnet.now = back ? { x: back.x, y: back.y } : { x: 0, y: 0 };
        } else {
          release();
        }
      } else if (!el) {
        release();
      }

      if (magnet.el) {
        const rect = magnet.el.getBoundingClientRect();
        const cx = rect.left - magnet.now.x + rect.width / 2; // 따라오기 전 가운데
        const cy = rect.top - magnet.now.y + rect.height / 2;
        magnet.target = { x: (e.clientX - cx) * MAGNET_PULL, y: (e.clientY - cy) * MAGNET_PULL };
        // 점은 버튼 가운데로 빨려 들어감
        mover.style.transform = `translate3d(${cx + magnet.target.x}px, ${cy + magnet.target.y}px, 0)`;
        root.classList.add(styles.stuck);
        root.classList.remove(styles.hover);
        run();
      } else {
        mover.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        root.classList.toggle(styles.hover, Boolean(el));
        // 작품 사진 위(data-cursor-lens) — 커서가 큰 원이 되고, 원 안에 보이는 부분만 흑백
        root.classList.toggle(styles.lensOn, Boolean(e.target.closest?.("[data-cursor-lens]")));
      }
    };
    const onLeave = (e) => {
      if (e.relatedTarget) return; // 창 밖으로 나갈 때만
      root.classList.remove(styles.shown);
      release();
    };
    const onDown = () => root.classList.add(styles.press);
    const onUp = () => root.classList.remove(styles.press);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      html.classList.remove(styles.noCursor);
      cancelAnimationFrame(magnet.frame);
      if (magnet.el) magnet.el.style.translate = "";
      magnet.leaving.forEach((item) => { item.el.style.translate = ""; });
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <div ref={moverRef} className={styles.mover}>
        <span className={styles.dot} />
        <span className={styles.lens} />
      </div>
    </div>
  );
};

export default CursorBadge;