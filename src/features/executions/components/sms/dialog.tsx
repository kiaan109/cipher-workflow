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
  accountSid: z.string().min(1, "Account SID is required"),
  authToken: z.string().min(1, "Auth token is required"),
  to: z.string().min(1, "Recipient phone is required"),
  from: z.string().min(1, "Sender phone is required"),
  body: z.string().min(1, "Message body is required"),
});

export type SmsFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SmsFormValues) => void;
  defaultValues?: Partial<SmsFormValues>;
}

export const SmsDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<SmsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", accountSid: "", authToken: "", to: "", from: "", body: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", accountSid: "", authToken: "", to: "", from: "", body: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "mySms";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS Configuration</DialogTitle>
          <DialogDescription>Send an SMS via Twilio.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="mySms" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.messageSid}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="accountSid" render={({ field }) => (
              <FormItem>
                <FormLabel>Account SID</FormLabel>
                <FormControl><Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} /></FormControl>
                <FormDescription>From Twilio Console Dashboard</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="authToken" render={({ field }) => (
              <FormItem>
                <FormLabel>Auth Token</FormLabel>
                <FormControl><Input type="password" placeholder="..." {...field} /></FormControl>
                <FormDescription>From Twilio Console Dashboard</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to" render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                <FormDescription>Recipient number with country code</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from" render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl><Input placeholder="+10987654321" {...field} /></FormControl>
                <FormDescription>Your Twilio phone number</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="body" render={({ field }) => (
              <FormItem>
                <FormLabel>Message Body</FormLabel>
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
