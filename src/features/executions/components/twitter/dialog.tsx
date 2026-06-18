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
  apiKey: z.string().min(1, "API Key is required"),
  apiKeySecret: z.string().min(1, "API Key Secret is required"),
  accessToken: z.string().min(1, "Access Token is required"),
  accessTokenSecret: z.string().min(1, "Access Token Secret is required"),
  text: z.string().min(1, "Tweet text is required").max(280, "Tweets cannot exceed 280 characters"),
});

export type TwitterFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TwitterFormValues) => void;
  defaultValues?: Partial<TwitterFormValues>;
}

export const TwitterDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<TwitterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", apiKey: "", apiKeySecret: "", accessToken: "", accessTokenSecret: "", text: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", apiKey: "", apiKeySecret: "", accessToken: "", accessTokenSecret: "", text: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myTwitter";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Twitter / X</DialogTitle>
          <DialogDescription>Post a tweet using your OAuth 1.0a credentials from the Twitter Developer Portal.</DialogDescription>
        </DialogHeader>
        <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm hover:bg-muted transition-colors">
          <span className="text-muted-foreground">Need credentials?</span>
          <span className="font-medium text-primary">developer.twitter.com ↗</span>
        </a>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-4 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myTwitter" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.tweetId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="apiKey" render={({ field }) => (
              <FormItem>
                <FormLabel>API Key (Consumer Key)</FormLabel>
                <FormControl><Input type="password" placeholder="From Twitter Developer Portal → App Keys" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="apiKeySecret" render={({ field }) => (
              <FormItem>
                <FormLabel>API Key Secret (Consumer Secret)</FormLabel>
                <FormControl><Input type="password" placeholder="From Twitter Developer Portal → App Keys" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accessToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Token</FormLabel>
                <FormControl><Input type="password" placeholder="From Twitter Developer Portal → Authentication Tokens" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accessTokenSecret" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Token Secret</FormLabel>
                <FormControl><Input type="password" placeholder="From Twitter Developer Portal → Authentication Tokens" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="text" render={({ field }) => (
              <FormItem>
                <FormLabel>Tweet Text</FormLabel>
                <FormControl><Textarea placeholder="Hello world! {{myAI.text}}" className="font-mono text-sm" {...field} /></FormControl>
                <FormDescription>Supports Handlebars variables. Max 280 chars.</FormDescription>
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
