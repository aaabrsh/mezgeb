<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import "../app.css";

  let { children } = $props();
</script>

<ModeWatcher />
<Toaster position="bottom-center" richColors />
<section class="h-screen w-screen overflow-auto bg-background">
  {@render children()}
</section>
