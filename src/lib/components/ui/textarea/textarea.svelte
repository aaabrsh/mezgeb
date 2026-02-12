<script lang="ts">
  import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { fade } from "svelte/transition";

  type Props = WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
    error?: string | string[];
    containerClass?: string;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    containerClass,
    "data-slot": dataSlot = "textarea",
    error,
    ...restProps
  }: Props = $props();
</script>

<div class={cn("grid gap-1", containerClass)}>
  <textarea
    bind:this={ref}
    data-slot={dataSlot}
    class={cn(
      "grow border-input placeholder:text-neutral-500 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      error && error.length > 0 ? "border-red-500" : "",
      className,
    )}
    bind:value
    {...restProps}
  ></textarea>

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
