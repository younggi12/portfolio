// 작품 소개 — Apple 홈페이지 제품 타일 방식
// 팀 / 개인 따로, 같은 크기 카드 3열.
// isMore: true인 작품은 처음엔 숨기고 "더보기"로 펼침 (대표 작품이 먼저 보이게 앞으로 정렬)
// 카드에는 작품 사진만, 글(분류·이름·부제·버튼)은 카드 아래로 — 사진 카드 → 분류 → 이름 → 부제 → 버튼 2개
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SECTION_IDS, toProjectDetail } from "@/routes/paths";
import { getProjectsByType } from "@/data/projects";
import { SECTION_TITLES, UI_TEXT } from "@/data/site";
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

const Tile = ({ project }) => {
  const { projectId, name, type, category, teamSize, roleShort, stack, thumbnail, headerColor, headerTone, headerText, headerGlow, links, hasDetail } = project;
  const { title, subtitle } = splitName(name);
  // 버튼 2개: 상세 페이지가 있으면 [자세히 보기, 첫 링크], 없으면 [첫 링크, 둘째 링크]
  const [first, second] = links;
  const primary = hasDetail ? { label: UI_TEXT.viewDetail, to: toProjectDetail(projectId) } : first;
  const secondary = hasDetail ? first : second;

  // 사진: 화면에 들어오면 커튼 걷히듯 왼쪽 → 오른쪽으로 드러남(data-reveal="wipe")
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
      {hasDetail ? (
        // 사진 링크는 마우스용 — 키보드(Tab) · 화면 읽기에서는 건너뜀 ("자세히 보기" 버튼과 같은 곳이라 두 번 거치지 않게)
        <Link to={toProjectDetail(projectId)} className={styles.media} data-reveal="wipe" tabIndex={-1} aria-hidden="true">
          {media}
        </Link>
      ) : (
        <div className={styles.media} data-reveal="wipe">{media}</div>
      )}
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

const ProjectGroup = ({ type, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const projects = getProjectsByType(type);
  const main = projects.filter((p) => !p.isMore);
  const more = projects.filter((p) => p.isMore);
  const visible = isOpen ? [...main, ...more] : main;

  return (
    <div className={styles.group}>
      <h2 className={styles.groupTitle} data-reveal>{title}</h2>
      <div className={styles.grid}>
        {visible.map((project) => <Tile key={project.projectId} project={project} />)}
      </div>
      {more.length > 0 && (
        <button type="button" className={styles.more} onClick={() => setIsOpen((v) => !v)} aria-expanded={isOpen}>
          {isOpen ? UI_TEXT.showLess : `${UI_TEXT.showMore} (${more.length})`}
        </button>
      )}
    </div>
  );
};

const ProjectTiles = () => (
  <section id={SECTION_IDS.projects} data-header-theme="light" className={styles.section} aria-label={SECTION_TITLES.projects}>
    {GROUPS.map((group) => <ProjectGroup key={group.type} type={group.type} title={group.title} />)}
  </section>
);

export default ProjectTiles;