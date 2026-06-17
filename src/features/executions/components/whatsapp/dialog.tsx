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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>WhatsApp Configuration</DialogTitle>
          <DialogDescription>Send a message via WhatsApp Business API.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
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
                <FormControl><Input type="password" placeholder="EAABwzL..." {...field} /></FormControl>
                <FormDescription>WhatsApp Business API access token</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phoneNumberId" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number ID</FormLabel>
                <FormControl><Input placeholder="123456789012345" {...field} /></FormControl>
                <FormDescription>From Meta Developer Portal → WhatsApp → Phone numbers</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to" render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Phone</FormLabel>
                <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                <FormDescription>Include country code (e.g. +1 for US)</FormDescription>
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
