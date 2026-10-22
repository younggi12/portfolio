// EmailJS — 푸터 이메일을 누르면 뜨는 "메일 보내기" 창이 쓰는 값 (emailjs.com 대시보드에서 복사)
// - 이 세 값은 원래 화면(브라우저) 코드에 넣도록 만든 공개용 값 — OpenAI 키처럼 숨길 필요 없음
// - 비어 있으면 창에서 보내기 대신 "주소 복사" 안내가 나옴
// - EmailJS 템플릿 본문에는 {{name}} · {{email}} · {{message}} 를 넣고, Reply To는 {{email}}로
export const EMAILJS = {
  serviceId: "service_0fc5o0v",  // Email Services → 서비스 ID (예: service_xxxxxxx)
  templateId: "template_hmi84b8", // Email Templates → 템플릿 ID (예: template_xxxxxxx)
  publicKey: "5xJ6922tWzb4bNVn8",  // Account → General → Public Key
};
