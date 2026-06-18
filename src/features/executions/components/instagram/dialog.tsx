"use client";

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  variableName: z.string().min(1, "Variable name is required").regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, "Must be a valid identifier"),
  accessToken: z.string().min(1, "Access Token is required"),
  userId: z.string().min(1, "Instagram User ID is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  caption: z.string().optional(),
});

export type InstagramFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InstagramFormValues) => void;
  defaultValues?: Partial<InstagramFormValues>;
}

export const InstagramDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<InstagramFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", accessToken: "", userId: "", imageUrl: "", caption: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", accessToken: "", userId: "", imageUrl: "", caption: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myInstagram";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Instagram</DialogTitle>
          <DialogDescription>Post a photo to Instagram via the Meta Graph API. Requires an Instagram Business or Creator account connected to a Meta app.</DialogDescription>
        </DialogHeader>
        <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm hover:bg-muted transition-colors">
          <span className="text-muted-foreground">Need credentials?</span>
          <span className="font-medium text-primary">developers.facebook.com ↗</span>
        </a>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-4 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myInstagram" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.mediaId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accessToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Token</FormLabel>
                <FormControl><Input type="password" placeholder="From Meta Business → Instagram Graph API" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram User ID</FormLabel>
                <FormControl><Input placeholder="Your Instagram Business account ID" {...field} /></FormControl>
                <FormDescription>From Meta Business Suite → Settings → Instagram account ID</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormDescription>Must be a publicly accessible URL. Supports Handlebars variables.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="caption" render={({ field }) => (
              <FormItem>
                <FormLabel>Caption (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Check this out! {{myAI.text}}" className="font-mono text-sm" {...field} /></FormControl>
                <FormDescription>Supports Handlebars variables</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter><Button type="submit">Save</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
