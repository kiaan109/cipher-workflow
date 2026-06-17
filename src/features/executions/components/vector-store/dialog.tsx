"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { useEffect } from "react";

const schema = z.object({
  variableName: z.string().min(1).regex(/^[A-Za-z_$][A-Za-z0-9_$]*/),
  operation: z.string(),
  indexHost: z.string().min(1),
  vector: z.string().optional(),
  id: z.string().optional(),
  metadata: z.string().optional(),
  topK: z.number().optional(),
});
export type VectorStoreFormValues = z.infer<typeof schema>;
interface Props { open: boolean; onOpenChange: (o: boolean) => void; onSubmit: (v: VectorStoreFormValues) => void; defaultValues?: Partial<VectorStoreFormValues>; }

const defaults = (dv: Partial<VectorStoreFormValues> = {}): VectorStoreFormValues => ({
  variableName: dv.variableName ?? "",
  operation: dv.operation ?? "query",
  indexHost: dv.indexHost ?? "",
  vector: dv.vector ?? "",
  id: dv.id ?? "",
  metadata: dv.metadata ?? "",
  topK: dv.topK ?? 5,
});

export const VectorStoreDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<VectorStoreFormValues>({
    resolver: zodResolver(schema) as Resolver<VectorStoreFormValues>,
    defaultValues: defaults(defaultValues),
  });
  useEffect(() => { if (open) form.reset(defaults(defaultValues)); }, [open]);
  const watchOp = form.watch("operation");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Vector Store (Pinecone)</DialogTitle><DialogDescription>Store and query vector embeddings</DialogDescription></DialogHeader>
      <Form {...form}><form onSubmit={form.handleSubmit(v => { onSubmit(v); onOpenChange(false); })} className="space-y-4 mt-2">
        <FormField control={form.control} name="variableName" render={({ field }) => (<FormItem><FormLabel>Variable Name</FormLabel><FormControl><Input placeholder="results" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="operation" render={({ field }) => (<FormItem><FormLabel>Operation</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="query">Query (search)</SelectItem><SelectItem value="upsert">Upsert (store)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="indexHost" render={({ field }) => (<FormItem><FormLabel>Index Host URL</FormLabel><FormControl><Input placeholder="https://my-index.svc.pinecone.io" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="vector" render={({ field }) => (<FormItem><FormLabel>Vector (JSON array)</FormLabel><FormControl><Input placeholder="{{myEmbedding.embedding}}" {...field} /></FormControl><FormDescription>Supports {`{{variables}}`}</FormDescription><FormMessage /></FormItem>)} />
        {watchOp === "upsert" && (<><FormField control={form.control} name="id" render={({ field }) => (<FormItem><FormLabel>Vector ID</FormLabel><FormControl><Input placeholder="doc-123" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="metadata" render={({ field }) => (<FormItem><FormLabel>Metadata (JSON)</FormLabel><FormControl><Input placeholder='{"source": "article"}' {...field} /></FormControl><FormMessage /></FormItem>)} /></>)}
        {watchOp === "query" && (<FormField control={form.control} name="topK" render={({ field }) => (<FormItem><FormLabel>Top K Results</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl><FormMessage /></FormItem>)} />)}
        <DialogFooter><Button type="submit">Save</Button></DialogFooter>
      </form></Form>
    </DialogContent></Dialog>
  );
};
