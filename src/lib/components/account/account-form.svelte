<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "@/components/ui/button";
  import { FormGroup } from "@/components/ui/form-group";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { DropdownInput } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";
  import type { Account, Currency } from "@prisma-generated/client";
  import type { ActionData } from "../../../routes/(app)/accounts/$types";
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
  } from "@/components/ui/input-group";

  type Props = {
    form: ActionData;
    account_to_edit: Account | null;
    account_types: string[];
    currencies: Currency[];
    onClear: () => void;
  };

  let { form, account_to_edit, account_types, currencies, onClear }: Props =
    $props();
  let form_pending = $state(false);
  let selected_currency_id = $state<string>("");
  let selected_currency = $derived(
    currencies.find((currency) => currency.id === selected_currency_id),
  );

  $effect(() => {
    selected_currency_id = account_to_edit?.currencyId || "";
  });
</script>

<form
  class="space-y-4"
  method="POST"
  action={account_to_edit ? "?/update" : "?/create"}
  use:enhance={({ formData }) => {
    form_pending = true;
    form = null;
    if (account_to_edit) {
      formData.append("id", account_to_edit.id);
    }

    return async ({ update, result }) => {
      await update();
      form_pending = false;

      if (result.type === "success") {
        account_to_edit = null;
      }
    };
  }}
>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    <div class="grid gap-4">
      <FormGroup>
        <Label for="name" required>Name</Label>
        <Input
          id="name"
          name="name"
          value={account_to_edit?.name}
          placeholder="ABC Bank - 1234"
          error={form?.errors?.name?.[0]}
        />
      </FormGroup>

      <FormGroup>
        <Label for="type" required>Type</Label>
        <DropdownInput
          type="single"
          name="type"
          items={account_types.map((type) => ({ label: type, value: type }))}
          value={account_to_edit?.type}
          placeholder="Select Type"
          error={form?.errors?.type?.[0]}
        />
      </FormGroup>
    </div>

    <div class="grid gap-4">
      <FormGroup>
        <Label for="currencyId" required>Currency</Label>
        <DropdownInput
          type="single"
          name="currencyId"
          items={currencies.map((currency) => ({
            label:
              `${currency.name}` +
              (currency.symbol ? ` - ${currency.symbol}` : ""),
            value: currency.id,
          }))}
          bind:value={selected_currency_id}
          placeholder="Select Currency"
          error={form?.errors?.currencyId?.[0]}
        />
      </FormGroup>

      <FormGroup>
        <Label for="balance" optional>Starting Balance</Label>
        <InputGroup error={form?.errors?.balance?.[0]}>
          {#if selected_currency?.symbol}
            <InputGroupAddon>
              <InputGroupText>{selected_currency.symbol}</InputGroupText>
            </InputGroupAddon>
          {/if}
          <InputGroupInput
            id="balance"
            name="balance"
            type="number"
            step="0.01"
            value={account_to_edit?.balance || 0}
            placeholder="19.99"
          />
          {#if selected_currency?.abbrev}
            <InputGroupAddon align="inline-end">
              <InputGroupText>{selected_currency?.abbrev}</InputGroupText>
            </InputGroupAddon>
          {/if}
        </InputGroup>
      </FormGroup>
    </div>

    <FormGroup class="h-full flex flex-col">
      <Label for="description" optional>Description</Label>
      <Textarea
        id="description"
        name="description"
        class="resize-none"
        containerClass="h-full"
        placeholder="any notes or remarks about the account"
        value={account_to_edit?.description}
        error={form?.errors?.description?.[0]}
      />
    </FormGroup>
  </div>

  <div class="flex gap-3 justify-end">
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
      {#if account_to_edit}
        {#if form_pending}
          Editing Account...
        {:else}
          Edit Account
        {/if}
      {:else if form_pending}
        Adding Account...
      {:else}
        Add Account
      {/if}
    </Button>
  </div>
</form>
