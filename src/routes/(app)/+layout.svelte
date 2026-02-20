<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import { ThemeToggle } from "@/components/ui/theme-toggle";
  import { Routes } from "@/data/routes";
  import { page } from "$app/state";

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
        <a
          class={page.url.pathname === Routes.home ? "active" : ""}
          href={Routes.home}>Home</a
        >
        <a
          class={page.url.pathname === Routes.accounts ? "active" : ""}
          href={Routes.accounts}
        >
          Accounts
        </a>
        <a
          class={page.url.pathname === Routes.currencies ? "active" : ""}
          href={Routes.currencies}
        >
          Currencies
        </a>
        <a
          class={page.url.pathname === Routes.tags ? "active" : ""}
          href={Routes.tags}
        >
          Tags
        </a>
      </div>

      <!-- Right side: User / Actions -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col">
          <p class="text-base font-semibold opacity-90">
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

<style lang="postcss">
  @reference "../../app.css";

  a {
    @apply text-sm font-semibold opacity-60;
  }

  a:hover {
    @apply text-primary opacity-100;
  }

  a.active {
    @apply pb-1 border-b-8 border-b-primary text-primary text-base opacity-100;
  }
</style>
