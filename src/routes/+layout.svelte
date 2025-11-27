<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";

  let { children } = $props();
</script>

<ModeWatcher />
<section class="h-screen w-screen overflow-auto bg-background">
  {@render children()}
</section>
