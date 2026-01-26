<script lang="ts">
  type Props = {
    text: string;
    max_length?: number;
  };

  let { text, max_length = 120 }: Props = $props();

  let expanded = $state(false);

  let is_long = $derived(text.length > max_length);
  let displayedText = $derived(
    !is_long || expanded ? text : text.slice(0, max_length) + "…",
  );
</script>

<span>
  {displayedText}

  {#if is_long}
    <button
      type="button"
      class="ml-1 text-blue-600 underline text-xs cursor-pointer"
      onclick={() => (expanded = !expanded)}
    >
      {expanded ? "Show less" : "Read more"}
    </button>
  {/if}
</span>
