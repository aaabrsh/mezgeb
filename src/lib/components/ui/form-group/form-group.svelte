<script lang="ts">
  import { cn } from "@/utils";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    class?: string;
  };
  let { children, class: className }: Props = $props();
</script>

<div class={cn("grid gap-2", className)}>
  {@render children()}
</div>
