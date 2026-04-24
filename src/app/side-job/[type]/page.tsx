"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

// 이전 URL /side-job/[type] → 새 URL /hustle/[id] 로 리다이렉트
export default function SideJobLegacyPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/hustle/${type}`);
  }, [type, router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">이동 중...</p>
      </div>
    </div>
  );
}
