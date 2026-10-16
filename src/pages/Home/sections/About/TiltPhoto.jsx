// ② 사진 카드 — 마우스를 따라 살짝 기울어짐
import { useRef } from "react";
import { PROFILE } from "@/data/profile";
import styles from "./About.module.scss";

const PHOTO_SRC = PROFILE.photo ? `${import.meta.env.BASE_URL}images/${PROFILE.photo}` : "";
// 사진 카드 — 마우스를 따라 살짝 기울어짐 (마우스 기기만, 동작 줄이기면 그대로)
const TILT = 12; // 최대 기울기(도)
const TiltPhoto = () => {
  const ref = useRef(null);
  const canTilt = typeof window !== "undefined"
    && window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg)`;
  };
  const handleLeave = () => { ref.current.style.transform = ""; };

  return (
    <div className={styles.photoWrap} data-reveal>
      <div
        ref={ref}
        className={styles.photo}
        onPointerMove={canTilt ? handleMove : undefined}
        onPointerLeave={canTilt ? handleLeave : undefined}
      >
        {PHOTO_SRC ? (
          <img src={PHOTO_SRC} alt={`${PROFILE.name} 사진`} />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">{PROFILE.logo}</span>
        )}
      </div>
    </div>
  );
};

export default TiltPhoto;
