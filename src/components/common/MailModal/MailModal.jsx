// 메일 보내기 창 — 푸터 이메일 주소를 누르면 열림
// 이름 · 답장 받을 이메일 · 내용 → EmailJS로 oosc76@naver.com에 바로 전송 (메일 앱이 없어도 됨)
// - Esc · 배경 클릭 · 닫기 버튼으로 닫힘, 열려 있는 동안 뒤 페이지 스크롤 잠금, 닫히면 누른 곳으로 포커스 복귀
// - EmailJS 값이 비어 있으면(data/emailjs.js) 보내기 대신 주소 복사 안내
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import { EMAILJS } from "@/data/emailjs";
import { PROFILE } from "@/data/profile";
import { MAIL_TEXT } from "@/data/site";
import styles from "./MailModal.module.scss";

const isReady = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);

const MailModal = ({ onClose }) => {
  const nameRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const closeRef = useRef(onClose); // 부모가 다시 그려져도 아래 열기 · 닫기 처리가 다시 돌지 않게
  closeRef.current = onClose;

  // 열릴 때: 첫 입력칸에 포커스 + 뒤 스크롤 잠금 / 닫힐 때: 원래대로
  useEffect(() => {
    const opener = document.activeElement;
    nameRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, []);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady || status === "sending") return;
    setStatus("sending");
    try {
      // 템플릿 변수: {{name}} · {{email}} · {{message}} + 보낸 시각 {{time}}
      const time = new Date().toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { ...form, time }, { publicKey: EMAILJS.publicKey });
      setStatus("sent");
    } catch (err) {
      console.error("[mail]", err); // 원인 확인용 (EmailJS 응답 코드 · 문구)
      setStatus("error");
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mail-title"
        onClick={(e) => e.stopPropagation()}
        data-chat // 사이트 부드러운 스크롤이 이 창 안의 휠을 건드리지 않게 (챗봇 창과 같은 표시)
      >
        <div className={styles.head}>
          <h2 id="mail-title" className={`${styles.title} ${status === "sent" ? styles.srOnly : ""}`}>{MAIL_TEXT.title}</h2>
          {/* 성공 화면에는 아래 "닫기" 버튼이 있어 위 × 는 숨김 */}
          {status !== "sent" && (
            <button type="button" className={styles.close} onClick={onClose} aria-label={MAIL_TEXT.close}>×</button>
          )}
        </div>
        {status !== "sent" && <p className={styles.to}>{MAIL_TEXT.to} <b>{PROFILE.email}</b></p>}

        {status === "sent" ? (
          // 성공 — 가운데 원 안에 체크가 그려지고, 이름 · 답장 주소를 넣은 안내
          <div className={styles.done} role="status">
            <svg className={styles.doneIcon} viewBox="0 0 64 64" width="84" height="84" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" pathLength="1" />
              <path d="M20 33l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
            </svg>
            <p className={styles.doneTitle}>{MAIL_TEXT.sentTitle}</p>
            <p className={styles.doneText}>
              {MAIL_TEXT.sentThanks(form.name)}<br />
              {MAIL_TEXT.sentReply} <b>{form.email}</b>{MAIL_TEXT.sentReplyEnd}
            </p>
            <button type="button" className={styles.submit} onClick={onClose}>{MAIL_TEXT.close}</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              <span>{MAIL_TEXT.name}</span>
              <input ref={nameRef} type="text" value={form.name} onChange={update("name")} maxLength={40} required autoComplete="name" />
            </label>
            <label>
              <span>{MAIL_TEXT.email}</span>
              <input type="email" value={form.email} onChange={update("email")} maxLength={100} required autoComplete="email" placeholder={MAIL_TEXT.emailHint} />
            </label>
            <label>
              <span>{MAIL_TEXT.message}</span>
              <textarea value={form.message} onChange={update("message")} rows={6} maxLength={2000} required />
            </label>

            {!isReady && <p className={styles.note}>{MAIL_TEXT.notReady}</p>}
            {status === "error" && <p className={styles.error} role="alert">{MAIL_TEXT.error}</p>}

            <button type="submit" className={styles.submit} disabled={!isReady || status === "sending"}>
              {status === "sending" ? MAIL_TEXT.sending : MAIL_TEXT.send}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default MailModal;