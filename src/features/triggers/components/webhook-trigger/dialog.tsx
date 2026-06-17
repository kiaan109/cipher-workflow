"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const schema = z.object({ variableName: z.string().min(1).regex(/^[A-Za-z_$][A-Za-z0-9_$]*/), path: z.string().optional() });
export type WebhookTriggerFormValues = z.infer<typeof schema>;
interface Props { open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (v: WebhookTriggerFormValues) => void; defaultValues?: Partial<WebhookTriggerFormValues>; }

export const WebhookTriggerDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<WebhookTriggerFormValues>({ resolver: zodResolver(schema), defaultValues: { variableName: "", path: "/webhook", ...defaultValues } });
  useEffect(() => { if (open) form.reset({ variableName: "", path: "/webhook", ...defaultValues }); }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Webhook Trigger</DialogTitle><DialogDescription>Trigger workflow via HTTP webhook</DialogDescription></DialogHeader>
      <Form {...form}><form onSubmit={form.handleSubmit(v => { onSubmit(v); onOpenChange(false); })} className="space-y-4 mt-2">
        <FormField control={form.control} name="variableName" render={({ field }) => (<FormItem><FormLabel>Variable Name</FormLabel><FormControl><Input placeholder="webhookData" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="path" render={({ field }) => (<FormItem><FormLabel>Webhook Path</FormLabel><FormControl><Input placeholder="/webhook/my-trigger" {...field} /></FormControl><FormDescription>The incoming payload will be available via the variable</FormDescription><FormMessage /></FormItem>)} />
        <DialogFooter><Button type="submit">Save</Button></DialogFooter>
      </form></Form>
    </DialogContent></Dialog>
  );
};
