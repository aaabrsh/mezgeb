<script lang="ts">
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils.js";
  import { Eye, EyeClosed } from "@lucide/svelte";
  import { Button } from "@/components/ui/button";
  import { fade } from "svelte/transition";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, "type"> & {
      error?: string | string[];
    } & (
        | { type: "file"; files?: FileList }
        | { type?: InputType; files?: undefined }
      )
  >;

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    error,
    ...restProps
  }: Props = $props();

  let showPassword = $state(false);
</script>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot="input"
    class={cn(
      "selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground/70 shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      error && error.length > 0 ? "border-red-500" : "",
      className
    )}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else if type === "password"}
  <div class="relative">
    <input
      bind:this={ref}
      data-slot="input"
      class={cn(
        "border-input selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground/70 shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "pr-10",
        error && error.length > 0 ? "border-red-500" : "",
        className
      )}
      type={showPassword ? "text" : "password"}
      bind:value
      {...restProps}
    />
    <Button
      class={cn(
        "absolute top-0 right-0",
        error && error.length > 0 ? "text-red-500" : ""
      )}
      variant="raw"
      onclick={() => (showPassword = !showPassword)}
    >
      {#if showPassword}
        <EyeClosed />
      {:else}
        <Eye />
      {/if}
    </Button>
  </div>
{:else}
  <input
    bind:this={ref}
    data-slot="input"
    class={cn(
      "border-input selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground/70 shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      error && error.length > 0 ? "border-red-500" : "",
      className
    )}
    {type}
    bind:value
    {...restProps}
  />
{/if}

{#if error && error.length > 0}
  {#if Array.isArray(error)}
    {#each error as e, index (index)}
      <p class="text-xs text-red-500" transition:fade>
        {e}
      </p>
    {/each}
  {:else}
    <p class="text-xs text-red-500" transition:fade>
      {error}
    </p>
  {/if}
{/if}
