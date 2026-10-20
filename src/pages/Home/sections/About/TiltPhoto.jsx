// ② 사진 카드 — 마우스를 따라 살짝 기울어지고, 올릴 때마다 뒤집히며 다른 사진
import { useRef, useState } from "react";
import { PROFILE } from "@/data/profile";
import styles from "./About.module.scss";

const toSrc = (file) => `${import.meta.env.BASE_URL}images/${file}`;
const PHOTOS = PROFILE.photo ? [PROFILE.photo, ...(PROFILE.hoverPhotos ?? [])].map(toSrc) : [];
const TILT = 12; // 최대 기울기(도)

const TiltPhoto = () => {
  const ref = useRef(null);
  // turn: 뒤집힌 횟수 (짝수 = 앞면, 홀수 = 뒷면이 보임) / faces: 앞 · 뒤 면에 걸린 사진 번호
  const [turn, setTurn] = useState(0);
  const [faces, setFaces] = useState([0, 1]);
  const canFlip = PHOTOS.length > 1;
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

  // 뒤집기 — 뒤에 미리 걸어 둔 다음 사진이 앞으로
  const flip = () => { if (canFlip) setTurn((t) => t + 1); };
  // 다 뒤집힌 뒤, 안 보이게 된 면에 그다음 사진을 걸어 둠 (도는 중에 바꾸면 깜빡임)
  const handleFlipped = (e) => {
    if (e.target !== e.currentTarget) return;
    const hidden = (turn + 1) % 2;
    setFaces((f) => { const next = [...f]; next[hidden] = (turn + 1) % PHOTOS.length; return next; });
  };
  // 동작 줄이기면 transition이 없어 transitionend가 안 옴 → 바로 걸어 둠
  const handleEnter = () => {
    flip();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = turn + 1;
      setFaces((f) => { const next = [...f]; next[(t + 1) % 2] = (t + 1) % PHOTOS.length; return next; });
    }
  };

  return (
    <div className={styles.photoWrap} data-reveal>
      <div
        ref={ref}
        className={styles.photo}
        onPointerEnter={canTilt ? handleEnter : undefined}
        onPointerMove={canTilt ? handleMove : undefined}
        onPointerLeave={canTilt ? handleLeave : undefined}
        onClick={!canTilt ? handleEnter : undefined} // 터치 기기는 누르면 뒤집힘
      >
        {PHOTOS.length > 0 ? (
          <div className={styles.flipper} style={{ transform: `rotateY(${turn * 180}deg)` }} onTransitionEnd={handleFlipped}>
            {faces.map((idx, i) => (
              <div key={i} className={styles.face} aria-hidden={turn % 2 !== i}>
                <img src={PHOTOS[idx]} alt={turn % 2 === i ? `${PROFILE.name} 사진` : ""} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.flipper}>
            <div className={styles.face}>
              <span className={styles.placeholder} aria-hidden="true">{PROFILE.logo}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiltPhoto;
