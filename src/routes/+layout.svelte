<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<section class="h-screen w-screen overflow-auto bg-background">
  {@render children()}
</section>
