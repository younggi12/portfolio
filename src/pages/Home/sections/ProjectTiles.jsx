// 작품 소개 — 무신사 기업 사이트 방식
// 화면이 멈추고(흰 배경이 꽉 차면) 상단에 그룹 제목 등장 → 스크롤하는 만큼 작품이 아래에서 위로 하나씩 지나감
// isMore: true인 작품은 처음엔 숨기고 "더보기"로 펼침 (대표 작품이 먼저 보이게 앞으로 정렬)
// 썸네일, 글(분류·이름·부제·담당·버튼)은 사진 반대쪽(사진 왼쪽 → 글 오른쪽, 사진 오른쪽 → 글 왼쪽)
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getProjectsByType } from "@/data/projects";
import { PROJECT_GROUP_TEXT, SECTION_TITLES, UI_TEXT } from "@/data/site";
import { getProjectImage } from "@/utils/getProjectImage";
import { getStackIcon } from "@/utils/skillIcons";
import SkillIcon from "@/components/common/SkillIcon/SkillIcon";
import styles from "./ProjectTiles.module.scss";

// 팀 프로젝트 → 개인 프로젝트 순서 (카드 크기는 모두 같음)

const GROUPS = [
  { type: "team", title: SECTION_TITLES.team },
  { type: "solo", title: SECTION_TITLES.solo },
];

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


// 스크롤 연출 — 무신사 기업 사이트 방식 (PC · 태블릿)
// 그룹마다 화면 하나(stage)가 멈춰 있고(sticky), 스크롤하는 만큼 작품이 아래에서 위로 하나씩 지나감
// 1) 그룹 제목(화면 가운데): 흰 배경이 꽉 찬 뒤 스크롤하는 만큼 서서히 등장 → 고정하지 않고 첫 작품과 함께 위로 지나감
// 2) 작품은 하나씩 — 아래에서 서서히 나타나며 올라와 제목 위를 지나 화면 위로 빠져나감 (사라지는 효과 없음)
// 휴대폰 · "동작 줄이기" 사용자는 멈춤 없이 보통 목록 (제목은 화면에 들어오면 등장)
const NEXT_AT = 0.85;    // 앞 작품이 이만큼(진행도) 올라가 화면 위로 거의 빠져나가면 다음 작품이 들어옴
const FADE_IN = 0.35;    // 진행도 0 → 0.35 동안 서서히 나타남 (아래에서 올라오며)
const SCALE_FROM = 0.95; // 나타날 때 크기 (다 나타나면 1)
const HEAD_IN = 0.3;     // 화면이 멈춘 뒤(흰 배경이 꽉 찬 뒤) 이만큼(화면 높이 배수) 스크롤하는 동안 제목이 서서히 나타남
const SCROLL_PER_MOVE = 1; // 작품이 1px 움직이는 데 필요한 스크롤(px) — 1 = 스크롤한 만큼 (사이트 다른 곳과 같은 속도)
const EASE = 0.4;        // 화면 가운데에서 느려지는 정도 (0 = 일정한 속도, 1 = 가운데서 거의 멈춤)
const SMOOTH = 0.15;     // 스크롤을 따라가는 부드러움 (작을수록 더 미끄러지듯 따라옴) — 페이지 스크롤 자체가 부드러워서(useSmoothScroll) 살짝만

// 0~1 진행도 → 들어올 때 빠르게, 가운데서 천천히, 나갈 때 다시 빠르게
const easeMiddle = (u) => u + (EASE * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (v) => v * v * (3 - 2 * v); // 시작 · 끝을 부드럽게

const useProjectScroll = (sectionRef) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    let layout = []; // 그룹별 [{ group, stage, head, tiles, starts, span, travel }]

    const isPinned = () => wide.matches && !reduce.matches;

    // 그룹 높이 · 작품 시작 위치 계산 (처음 · 화면 크기 바뀔 때)
    const measure = () => {
      const pinned = isPinned();
      section.classList.toggle(styles.pinned, pinned);
      const vh = window.innerHeight;
      layout = [...section.querySelectorAll(`.${styles.group}`)].map((group) => {
        const stage = group.querySelector(`.${styles.stage}`);
        const head = group.querySelector(`.${styles.groupHead}`);
        const tiles = [...group.querySelectorAll(`.${styles.tile}`)];
        if (!pinned) {
          group.style.removeProperty("height");
          tiles.forEach((t) => { t.style.removeProperty("transform"); t.style.removeProperty("opacity"); t.style.removeProperty("visibility"); });
          [...head.children].forEach((el) => { el.style.removeProperty("transform"); el.style.removeProperty("opacity"); });
          head.style.removeProperty("transform");
          return { group, head, tiles, pinned };
        }
        // 작품: 화면 아래(vh)에서 화면 위 밖(-작품 높이)까지 움직임
        const travel = vh + Math.max(...tiles.map((t) => t.offsetHeight));
        const span = travel * SCROLL_PER_MOVE; // 작품 하나가 지나가는 데 필요한 스크롤
        // 제목이 다 나타나면 첫 작품 시작 (제목은 그때부터 스크롤만큼 위로 지나감)
        const starts = tiles.map((_, i) => vh * HEAD_IN + i * span * NEXT_AT);
        const cardsEnd = starts[starts.length - 1] + span; // 마지막 작품이 화면 위로 다 빠져나가는 지점
        // 작품이 다 지나갈 때까지 스크롤할 거리 + 화면 하나 (제목은 계속 보이다가 화면과 함께 올라감)
        group.style.height = `${Math.ceil(vh + cardsEnd)}px`; // 그룹 맨 위부터 마지막 작품이 빠져나갈 때까지 + 화면 하나
        const prev = layout.find((g) => g.group === group);
        return { group, stage, head, tiles, starts, span, cardsEnd, travel, pinned, smooth: prev?.smooth ?? null };
      });
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      let moving = false;
      layout.forEach((item) => {
        const { group, head, tiles, starts, span, travel, pinned } = item;
        const top = group.getBoundingClientRect().top;
        if (!pinned) {
          if (head.getBoundingClientRect().top < vh * 0.8) head.classList.add(styles.headShown);
          return;
        }
        // 제목: 화면이 멈춘 뒤(흰 배경이 꽉 찬 상태)부터 스크롤하는 만큼 서서히 나타남
        // 한 번 나타나면 계속 보임 (작품이 다 지나가면 화면과 함께 위로 올라감)
        const h = Math.max(0, Math.min(1, -top / (vh * HEAD_IN)));
        // 다 나타난 뒤에는 고정하지 않고 스크롤한 만큼 위로 지나감
        head.style.transform = `translateY(${(-Math.max(0, -top - vh * HEAD_IN)).toFixed(1)}px)`;
        [...head.children].forEach((el, k) => {
          const v = Math.max(0, Math.min(1, h * 1.25 - k * 0.25)); // 설명은 제목보다 조금 늦게
          el.style.opacity = v.toFixed(3);
          el.style.transform = `translateY(${((1 - v) * 40).toFixed(1)}px)`;
        });
        const target = Math.max(0, -top); // 멈춘 화면 안에서 스크롤한 거리
        // 스크롤 값을 바로 쓰지 않고 조금씩 따라감 → 휠을 끊어 굴려도 미끄러지듯 부드럽게
        if (item.smooth === null || Math.abs(target - item.smooth) > vh * 2) item.smooth = target;
        item.smooth += (target - item.smooth) * SMOOTH;
        if (Math.abs(target - item.smooth) < 0.5) item.smooth = target;
        else moving = true;

        tiles.forEach((tile, i) => {
          const u = Math.max(0, Math.min(1, (item.smooth - starts[i]) / span));
          const y = vh - easeMiddle(u) * travel; // 아래(vh)에서 화면 위 밖까지
          // 올라오며 서서히 나타남 (사라지는 효과는 없음 — 그대로 화면 위로 빠져나감)
          const opacity = smoothstep(clamp01(u / FADE_IN));
          const scale = SCALE_FROM + (1 - SCALE_FROM) * opacity;
          tile.style.transform = `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(4)})`;
          tile.style.opacity = opacity.toFixed(3);
          tile.style.visibility = opacity === 0 || u >= 1 ? "hidden" : "visible"; // 안 보이는 작품은 클릭 · Tab 안 되게
        });
      });
      if (moving) request(); // 다 따라갈 때까지 계속
    };

    // Tab으로 작품 버튼에 들어오면 그 작품이 화면 가운데 오도록 스크롤
    const onFocus = (e) => {
      const tile = e.target.closest?.(`.${styles.tile}`);
      const item = tile && layout.find((g) => g.pinned && g.tiles.includes(tile));
      if (!item) return;
      const i = item.tiles.indexOf(tile);
      const progress = item.starts[i] + item.span / 2; // 가운데쯤
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
    return () => {
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
  const { projectId, name, type, category, teamSize, roleShort, stack, thumbnail, headerColor, headerTone, headerText, headerGlow, links, hasDetail } = project;
  const { title, subtitle } = splitName(name);
  // 버튼 2개: 상세 페이지가 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  const [first, second] = links;
  const primary = hasDetail ? { label: UI_TEXT.viewDetail, to: toProjectDetail(projectId) } : first;
  const secondary = hasDetail ? first : second;

  // 사진: 화면에 들어오면 서서히 등장(data-reveal — 사이트 공통 스크롤 등장)
  //       마우스를 올리면 아래에서 기술 태그 패널이 올라옴 · 누르면 상세 페이지
  const media = (
    <>
      <img src={getProjectImage(thumbnail)} alt={`${title} 화면`} className={styles.image} loading="lazy" />
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
      {/* 썸네일 */}
      <div className={styles.card} data-reveal>
        {hasDetail ? (
          // 사진 링크는 마우스용 — 키보드(Tab) · 화면 읽기에서는 건너뜀 ("자세히 보기" 버튼과 같은 곳이라 두 번 거치지 않게)
          <Link to={toProjectDetail(projectId)} className={styles.media} tabIndex={-1} aria-hidden="true">
            {media}
          </Link>
        ) : (
          <div className={styles.media}>{media}</div>
        )}
      </div>
      <div className={styles.text} data-reveal>
        <p className={styles.eyebrow}>
          {category} · {type === "team" ? UI_TEXT.teamSize(teamSize) : UI_TEXT.solo}
        </p>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {/* 팀 프로젝트: 내 담당 한 줄 */}
        {roleShort && (
          <p className={styles.role}>
            <b>{UI_TEXT.myRole}</b> {roleShort}
          </p>
        )}
        <div className={styles.actions}>
          {primary?.to && <Link to={primary.to} className={styles.primary}>{primary.label}</Link>}
          {primary?.href && <a href={primary.href} target="_blank" rel="noreferrer" className={styles.primary}>{primary.label}</a>}
          {secondary && <a href={secondary.href} target="_blank" rel="noreferrer" className={styles.secondary}>{secondary.label}</a>}
        </div>
      </div>
    </article>
  );
};

// 그룹 = 멈춰 있는 화면 + 상단 제목 + 아래에서 위로 지나가는 작품(좌우 번갈아)
const ProjectGroup = ({ type, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const projects = getProjectsByType(type);
  const main = projects.filter((p) => !p.isMore);
  const more = projects.filter((p) => p.isMore);
  const visible = isOpen ? [...main, ...more] : main;

  return (
    <div className={styles.group}>
      {/* stage = 멈춰 있는 화면 (PC · 태블릿) — 제목은 나타난 뒤 스크롤하면 위로 지나감(고정 안 함) */}
      <div className={styles.stage}>
        <div className={styles.groupHead}>
          <h2 className={styles.groupTitle}>{title}</h2>
          <p className={styles.groupDesc}>{PROJECT_GROUP_TEXT[type]}</p>
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

const ProjectTiles = () => {
  const sectionRef = useRef(null);
  useProjectScroll(sectionRef);

  return (
    <section ref={sectionRef} id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={SECTION_TITLES.projects}>
      {GROUPS.map((group) => <ProjectGroup key={group.type} type={group.type} title={group.title} />)}
    </section>
  );
};

export default ProjectTiles;