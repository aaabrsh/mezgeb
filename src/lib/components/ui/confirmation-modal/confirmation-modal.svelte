<script lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

  type Props = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
  };

  let {
    open = false,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onClose,
  }: Props = $props();
</script>

<Dialog {open} onOpenChange={onClose}>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle class="text-lg font-semibold">
        {title}
      </DialogTitle>
      <DialogDescription class="text-sm text-muted-foreground">
        {description}
      </DialogDescription>
    </DialogHeader>

    <DialogFooter class="gap-2">
      <Button variant="outline" onclick={onClose} disabled={loading}>
        {cancelText}
      </Button>

      <Button
        variant="destructive"
        disabled={loading}
        {loading}
        onclick={onConfirm}
      >
        {#if loading}
          Processing...
        {:else}
          {confirmText}
        {/if}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
