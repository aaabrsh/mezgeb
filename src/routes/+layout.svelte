<script lang="ts">
  import { Routes } from "@/data/routes";
  import "../app.css";

  let { children, data } = $props();

  const { user } = data;
</script>

<nav>
  {#if user}
    <p>Logged in as {user.email}, {user.full_name}</p>
    <form method="POST" action={Routes.logout}><button>Logout</button></form>
  {:else}
    <a href={Routes.login}>Login</a>
    <a href={Routes.signup}>Sign up</a>
  {/if}
</nav>

{@render children()}
