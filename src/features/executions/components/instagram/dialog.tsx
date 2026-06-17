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
  accessToken: z.string().min(1, "Access token is required"),
  userId: z.string().min(1, "User ID is required"),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instagram Configuration</DialogTitle>
          <DialogDescription>Post a photo to Instagram Business via the Graph API.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
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
                <FormControl><Input type="password" placeholder="EAABwzL..." {...field} /></FormControl>
                <FormDescription>Page access token from Meta Developer Portal</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram User ID</FormLabel>
                <FormControl><Input placeholder="17841400000000000" {...field} /></FormControl>
                <FormDescription>Your Instagram Business Account ID</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormDescription>Public URL of the image to post</FormDescription>
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
