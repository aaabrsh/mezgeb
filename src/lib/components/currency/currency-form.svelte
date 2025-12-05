<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { enhance } from "$app/forms";
  import { FormGroup } from "@/components/ui/form-group";
  import type { Currency } from "@prisma/client";
  import type { ActionData } from "../../../routes/(app)/currencies/$types";

  type Props = {
    form: ActionData;
    currency_to_edit: Currency | null;
    onClear: () => void;
  };

  let { form, currency_to_edit, onClear }: Props = $props();
  let form_pending = $state(false);

  const handleFormClear = () => {
    onClear();
  };
</script>

<form
  class="space-y-4"
  method="POST"
  action={currency_to_edit ? "?/update" : "?/create"}
  use:enhance={({ formData }) => {
    form_pending = true;
    if (currency_to_edit) {
      formData.append("id", currency_to_edit.id);
    }

    return async ({ update, result }) => {
      await update();
      form_pending = false;

      if (result.type === "success") {
        currency_to_edit = null;
      }
    };
  }}
>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    <FormGroup>
      <Label for="abbrev">Abbreviation</Label>
      <Input
        id="abbrev"
        name="abbrev"
        value={currency_to_edit?.abbrev}
        placeholder="USD"
        error={form?.errors?.abbrev?.[0]}
      />
    </FormGroup>

    <FormGroup>
      <Label for="symbol" optional>Symbol</Label>
      <Input
        id="symbol"
        name="symbol"
        value={currency_to_edit?.symbol}
        placeholder="$"
        error={form?.errors?.symbol?.[0]}
      />
    </FormGroup>

    <FormGroup>
      <Label for="name" optional>Name</Label>
      <Input
        id="name"
        name="name"
        value={currency_to_edit?.name}
        placeholder="US Dollar"
        error={form?.errors?.name?.[0]}
      />
    </FormGroup>
  </div>

  <div class="flex gap-3 justify-end">
    <Button
      variant="secondary"
      type="reset"
      onclick={handleFormClear}
      disabled={form_pending}>Clear</Button
    >
    <Button
      variant="default"
      type="submit"
      disabled={form_pending}
      loading={form_pending}
    >
      {#if currency_to_edit}
        Edit Currency
      {:else}
        Add Currency
      {/if}
    </Button>
  </div>
</form>
