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
  phoneNumberId: z.string().min(1, "Phone Number ID is required"),
  to: z.string().min(1, "Recipient phone number is required"),
  message: z.string().min(1, "Message is required"),
});

export type WhatsappFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: WhatsappFormValues) => void;
  defaultValues?: Partial<WhatsappFormValues>;
}

export const WhatsappDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<WhatsappFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", accessToken: "", phoneNumberId: "", to: "", message: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", accessToken: "", phoneNumberId: "", to: "", message: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myWhatsapp";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>WhatsApp</DialogTitle>
          <DialogDescription>Send a WhatsApp message via your Meta Business WhatsApp Cloud API account.</DialogDescription>
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
                <FormControl><Input placeholder="myWhatsapp" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.messageId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accessToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Access Token</FormLabel>
                <FormControl><Input type="password" placeholder="From Meta Business → WhatsApp → API Setup" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phoneNumberId" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number ID</FormLabel>
                <FormControl><Input placeholder="1234567890 — from Meta WhatsApp API Setup" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to" render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Phone</FormLabel>
                <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                <FormDescription>Include country code. Must be registered on WhatsApp.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="message" render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea placeholder="Hello! {{myAI.text}}" className="font-mono text-sm" {...field} /></FormControl>
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
