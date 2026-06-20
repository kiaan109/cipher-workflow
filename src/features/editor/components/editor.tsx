"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { RotateCcwIcon } from 'lucide-react';
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow, useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";

import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from './add-node-button';
import { useSetAtom } from 'jotai';
import { editorAtom, editorSettersAtom, workflowIdAtom } from '../store/atoms';
import { NodeType } from '@/generated/prisma';
import { ExecuteWorkflowButton } from './execute-workflow-button';

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const {
    data: workflow
  } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);
  const setEditorSetters = useSetAtom(editorSettersAtom);
  const setWorkflowId = useSetAtom(workflowIdAtom);
  const saveWorkflow = useUpdateWorkflow();
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const initialNodesRef = useRef<Node[]>(workflow.nodes);
  const initialEdgesRef = useRef<Edge[]>(workflow.edges);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  // Expose state setters so Cipher AI can inject nodes/edges from outside
  useEffect(() => {
    setEditorSetters({ setNodes, setEdges });
    return () => setEditorSetters(null);
  }, [setEditorSetters, setNodes, setEdges]);

  useEffect(() => {
    setWorkflowId(workflowId);
    return () => setWorkflowId(null);
  }, [setWorkflowId, workflowId]);

  const triggerAutoSave = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveWorkflow.mutate({ id: workflowId, nodes: currentNodes, edges: currentEdges });
    }, 1500);
  }, [workflowId, saveWorkflow]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    triggerAutoSave(nodes, edges);
  }, [nodes, edges]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ctrl/Cmd+S forces an immediate save instead of waiting for the autosave debounce.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        saveWorkflow.mutate({ id: workflowId, nodes, edges });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges, workflowId, saveWorkflow]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const handleReset = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
    setNodes(initialNodesRef.current);
    setEdges(initialEdgesRef.current);
  }, []);

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER || node.type === NodeType.INITIAL);
  }, [nodes]);

  return (
    <div className='size-full'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeComponents}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        <Panel position="top-left">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            className="gap-2 border-white/70 bg-white/90 shadow-sm backdrop-blur-md"
          >
            <RotateCcwIcon className="size-4" />
            Reset workflow
          </Button>
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
