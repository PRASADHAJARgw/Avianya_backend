// // // import React, { useRef, useState, useCallback } from 'react';
// // // import { WorkflowNode } from './WorkflowNode';
// // // import { NodeConnection } from './NodeConnection';
// // // import { useWorkflowStore } from '../../store/workflowStore';

// // // export const WorkflowCanvas = () => {
// // //   const canvasRef = useRef<HTMLDivElement>(null);
// // //   const { nodes, connections, addNode, updateNodePosition, addConnection } = useWorkflowStore();
// // //   const [draggedNode, setDraggedNode] = useState<{ id: string; offset: { x: number; y: number } } | null>(null);
// // //   const [isConnecting, setIsConnecting] = useState<{ from: string; fromHandle: string } | null>(null);

// // //   const handleDrop = useCallback((e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     const nodeType = e.dataTransfer.getData('nodeType');
// // //     if (!nodeType || !canvasRef.current) return;

// // //     const rect = canvasRef.current.getBoundingClientRect();
// // //     const x = e.clientX - rect.left;
// // //     const y = e.clientY - rect.top;

// // //     addNode({
// // //       id: `node-${Date.now()}`,
// // //       type: nodeType,
// // //       position: { x, y },
// // //       data: {},
// // //     });
// // //   }, [addNode]);

// // //   const handleDragOver = useCallback((e: React.DragEvent) => {
// // //     e.preventDefault();
// // //   }, []);

// // //   const handleNodeDragStart = (nodeId: string, offset: { x: number; y: number }) => {
// // //     setDraggedNode({ id: nodeId, offset });
// // //   };

// // //   const handleNodeDrag = useCallback((e: React.MouseEvent) => {
// // //     if (!draggedNode || !canvasRef.current) return;

// // //     const rect = canvasRef.current.getBoundingClientRect();
// // //     const x = e.clientX - rect.left - draggedNode.offset.x;
// // //     const y = e.clientY - rect.top - draggedNode.offset.y;

// // //     updateNodePosition(draggedNode.id, { x, y });
// // //   }, [draggedNode, updateNodePosition]);

// // //   const handleMouseUp = useCallback(() => {
// // //     setDraggedNode(null);
// // //   }, []);

// // //   const handleConnectionStart = (nodeId: string, handleId: string) => {
// // //     setIsConnecting({ from: nodeId, fromHandle: handleId });
// // //   };

// // //   const handleConnectionEnd = (nodeId: string, handleId: string) => {
// // //     if (isConnecting && isConnecting.from !== nodeId) {
// // //       addConnection({
// // //         id: `connection-${Date.now()}`,
// // //         from: isConnecting.from,
// // //         to: nodeId,
// // //         fromHandle: isConnecting.fromHandle,
// // //         toHandle: handleId,
// // //       });
// // //     }
// // //     setIsConnecting(null);
// // //   };

// // //   return (
// // //     <div 
// // //       ref={canvasRef}
// // //       className="relative w-full h-full bg-gradient-canvas overflow-hidden"
// // //       onDrop={handleDrop}
// // //       onDragOver={handleDragOver}
// // //       onMouseMove={handleNodeDrag}
// // //       onMouseUp={handleMouseUp}
// // //     >
// // //       {/* Grid background */}
// // //       <div 
// // //         className="absolute inset-0 opacity-20"
// // //         style={{
// // //           backgroundImage: `
// // //             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
// // //             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
// // //           `,
// // //           backgroundSize: '20px 20px'
// // //         }}
// // //       />

// // //       {/* Connections */}
// // //       <svg className="absolute inset-0 w-full h-full pointer-events-none">
// // //         {connections.map(connection => {
// // //           const fromNode = nodes.find(n => n.id === connection.from);
// // //           const toNode = nodes.find(n => n.id === connection.to);
// // //           if (!fromNode || !toNode) return null;

// // //           return (
// // //             <NodeConnection
// // //               key={connection.id}
// // //               from={{ x: fromNode.position.x + 150, y: fromNode.position.y + 30 }}
// // //               to={{ x: toNode.position.x, y: toNode.position.y + 30 }}
// // //             />
// // //           );
// // //         })}
// // //       </svg>

// // //       {/* Nodes */}
// // //       {nodes.map(node => (
// // //         <WorkflowNode
// // //           key={node.id}
// // //           id={node.id}
// // //           type={node.type}
// // //           position={node.position}
// // //           data={node.data}
// // //           onDragStart={handleNodeDragStart}
// // //           onConnectionStart={handleConnectionStart}
// // //           onConnectionEnd={handleConnectionEnd}
// // //         />
// // //       ))}

// // //       {/* Connection in progress */}
// // //       {isConnecting && (
// // //         <div className="absolute inset-0 pointer-events-none">
// // //           <div className="absolute top-2 left-2 text-sm text-muted-foreground bg-node-bg px-2 py-1 rounded">
// // //             Click on another node to connect
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // import React, { useCallback } from 'react';
// // import ReactFlow, { Background, Controls, addEdge, OnConnect, OnEdgesChange, OnNodesChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';
// // import 'reactflow/dist/style.css';

// // import { useWorkflowStore } from '../../store/workflowStore';
// // import { WorkflowNode } from './WorkflowNode'; // Your custom node component

// // // Define custom node types
// // const nodeTypes = {
// //   'whatsapp-message': WorkflowNode,
// //   'trigger': WorkflowNode,
// //   'delay': WorkflowNode,
// //   'condition': WorkflowNode,
// //   // ... add other custom nodes here
// // };

// // export const WorkflowCanvas = () => {
// //   const { nodes, edges, setNodes, setEdges, addNode, setSelectedNode } = useWorkflowStore();

// //   const onNodesChange: OnNodesChange = useCallback(
// //     (changes) => setNodes(applyNodeChanges(changes, nodes)),
// //     [setNodes, nodes]
// //   );

// //   const onEdgesChange: OnEdgesChange = useCallback(
// //     (changes) => setEdges(applyEdgeChanges(changes, edges)),
// //     [setEdges, edges]
// //   );

// //   const onConnect: OnConnect = useCallback(
// //     (connection) => setEdges(addEdge(connection, edges)),
// //     [setEdges, edges]
// //   );
    
// //   // Handle dropping a new node from the library
// //   const onDrop = useCallback(
// //     (event: React.DragEvent) => {
// //       event.preventDefault();
// //       const type = event.dataTransfer.getData('application/reactflow');
// //       if (!type) return;

// //       // You'll need access to the reactFlowInstance to project screen to flow coordinates
// //       // This can be done using the useReactFlow() hook inside this component.
// //       const position = { x: event.clientX, y: event.clientY }; // Simplified for example

// //       addNode({
// //         id: `node-${Date.now()}`,
// //         type,
// //         position,
// //         data: {},
// //       });
// //     },
// //     [addNode]
// //   );
    
// //   const onDragOver = useCallback((event: React.DragEvent) => {
// //     event.preventDefault();
// //     event.dataTransfer.dropEffect = 'move';
// //   }, []);

// //   return (
// //     <ReactFlow
// //       nodes={nodes}
// //       edges={edges}
// //       onNodesChange={onNodesChange}
// //       onEdgesChange={onEdgesChange}
// //       onConnect={onConnect}
// //       onDrop={onDrop}
// //       onDragOver={onDragOver}
// //       nodeTypes={nodeTypes}
// //       onNodeClick={(_, node) => setSelectedNode(node.id)}
// //       fitView
// //     >
// //       <Background />
// //       <Controls />
// //     </ReactFlow>
// //   );
// // };

// // src/components/whatsapp/WorkflowCanvas.tsx

// import React, { useCallback, useRef } from 'react';
// import ReactFlow, {
//   Background,
//   Controls,
//   addEdge,
//   OnConnect,
//   useNodesState,
//   useEdgesState,
//   useReactFlow, // Import the hook
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// import { useWorkflowStore } from '../../store/workflowStore';
// import { WorkflowNode } from './WorkflowNode';

// const nodeTypes = {
//   'whatsapp-message': WorkflowNode,
//   trigger: WorkflowNode,
//   delay: WorkflowNode,
//   condition: WorkflowNode,
//   database: WorkflowNode,
//   webhook: WorkflowNode,
// };

// export const WorkflowCanvas = () => {
//   const { nodes, edges, addNode, updateNodePosition, addConnection, setSelectedNode } = useWorkflowStore();
//   const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
//   const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const { project } = useReactFlow(); // Get the project function

//   const onConnect: OnConnect = useCallback(
//     (params) => addConnection({ ...params, id: `edge-${Date.now()}` }),
//     [addConnection]
//   );

//   const onDragOver = useCallback((event: React.DragEvent) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event: React.DragEvent) => {
//       event.preventDefault();

//       const type = event.dataTransfer.getData('application/reactflow');
//       if (typeof type === 'undefined' || !type) {
//         return;
//       }
      
//       // Use the 'project' function to get the correct position
//       const position = project({
//         x: event.clientX,
//         y: event.clientY,
//       });

//       const newNode = {
//         id: `node-${Date.now()}`,
//         type,
//         position,
//         data: {},
//       };

//       addNode(newNode);
//     },
//     [project, addNode] // Add dependencies here
//   );

//   // Update React Flow when Zustand store changes
//   React.useEffect(() => {
//     setNodes(nodes);
//   }, [nodes, setNodes]);

//   React.useEffect(() => {
//     setEdges(edges);
//   }, [edges, setEdges]);

//   return (
//     <div className="w-full h-full" ref={reactFlowWrapper}>
//       <ReactFlow
//         nodes={reactFlowNodes}
//         edges={reactFlowEdges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//         nodeTypes={nodeTypes}
//         onNodeClick={(_, node) => setSelectedNode(node.id)}
//         fitView
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };


// src/components/whatsapp/WorkflowCanvas.tsx

import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../../store/workflowStore';
import { WorkflowNode } from './WorkflowNode';

const nodeTypes = {
  'whatsapp-message': WorkflowNode,
  trigger: WorkflowNode,
  delay: WorkflowNode,
  condition: WorkflowNode,
  database: WorkflowNode,
  webhook: WorkflowNode,
};

// --- FIX: Use granular selectors (one per field) to avoid returning a new object
// from the selector on each render which can cause re-subscribing and loops.
const selectNodes = (state) => state.nodes;
const selectEdges = (state) => state.edges;
const selectOnNodesChange = (state) => state.onNodesChange;
const selectOnEdgesChange = (state) => state.onEdgesChange;
const selectAddConnection = (state) => state.addConnection;
const selectAddNode = (state) => state.addNode;
const selectSetSelectedNode = (state) => state.setSelectedNode;

export const WorkflowCanvas = () => {
  // The store hook now uses the stable selector function
  // Note: `useWorkflowStore` only accepts a selector in this project setup.
  // Selector function is defined outside the component to keep a stable
  // function reference so the store doesn't resubscribe every render.
  const nodes = useWorkflowStore(selectNodes);
  const edges = useWorkflowStore(selectEdges);
  const onNodesChange = useWorkflowStore(selectOnNodesChange);
  const onEdgesChange = useWorkflowStore(selectOnEdgesChange);
  const addConnection = useWorkflowStore(selectAddConnection);
  const addNode = useWorkflowStore(selectAddNode);
  const setSelectedNode = useWorkflowStore(selectSetSelectedNode);
  
  const { project } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      
      const position = project({
        x: event.clientX,
        y: event.clientY,
      });

      addNode({
        id: `node-${Date.now()}`,
        type,
        position,
        data: {},
      });
    },
    [project, addNode]
  );
  
  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={addConnection}
        onDrop={onDrop}
        onDragOver={onDragOver}
  nodeTypes={nodeTypes as any}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        onPaneClick={() => setSelectedNode(null)}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
  );
};