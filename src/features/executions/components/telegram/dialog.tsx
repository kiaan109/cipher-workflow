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
  chatId: z.string().min(1, "Chat ID is required"),
  text: z.string().min(1, "Message text is required"),
});

export type TelegramFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TelegramFormValues) => void;
  defaultValues?: Partial<TelegramFormValues>;
}

export const TelegramDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<TelegramFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", chatId: "", text: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", chatId: "", text: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "myTelegram";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Telegram</DialogTitle>
          <DialogDescription>Send a Telegram message. Platform bot credentials are pre-configured.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="myTelegram" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.messageId}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="chatId" render={({ field }) => (
              <FormItem>
                <FormLabel>Chat ID</FormLabel>
                <FormControl><Input placeholder="-1001234567890" {...field} /></FormControl>
                <FormDescription>Your Telegram user ID, group, or channel chat ID</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="text" render={({ field }) => (
              <FormItem>
                <FormLabel>Message Text</FormLabel>
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
