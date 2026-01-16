<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from "@/components/ui/select";
  import { cn } from "@/utils";
  import { Select as SelectPrimitive } from "bits-ui";
  import { fade } from "svelte/transition";

  type Props = SelectPrimitive.RootProps & {
    items: { label: string; value: string; disabled?: boolean }[];
    placeholder?: string;
    error?: string | string[];
  };

  let {
    items,
    placeholder = "Select an option",
    error,
    value = $bindable(),
    name,
    ...restProps
  }: Props = $props();
</script>

<div class="grid gap-1">
  <Select {name} bind:value={value as never} {...restProps}>
    <SelectTrigger
      class={cn("w-full", error && error.length > 0 ? "border-red-500" : "")}
    >
      {value || placeholder}
    </SelectTrigger>
    <SelectContent>
      {#each items as { label, value, disabled = false }}
        <SelectItem {value} {disabled}>{label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>

  <!-- shadcn Select does not submit values automatically, so we use hidden input element. -->
  <input type="hidden" {name} {value} />

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
</div>
