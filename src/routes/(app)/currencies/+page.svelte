<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import CurrencyList from "@/components/currency/currency-list.svelte";
  import type { Currency } from "@prisma/client";
  import CurrencyForm from "@/components/currency/currency-form.svelte";

  let { data, form } = $props();
  const global_currencies = $derived(data.global_currencies ?? []);
  const user_currencies = $derived(data.user_currencies ?? []);

  let currency_to_edit = $state<Currency | null>(null);

  const handleFormClear = () => {
    form = null;
    currency_to_edit = null;
  };

  const handleEditClick = (currency: Currency) => {
    currency_to_edit = currency;
  };

  const handleDeleteComplete = () => {
    currency_to_edit = null;
  };
</script>

<div class="max-w-4xl mx-auto px-4 py-10 space-y-8">
  <!-- title -->
  <div>
    <h1 class="text-3xl font-bold text-primary">Currencies</h1>
    <p class="text-neutral-600">
      Update the list of currencies you keep balances in.
    </p>
  </div>

  <!-- currency form -->
  <Card>
    <CardHeader>
      <CardTitle class="text-primary">Add New Currency</CardTitle>
    </CardHeader>
    <CardContent>
      <CurrencyForm {currency_to_edit} {form} onClear={handleFormClear} />
    </CardContent>
  </Card>

  <!-- currency list -->
  {#if global_currencies.length === 0 && user_currencies.length === 0}
    <Card>
      <CardHeader>
        <CardTitle class="text-primary">No currencies available</CardTitle>
      </CardHeader>

      <CardContent class="text-neutral-600">
        Start by adding the first currency to your workspace.
      </CardContent>
    </Card>
  {:else}
    <Card>
      {#if user_currencies.length > 0}
        <CardHeader>
          <CardTitle class="text-primary">Currencies Added by You</CardTitle>
        </CardHeader>

        <CardContent>
          <CurrencyList
            currencies={user_currencies}
            onEdit={handleEditClick}
            onDeleteComplete={handleDeleteComplete}
          />
        </CardContent>
      {/if}

      {#if global_currencies.length > 0}
        <CardHeader>
          <CardTitle class="text-primary">Default Currencies</CardTitle>
        </CardHeader>

        <CardContent>
          <CurrencyList currencies={global_currencies} />
        </CardContent>
      {/if}
    </Card>
  {/if}
</div>
