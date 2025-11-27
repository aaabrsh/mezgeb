<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import ThemeToggle from "@/components/ui/theme-toggle/theme-toggle.svelte";
  import { Routes } from "@/data/routes";

  let { children, data } = $props();

  let user = $derived(data.user);
</script>

<!-- Page Wrapper -->
<div class="w-full h-full flex flex-col">
  <!-- NAVBAR -->
  <nav class="w-full bg-card shadow-md">
    <div class="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
      <!-- Left side: Logo + Title -->
      <div class="flex items-center gap-3">
        <a class="hover:underline text-md" href={Routes.home}>Home</a>
        <a class="hover:underline text-md" href={Routes.currencies}>
          Currencies
        </a>
      </div>

      <!-- Right side: User / Actions -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
          <p class="text-md opacity-90">
            {user.full_name}
          </p>
          <p class="text-sm opacity-70">{user.email}</p>
        </div>

        <form method="POST" action={Routes.logout}>
          <Button type="submit" variant="secondary">Logout</Button>
        </form>

        <ThemeToggle />
      </div>
    </div>
  </nav>

  <!-- Main Content Container -->
  <main class="max-w-6xl w-full h-full mx-auto flex-1">
    {@render children()}
  </main>
</div>
