"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, NumberField } from "./Field";
import type { Currency, Profile } from "@/domain/types";

interface Props {
  value: Profile;
  onChange: (next: Profile) => void;
}

export default function ProfileBasicsForm({ value, onChange }: Props) {
  const update = <K extends keyof Profile>(key: K, v: Profile[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Field label="名稱" htmlFor="profile-name">
        <Input
          id="profile-name"
          value={value.name ?? ""}
          onChange={(e) => update("name", e.target.value)}
          placeholder="例如：我的財務檔案"
        />
      </Field>
      <NumberField
        id="profile-age"
        label="年齡"
        value={value.age}
        onChange={(n) => update("age", n)}
      />
      <Field label="職業" htmlFor="profile-occupation">
        <Input
          id="profile-occupation"
          value={value.occupation}
          onChange={(e) => update("occupation", e.target.value)}
        />
      </Field>
      <Field label="國家" htmlFor="profile-country">
        <Input
          id="profile-country"
          value={value.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </Field>
      <NumberField
        id="profile-deps"
        label="扶養人口"
        value={value.dependentsCount}
        onChange={(n) => update("dependentsCount", n)}
        hint="影響緊急金與覆蓋率的目標門檻"
      />
      <Field label="計價幣別" htmlFor="profile-currency">
        <Select
          value={value.currency}
          onValueChange={(v) => update("currency", v as Currency)}
        >
          <SelectTrigger id="profile-currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TWD">TWD（新台幣）</SelectItem>
            <SelectItem value="USD">USD（美金）</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
