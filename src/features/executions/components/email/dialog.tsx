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
  apiKey: z.string().min(1, "SendGrid API key is required"),
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  fromEmail: z.string().optional(),
  fromName: z.string().optional(),
});

export type EmailFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmailFormValues) => void;
  defaultValues?: Partial<EmailFormValues>;
}

export const EmailDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", apiKey: "", to: "", subject: "", body: "", fromEmail: "", fromName: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", apiKey: "", to: "", subject: "", body: "", fromEmail: "", fromName: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myEmail";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Configuration</DialogTitle>
          <DialogDescription>Send an email via SendGrid.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myEmail" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.sent}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="apiKey" render={({ field }) => (
              <FormItem>
                <FormLabel>SendGrid API Key</FormLabel>
                <FormControl><Input type="password" placeholder="SG...." {...field} /></FormControl>
                <FormDescription>From SendGrid API Keys settings</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to" render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl><Input placeholder="user@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="subject" render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl><Input placeholder="Hello from Cipher! {{myData.title}}" {...field} /></FormControl>
                <FormDescription>Supports Handlebars variables</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem>
                <FormLabel>Body (HTML)</FormLabel>
                <FormControl><Textarea placeholder="<p>{{myAI.text}}</p>" className="min-h-[100px] font-mono text-sm" {...field} /></FormControl>
                <FormDescription>HTML supported. Supports Handlebars variables.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fromEmail" render={({ field }) => (
              <FormItem>
                <FormLabel>From Email (Optional)</FormLabel>
                <FormControl><Input placeholder="noreply@cipher.app" {...field} /></FormControl>
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
