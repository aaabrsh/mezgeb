<script lang="ts">
  import CategoryForm from "@/components/category/category-form.svelte";
  import CategoryList from "@/components/category/category-list.svelte";
  import DefaultPageLayout from "@/components/layouts/default-page-layout.svelte";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { cn } from "@/utils";
  import { MoonIcon, SunIcon } from "@lucide/svelte";
  import type { Category } from "@prisma-generated/client";
  import { mode } from "mode-watcher";
  import { toast } from "svelte-sonner";

  let { data, form } = $props();
  const categories = $derived(data.categories);
  let category_to_edit = $state<Category | null>(null);
  let categories_card_theme = $state(mode.current);
  let ref: HTMLElement;

  $effect(() => {
    if (form?.message) {
      const _toast = form.success ? toast.success : toast.error;
      _toast(form.message);
    }
  });

  const handleFormClear = () => {
    form = null;
    category_to_edit = null;
  };

  const handleEditClick = (category: Category) => {
    category_to_edit = category;
    ref.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteComplete = (categoryId: string) => {
    if (category_to_edit?.id === categoryId) {
      form = null;
      category_to_edit = null;
    }
  };

  const toggleCategoriesCardTheme = () => {
    categories_card_theme =
      categories_card_theme === "light" ? "dark" : "light";
  };
</script>

<DefaultPageLayout
  title="Categories"
  subtitle="Categorize your activities to keep your finances organized"
>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Categories Form -->
    <Card class="col-span-1 h-fit">
      <CardHeader>
        <CardTitle class="text-primary">
          {category_to_edit ? "Update Category" : "Add New Category"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div bind:this={ref}>
          <CategoryForm {category_to_edit} {form} onClear={handleFormClear} />
        </div>
      </CardContent>
    </Card>

    <!-- Categories List -->
    <Card class={cn("col-span-1 sm:col-span-2", categories_card_theme)}>
      {#if categories.length === 0}
        <CardHeader>
          <CardTitle class="text-primary">No categories available</CardTitle>
        </CardHeader>

        <CardContent class="text-neutral-600">
          You haven't created any categories yet. Start by adding the first
          category to organize your financial activities.
        </CardContent>
      {:else}
        <CardHeader>
          <CardTitle class="text-primary">Categories</CardTitle>
          <CardDescription>
            All your categories in one place — customize them to match how you
            manage your money
          </CardDescription>

          <!-- Card Theme Toggle -->
          <CardAction>
            <Button
              variant="raw"
              size="icon"
              class="text-primary dark:text-secondary relative"
              onclick={toggleCategoriesCardTheme}
            >
              <SunIcon
                class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
              />
              <MoonIcon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
              />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <CategoryList
            {categories}
            onEdit={handleEditClick}
            onDeleteComplete={handleDeleteComplete}
          />
        </CardContent>
      {/if}
    </Card>
  </div>
</DefaultPageLayout>
