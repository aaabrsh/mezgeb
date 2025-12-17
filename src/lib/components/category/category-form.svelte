<script lang="ts">
  import type { Category } from "@prisma-generated/client";
  import type { ActionData } from "../../../routes/(app)/categories/$types";
  import { enhance } from "$app/forms";
  import { FormGroup } from "@/components/ui/form-group";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  type Props = {
    form: ActionData;
    category_to_edit: Category | null;
    onClear: () => void;
  };

  let { form, category_to_edit, onClear }: Props = $props();
  let form_pending = $state(false);
</script>

<form
  class="space-y-4"
  action={category_to_edit ? "?/update" : "?/create"}
  method="POST"
  use:enhance={({ formData }) => {
    form_pending = true;
    form = null;
    if (category_to_edit) {
      formData.append("id", category_to_edit.id);
    }

    return async ({ update, result }) => {
      await update();
      form_pending = false;

      if (result.type === "success") {
        category_to_edit = null;
      }
    };
  }}
>
  <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"> -->
  <div class="grid w-full gap-4 items-start">
    <FormGroup>
      <Label for="name" required>Name</Label>
      <Input
        id="name"
        name="name"
        value={category_to_edit?.name}
        placeholder="Bill Payment"
        error={form?.errors?.name?.[0]}
      />
    </FormGroup>
    <FormGroup>
      <Label for="color">Color</Label>
      <Input
        id="color"
        name="color"
        type="color"
        value={category_to_edit?.color}
        error={form?.errors?.color?.[0]}
      />
    </FormGroup>
  </div>

  <div class="flex gap-3 justify-end flex-wrap">
    <Button
      variant="secondary"
      type="reset"
      onclick={onClear}
      disabled={form_pending}>Clear</Button
    >
    <Button
      variant="default"
      type="submit"
      disabled={form_pending}
      loading={form_pending}
    >
      {#if category_to_edit}
        {#if form_pending}
          Editing Category...
        {:else}
          Edit Category
        {/if}
      {:else if form_pending}
        Adding Category...
      {:else}
        Add Category
      {/if}
    </Button>
  </div>
</form>
