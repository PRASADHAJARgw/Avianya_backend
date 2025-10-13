//  import React from 'react';
//  import { MessageSquare, Clock, GitBranch, Play, Database, Webhook } from 'lucide-react';
//  import { cn } from '../../lib/utils';

//  const nodeTypes = [
//    {
//      type: 'trigger',
//      icon: Play,
//      label: 'Trigger',
//      description: 'Start your workflow',
//      color: 'bg-green-500'
//    },
//    {
//      type: 'whatsapp-message',
//      icon: MessageSquare,
//      label: 'WhatsApp Message',
//      description: 'Send WhatsApp message',
//      color: 'bg-whatsapp'
//    },
//    {
//      type: 'delay',
//      icon: Clock,
//      label: 'Delay',
//      description: 'Wait for specified time',
//      color: 'bg-blue-500'
//    },
//    {
//      type: 'condition',
//      icon: GitBranch,
//      label: 'Condition',
//      description: 'Branch workflow logic',
//      color: 'bg-purple-500'
//    },
//    {
//      type: 'database',
//      icon: Database,
//      label: 'Database',
//      description: 'Store or retrieve data',
//      color: 'bg-orange-500'
//    },
//    {
//      type: 'webhook',
//      icon: Webhook,
//      label: 'Webhook',
//      description: 'HTTP request',
//      color: 'bg-red-500'
//    }
//  ];

//  export const NodeLibrary = () => {
//    const handleDragStart = (e: React.DragEvent, nodeType: string) => {
//      e.dataTransfer.setData('nodeType', nodeType);
//    };

//    return (
//      <div className="w-72 bg-gradient-glass backdrop-blur-sm border-r border-border h-full p-4">
//        <div className="mb-6">
//          <h2 className="text-lg font-semibold text-foreground mb-2">Node Library</h2>
//          <p className="text-sm text-muted-foreground">Drag nodes to the canvas to build your workflow</p>
//        </div>

//        <div className="space-y-3">
//          {nodeTypes.map((nodeType) => {
//            const Icon = nodeType.icon;
//            return (
//              <div
//                key={nodeType.type}
//                draggable
//                onDragStart={(e) => handleDragStart(e, nodeType.type)}
//                className={cn(
//                  "flex items-center gap-3 p-3 bg-gradient-node border border-node-border rounded-lg cursor-grab",
//                  "hover:border-primary/50 transition-all duration-300 hover:shadow-node group"
//                )}
//              >
//                <div className={cn("p-2 rounded-md", nodeType.color)}>
//                  <Icon className="w-4 h-4 text-white" />
//                </div>
//                <div className="flex-1">
//                  <h3 className="text-sm font-medium text-foreground">{nodeType.label}</h3>
//                  <p className="text-xs text-muted-foreground">{nodeType.description}</p>
//                </div>
//              </div>
//            );
//          })}
//        </div>

//        <div className="mt-8 p-4 bg-gradient-node border border-node-border rounded-lg">
//          <h3 className="text-sm font-medium text-foreground mb-2">Quick Start</h3>
//          <p className="text-xs text-muted-foreground">
//            1. Drag a trigger node to start<br/>
//            2. Add WhatsApp message nodes<br/>
//            3. Connect nodes to create flow<br/>
//            4. Configure each node's settings
//          </p>
//        </div>
//      </div>
//    );
//  };


//  src/components/whatsapp/NodeLibrary.tsx

import React from 'react';
import { MessageSquare, Clock, GitBranch, Play, Database, Webhook } from 'lucide-react';
import { cn } from '../../lib/utils';

const nodeTypes = [
  {
    type: 'trigger',
    icon: Play,
    label: 'Trigger',
    description: 'Start your workflow',
    color: 'bg-green-500'
  },
  {
    type: 'whatsapp-message',
    icon: MessageSquare,
    label: 'WhatsApp Message',
    description: 'Send WhatsApp message',
    color: 'bg-whatsapp'
  },
  {
    type: 'delay',
    icon: Clock,
    label: 'Delay',
    description: 'Wait for specified time',
    color: 'bg-blue-500'
  },
  {
    type: 'condition',
    icon: GitBranch,
    label: 'Condition',
    description: 'Branch workflow logic',
    color: 'bg-purple-500'
  },
  {
    type: 'database',
    icon: Database,
    label: 'Database',
    description: 'Store or retrieve data',
    color: 'bg-orange-500'
  },
  {
    type: 'webhook',
    icon: Webhook,
    label: 'Webhook',
    description: 'HTTP request',
    color: 'bg-red-500'
  }
];

export const NodeLibrary = () => {
  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    //  Correctly set the dataTransfer type for React Flow
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-gradient-glass backdrop-blur-sm border-r border-border h-full p-4">
      {/* ... (rest of the component JSX is unchanged) */}
      <div className="mb-6">
         <h2 className="text-lg font-semibold text-foreground mb-2">Node Library</h2>
         <p className="text-sm text-muted-foreground">Drag nodes to the canvas to build your workflow</p>
       </div>

       <div className="space-y-3">
         {nodeTypes.map((nodeType) => {
           const Icon = nodeType.icon;
           return (
             <div
               key={nodeType.type}
               draggable
               onDragStart={(e) => handleDragStart(e, nodeType.type)}
               className={cn(
                 "flex items-center gap-3 p-3 bg-gradient-node border border-node-border rounded-lg cursor-grab",
                 "hover:border-primary/50 transition-all duration-300 hover:shadow-node group"
               )}
             >
               <div className={cn("p-2 rounded-md", nodeType.color)}>
                 <Icon className="w-4 h-4 text-white" />
               </div>
               <div className="flex-1">
                 <h3 className="text-sm font-medium text-foreground">{nodeType.label}</h3>
                 <p className="text-xs text-muted-foreground">{nodeType.description}</p>
               </div>
             </div>
           );
         })}
       </div>

       <div className="mt-8 p-4 bg-gradient-node border border-node-border rounded-lg">
         <h3 className="text-sm font-medium text-foreground mb-2">Quick Start</h3>
         <p className="text-xs text-muted-foreground">
           1. Drag a trigger node to start<br/>
           2. Add WhatsApp message nodes<br/>
           3. Connect nodes to create flow<br/>
           4. Configure each node's settings
         </p>
       </div>
    </div>
  );
};