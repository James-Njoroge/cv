"use client";

// THIS IS THE CORRECT IMPORT PATH
import { useTransition } from "react";

import { useLocale } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLocale, locales } from "@/i18n";
import { usePathname, useRouter } from "@/lib/navigation";

export default function LocaleSwitcherSelect() {
  const router = useRouter();
  const pathname = usePathname(); // This now comes from your own navigation.ts
  const locale = useLocale() as AppLocale;
  const [isPending, startTransition] = useTransition();

  function onSelectChange(value: string) {
    startTransition(() => {
      // The router now has the correct context and will work as expected.
      router.replace(pathname, { locale: value });
    });
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {cur.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
