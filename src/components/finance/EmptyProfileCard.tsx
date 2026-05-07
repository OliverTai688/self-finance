"use client";

import Link from "next/link";
import { Sparkles, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/hooks/use-demo-mode";

export default function EmptyProfileCard() {
  const { setDemoMode } = useDemoMode();

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">尚無財務資料</CardTitle>
        <CardDescription>
          先輸入資料就能看到三層分數、缺口分析與下一步建議。也可以先打開 Demo
          資料快速預覽。
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/inputs">
            <ListChecks size={16} /> 開始輸入
          </Link>
        </Button>
        <Button variant="outline" onClick={() => setDemoMode(true)}>
          <Sparkles size={16} /> 載入 Demo 資料
        </Button>
      </CardContent>
    </Card>
  );
}
