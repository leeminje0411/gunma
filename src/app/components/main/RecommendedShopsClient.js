"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseF";

export default function RecommendedShopsClient({
  initialTag,
  initialShops,
}) {
  const tags = ["스웨디시", "1인샵", "로미로미", "타이마사지", "사우나/스파", "왁싱"];

  // 서버에서 받은 초기 태그, 초기 샵 목록
  const [selectedTag, setSelectedTag] = useState(initialTag || "스웨디시");
  const [shops, setShops] = useState(initialShops || []);

  // 태그 클릭 시 새로 Supabase 호출
  async function handleClickTag(tagName) {
    // 이미 선택된 태그이면 다시 fetch 안 함
    if (tagName === selectedTag) return;

    setSelectedTag(tagName);

    try {
      // 1) themes에서 name=tagName
      let { data: themeRows } = await supabase
        .from("themes")
        .select("id, name")
        .eq("name", tagName)
        .single();

      if (!themeRows) {
        setShops([]);
        return;
      }

      // 2) partnershipsubmit_themes에서 theme_id
      const themeId = themeRows.id;
      let { data: relRows } = await supabase
        .from("partnershipsubmit_themes")
        .select("submit_id")
        .eq("theme_id", themeId);

      if (!relRows || relRows.length === 0) {
        setShops([]);
        return;
      }

      // 3) partnershipsubmit에서 id in (...)
      const submitIds = relRows.map((r) => r.submit_id);
      let { data: subRows } = await supabase
        .from("partnershipsubmit")
        .select("id, post_title, address, address_street, thumbnail_url, comment")
        .in("id", submitIds)
        .limit(4);

      if (!subRows || subRows.length === 0) {
        setShops([]);
        return;
      }

      // 4) 최종 변환
      const newShops = subRows.map((item) => ({
        id: item.id,
        imgSrc: `https://vejthvawsbsitttyiwzv.supabase.co/storage/v1/object/public/gunma/${item.thumbnail_url}`,
        title: item.post_title,
        address: item.address + " " + (item.address_street || ""),
        reviewCount: item.comment || 0,
      }));

      setShops(newShops);
    } catch (err) {
      console.error("handleClickTag error:", err);
      setShops([]);
    }
  }

  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <hr className="mb-6 border-black" />
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">회원님을 위한 취향별 마사지샵 추천</h2>
          <p className="text-gray-600">회원님의 취향을 고려해서 테마별로 보여드릴게요!</p>
        </div>

        {/* 태그 버튼 */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tags.map((tag) => {
            const isSelected = tag === selectedTag;
            return (
              <button
                key={tag}
                onClick={() => handleClickTag(tag)}
                className={
                  isSelected
                    ? "rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    : "rounded-full border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
                }
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* 
          (A) 모바일(<640px) 슬라이드 
          (B) 데스크톱(≥640px) 그리드 
        */}
        <div className="mt-8">
          {/* (A) 모바일 슬라이드 */}
          <div className="block sm:hidden px-2">
            <div
              className="
                flex
                overflow-x-auto
                gap-6
                snap-x snap-mandatory
              "
              style={{ scrollBehavior: "smooth" }}
            >
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/board/details/${shop.id}`}
                  className="
                    shrink-0 
                    snap-start
                    w-[260px]
                    overflow-hidden
                    rounded-xl border border-gray-200 bg-white shadow
                    focus-within:ring-2 focus-within:ring-blue-500
                  "
                >
                  <div className="w-[240px] h-[130px] mx-auto mt-3 overflow-hidden rounded-xl">
                    <Image
                      src={shop.imgSrc}
                      alt={shop.title}
                      width={240}
                      height={130}
                      style={{ objectFit: "cover" }}
                      quality={30}
                      priority
                      className="rounded-xl"
                      sizes="240px"
                    />
                  </div>
                  <div className="p-4 w-[260px] box-border">
                    <h3 className="mb-1 text-base font-semibold text-gray-800">
                      {shop.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {shop.address}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      리뷰 {shop.reviewCount}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* (B) 데스크톱 그리드 */}
          <div className="hidden sm:grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/board/details/${shop.id}`}
                className="
                  block
                  overflow-hidden
                  rounded-xl border border-gray-200
                  bg-white shadow
                  focus-within:ring-2 focus-within:ring-blue-500
                "
              >
                <div className="h-[153px] w-[263px] mx-auto mt-4 overflow-hidden rounded-xl">
                  <Image
                    src={shop.imgSrc}
                    alt={shop.title}
                    width={263}
                    height={153}
                    style={{ objectFit: "cover" }}
                    quality={30}
                    priority
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-base font-semibold text-gray-800">
                    {shop.title}
                  </h3>
                  <p className="text-sm text-gray-600">{shop.address}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    리뷰 {shop.reviewCount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}