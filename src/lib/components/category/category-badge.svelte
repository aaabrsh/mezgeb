<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Spinner } from "@/components/ui/spinner";
  import { cn } from "@/utils";
  import { Pencil, X } from "@lucide/svelte";
  import type { Category } from "@prisma-generated/client";

  type Props = {
    category: Category;
    loading?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
  };

  let {
    category,
    loading = false,
    showEdit = false,
    onEdit,
    showDelete = false,
    onDelete,
  }: Props = $props();

  let bgColor = "bg-[color-mix(in_srgb,var(--category-color)_10%,transparent)]";
  let borderColor =
    "inset-ring inset-ring-[color-mix(in_srgb,var(--category-color)_70%,transparent)]";
  let textColor = "text-[var(--category-color)]";
  let textColorMuted =
    "text-[color-mix(in_srgb,var(--category-color)_50%,transparent)]";
</script>

<div
  style={`--category-color: ${category.color}`}
  class={cn(
    "inline-flex items-center gap-2 rounded-2xl px-3 py-1 text-xs font-medium",
    bgColor,
    textColor,
    borderColor
  )}
>
  {category.name}

  {#if loading}
    <Spinner />
  {:else if showEdit || showDelete}
    <div class="flex gap-0.5">
      {#if showEdit}
        <Button
          variant="raw"
          class={cn(
            "p-0.5! m-0 w-auto h-auto opacity-40 hover:opacity-100",
            textColor
          )}
          onclick={() => onEdit && onEdit(category)}
        >
          <Pencil />
        </Button>
      {/if}

      {#if showDelete}
        <Button
          variant="raw"
          class={cn(
            "p-0.5! m-0 w-auto h-auto opacity-40 hover:opacity-100",
            textColor
          )}
          onclick={() => onDelete && onDelete(category)}
        >
          <X />
        </Button>
      {/if}
    </div>
  {/if}
</div>
