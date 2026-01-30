<script lang="ts">
  import { cn } from "@/utils";
  import type { AccountType } from "@prisma-generated/enums";

  type Props = {
    account_type: AccountType;
  };

  let { account_type }: Props = $props();

  const badgeConfig: Record<AccountType, { label: string; class: string }> = {
    BANK: { label: "Bank", class: "bg-green-500/20 text-green-500" },
    CRYPTO: { label: "Crypto", class: "bg-blue-500/20 text-blue-500" },
    CASH: { label: "Cash", class: "bg-purple-500/20 text-purple-500" },
    OTHER: { label: "Other", class: "bg-gray-500/20 text-gray-500" },
  };
</script>

<span
  class={cn(
    "inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-xs font-medium",
    badgeConfig[account_type].class,
  )}
>
  {badgeConfig[account_type].label}
</span>
