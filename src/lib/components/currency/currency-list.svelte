<script lang="ts">
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Pencil, Trash2 } from "@lucide/svelte";
  import type { Currency } from "@prisma-generated/client";
  import { enhance } from "$app/forms";
  import { cn } from "@/utils";
  import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
  } from "@/components/ui/item";
  import { ConfirmationModal } from "@/components/ui/confirmation-modal";

  type Props = {
    currencies: Currency[];
    onEdit?: (currency: Currency) => void;
    onDeleteComplete?: () => void;
  };

  let { currencies, onEdit, onDeleteComplete }: Props = $props();
  let delete_pending: Record<string, boolean> = $state({});
  let data_to_delete = $state<string | null>(null);
  let deletion_form: HTMLFormElement;
</script>

<div class="space-y-3">
  {#each currencies as currency (currency.id)}
    <Item variant={currency.userId ? "outline" : "muted"} class="wifull">
      <ItemContent>
        <ItemTitle class="text-primary">{currency.abbrev}</ItemTitle>
        <ItemDescription class="text-neutral-600">
          {currency.name || "-"}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {#if currency.symbol}
          <div
            class="flex items-center justify-center font-semibold text-neutral-600 h-12 w-12 rounded-[50%] bg-background"
          >
            {currency.symbol}
          </div>
        {/if}
      </ItemActions>

      {#if currency.userId}
        <ItemActions class={"border-l-1 ps-4"}>
          <Button
            variant="raw"
            class="rounded-full h-10 w-10 text-primary hover:bg-primary/20 transition p-2"
            onclick={() => onEdit && onEdit(currency)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="raw"
            class="rounded-full h-10 w-10 text-red-600 hover:bg-red-200 transition p-2"
            disabled={delete_pending[currency.id]}
            loading={delete_pending[currency.id]}
            onclick={() => {
              data_to_delete = currency.id;
            }}
          >
            {#if !delete_pending[currency.id]}
              <Trash2 size={16} />
            {/if}
          </Button>
        </ItemActions>
      {/if}
    </Item>
  {/each}
</div>

<!-- Hidden Currency Delete form to be triggered programmatically -->
<form
  method="POST"
  action="?/delete"
  bind:this={deletion_form}
  use:enhance={() => {
    delete_pending[data_to_delete || ""] = true;
    return async ({ update }) => {
      await update();
      delete_pending[data_to_delete || ""] = false;
      data_to_delete = null;
      onDeleteComplete && onDeleteComplete();
    };
  }}
>
  <input type="hidden" name="id" value={data_to_delete} />
</form>

<!-- Confirmation modal to be shown before deletion -->
<ConfirmationModal
  open={!!data_to_delete}
  onConfirm={() => {
    deletion_form?.requestSubmit();
  }}
  onClose={() => {
    data_to_delete = null;
  }}
  title="Are you sure you want to delete this currency?"
  loading={delete_pending[data_to_delete || ""]}
/>
