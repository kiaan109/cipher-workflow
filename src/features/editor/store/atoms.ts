import type { ReactFlowInstance, Node, Edge } from "@xyflow/react";
import { atom } from "jotai";

export const editorAtom = atom<ReactFlowInstance | null>(null);

// Exposes the actual React state setters so AI assistant can inject nodes/edges
export type EditorSetters = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export const editorSettersAtom = atom<EditorSetters | null>(null);
