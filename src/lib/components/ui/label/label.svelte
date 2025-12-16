<script lang="ts">
  import { Label as LabelPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";

  type Props = LabelPrimitive.RootProps &
    (
      | { required?: boolean; optional?: undefined }
      | { optional?: boolean; required?: undefined }
    );

  let {
    ref = $bindable(null),
    class: className,
    required,
    optional,
    children,
    ...restProps
  }: Props = $props();
</script>

<LabelPrimitive.Root
  bind:ref
  data-slot="label"
  class={cn(
    "flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
    className
  )}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}

  {#if optional}
    <div class="text-neutral-600">(optional)</div>
  {/if}
  {#if required}
    <div class="text-neutral-600">(required)</div>
  {/if}
</LabelPrimitive.Root>
