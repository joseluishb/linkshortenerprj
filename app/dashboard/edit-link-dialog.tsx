"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateLinkAction } from "./actions";
import { SelectLink } from "@/db";
import { useRouter } from "next/navigation";

interface EditLinkDialogProps {
  link: SelectLink;
}

export function EditLinkDialog({ link }: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setUrl(link.url);
      setShortCode(link.shortCode);
      setError(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateLinkAction({ id: link.id, url, shortCode });
      if ("error" in result) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit short link</DialogTitle>
          <DialogDescription>
            Update the destination URL or short code for this link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label htmlFor="edit-url" className="text-sm font-medium">
              Destination URL
            </label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="edit-shortCode" className="text-sm font-medium">
              Short code
            </label>
            <Input
              id="edit-shortCode"
              placeholder="my-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
