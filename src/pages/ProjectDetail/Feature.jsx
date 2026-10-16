import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { LIGHTBOX_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import Lightbox from "@/components/common/Lightbox/Lightbox";
import { pad } from "./detailText";
import styles from "./ProjectDetail.module.scss";

// 기능 카드: 큰 화면 1개 + 아래 작은 칸들 (누르면 큰 화면이 바뀜)
// 화면으로 보여주기 어려운 기능은 실제 코드 일부(code)를 함께 보여줌 — 사진 뒤 마지막 칸 "</>"
const CODE = "__code__";

// 사진이 2:1에 가까우면 칸을 꽉 채우고(잘림 없음), 세로로 긴 사진(F1 방명록 등)은 잘리지 않게 전체를 보여줌
const handleFit = (e) => {
  const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
  e.currentTarget.dataset.fit = w / h < 1.9 ? "contain" : "cover";
};

// 마우스 위치(사진 안 %) → 확대 기준점
const handleZoomMove = (e) => {
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--zoom-x", `${((e.clientX - box.left) / box.width) * 100}%`);
  e.currentTarget.style.setProperty("--zoom-y", `${((e.clientY - box.top) / box.height) * 100}%`);
};

const Feature = ({ feature }) => {
  const [current, setCurrent] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // 사진 크게 보기
  const { title, text, images = [], code } = feature;
  const items = code ? [...images, CODE] : images;
  const active = items[current];
  const imageUrls = images.map(getProjectImage);

  return (
    <div className={styles.feature} data-reveal>
      <p className={styles.featureText}>{text}</p>
      {active === CODE ? (
        <figure className={styles.code}>
          <figcaption className={styles.codeFile}>{code.file}</figcaption>
          <pre><code>{code.snippet}</code></pre>
        </figure>
      ) : (
        active && (
          // 큰 사진을 누르면 화면 가득 크게 보기
          // 마우스를 올리면 마우스가 있는 곳을 확대해서 보여줌 (위치만 CSS 변수로 넘김)
          <button
            type="button"
            className={styles.zoom}
            onClick={() => setIsZoomed(true)}
            onMouseMove={handleZoomMove}
            aria-label={`${title} ${LIGHTBOX_TEXT.open}`}
          >
            <img
              src={getProjectImage(active)}
              alt={`${title} 화면`}
              className={styles.featureMain}
              loading="lazy"
              onLoad={handleFit}
            />
            <span className={styles.zoomIcon} aria-hidden="true"><Maximize2 size={16} strokeWidth={2} /></span>
          </button>
        )
      )}
      {isZoomed && (
        <Lightbox images={imageUrls} index={current} title={title} onChange={setCurrent} onClose={() => setIsZoomed(false)} />
      )}
      {items.length > 1 && (
        <p className={styles.counter} aria-live="polite">
          <strong>{pad(current + 1)}</strong> / {pad(items.length)}
        </p>
      )}
      {/* 칸이 1개여도 작은 칸 줄을 둬서 세 카드의 제목 줄을 맞춤 */}
      {items.length > 0 && (
        <div className={styles.thumbs}>
          {items.map((item, i) => (
            <button
              key={item}
              type="button"
              className={`${styles.thumb} ${item === CODE ? styles.thumbCode : ""} ${i === current ? styles.thumbActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={item === CODE ? `${title} 코드` : `${title} 화면 ${i + 1}`}
            >
              {item === CODE ? <span>{"</>"}</span> : <img src={getProjectImage(item)} alt="" loading="lazy" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feature;
