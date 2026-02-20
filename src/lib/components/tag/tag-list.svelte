<script lang="ts">
  import { enhance } from "$app/forms";
  import TagBadge from "@/components/tag/tag-badge.svelte";
  import { ConfirmationModal } from "@/components/ui/confirmation-modal";
  import type { Tag } from "@prisma-generated/client";

  type Props = {
    tags: Tag[];
    onEdit: (tag: Tag) => void;
    onDeleteComplete: (categroyId: string) => void;
  };

  let { tags, onEdit, onDeleteComplete }: Props = $props();
  let delete_pending: Record<string, boolean> = $state({});
  let data_to_delete = $state<string | null>(null);
  let deletion_form: HTMLFormElement;
</script>

<div class="flex gap-4 flex-wrap">
  {#each tags as tag (tag.id)}
    <TagBadge
      {tag}
      showEdit={true}
      {onEdit}
      showDelete={true}
      loading={delete_pending[tag.id]}
      onDelete={(tag) => (data_to_delete = tag.id)}
    />
  {/each}
</div>

<!-- Hidden Tag Delete form to be triggered programmatically -->
<form
  method="POST"
  action="?/delete"
  bind:this={deletion_form}
  use:enhance={() => {
    delete_pending[data_to_delete || ""] = true;
    return async ({ update }) => {
      await update();
      delete_pending[data_to_delete || ""] = false;
      data_to_delete && onDeleteComplete(data_to_delete);
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
  title="Are you sure you want to delete this tag?"
  loading={delete_pending[data_to_delete || ""]}
/>
