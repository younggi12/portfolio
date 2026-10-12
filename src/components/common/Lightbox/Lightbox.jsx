// 사진 크게 보기 — 화면 전체에 어두운 배경 + 사진 1장
// - ← / → 키와 버튼으로 이전 · 다음 사진, Esc · 배경 클릭 · 닫기 버튼으로 닫힘
// - 열릴 때 닫기 버튼에 포커스, 닫히면 원래 눌렀던 요소로 포커스 복귀
// - 열려 있는 동안 뒤 페이지 스크롤 잠금
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LIGHTBOX_TEXT } from "@/data/site";
import styles from "./Lightbox.module.scss";

const Lightbox = ({ images, index, title, onChange, onClose }) => {
  const closeRef = useRef(null);
  const count = images.length;
  const hasMany = count > 1;

  const go = (step) => onChange((index + step + count) % count);

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (!hasMany) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
        <img src={images[index]} alt={`${title} 화면 ${index + 1}`} className={styles.image} />
        <figcaption className={styles.caption}>
          {title}
          {hasMany && <span className={styles.count}>{index + 1} / {count}</span>}
        </figcaption>
      </figure>

      <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={LIGHTBOX_TEXT.close}>✕</button>
      {hasMany && (
        <>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={LIGHTBOX_TEXT.prev}>‹</button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={LIGHTBOX_TEXT.next}>›</button>
        </>
      )}
    </div>,
    document.body,
  );
};

export default Lightbox;