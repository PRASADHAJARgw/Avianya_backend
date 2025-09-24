// // import { create } from 'zustand';

// // interface Node {
// //   id: string;
// //   type: string;
// //   position: { x: number; y: number };
// //   data: any;
// // }

// // interface Connection {
// //   id: string;
// //   from: string;
// //   to: string;
// //   fromHandle: string;
// //   toHandle: string;
// // }

// // interface WorkflowStore {
// //   nodes: Node[];
// //   connections: Connection[];
// //   selectedNode: string | null;
// //   addNode: (node: Node) => void;
// //   updateNodePosition: (id: string, position: { x: number; y: number }) => void;
// //   updateNodeData: (id: string, data: any) => void;
// //   addConnection: (connection: Connection) => void;
// //   setSelectedNode: (id: string | null) => void;
// //   deleteNode: (id: string) => void;
// //   deleteConnection: (id: string) => void;
// //   exportFlow: () => any;
// //   importFlow: (flowData: any) => void;
// //   clearAll: () => void;
// // }

// // export const useWorkflowStore = create<WorkflowStore>((set) => ({
// //   nodes: [],
// //   connections: [],
// //   selectedNode: null,
  
// //   addNode: (node) =>
// //     set((state) => ({
// //       nodes: [...state.nodes, node],
// //     })),
  
// //   updateNodePosition: (id, position) =>
// //     set((state) => ({
// //       nodes: state.nodes.map((node) =>
// //         node.id === id ? { ...node, position } : node
// //       ),
// //     })),
  
// //   updateNodeData: (id, data) =>
// //     set((state) => ({
// //       nodes: state.nodes.map((node) =>
// //         node.id === id ? { ...node, data } : node
// //       ),
// //     })),
  
// //   addConnection: (connection) =>
// //     set((state) => ({
// //       connections: [...state.connections, connection],
// //     })),
  
// //   setSelectedNode: (id) =>
// //     set(() => ({
// //       selectedNode: id,
// //     })),
  
// //   deleteNode: (id) =>
// //     set((state) => ({
// //       nodes: state.nodes.filter((node) => node.id !== id),
// //       connections: state.connections.filter(
// //         (conn) => conn.from !== id && conn.to !== id
// //       ),
// //       selectedNode: state.selectedNode === id ? null : state.selectedNode,
// //     })),
  
// //   deleteConnection: (id) =>
// //     set((state) => ({
// //       connections: state.connections.filter((conn) => conn.id !== id),
// //     })),

// //   exportFlow: () => {
// //     const state = useWorkflowStore.getState();
// //     return {
// //       flowId: `flow_${Date.now()}`,
// //       name: "WhatsApp Automation Flow",
// //       nodes: state.nodes.map(node => ({
// //         id: node.id,
// //         type: node.type,
// //         position: node.position,
// //         data: node.data
// //       })),
// //       edges: state.connections.map(conn => ({
// //         id: conn.id,
// //         from: conn.from,
// //         to: conn.to,
// //         fromHandle: conn.fromHandle,
// //         toHandle: conn.toHandle
// //       })),
// //       createdBy: "user_123",
// //       createdAt: new Date().toISOString()
// //     };
// //   },

// //   importFlow: (flowData) =>
// //     set(() => ({
// //       nodes: flowData.nodes || [],
// //       connections: flowData.edges || [],
// //       selectedNode: null,
// //     })),

// //   clearAll: () =>
// //     set(() => ({
// //       nodes: [],
// //       connections: [],
// //       selectedNode: null,
// //     })),
// // }));


// // src/store/workflowStore.ts

// import { create } from 'zustand';
// import {
//   Node,
//   Edge,
//   OnNodesChange,
//   OnEdgesChange,
//   applyNodeChanges,
//   applyEdgeChanges,
//   Connection,
//   addEdge,
// } from 'reactflow';

// interface WorkflowState {
//   nodes: Node[];
//   edges: Edge[];
//   selectedNodeId: string | null;
  
//   onNodesChange: OnNodesChange;
//   onEdgesChange: OnEdgesChange;
//   addConnection: (connection: Connection) => void;

//   addNode: (node: Node) => void;
//   updateNodeData: (id: string, data: any) => void;
//   setSelectedNode: (id: string | null) => void;
//   deleteNode: (id: string) => void;
//   exportFlow: () => any;
//   importFlow: (flowData: any) => void;
// }

// export const useWorkflowStore = create<WorkflowState>((set, get) => ({
//   nodes: [],
//   edges: [],
//   selectedNodeId: null,

//   onNodesChange: (changes) => {
//     set({
//       nodes: applyNodeChanges(changes, get().nodes),
//     });
//   },

//   onEdgesChange: (changes) => {
//     set({
//       edges: applyEdgeChanges(changes, get().edges),
//     });
//   },
  
//   addConnection: (connection) => {
//     set({
//       edges: addEdge(connection, get().edges),
//     });
//   },

//   addNode: (node) => {
//     set({
//       nodes: [...get().nodes, node],
//     });
//   },
  
//   // Replace the node.data object entirely with the provided `data`.
//   // PropertiesPanel will build the full payload object and pass it here.
//   updateNodeData: (id, data) =>
//     set((state) => ({
//       nodes: state.nodes.map((node) =>
//         node.id === id ? { ...node, data: data } : node
//       ),
//     })),

//   setSelectedNode: (id) => {
//     set({ selectedNodeId: id });
//   },
  
//   deleteNode: (id) => {
//     set((state) => ({
//       nodes: state.nodes.filter((n) => n.id !== id),
//       edges: state.edges.filter((e) => e.source !== id && e.target !== id),
//       selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
//     }));
//   },
  
//   exportFlow: () => {
//     const state = get();
//     // Clean node data by removing UI-only fields (keys starting with '_' and interactiveType)
//     const cleanNodes = state.nodes.map((n) => {
//       const data = n.data || {};
//       const cleanData: any = {};
//       Object.keys(data).forEach((k) => {
//         if (k.startsWith('_')) return; // skip UI-only
//         if (k === 'interactiveType') return; // skip form-only
//         cleanData[k] = data[k];
//       });
//       return { id: n.id, type: n.type, position: n.position, data: cleanData };
//     });

//     return {
//       flowId: `flow_${Date.now()}`,
//       name: 'WhatsApp Automation Flow',
//       nodes: cleanNodes,
//       edges: state.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: (e as any).sourceHandle, targetHandle: (e as any).targetHandle })),
//       createdAt: new Date().toISOString(),
//     };
//   },

//   importFlow: (flowData) => {
//     set(() => ({
//       nodes: flowData.nodes || [],
//       edges: flowData.edges || [],
//       selectedNodeId: null,
//     }));
//   },
// }));

import { create } from 'zustand';
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addConnection: (connection: Connection) => void;

  addNode: (node: Omit<Node, 'id'>) => void;
  updateNodeData: (id: string, data: any) => void;
  setSelectedNode: (id: string | null) => void;
  deleteNode: (id: string) => void;
  exportFlow: () => any;
  importFlow: (flowData: any) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  addConnection: (connection) => {
    const { source, target } = connection;
    set((state) => {
      const newEdges = addEdge(connection, state.edges);
      const newNodes = state.nodes.map(node => {
        if (node.id === source) {
          return {
            ...node,
            data: {
              ...node.data,
              outputs: {
                ...node.data.outputs,
                [target as string]: { nextNodeId: target }
              }
            }
          };
        }
        if (node.id === target) {
          return {
            ...node,
            data: {
              ...node.data,
              inputs: {
                ...node.data.inputs,
                [source as string]: { previousNodeId: source }
              }
            }
          };
        }
        return node;
      });
      return { edges: newEdges, nodes: newNodes };
    });
  },

  addNode: (node) => {
    const newNode = { ...node, id: uuidv4() };
    set({
      nodes: [...get().nodes, newNode],
    });
  },
  
  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },
  
  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },
  
  exportFlow: () => {
    const state = get();
    const cleanNodes = state.nodes.map((n) => {
      const data = n.data || {};
      const cleanData: any = {};
      Object.keys(data).forEach((k) => {
        if (k.startsWith('_')) return;
        if (k === 'interactiveType') return;
        cleanData[k] = data[k];
      });
      return { id: n.id, type: n.type, position: n.position, data: cleanData };
    });

    return {
      flowId: `flow_${Date.now()}`,
      name: 'WhatsApp Automation Flow',
      nodes: cleanNodes,
      edges: state.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: (e as any).sourceHandle, targetHandle: (e as any).targetHandle })),
      createdAt: new Date().toISOString(),
    };
  },

  importFlow: (flowData) => {
    set(() => ({
      nodes: flowData.nodes || [],
      edges: flowData.edges || [],
      selectedNodeId: null,
    }));
  },
}));