// src/app/(main)/board/RegionSelectorSSR.js
"use client";

import Link from "next/link";
import ThemeSelectorMobile from "./ThemeSelectorMobile"; // 모바일 전용 (클라이언트 컴포넌트)

/**
 * RegionSelectorSSR
 * - PC: table(6칸 또는 7칸) 레이아웃
 * - 모바일: 3칸 Flex로 정렬 + 폰트 축소
 * - regionSlug / themeName 파라미터에 따라 선택 상태 표시
 * - 지역/테마 전부 하드코딩
 */

// ────────────────────────────────────────────────────
// (1) 지역 목록 (id=12 홈케어 제외) - 하드코딩
// ────────────────────────────────────────────────────
// ────────────────────────────────────────────────────
const REGIONS = [
  // 상위 지역 (id=1~11)
  { id: 1,  name: "강남/서초/송파", parent_id: null, sort_order: 1,  region_slug: "강남-서초-송파" },
  { id: 2,  name: "서울",          parent_id: null, sort_order: 2,  region_slug: "서울" },
  { id: 3,  name: "수원/동탄/용인/화성/평택/오산", parent_id: null, sort_order: 3,  region_slug: "수원-동탄-용인-화성-평택-오산" },
  { id: 4,  name: "분당/성남/위례/경기광주/하남", parent_id: null, sort_order: 4,  region_slug: "분당-성남-위례-경기광주-하남" },
  { id: 5,  name: "인천/부천/부평", parent_id: null, sort_order: 5,  region_slug: "인천-부천-부평" },
  { id: 6,  name: "안양/군포/시흥/의왕", parent_id: null, sort_order: 6,  region_slug: "안양-군포-시흥-의왕" },
  { id: 7,  name: "일산/김포/파주/고양", parent_id: null, sort_order: 7,  region_slug: "일산-김포-파주-고양" },
  { id: 8,  name: "의정부/구리/남양주/포천/동두천", parent_id: null, sort_order: 8,  region_slug: "의정부-구리-남양주-포천-동두천" },
  { id: 9,  name: "대전/천안/세종/충청/강원", parent_id: null, sort_order: 9,  region_slug: "대전-천안-세종-충청-강원" },
  { id: 10, name: "부산/대구/울산/경상도/전라도/광주", parent_id: null, sort_order: 10, region_slug: "부산-대구-울산-경상도-전라도-광주" },
  { id: 11, name: "제주도", parent_id: null, sort_order: 11, region_slug: "제주도" },
  // 하위 지역 (id=13~...)
  // 상위=1 (강남/서초/송파)
  { id: 13, name: "강남구",       parent_id: 1, sort_order: 1,  region_slug: "강남구" },
  { id: 14, name: "서초구",       parent_id: 1, sort_order: 2,  region_slug: "서초구" },
  { id: 15, name: "송파구",       parent_id: 1, sort_order: 3,  region_slug: "송파구" },
  { id: 16, name: "신논현역/강남역", parent_id: 1, sort_order: 4,  region_slug: "신논현역-강남역" },
  { id: 17, name: "역삼/언주/매봉/양재", parent_id: 1, sort_order: 5,  region_slug: "역삼-언주-매봉-양재" },
  { id: 18, name: "선릉/대치",     parent_id: 1, sort_order: 6,  region_slug: "선릉-대치" },
  { id: 19, name: "학동/논현/청담/강남구청", parent_id: 1, sort_order: 7,  region_slug: "학동-논현-청담-강남구청" },
  { id: 20, name: "압구정/신사",    parent_id: 1, sort_order: 8,  region_slug: "압구정-신사" },
  { id: 21, name: "삼성역/선정릉역/삼성중앙역", parent_id: 1, sort_order: 9,  region_slug: "삼성역-선정릉역-삼성중앙역" },
  { id: 22, name: "서초역/교대역/이수역/방배역", parent_id: 1, sort_order: 10, region_slug: "서초역-교대역-이수역-방배역" },
  { id: 23, name: "잠실/송파",     parent_id: 1, sort_order: 11, region_slug: "잠실-송파" },
  { id: 24, name: "문정/장지/복정",  parent_id: 1, sort_order: 12, region_slug: "문정-장지-복정" },
  { id: 25, name: "가락/석촌",     parent_id: 1, sort_order: 13, region_slug: "가락-석촌" },
  { id: 26, name: "방이/삼전",     parent_id: 1, sort_order: 14, region_slug: "방이-삼전" },

  // 상위=2 (서울)
  { id: 27, name: "강북",        parent_id: 2, sort_order: 1,  region_slug: "강북" },
  { id: 28, name: "강서",        parent_id: 2, sort_order: 2,  region_slug: "강서" },
  { id: 29, name: "강동",        parent_id: 2, sort_order: 3,  region_slug: "강동" },
  { id: 30, name: "천호/암사",    parent_id: 2, sort_order: 4,  region_slug: "천호-암사" },
  { id: 31, name: "길동/둔촌",    parent_id: 2, sort_order: 5,  region_slug: "길동-둔촌" },
  { id: 32, name: "성북/도봉/노원/강북/수유/미아", parent_id: 2, sort_order: 6,  region_slug: "성북-도봉-노원-강북-수유-미아" },
  { id: 33, name: "중랑/상봉/망우/면목", parent_id: 2, sort_order: 7,  region_slug: "중랑-상봉-망우-면목" },
  { id: 34, name: "장한평/왕십리/답십리", parent_id: 2, sort_order: 8,  region_slug: "장한평-왕십리-답십리" },
  { id: 35, name: "광진구/건대/아차산/구의/성수/성동", parent_id: 2, sort_order: 9,  region_slug: "광진구-건대-아차산-구의-성수-성동" },
  { id: 36, name: "종로/동묘/신당/동대문/신설/제기",  parent_id: 2, sort_order: 10,region_slug: "종로-동묘-신당-동대문-신설-제기" },
  { id: 37, name: "을지/명동/충무/서울역/회현", parent_id: 2, sort_order: 11,region_slug: "을지-명동-충무-서울역-회현" },
  { id: 38, name: "용산/신용산",    parent_id: 2, sort_order: 12,region_slug: "용산-신용산" },
  { id: 39, name: "불광/함정역/홍대/신촌/은평", parent_id: 2, sort_order: 13,region_slug: "불광-함정역-홍대-신촌-은평" },
  { id: 40, name: "마포구청/상암/북가좌", parent_id: 2, sort_order: 14,region_slug: "마포구청-상암-북가좌" },
  { id: 41, name: "마곡/송정/발산/가양/등촌/화곡", parent_id: 2, sort_order: 15,region_slug: "마곡-송정-발산-가양-등촌-화곡" },
  { id: 42, name: "양천/목동/당산/영등포/여의도", parent_id: 2, sort_order: 16,region_slug: "양천-목동-당산-영등포-여의도" },
  { id: 43, name: "구로구/금천구",   parent_id: 2, sort_order: 17,region_slug: "구로구-금천구" },
  { id: 44, name: "관악/봉천/신림/신대방/동작/사당/이수", parent_id: 2, sort_order: 18,region_slug: "관악-봉천-신림-신대방-동작-사당-이수" },

  // 상위=3(수원/동탄...)
  { id: 45, name: "수원",     parent_id: 3, sort_order: 1,  region_slug: "수원" },
  { id: 46, name: "팔달/수원역/영통/매교/장안/성균관대", parent_id: 3, sort_order: 2, region_slug: "팔달-수원역-영통-매교-장안-성균관대" },
  { id: 47, name: "인계동",   parent_id: 3, sort_order: 3,  region_slug: "인계동" },
  { id: 48, name: "권선/권선동/세류동/금곡동/호매실동", parent_id: 3, sort_order: 4, region_slug: "권선-권선동-세류동-금곡동-호매실동" },
  { id: 49, name: "화성/동탄/병점",  parent_id: 3, sort_order: 5,  region_slug: "화성-동탄-병점" },
  { id: 50, name: "용인/수지/광교",  parent_id: 3, sort_order: 6,  region_slug: "용인-수지-광교" },
  { id: 51, name: "광교",     parent_id: 3, sort_order: 7,  region_slug: "광교" },
  { id: 52, name: "오산/평택", parent_id: 3, sort_order: 8,  region_slug: "오산-평택" },
  { id: 53, name: "매탄동",   parent_id: 3, sort_order: 9,  region_slug: "매탄동" },

  // 상위=4(분당/성남/위례/경기광주/하남)
  { id: 54, name: "경기광주/이천/하남", parent_id: 4, sort_order: 1, region_slug: "경기광주-이천-하남" },
  { id: 55, name: "분당/성남",     parent_id: 4, sort_order: 2, region_slug: "분당-성남" },
  { id: 56, name: "모란/단대/중원/신흥/위례", parent_id: 4, sort_order: 3, region_slug: "모란-단대-중원-신흥-위례" },
  { id: 57, name: "오리/미금/정자",   parent_id: 4, sort_order: 4, region_slug: "오리-미금-정자" },
  { id: 58, name: "수내/서현",     parent_id: 4, sort_order: 5, region_slug: "수내-서현" },
  { id: 59, name: "판교/운중동",    parent_id: 4, sort_order: 6, region_slug: "판교-운중동" },
  { id: 60, name: "야탑",       parent_id: 4, sort_order: 7, region_slug: "야탑" },

  // 상위=5(인천/부천/부평)
  { id: 61, name: "인천시",   parent_id: 5, sort_order: 1,  region_slug: "인천시" },
  { id: 62, name: "부평구",   parent_id: 5, sort_order: 2,  region_slug: "부평구" },
  { id: 63, name: "부천시",   parent_id: 5, sort_order: 3,  region_slug: "부천시" },
  { id: 64, name: "계양구/마전동", parent_id: 5, sort_order: 4,  region_slug: "계양구-마전동" },
  { id: 65, name: "연희동/청라/검암/석남/검단", parent_id: 5, sort_order: 5, region_slug: "연희동-청라-검암-석남-검단" },
  { id: 66, name: "삼산/부평역,구청,시장", parent_id: 5, sort_order: 6, region_slug: "삼산-부평역-구청-시장" },
  { id: 67, name: "부개역,송내역",    parent_id: 5, sort_order: 7, region_slug: "부개역-송내역" },
  { id: 68, name: "구월/만수동",     parent_id: 5, sort_order: 8, region_slug: "구월-만수동" },
  { id: 69, name: "신중동,부천시청,부천역", parent_id: 5, sort_order: 9, region_slug: "신중동-부천시청-부천역" },
  { id: 70, name: "송도/연수/청학/영종도", parent_id: 5, sort_order: 10,region_slug: "송도-연수-청학-영종도" },
  { id: 71, name: "논현/소래/서창/호구포", parent_id: 5, sort_order: 11,region_slug: "논현-소래-서창-호구포" },
  { id: 72, name: "간석/동암",       parent_id: 5, sort_order: 12,region_slug: "간석-동암" },
  { id: 73, name: "주안/도화/송의/중산", parent_id: 5, sort_order: 13,region_slug: "주안-도화-송의-중산" },

  // 상위=6(안양/군포/시흥/의왕)
  { id: 74, name: "안양/의왕",    parent_id: 6, sort_order: 1, region_slug: "안양-의왕" },
  { id: 75, name: "안산",       parent_id: 6, sort_order: 2, region_slug: "안산" },
  { id: 76, name: "광명/군포,산본/인근", parent_id: 6, sort_order: 3, region_slug: "광명-군포-산본-인근" },
  { id: 77, name: "시흥/정왕/월곶/소래", parent_id: 6, sort_order: 4, region_slug: "시흥-정왕-월곶-소래" },

  // 상위=7(일산/김포/파주/고양)
  { id: 78, name: "고양/일산",    parent_id: 7, sort_order: 1, region_slug: "고양-일산" },
  { id: 79, name: "김포",       parent_id: 7, sort_order: 2, region_slug: "김포" },
  { id: 80, name: "파주",       parent_id: 7, sort_order: 3, region_slug: "파주" },

  // 상위=8(의정부/구리/남양주/포천/동두천)
  { id: 81, name: "구리/남양주", parent_id: 8, sort_order: 1, region_slug: "구리-남양주" },
  { id: 82, name: "의정부/양주/동두천/포천", parent_id: 8, sort_order: 2, region_slug: "의정부-양주-동두천-포천" },

  // 상위=9(대전/천안/세종/충청/강원)
  { id: 83, name: "천안/충청",   parent_id: 9, sort_order: 1, region_slug: "천안-충청" },
  { id: 84, name: "대전",       parent_id: 9, sort_order: 2, region_slug: "대전" },
  { id: 85, name: "세종",       parent_id: 9, sort_order: 3, region_slug: "세종" },
  { id: 86, name: "충북",       parent_id: 9, sort_order: 4, region_slug: "충북" },
  { id: 87, name: "강원",       parent_id: 9, sort_order: 5, region_slug: "강원" },

  // 상위=10(부산/대구/울산/경상도/전라도/광주)
  { id: 88, name: "부산",       parent_id: 10, sort_order: 1, region_slug: "부산" },
  { id: 89, name: "대구",       parent_id: 10, sort_order: 2, region_slug: "대구" },
  { id: 90, name: "경남",       parent_id: 10, sort_order: 3, region_slug: "경남" },
  { id: 91, name: "경북",       parent_id: 10, sort_order: 4, region_slug: "경북" },
  { id: 92, name: "전남",       parent_id: 10, sort_order: 5, region_slug: "전남" },
  { id: 93, name: "전북",       parent_id: 10, sort_order: 6, region_slug: "전북" },
  { id: 94, name: "울산",       parent_id: 10, sort_order: 7, region_slug: "울산" },
  { id: 95, name: "광주",       parent_id: 10, sort_order: 8, region_slug: "광주" },

  // 상위=11(제주도)
  { id: 96, name: "제주시",    parent_id: 11, sort_order: 1, region_slug: "제주시" },
  { id: 97, name: "서귀포시",   parent_id: 11, sort_order: 2, region_slug: "서귀포시" },
];
// ────────────────────────────────────────────────────
// (2) 테마 목록 (id=12 제외) - 하드코딩
// ────────────────────────────────────────────────────
const THEMES = [
  { id: 0,  name: "전체",       sort_order: 0 },
  { id: 1,  name: "신규업체",   sort_order: 1 },
  { id: 19, name: "눈썹문신",   sort_order: 19 },
  { id: 20, name: "애견펜션",   sort_order: 20 },
  { id: 21, name: "사주",      sort_order: 21 },
  { id: 22, name: "타로",      sort_order: 22 },
  { id: 23, name: "아이폰-스냅", sort_order: 23 },
  { id: 24, name: "웨딩플래너", sort_order: 24 },
  { id: 25, name: "룸카페",    sort_order: 25 },
  { id: 26, name: "성인용품",  sort_order: 26 },
  { id: 27, name: "클럽",     sort_order: 27 },
  { id: 28, name: "나이트클럽", sort_order: 28 },
  { id: 29, name: "네일샵",   sort_order: 29 },
  { id: 30, name: "애견미용", sort_order: 30 },
  { id: 31, name: "태닝샵",   sort_order: 31 },
  { id: 32, name: "왁싱샵",   sort_order: 32 },
  { id: 33, name: "라운지바", sort_order: 33 },
  { id: 34, name: "헌팅포차", sort_order: 34 },
  { id: 35, name: "바",      sort_order: 35 },
  { id: 36, name: "감성주점", sort_order: 36 },
].sort((a, b) => a.sort_order - b.sort_order);

// ────────────────────────────────────────────────────
// (3) chunkArray(배열, size)
// ────────────────────────────────────────────────────
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// ────────────────────────────────────────────────────
// (4) RegionSelectorSSR
// ────────────────────────────────────────────────────
export default function RegionSelectorSSR({ regionSlug, themeName }) {
  // a) regionSlug 분석
  let selectedParentId = 0;
  let selectedChildId = 0;
  if (regionSlug === "전체") {
    selectedParentId = 0;
    selectedChildId = 0;
  } else {
    const matched = REGIONS.find((r) => r.region_slug === regionSlug);
    if (matched) {
      if (matched.parent_id === null) {
        selectedParentId = matched.id;
        selectedChildId = 0;
      } else {
        selectedParentId = matched.parent_id;
        selectedChildId = matched.id;
      }
    }
  }

  // b) 상위 지역 목록 + "전체"
  const parentItems = [
    { id: 0, name: "전체", parent_id: null, region_slug: "전체" },
    ...REGIONS.filter((r) => r.parent_id === null),
  ];

  // c) 하위 지역 목록 + "전체"
  let childItems = [];
  if (selectedParentId !== 0) {
    const parentObj = REGIONS.find((r) => r.id === selectedParentId);
    if (parentObj) {
      const children = REGIONS
        .filter((r) => r.parent_id === parentObj.id)
        .sort((a, b) => a.sort_order - b.sort_order);

      const allChildItem = {
        id: 0,
        name: "전체",
        parent_id: parentObj.id,
        region_slug: parentObj.region_slug,
      };
      childItems = [allChildItem, ...children];
    }
  }

  // d) themeName 분석
  let selectedThemeIds = [];
  if (themeName === "전체") {
    selectedThemeIds = [0];
  } else {
    const matchedT = THEMES.find((t) => t.name === themeName);
    if (matchedT) {
      selectedThemeIds = [matchedT.id];
    } else {
      selectedThemeIds = [0];
    }
  }

  // e) 테이블 & 셀 스타일
  const tableStyle = {
    width: "100%",
    // 상단+왼쪽 테두리만
    borderTop: "1px solid #ddd",
    borderLeft: "1px solid #ddd",

    borderCollapse: "separate",
    borderSpacing: 0,
    marginBottom: "1rem",
  };
  // 각 셀은 "오른쪽+아래"만 테두리
  function getTdStyle(isSelected) {
    return {
      borderRight: "1px solid #ddd",
      borderBottom: "1px solid #ddd",
      padding: "8px",
      cursor: "pointer",
      backgroundColor: isSelected ? "#f9665e" : "#fff",
      color: isSelected ? "#fff" : "#333",
      textAlign: "center",
      verticalAlign: "middle", // PC에서만 유효
    };
  }

  // f) 렌더링
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center mt-3 md:mt-10 mb-3">
        <h2 className="font-bold text-xl mr-3">지역별 업체 선택</h2>
        <p className="text-base text-gray-600 m-0 p-0">
          인기있는 지역들을 보기쉽게 모아놨어요!
        </p>
      </div>

      {/* 상위 지역 (6칸) */}
      <table className="region-table" style={tableStyle}>
        <tbody>
          {chunkArray(parentItems, 6).map((row, idx) => (
            <tr key={idx}>
              {row.map((item) => {
                const isSelected = selectedParentId === item.id;
                const href = `/board/${item.region_slug}/${themeName}`;
                return (
                  <td key={item.id} style={getTdStyle(isSelected)}>
                    <Link className="text-sm" href={href} style={{ display: "block" }}>
                      {item.name}
                    </Link>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 하위 지역 (7칸) */}
      {selectedParentId !== 0 && childItems.length > 0 && (
        <table className="region-table" style={tableStyle}>
          <tbody>
            {chunkArray(childItems, 7).map((row, idx) => (
              <tr key={idx}>
                {row.map((child) => {
                  const isSelected = selectedChildId === child.id;
                  const href = `/board/${child.region_slug}/${themeName}`;
                  return (
                    <td key={child.id} style={getTdStyle(isSelected)}>
                      <Link className="text-sm" href={href} style={{ display: "block" }}>
                        {child.name}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PC 테마 (SSR) */}
      <div className="pc-theme">
        <div className="flex flex-col md:flex-row items-center mt-10 mb-3">
          <h2 className="text-xl font-bold mr-3">테마별 업체 선택</h2>
          <p className="text-base text-gray-600 m-0 p-0">
            원하는 테마를 골라보세요!
          </p>
        </div>

        <table className="region-table" style={tableStyle}>
          <tbody>
            {chunkArray(THEMES, 9).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((th) => {
                  const isSelected = selectedThemeIds.includes(th.id);
                  const href = `/board/${regionSlug}/${th.name}`;
                  return (
                    <td key={th.id} style={getTdStyle(isSelected)}>
                      <Link className="text-sm" href={href} style={{ display: "block" }}>
                        {th.name}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일 테마 (Client) */}
      <div className="mobile-theme" style={{ marginTop: "2rem" }}>
        <ThemeSelectorMobile
          regionSlug={regionSlug}
          themeName={themeName}
          selectedThemeIds={selectedThemeIds}
          allThemes={THEMES}
        />
      </div>

      {/* 미디어쿼리 */}
      <style jsx>{`
        /* PC 에선 pc-theme 보이고 mobile-theme 숨김 */
        @media (min-width: 769px) {
          .pc-theme {
            display: block;
          }
          .mobile-theme {
            display: none;
          }
        }
        /* 모바일에서는 pc-theme 숨기고 mobile-theme 보임 */
        @media (max-width: 768px) {
          .pc-theme {
            display: none;
          }
          .mobile-theme {
            display: block;
          }
        }

        /* 모바일: 3칸 Flex */
        @media (max-width: 768px) {
          .region-table {
            display: flex;
            flex-wrap: wrap;
          }
          .region-table tbody,
          .region-table tr {
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
          }
          .region-table td {
            flex: 0 0 33.3333%;
            box-sizing: border-box;

            /* 수직중앙 -> flex로 처리 */
            display: flex;
            align-items: center;
            justify-content: center;

            /* 폰트, 패딩 축소 */
            font-size: 12px;
            padding: 6px;

            /* partial borders (오른쪽+아래) */
            borderRight:  "1px solid #ddd";
            borderBottom: "1px solid #ddd";
          }
        }
      `}</style>
    </div>
  );
}