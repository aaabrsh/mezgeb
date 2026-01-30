<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = { children: Snippet; title?: string; subtitle?: string };

  let { title, subtitle, children }: Props = $props();
</script>

<div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
  <!-- title -->
  <div>
    {#if title}
      <h1 class="text-3xl font-bold text-primary">{title}</h1>
    {/if}
    {#if subtitle}
      <p class="text-neutral-600">
        {subtitle}
      </p>
    {/if}
  </div>

  <!-- Page Content -->
  {@render children?.()}
</div>
