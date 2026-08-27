"use client";

import { useEffect, useState } from "react";

export interface MyContentIds {
  reviewIds: string[];
  postIds: string[];
  questionIds: string[];
  answerIds: string[];
}

const EMPTY: MyContentIds = { reviewIds: [], postIds: [], questionIds: [], answerIds: [] };

// 페이지당 한 번만 요청하도록 진행 중인 Promise를 재사용한다.
let inflight: Promise<MyContentIds> | null = null;

export function fetchMyContentIds(): Promise<MyContentIds> {
  if (!inflight) {
    inflight = fetch("/api/me/ids")
      .then((r) => (r.ok ? r.json() : EMPTY))
      .catch(() => EMPTY);
  }
  return inflight;
}

/** 로그아웃 등으로 소유권이 바뀌었을 때 캐시를 비운다 */
export function clearMyContentIdsCache() {
  inflight = null;
}

/**
 * 이 콘텐츠가 로그인한 본인 것인지 여부.
 * 서버가 쿠키로 판단하므로 작성자 id를 클라이언트에 노출하지 않아도 된다.
 */
export function useIsMine(kind: keyof MyContentIds, id: string | undefined | null): boolean {
  const [mine, setMine] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    fetchMyContentIds().then((ids) => {
      if (alive) setMine(ids[kind].includes(String(id)));
    });
    return () => { alive = false; };
  }, [kind, id]);

  return mine;
}

/** 목록 렌더링용 — map 안에서는 훅을 호출할 수 없으므로 Set으로 한 번에 받는다 */
export function useMyIdSet(kind: keyof MyContentIds): Set<string> {
  const [ids, setIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let alive = true;
    fetchMyContentIds().then((all) => {
      if (alive) setIds(new Set(all[kind]));
    });
    return () => { alive = false; };
  }, [kind]);

  return ids;
}
