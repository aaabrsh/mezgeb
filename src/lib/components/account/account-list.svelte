<script lang="ts">
  import { enhance } from "$app/forms";
  import AccountTypeBadge from "@/components/account/account-type-badge.svelte";
  import { Button } from "@/components/ui/button";
  import { ConfirmationModal } from "@/components/ui/confirmation-modal";
  import { ExpandableText } from "@/components/ui/expandable-text";
  import { Spinner } from "@/components/ui/spinner";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import type { AccountWithCurrency } from "@/types/account.type";
  import { formatAmountToString } from "@/utils/money.util";
  import { Pencil, Trash2 } from "@lucide/svelte";

  type Props = {
    accounts: AccountWithCurrency[];
    onEdit: (account: AccountWithCurrency) => void;
    onDeleteComplete: (accountId: string) => void;
  };

  let { accounts, onEdit, onDeleteComplete }: Props = $props();
  let loading = $state(false);
  let data_to_delete = $state<string | null>(null);
  let deletion_form: HTMLFormElement;
</script>

<div class="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead class="text-center">Type</TableHead>
        <TableHead>Description</TableHead>
        <TableHead class="text-end">Balance</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#if loading}
        <TableRow>
          <TableCell colspan={5} class="h-24 text-center m-auto">
            <Spinner class="m-auto size-7" />
          </TableCell>
        </TableRow>
      {:else}
        {#each accounts as account (account.id)}
          <TableRow>
            <TableCell class="font-medium">{account.name}</TableCell>
            <TableCell class="text-center">
              <AccountTypeBadge account_type={account.type} />
            </TableCell>
            <TableCell
              class="text-neutral-600 whitespace-normal break-words text-justify"
            >
              <ExpandableText text={account.description || "-"} />
            </TableCell>
            <TableCell class="text-end font-medium">
              {formatAmountToString(account.balance, account.currency.abbrev)}
            </TableCell>
            <TableCell>
              <Button
                variant="raw"
                class="rounded-full h-10 w-10 text-primary hover:bg-primary/20 transition p-2"
                onclick={() => onEdit(account)}
              >
                <Pencil size={16} />
              </Button>

              <Button
                variant="raw"
                class="rounded-full h-10 w-10 text-red-600 hover:bg-red-200 transition p-2"
                onclick={() => {
                  data_to_delete = account.id;
                }}
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        {:else}
          <TableRow>
            <TableCell colspan={5} class="h-24 text-center">
              No Accounts found
            </TableCell>
          </TableRow>
        {/each}
      {/if}
    </TableBody>
  </Table>
</div>

<!-- Hidden Currency Delete form to be triggered programmatically -->
<form
  method="POST"
  action="?/delete"
  bind:this={deletion_form}
  use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
      onDeleteComplete(data_to_delete || "");
      data_to_delete = null;
    };
  }}
>
  <input type="hidden" name="id" value={data_to_delete} />
</form>

<!-- Confirmation modal to be shown before deletion -->
<ConfirmationModal
  open={!!data_to_delete}
  onConfirm={() => {
    deletion_form?.requestSubmit();
  }}
  onClose={() => {
    data_to_delete = null;
  }}
  title="Are you sure you want to delete this account?"
  {loading}
/>
