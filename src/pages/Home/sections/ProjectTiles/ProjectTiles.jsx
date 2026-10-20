// 작품 소개 — 한 화면에 작품 하나 (Hero · About과 같은 결: 흰 바탕 · 큰 검은 글자 · 번호 · 선)
// 화면이 멈추고 큰 그룹 제목(TEAM · SOLO) 띠 → 스크롤하면 [왼쪽 화면 끝까지 큰 사진 | 오른쪽 번호 · 큰 이름 · 선 목록 · 글자 버튼]이 하나씩 바뀜
// 글 뒤에 큰 윤곽 번호(01~06), 오른쪽 번호 목록(지금 작품만 진하게), 화면 맨 아래 진행 막대
// isMore: true인 작품은 처음엔 숨기고 "더보기"로 펼침 (대표 작품이 먼저 보이게 앞으로 정렬)
// PC · 태블릿: 큰 썸네일 아래에 설명(왼쪽 이름 · 부제 / 오른쪽 담당 · 버튼) / 휴대폰: 썸네일 + 설명 목록
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getProjectsByType } from "@/data/projects";
import { PROJECT_GROUP_WORD, SECTION_TITLES, UI_TEXT, DETAIL_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import { getStackIcon } from "@/utils/skillIcons";
import { scrollToY } from "@/utils/scrollToY";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import styles from "./ProjectTiles.module.scss";

const FILL_START = 0.5; // 큰 그룹 제목(TEAM · SOLO)이 처음부터 채워져 있는 정도

// 팀 프로젝트 → 개인 프로젝트 순서 (카드 크기는 모두 같음)

const GROUPS = [
  { type: "team", title: SECTION_TITLES.team },
  { type: "solo", title: SECTION_TITLES.solo },
];
// 전체 작품 순서(팀 → 개인) — "01 / 06" 번호 · 큰 윤곽 번호 · 진행 막대에 씀
const ALL_PROJECTS = GROUPS.flatMap((g) => getProjectsByType(g.type));

// "JAJAK — 전통주 AI 큐레이션 쇼핑몰" → 제목 / 부제
const splitName = (name) => {
  const [title, subtitle = ""] = name.split(" — ");
  return { title, subtitle };
};

const StackChip = ({ item }) => (
  <li>
    <SkillIcon name={getStackIcon(item)} />
    {item}
  </li>
);

// 기술 태그 — 한 줄에 다 들어가면 전부, 넘치면 들어가는 만큼 + "+N"
// 숨겨진 측정용 줄에 전부 그려서 너비를 재고, 카드 크기가 바뀌면 다시 계산
const StackLine = ({ stack }) => {
  const lineRef = useRef(null);
  const measureRef = useRef(null);
  const [count, setCount] = useState(stack.length);

  useLayoutEffect(() => {
    const line = lineRef.current;
    const measure = measureRef.current;
    if (!line || !measure) return undefined;

    const fit = () => {
      const chips = [...measure.children];
      const plus = chips.pop(); // 마지막은 "+N" 칩 너비 측정용
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      const max = line.clientWidth;
      const widths = chips.map((c) => c.offsetWidth);
      const total = widths.reduce((a, w) => a + w, 0) + gap * (widths.length - 1);
      if (total <= max) return setCount(stack.length);
      let used = plus.offsetWidth;
      let n = 0;
      while (n < widths.length && used + gap + widths[n] <= max) {
        used += gap + widths[n];
        n += 1;
      }
      setCount(Math.max(1, n));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(line);
    return () => observer.disconnect();
  }, [stack]);

  const hidden = stack.length - count;
  return (
    <>
      <ul ref={lineRef} className={styles.stack}>
        {stack.slice(0, count).map((item) => <StackChip key={item} item={item} />)}
        {hidden > 0 && <li>+{hidden}</li>}
      </ul>
      <ul ref={measureRef} className={`${styles.stack} ${styles.measure}`} aria-hidden="true">
        {stack.map((item) => <StackChip key={item} item={item} />)}
        <li>+{stack.length}</li>
      </ul>
    </>
  );
};


// 스크롤 연출 — 애플 제품 페이지 방식 (PC · 태블릿): 한 화면에 작품 하나
// 그룹마다 화면 하나(stage)가 멈춰 있고(sticky), 스크롤하는 만큼 장면이 바뀜
// 1) 그룹 제목(TEAM · SOLO): 화면 끝까지 흐르는 띠 — 흰 배경이 꽉 찬 뒤 윤곽선 글자로 서서히 등장 → 스크롤하는 만큼 왼쪽부터 검정으로 채워짐
// 2) 작품: 큰 썸네일 + 설명이 한 세트로 화면 가운데 — 앞 장면이 위로 살짝 빠지며 흐려진 뒤, 아래에서 서서히 들어와 머묾
// 휴대폰 · "동작 줄이기" 사용자는 멈춤 없이 보통 목록 (제목은 화면에 들어오면 등장)
const HEAD_START = 0.35; // 섹션 윗변이 화면 위에서 이만큼(화면 높이 배수) 올라왔을 때 제목이 나타나기 시작
const HEAD_IN = 0.3;    // 제목이 서서히 나타나는 스크롤 (화면 높이 배수)
const HEAD_HOLD = 0.45; // 제목만 보이는 스크롤 — 이 동안 윤곽선 글자가 왼쪽부터 검정으로 채워짐
const CHANGE = 0.6;     // 장면이 바뀌는 데(나가고 · 들어오는) 걸리는 스크롤 — 클수록 천천히 바뀜
const HOLD = 0.7;       // 작품 하나가 가만히 보이는 스크롤
const MARQUEE_REPEAT = 4; // 흐르는 띠에 단어를 몇 번 이어 쓸지 (끊김 없이 돌도록 두 벌)
const SHIFT = 60;       // 들어올 때 아래에서 · 나갈 때 위로 움직이는 거리(px)
const SMOOTH = 0.15;    // 스크롤을 따라가는 부드러움 (작을수록 더 미끄러지듯 따라옴)

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (v) => v * v * (3 - 2 * v); // 시작 · 끝을 부드럽게

const clearStyles = (el, props) => props.forEach((prop) => el?.style.removeProperty(prop));

const useProjectScroll = (sectionRef) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    let layout = []; // 그룹별 { group, head, tiles, starts, change, hold }

    const isPinned = () => wide.matches && !reduce.matches;

    // 그룹 높이 · 장면 시작 위치 계산 (처음 · 화면 크기 바뀔 때)
    const measure = () => {
      const pinned = isPinned();
      section.classList.toggle(styles.pinned, pinned);
      const vh = window.innerHeight;
      layout = [...section.querySelectorAll(`.${styles.group}`)].map((group) => {
        const head = group.querySelector(`.${styles.groupHead}`);
        const tiles = [...group.querySelectorAll(`.${styles.tile}`)];
        if (!pinned) {
          group.style.removeProperty("height");
          tiles.forEach((t) => {
            clearStyles(t, ["transform", "opacity", "visibility"]);
            clearStyles(t.querySelector(`.${styles.card}`), ["clip-path"]);
          });
          clearStyles(head, ["transform", "opacity"]);
          [...head.children].forEach((el) => clearStyles(el, ["transform", "opacity", "--fill"]));
          return { group, head, tiles, pinned };
        }
        const change = vh * CHANGE;
        const hold = vh * HOLD;
        // 작품 i가 들어오기 시작하는 지점 — 제목(나타남 + 머묾) 뒤로, 한 작품마다 바뀜 + 머묾
        const headEnd = vh * (HEAD_IN + HEAD_HOLD);
        const starts = tiles.map((_, i) => headEnd + i * (change + hold));
        const end = starts[starts.length - 1] + change + hold; // 마지막 작품이 머문 뒤 화면이 풀림
        group.style.height = `${Math.ceil(vh + end)}px`;
        const prev = layout.find((g) => g.group === group);
        return { group, head, tiles, starts, change, hold, headEnd, pinned, smooth: prev?.smooth ?? null };
      });
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      let moving = false;
      layout.forEach((item) => {
        const { group, head, tiles, starts, change, hold, headEnd, pinned } = item;
        const top = group.getBoundingClientRect().top;
        if (!pinned) {
          if (head.getBoundingClientRect().top < vh * 0.8) head.classList.add(styles.headShown);
          return;
        }
        const target = Math.max(0, -top); // 멈춘 화면 안에서 스크롤한 거리
        // 스크롤 값을 바로 쓰지 않고 조금씩 따라감 → 휠을 끊어 굴려도 미끄러지듯 부드럽게
        if (item.smooth === null || Math.abs(target - item.smooth) > vh * 2) item.smooth = target;
        item.smooth += (target - item.smooth) * SMOOTH;
        if (Math.abs(target - item.smooth) < 0.5) item.smooth = target;
        else moving = true;
        const p = item.smooth;

        // 제목: 흰 배경이 화면 대부분을 덮을 즈음(위에서 35%) 나타나기 시작 → 화면에 붙고 조금 더 스크롤하면 다 나옴
        //       (원래는 화면에 붙은 뒤에야 시작해서 빈 흰 화면이 길었고, 너무 일찍 나오면 앞 섹션과 겹쳐 짧게 느껴져서 중간으로)
        const hIn = clamp01((vh * HEAD_START - top) / (vh * (HEAD_START + HEAD_IN)));
        const hOut = smoothstep(clamp01((p - headEnd) / (change * 0.5)));
        // 처음부터 왼쪽 절반은 검정, 스크롤하는 만큼 나머지가 채워짐
        const fill = FILL_START + (1 - FILL_START) * smoothstep(clamp01((p - vh * HEAD_IN) / (vh * HEAD_HOLD * 0.85)));
        [...head.children].forEach((el) => {
          el.style.opacity = hIn.toFixed(3);
          el.style.transform = `translateY(${((1 - hIn) * 40).toFixed(1)}px)`;
          el.style.setProperty("--fill", fill.toFixed(3));
        });
        head.style.opacity = (1 - hOut).toFixed(3);
        head.style.transform = `translateY(${(-hOut * SHIFT).toFixed(1)}px) scale(${(1 - hOut * 0.04).toFixed(4)})`;

        // 작품: 들어옴(아래 → 제자리, 흐림 → 선명) → 머묾 → 나감(제자리 → 위, 선명 → 흐림, 다음 작품과 겹쳐서)
        tiles.forEach((tile, i) => {
          // 바뀌는 구간의 앞 절반에 앞 장면이 빠지고, 뒤 절반에 새 장면이 들어옴 (두 장면이 겹쳐 보이지 않게)
          // 사진 · 글이 한꺼번에 짧게 나타남 (아래에서 열리듯 나눠 나오지 않게)
          const enter = smoothstep(clamp01((p - starts[i] - change * 0.5) / (change * 0.25)));
          const isLast = i === tiles.length - 1;
          const leave = isLast ? 0 : smoothstep(clamp01((p - starts[i] - change - hold) / (change * 0.5)));
          const opacity = Math.min(enter, 1 - leave);
          const y = (1 - enter) * SHIFT - leave * SHIFT;
          const scale = 1 - (1 - enter) * 0.03 - leave * 0.03;
          tile.style.opacity = opacity.toFixed(3);
          tile.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
          tile.style.visibility = opacity < 0.05 ? "hidden" : "visible"; // 안 보이는 작품은 클릭 · Tab 안 되게
        });
      });
      updateNav();
      if (moving) request(); // 다 따라갈 때까지 계속
    };

    // 오른쪽 점 메뉴: 작품 소개 화면 안에서만 보이고, 지금 보고 있는 작품 점을 채움
    const nav = section.querySelector(`.${styles.dots}`);
    const bar = section.querySelector(`.${styles.progress}`);
    const dots = nav ? [...nav.querySelectorAll("button[data-group]")] : [];
    const updateNav = () => {
      if (!nav) return;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const inView = layout.some((g) => g.pinned) && rect.top <= 1 && rect.bottom >= vh;
      nav.classList.toggle(styles.dotsShown, inView);
      bar?.classList.toggle(styles.progressShown, inView);
      let active = null;
      layout.forEach((item, g) => {
        if (!item.pinned) return;
        const top = item.group.getBoundingClientRect().top;
        if (top > 1 || top + item.group.offsetHeight < vh) return; // 이 그룹 화면이 아님
        const p = Math.max(0, -top);
        item.starts.forEach((start, i) => { if (p >= start + item.change * 0.45) active = `${g}-${i}`; });
        if (active === null) active = `${g}-0`; // 제목 화면에서는 그 그룹 첫 작품
      });
      // 진행 막대 — 지금 작품이 전체 몇 번째인지 (팀 2개 다음 개인)
      if (bar && active !== null) {
        const n = dots.findIndex((dot) => `${dot.dataset.group}-${dot.dataset.index}` === active);
        bar.style.setProperty("--progress", ((n + 1) / dots.length).toFixed(3));
      }
      dots.forEach((dot) => {
        const on = `${dot.dataset.group}-${dot.dataset.index}` === active;
        dot.classList.toggle(styles.dotActive, on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    // 점을 누르면 그 작품이 가만히 보이는 위치로, TEAM · SOLO 글자를 누르면 큰 띠가 다 채워진 위치로 스크롤
    const onDotClick = (e) => {
      const label = e.target.closest?.("button[data-head]");
      const head = label && layout[Number(label.dataset.head)];
      if (head?.pinned) {
        const groupTop = head.group.getBoundingClientRect().top + window.scrollY;
        scrollToY(groupTop + head.headEnd);
        return;
      }
      const dot = e.target.closest?.("button[data-group]");
      const item = dot && layout[Number(dot.dataset.group)];
      if (!item?.pinned) return;
      const i = Number(dot.dataset.index);
      const progress = item.starts[i] + item.change + item.hold / 2;
      const groupTop = item.group.getBoundingClientRect().top + window.scrollY;
      scrollToY(groupTop + progress);
    };

    // Tab으로 작품 버튼에 들어오면 그 작품이 다 보이는 위치로 스크롤
    const onFocus = (e) => {
      if (e.target.closest?.(`.${styles.dots}`)) return; // 점 메뉴는 제외
      const tile = e.target.closest?.(`.${styles.tile}`);
      const item = tile && layout.find((g) => g.pinned && g.tiles.includes(tile));
      if (!item) return;
      const i = item.tiles.indexOf(tile);
      const progress = item.starts[i] + item.change + item.hold / 2; // 머무는 구간 가운데
      const groupTop = item.group.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: groupTop + progress, behavior: "instant" });
      item.smooth = progress;
    };

    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    const relayout = () => { measure(); update(); };
    relayout();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", relayout);
    wide.addEventListener("change", relayout);
    reduce.addEventListener("change", relayout);
    section.addEventListener("focusin", onFocus);
    nav?.addEventListener("click", onDotClick);
    return () => {
      nav?.removeEventListener("click", onDotClick);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", relayout);
      wide.removeEventListener("change", relayout);
      reduce.removeEventListener("change", relayout);
      section.removeEventListener("focusin", onFocus);
    };
  }, [sectionRef]);
};

const Tile = ({ project }) => {
  const { projectId, name, roleShort, summary, teamSize, type, stack, thumbnail, scrollShot, previewVideo, headerColor, headerTone, headerText, headerGlow, links, docs, hasDetail } = project;
  const { title, subtitle } = splitName(name);
  const no = ALL_PROJECTS.indexOf(project) + 1; // 전체 순서 (01 ~ 06)
  // 버튼 2개: 상세 페이지가 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  const [first, second] = links;
  const primary = hasDetail ? { label: UI_TEXT.viewDetail, to: toProjectDetail(projectId) } : first;
  const secondary = hasDetail ? first : second;

  // 시연 영상 — 올리면 처음부터 재생, 떼면 멈춤 (동작 줄이기 · 마우스 없는 기기는 CSS로 숨김)
  const videoHandlers = previewVideo ? {
    onPointerEnter: (e) => {
      const video = e.currentTarget.querySelector("video");
      if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      video.currentTime = 0;
      video.play().catch(() => {}); // 자동 재생이 막혀도 사진은 그대로
    },
    onPointerLeave: (e) => e.currentTarget.querySelector("video")?.pause(),
  } : {};

  // 사진: 마우스를 올리면 아래에서 기술 태그 패널이 올라옴 · 커서 원 안이 흑백(data-cursor-lens) · 누르면 상세 페이지
  const media = (
    <>
      <img src={getProjectImage(thumbnail)} alt={`${title} 화면`} className={styles.image} loading="lazy" />
      {/* 한 화면짜리 작품 — 마우스를 올리면 짧은 시연 영상 재생, 떼면 멈추고 처음으로 (소리 없음) */}
      {previewVideo && (
        <video
          className={styles.previewVideo}
          src={`${import.meta.env.BASE_URL}videos/${previewVideo}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
      {/* 사이트 전체 캡처 — 마우스를 올리면 나타나 위에서 아래로 천천히 스크롤 (길수록 오래) */}
      {scrollShot && (
        <img
          src={getProjectImage(scrollShot)}
          alt=""
          className={styles.scrollShot}
          loading="lazy"
          onLoad={(e) => {
            const img = e.currentTarget;
            const seconds = Math.min(10, Math.max(4, img.naturalHeight / img.naturalWidth * 1.8));
            img.style.setProperty("--scroll-time", `${seconds.toFixed(1)}s`);
          }}
        />
      )}
      {/* 패널 색 = 그 작품 사이트의 헤더 색 (어두우면 흰 글자) */}
      <div
        className={[
          styles.panel,
          headerTone === "dark" && styles.panelDark,
          // 흰색 · 검정 계열이 아닌 색 글자(F1 빨강) → 칩 배경을 더 어둡게
          headerTone === "dark" && headerText && headerText.toLowerCase() !== "#ffffff" && styles.panelAccent,
        ].filter(Boolean).join(" ")}
        style={{
          ...(headerColor && { "--panel-bg": headerColor }),
          ...(headerText && { "--panel-text": headerText }), // 그 사이트 헤더 글자색
          ...(headerGlow && { "--panel-glow": headerGlow }), // 글자 빛 번짐(벽돌깨기 제목의 cyan)
        }}
        aria-hidden="true"
      >
        <StackLine stack={stack} />
      </div>
    </>
  );

  return (
    <article className={styles.tile}>
      {/* 글 뒤 큰 윤곽 번호 (장식) */}
      <span className={styles.bigNo} aria-hidden="true">{String(no).padStart(2, "0")}</span>
      {/* 썸네일 — PC에선 화면 왼쪽 끝까지 */}
      <div className={styles.card} data-reveal>
        {hasDetail ? (
          // 사진 링크는 마우스용 — 키보드(Tab) · 화면 읽기에서는 건너뜀 ("자세히 보기" 버튼과 같은 곳이라 두 번 거치지 않게)
          <Link to={toProjectDetail(projectId)} className={styles.media} tabIndex={-1} aria-hidden="true" data-cursor-lens {...videoHandlers}>
            {media}
          </Link>
        ) : (
          <div className={styles.media} data-cursor-lens {...videoHandlers}>{media}</div>
        )}
      </div>
      {/* 글: 번호 · 구분 → 큰 이름 → 부제 → 한 줄 소개 → 선 목록(담당 · 스택) → 글자 버튼 */}
      <div className={styles.text} data-reveal>
        <p className={styles.meta}>
          {[UI_TEXT.projectCount(no, ALL_PROJECTS.length), type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo].join("   ·   ")}
        </p>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {summary && <p className={styles.summary}>{summary}</p>}
        <dl className={styles.facts}>
          {roleShort && (
            <div>
              <dt>{UI_TEXT.myRole}</dt>
              <dd>{roleShort}</dd>
            </div>
          )}
          <div>
            <dt>{UI_TEXT.stackLabel}</dt>
            {/* 기술 — 아이콘 + 이름 (About · 상세 페이지와 같은 아이콘) */}
            <dd className={styles.stackIcons}>
              {stack.map((item) => (
                <span key={item}><SkillIcon name={getStackIcon(item)} />{item}</span>
              ))}
            </dd>
          </div>
        </dl>
        <div className={styles.actions}>
          {primary?.to && <Link to={primary.to} className={styles.primary}>{primary.label} <b aria-hidden="true">→</b></Link>}
          {primary?.href && <a href={primary.href} target="_blank" rel="noreferrer" className={styles.primary}>{primary.label} <b aria-hidden="true">↗</b></a>}
          {secondary && <a href={secondary.href} target="_blank" rel="noreferrer" className={styles.secondary}>{secondary.label} ↗</a>}
        </div>
        {/* 팀 기획 문서 — 누르면 PDF 내려받기 (상세 페이지와 같은 파일) */}
        {docs?.length > 0 && (
          <div className={styles.docs}>
            <span className={styles.docsTitle}>{DETAIL_TEXT.docs}</span>
            {docs.map((doc) => (
              <a key={doc.file} href={`/docs/${doc.file}`} download className={styles.docLink}>
                {doc.label} <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

// 그룹 = 멈춰 있는 화면 + 큰 제목(TEAM · SOLO) + 한 화면에 하나씩 바뀌는 작품
const ProjectGroup = ({ type, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const projects = getProjectsByType(type);
  const main = projects.filter((p) => !p.isMore);
  const more = projects.filter((p) => p.isMore);
  const visible = isOpen ? [...main, ...more] : main;

  return (
    <div className={styles.group}>
      {/* stage = 멈춰 있는 화면 (PC · 태블릿) */}
      <div className={styles.stage}>
        <div className={styles.groupHead}>
          <h2 className={styles.groupTitle}>
            <span className={styles.srOnly}>{title}</span>
            {/* 흐르는 띠 — 윤곽선 줄 위에 검정 줄을 겹치고, 검정 줄을 왼쪽부터 드러냄(--fill) */}
            <span className={styles.marquee} aria-hidden="true">
              {["outline", "fill"].map((layer) => (
                <span key={layer} className={`${styles.marqueeLayer} ${layer === "fill" ? styles.marqueeFill : ""}`}>
                  <span className={styles.track}>
                    {Array.from({ length: MARQUEE_REPEAT * 2 }, (_, i) => <span key={i}>{PROJECT_GROUP_WORD[type]}</span>)}
                  </span>
                </span>
              ))}
            </span>
          </h2>
        </div>
        <div className={styles.cards}>
          {visible.map((project) => <Tile key={project.projectId} project={project} />)}
        </div>
      </div>
      {more.length > 0 && (
        <button type="button" className={styles.more} onClick={() => setIsOpen((v) => !v)} aria-expanded={isOpen}>
          {isOpen ? UI_TEXT.showLess : `${UI_TEXT.showMore} (${more.length})`}
        </button>
      )}
    </div>
  );
};


// 오른쪽에 고정된 번호 메뉴 — 번호 하나 = 작품 하나, 누르면 그 작품으로 이동 (PC · 태블릿, 작품 소개 화면 안에서만 보임)
const ProjectDots = () => (
  <nav className={styles.dots} aria-label={UI_TEXT.projectNav}>
    {GROUPS.map((group, g) => (
      <div key={group.type} className={styles.dotGroup}>
        {/* TEAM · SOLO 글자를 누르면 그 그룹 첫 화면(큰 TEAM · SOLO 띠)으로 */}
        <button type="button" className={styles.dotLabel} data-head={g} aria-label={group.title}>
          {PROJECT_GROUP_WORD[group.type]}
        </button>
        <ul>
          {getProjectsByType(group.type).filter((p) => !p.isMore).map((project, i) => {
            const { title } = splitName(project.name);
            return (
              <li key={project.projectId}>
                {/* 번호 — 지금 작품만 진하게 + 앞에 선, 마우스를 올리면 왼쪽에 작품 이름 */}
                <button type="button" className={styles.dot} data-group={g} data-index={i} aria-label={title}>
                  {String(ALL_PROJECTS.indexOf(project) + 1).padStart(2, "0")}
                  <span className={styles.dotName} aria-hidden="true">{title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);

const ProjectTiles = () => {
  const sectionRef = useRef(null);
  useProjectScroll(sectionRef);

  return (
    <section ref={sectionRef} id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={SECTION_TITLES.projects}>
      {GROUPS.map((group) => <ProjectGroup key={group.type} type={group.type} title={group.title} />)}
      <ProjectDots />
      {/* 화면 맨 아래 진행 막대 — 지금 몇 번째 작품인지 (작품 소개 화면 안에서만) */}
      <div className={styles.progress} aria-hidden="true" />
    </section>
  );
};

export default ProjectTiles;