<script lang="ts">
  let { children } = $props();
</script>

<div class="grid gap-2">
  {@render children()}
</div>
