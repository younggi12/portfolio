// 푸터 = 연락처 (헤더의 Contact 메뉴가 여기로 스크롤)
// 위: 왼쪽 인사말 / 오른쪽 연락처(이메일 + 복사 버튼 · GitHub)
// 메일 앱이 없는 PC가 많아 mailto 링크 · "이메일 보내기" 버튼은 쓰지 않음 — 주소는 글자 + 복사
// 아래: 저작권 · 만든 도구 / 맨 위로
import { useEffect, useState } from "react";
import { SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { FOOTER_TEXT } from "@/data/site";
import styles from "./Footer.module.scss";
import { scrollToY } from "@/utils/scrollToY";

const COPIED_MS = 2000; // "복사됨" 표시 시간

const githubLabel = PROFILE.github.replace(/^https?:\/\//, "");

const Footer = () => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timer = setTimeout(() => setIsCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setIsCopied(true);
    } catch {
      // 복사가 막힌 환경 — 이메일 글자는 그대로 보이므로 무시
    }
  };

  const handleToTop = () => scrollToY(0);

  return (
    <footer id={SECTION_IDS.contact} className={styles.footer} data-header-theme="light">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <h2 className={styles.title}>{FOOTER_TEXT.title}</h2>
            <p className={styles.message}>{FOOTER_TEXT.message}</p>
            <p className={styles.subMessage}>{FOOTER_TEXT.subMessage}</p>
          </div>

          <div className={styles.contact}>
            <dl className={styles.list}>
              <div className={styles.row}>
                <dt>{FOOTER_TEXT.emailLabel}</dt>
                <dd>
                  <span className={styles.value}>{PROFILE.email}</span>
                  <button type="button" className={styles.copy} onClick={handleCopy}>
                    {isCopied ? FOOTER_TEXT.copied : FOOTER_TEXT.copy}
                  </button>
                  <span className={styles.srOnly} aria-live="polite">{isCopied ? FOOTER_TEXT.copied : ""}</span>
                </dd>
              </div>
              <div className={styles.row}>
                <dt>{FOOTER_TEXT.githubLabel}</dt>
                <dd>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer" className={styles.value}>{githubLabel} ↗</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 {PROFILE.nameEn} · {FOOTER_TEXT.madeWith}</p>
          <button type="button" className={styles.toTop} onClick={handleToTop}>{FOOTER_TEXT.toTop} ↑</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
