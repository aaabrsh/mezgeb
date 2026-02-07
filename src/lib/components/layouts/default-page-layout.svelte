<script lang="ts">
  import { cn } from "@/utils";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    title?: string;
    subtitle?: string;
    class?: string;
  };

  let { title, subtitle, children, class: className }: Props = $props();
</script>

<div
  class={cn(
    "max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-10 space-y-4 sm:space-y-8",
    className,
  )}
>
  <!-- title -->
  <div>
    {#if title}
      <h1 class="text-2xl sm:text-3xl font-bold text-primary">{title}</h1>
    {/if}
    {#if subtitle}
      <p class="text-neutral-600 text-sm sm:text-base">
        {subtitle}
      </p>
    {/if}
  </div>

  <!-- Page Content -->
  {@render children?.()}
</div>
