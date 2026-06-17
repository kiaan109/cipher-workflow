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
  bearerToken: z.string().min(1, "Bearer token is required"),
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
    defaultValues: { variableName: "", bearerToken: "", text: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", bearerToken: "", text: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myTwitter";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Twitter / X Configuration</DialogTitle>
          <DialogDescription>Post a tweet via the Twitter v2 API.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myTwitter" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.tweetId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bearerToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Bearer Token</FormLabel>
                <FormControl><Input type="password" placeholder="AAAAAA..." {...field} /></FormControl>
                <FormDescription>From the Twitter Developer Portal</FormDescription>
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
