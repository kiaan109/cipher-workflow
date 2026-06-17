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
  apiKey: z.string().min(1, "API key is required"),
  spreadsheetId: z.string().min(1, "Spreadsheet ID is required"),
  range: z.string().min(1, "Range is required"),
  values: z.string().min(1, "Values are required"),
});

export type GoogleSheetsFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GoogleSheetsFormValues) => void;
  defaultValues?: Partial<GoogleSheetsFormValues>;
}

export const GoogleSheetsDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<GoogleSheetsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { variableName: "", apiKey: "", spreadsheetId: "", range: "Sheet1!A1", values: "", ...defaultValues },
  });

  useEffect(() => {
    if (open) form.reset({ variableName: "", apiKey: "", spreadsheetId: "", range: "Sheet1!A1", values: "", ...defaultValues });
  }, [open, defaultValues, form]);

  const watchVar = form.watch("variableName") || "mySheets";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Sheets Configuration</DialogTitle>
          <DialogDescription>Append data to a Google Sheet.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => { onSubmit(v); onOpenChange(false); })} className="space-y-6 mt-4">
            <FormField control={form.control} name="variableName" render={({ field }) => (
              <FormItem>
                <FormLabel>Variable Name</FormLabel>
                <FormControl><Input placeholder="mySheets" {...field} /></FormControl>
                <FormDescription>Reference as {`{{${watchVar}.updatedRows}}`}</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="apiKey" render={({ field }) => (
              <FormItem>
                <FormLabel>Google API Key</FormLabel>
                <FormControl><Input type="password" placeholder="AIzaSy..." {...field} /></FormControl>
                <FormDescription>From Google Cloud Console → Credentials</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="spreadsheetId" render={({ field }) => (
              <FormItem>
                <FormLabel>Spreadsheet ID</FormLabel>
                <FormControl><Input placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" {...field} /></FormControl>
                <FormDescription>From the spreadsheet URL</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="range" render={({ field }) => (
              <FormItem>
                <FormLabel>Range</FormLabel>
                <FormControl><Input placeholder="Sheet1!A1" {...field} /></FormControl>
                <FormDescription>A1 notation range to append to</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="values" render={({ field }) => (
              <FormItem>
                <FormLabel>Values (JSON array)</FormLabel>
                <FormControl><Textarea placeholder={'[["{{myAI.text}}", "{{myData.date}}"]]'} className="font-mono text-sm" {...field} /></FormControl>
                <FormDescription>2D JSON array of values. Supports Handlebars.</FormDescription>
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
