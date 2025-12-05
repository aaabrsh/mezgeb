<script lang="ts">
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Pencil, Trash2 } from "@lucide/svelte";
  import type { Currency } from "@prisma/client";
  import { enhance } from "$app/forms";
  import { cn } from "@/utils";

  type Props = {
    currencies: Currency[];
    onEdit?: (currency: Currency) => void;
    onDeleteComplete?: () => void;
  };

  let { currencies, onEdit, onDeleteComplete }: Props = $props();
  let delete_pending: Record<string, boolean> = $state({});
</script>

<div class="space-y-3">
  {#each currencies as currency}
    <div class="flex gap-2 items-center">
      <Card
        class={cn("flex-grow p-0 shadow-none", { "bg-neutral-600/10": !currency.userId })}
      >
        <div class="flex gap-2 px-5 py-3 w-full justify-center">
          <div class="flex-grow">
            <div class="text-primary font-semibold">
              {currency.abbrev}
            </div>
            <div class="text-neutral-600">
              {currency.name || "-"}
            </div>
          </div>
          {#if currency.symbol}
            <div
              class="flex items-center justify-center font-semibold text-neutral-600 h-12 w-12 rounded-[50%] bg-background"
            >
              {currency.symbol}
            </div>
          {/if}
        </div>
      </Card>

      {#if currency.userId}
        <Button
          variant="raw"
          class="rounded-full h-10 w-10 text-primary hover:bg-primary/20 transition p-2"
          onclick={() => onEdit && onEdit(currency)}
        >
          <Pencil size={16} />
        </Button>
        <form
          method="POST"
          action="?/delete"
          use:enhance={() => {
            delete_pending[currency.id] = true;
            return async ({ update }) => {
              await update();
              delete_pending[currency.id] = false;
              onDeleteComplete && onDeleteComplete();
            };
          }}
        >
          <input type="hidden" name="id" value={currency.id} />
          <Button
            type="submit"
            variant="raw"
            class="rounded-full h-10 w-10 text-red-600 hover:bg-red-200 transition p-2"
            disabled={delete_pending[currency.id]}
            loading={delete_pending[currency.id]}
          >
            {#if !delete_pending[currency.id]}
              <Trash2 size={16} />
            {/if}
          </Button>
        </form>
      {/if}
    </div>
  {/each}
</div>
