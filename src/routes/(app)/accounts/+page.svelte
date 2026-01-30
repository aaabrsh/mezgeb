<script lang="ts">
  import AccountForm from "@/components/account/account-form.svelte";
  import AccountList from "@/components/account/account-list.svelte";
  import DefaultPageLayout from "@/components/layouts/default-page-layout.svelte";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import type { AccountWithCurrency } from "@/types/account.type.js";
  import type { Account } from "@prisma-generated/client";
  import { toast } from "svelte-sonner";

  let { data, form } = $props();
  let accounts = $derived(data.accounts);
  let account_types = $derived(data.account_types);
  let currencies = $derived(data.currencies);
  let account_to_edit = $state<Account | null>(null);
  let ref: HTMLElement;

  $effect(() => {
    if (form?.message) {
      const _toast = form.success ? toast.success : toast.error;
      _toast(form.message);
    }
  });

  const handleFormClear = () => {
    form = null;
    account_to_edit = null;
  };

  const handleEditClick = (account: AccountWithCurrency | Account) => {
    account_to_edit = account;
    ref.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteComplete = (accountId: string) => {
    if (account_to_edit?.id === accountId) {
      form = null;
      account_to_edit = null;
    }
  };
</script>

<DefaultPageLayout
  title="Accounts"
  subtitle="Keep track of all the account you use to manage your finances."
>
  <!-- Accounts Form -->
  <Card>
    <CardHeader>
      <CardTitle class="text-primary">
        {account_to_edit ? "Update Account" : "Add New Account"}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div bind:this={ref}>
        <AccountForm
          {account_to_edit}
          {form}
          {account_types}
          {currencies}
          onClear={handleFormClear}
        />
      </div>
    </CardContent>
  </Card>

  <!-- Accounts List -->
  <Card>
    {#if accounts.length === 0}
      <CardHeader>
        <CardTitle>No Accounts available</CardTitle>
      </CardHeader>

      <CardContent class="text-neutral-600">
        You haven't added any accounts yet. Create one to get started.
      </CardContent>
    {:else}
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
      </CardHeader>

      <CardContent>
        <AccountList
          {accounts}
          onEdit={handleEditClick}
          onDeleteComplete={handleDeleteComplete}
        />
      </CardContent>
    {/if}
  </Card>
</DefaultPageLayout>
