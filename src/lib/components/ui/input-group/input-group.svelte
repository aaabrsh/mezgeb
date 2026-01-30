<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  import { fade } from "svelte/transition";

  type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    error?: string | string[];
  };

  let {
    ref = $bindable(null),
    class: className,
    children,
    error,
    ...props
  }: Props = $props();
</script>

<div class="grid gap-1">
  <div
    bind:this={ref}
    data-slot="input-group"
    role="group"
    class={cn(
      "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
      "h-9 has-[>textarea]:h-auto",

      // Variants based on alignment.
      "has-[>[data-align=inline-start]]:[&>input]:ps-2",
      "has-[>[data-align=inline-end]]:[&>input]:pe-2",
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

      // Focus state.
      "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

      // Error state.
      "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
      error && error.length > 0 ? "border-red-500" : "",

      className,
    )}
    {...props}
  >
    {@render children?.()}
  </div>

  {#if error && error.length > 0}
    {#if Array.isArray(error)}
      {#each error as e, index (index)}
        <p class="text-xs text-red-500" transition:fade>
          {e}
        </p>
      {/each}
    {:else}
      <p class="text-xs text-red-500" transition:fade>
        {error}
      </p>
    {/if}
  {/if}
</div>
