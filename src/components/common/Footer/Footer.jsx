// 푸터 = 연락처 (헤더의 Contact 메뉴가 여기로 스크롤)
// 위: 왼쪽 인사말 / 오른쪽 연락처(이메일 · 전화 + 복사 버튼 · GitHub)
// 전화번호는 tel: 링크 — 휴대폰에서 누르면 바로 전화 앱 (PC에서는 글자 + 복사)
// 메일 앱이 없는 PC가 많아 mailto 링크 · "이메일 보내기" 버튼은 쓰지 않음 — 주소는 글자 + 복사
// 아래: 저작권 · 만든 도구 / 맨 위로
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PATHS, SECTION_IDS } from "@/routes/paths";
import { PROFILE } from "@/data/profile";
import { FOOTER_TEXT } from "@/data/site";
import styles from "./Footer.module.scss";
import { jumpToTop, scrollToY } from "@/utils/scrollToY";

const COPIED_MS = 2000; // "복사됨" 표시 시간

const githubLabel = PROFILE.github.replace(/^https?:\/\//, "");

const Footer = () => {
  const [copied, setCopied] = useState(""); // 방금 복사한 항목 ("email" | "phone")

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(""), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      // 복사가 막힌 환경 — 글자는 그대로 보이므로 무시
    }
  };

  // 맨 위로 — Home은 스크롤 없이 바로 Hero로(로고와 같음), 작품 상세는 그 페이지 맨 위로
  const { pathname } = useLocation();
  const handleToTop = () => (pathname === PATHS.home ? jumpToTop() : scrollToY(0));

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
                  <button type="button" className={styles.copy} onClick={() => handleCopy("email", PROFILE.email)}>
                    {copied === "email" ? FOOTER_TEXT.copied : FOOTER_TEXT.copy}
                  </button>
                </dd>
              </div>
              {PROFILE.phone && (
                <div className={styles.row}>
                  <dt>{FOOTER_TEXT.phoneLabel}</dt>
                  <dd>
                    <a href={`tel:${PROFILE.phone.replace(/\D/g, "")}`} className={styles.value}>{PROFILE.phone}</a>
                    <button type="button" className={styles.copy} onClick={() => handleCopy("phone", PROFILE.phone)}>
                      {copied === "phone" ? FOOTER_TEXT.copied : FOOTER_TEXT.copy}
                    </button>
                  </dd>
                </div>
              )}

              {PROFILE.resume && (
                <div className={styles.row}>
                  <dt>{FOOTER_TEXT.resumeLabel}</dt>
                  <dd>
                    <a href={`/docs/${PROFILE.resume}`} download className={styles.value}>{FOOTER_TEXT.resumeLink} ↓</a>
                  </dd>
                </div>
              )}
              <div className={styles.row}>
                <dt>{FOOTER_TEXT.githubLabel}</dt>
                <dd>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer" className={styles.value}>{githubLabel} ↗</a>
                </dd>
              </div>
            </dl>
            <span className={styles.srOnly} aria-live="polite">{copied ? FOOTER_TEXT.copied : ""}</span>
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
