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
  personUrn: z.string().min(1, "Person URN is required"),
  text: z.string().min(1, "Post text is required"),
});

export type LinkedinFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: LinkedinFormValues) => void;
  defaultValues?: Partial<LinkedinFormValues>;
}

export const LinkedinDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<LinkedinFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", accessToken: "", personUrn: "", text: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", accessToken: "", personUrn: "", text: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myLinkedin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>LinkedIn Configuration</DialogTitle>
          <DialogDescription>Post an update to LinkedIn via the UGC Posts API.</DialogDescription>
        </DialogHeader>
        <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm hover:bg-muted transition-colors">
          <span className="text-muted-foreground">Need credentials?</span>
          <span className="font-medium text-primary">linkedin.com/developers ↗</span>
        </a>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myLinkedin" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.postId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accessToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Token</FormLabel>
                <FormControl><Input type="password" placeholder="AQV..." {...field} /></FormControl>
                <FormDescription>OAuth 2.0 access token from LinkedIn Developer Portal</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="personUrn" render={({ field }) => (
              <FormItem>
                <FormLabel>Person URN</FormLabel>
                <FormControl><Input placeholder="urn:li:person:XXXXXXXXXX" {...field} /></FormControl>
                <FormDescription>Your LinkedIn person URN (from /v2/me)</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="text" render={({ field }) => (
              <FormItem>
                <FormLabel>Post Text</FormLabel>
                <FormControl><Textarea placeholder="Excited to share... {{myAI.text}}" className="font-mono text-sm" {...field} /></FormControl>
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
