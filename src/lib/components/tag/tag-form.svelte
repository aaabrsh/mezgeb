<script lang="ts">
  import type { Tag } from "@prisma-generated/client";
  import type { ActionData } from "../../../routes/(app)/tags/$types";
  import { enhance } from "$app/forms";
  import { FormGroup } from "@/components/ui/form-group";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";

  type Props = {
    form: ActionData;
    tag_to_edit: Tag | null;
    onClear: () => void;
  };

  let { form, tag_to_edit, onClear }: Props = $props();
  let form_pending = $state(false);
</script>

<form
  class="space-y-4"
  action={tag_to_edit ? "?/update" : "?/create"}
  method="POST"
  use:enhance={({ formData }) => {
    form_pending = true;
    form = null;
    if (tag_to_edit) {
      formData.append("id", tag_to_edit.id);
    }

    return async ({ update, result }) => {
      await update();
      form_pending = false;

      if (result.type === "success") {
        tag_to_edit = null;
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
        value={tag_to_edit?.name}
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
        value={tag_to_edit?.color}
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
      {#if tag_to_edit}
        {#if form_pending}
          Editing Tag...
        {:else}
          Edit Tag
        {/if}
      {:else if form_pending}
        Adding Tag...
      {:else}
        Add Tag
      {/if}
    </Button>
  </div>
</form>
