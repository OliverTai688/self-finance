"use client";

import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/PageHeader";
import DemoModeToggle from "@/components/finance/DemoModeToggle";
import { useUserProfile } from "@/hooks/use-profile";

export default function SettingsPage() {
  const { profile, clear } = useUserProfile();

  const onClear = async () => {
    if (!confirm("確定要清除你在本裝置儲存的所有財務資料？此動作不可回復。"))
      return;
    await clear();
  };

  return (
    <div className="space-y-8">
      <PageHeader title="設定" description="裝置本機設定與資料管理" />

      <Card>
        <CardHeader>
          <CardTitle>Demo 資料</CardTitle>
          <CardDescription>
            打開後，Dashboard 與報告會改用預填的範例資料；關掉回到你的真實資料。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DemoModeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>你的資料</CardTitle>
          <CardDescription>
            目前所有資料僅儲存在本機 localStorage，未上傳雲端。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            {profile ? (
              <>
                <span className="text-muted-foreground">已有資料：</span>
                <span className="font-medium">
                  {profile.profile.name || "（未命名）"} ·{" "}
                  {profile.profile.currency}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">目前沒有已儲存的資料</span>
            )}
          </div>
          <Button
            variant="outline"
            onClick={onClear}
            disabled={!profile}
            className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
          >
            <Trash2 size={14} /> 清除全部資料
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>未來擴充</CardTitle>
          <CardDescription>
            此架構已預留 BFF 與 Domain 分層。未來可切換到 Route Handler + DB，無需改動 UI 與計算邏輯。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          <p>• domain/ 為純 TS，0 依賴，可移到 server</p>
          <p>• infrastructure/repositories/ 封裝了儲存層，換 HTTP 只改 factory</p>
          <p>• services/ 為 use-case 層，頁面與 hooks 只依賴它</p>
        </CardContent>
      </Card>
    </div>
  );
}
