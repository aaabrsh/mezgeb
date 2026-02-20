<script lang="ts">
  import TagForm from "@/components/tag/tag-form.svelte";
  import TagList from "@/components/tag/tag-list.svelte";
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
  import type { Tag } from "@prisma-generated/client";
  import { mode } from "mode-watcher";
  import { toast } from "svelte-sonner";

  let { data, form } = $props();
  const tags = $derived(data.tags);
  let tag_to_edit = $state<Tag | null>(null);
  let tags_card_theme = $state(mode.current);
  let ref: HTMLElement;

  $effect(() => {
    if (form?.message) {
      const _toast = form.success ? toast.success : toast.error;
      _toast(form.message);
    }
  });

  const handleFormClear = () => {
    form = null;
    tag_to_edit = null;
  };

  const handleEditClick = (tag: Tag) => {
    tag_to_edit = tag;
    ref.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleDeleteComplete = (tagId: string) => {
    if (tag_to_edit?.id === tagId) {
      form = null;
      tag_to_edit = null;
    }
  };

  const toggleTagsCardTheme = () => {
    tags_card_theme = tags_card_theme === "light" ? "dark" : "light";
  };
</script>

<DefaultPageLayout
  title="Tags"
  subtitle="Categorize your activities using tags to keep your finances organized"
>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Tags Form -->
    <Card class="col-span-1 h-fit">
      <CardHeader>
        <CardTitle class="text-primary">
          {tag_to_edit ? "Update Tag" : "Add New Tag"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div bind:this={ref}>
          <TagForm {tag_to_edit} {form} onClear={handleFormClear} />
        </div>
      </CardContent>
    </Card>

    <!-- Tags List -->
    <Card class={cn("col-span-1 sm:col-span-2", tags_card_theme)}>
      {#if tags.length === 0}
        <CardHeader>
          <CardTitle class="text-primary">No tags available</CardTitle>
        </CardHeader>

        <CardContent class="text-neutral-600">
          You haven't created any tags yet. Start by adding the first tag to
          organize your financial activities.
        </CardContent>
      {:else}
        <CardHeader>
          <CardTitle class="text-primary">Tags</CardTitle>
          <CardDescription>
            All your tags in one place — customize them to match how you manage
            your money
          </CardDescription>

          <!-- Card Theme Toggle -->
          <CardAction>
            <Button
              variant="raw"
              size="icon"
              class="text-primary dark:text-secondary relative"
              onclick={toggleTagsCardTheme}
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
          <TagList
            {tags}
            onEdit={handleEditClick}
            onDeleteComplete={handleDeleteComplete}
          />
        </CardContent>
      {/if}
    </Card>
  </div>
</DefaultPageLayout>
