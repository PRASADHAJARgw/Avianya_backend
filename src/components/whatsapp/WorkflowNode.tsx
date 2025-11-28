import React from 'react';
import { MessageSquare, Clock, GitBranch, Play, Database, Webhook, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useWorkflowStore } from '../../store/workflowStore';
import { Button } from '../ui/button';
import { NodeProps, Handle, Position } from 'reactflow';

const nodeConfigs = {
  'whatsapp-message': {
    icon: MessageSquare,
    label: 'WhatsApp Message',
    color: 'bg-whatsapp',
    description: 'Send WhatsApp message'
  },
  'delay': {
    icon: Clock,
    label: 'Delay',
    color: 'bg-blue-500',
    description: 'Wait for specified time'
  },
  'condition': {
    icon: GitBranch,
    label: 'Condition',
    color: 'bg-purple-500',
    description: 'Branch workflow logic'
  },
  'trigger': {
    icon: Play,
    label: 'Trigger',
    color: 'bg-green-500',
    description: 'Start workflow'
  },
  'database': {
    icon: Database,
    label: 'Database',
    color: 'bg-orange-500',
    description: 'Database operation'
  },
  'webhook': {
    icon: Webhook,
    label: 'Webhook',
    color: 'bg-red-500',
    description: 'HTTP webhook'
  }
};

export const WorkflowNode: React.FC<NodeProps<any>> = ({ id, data, type, selected }) => {
  const config = nodeConfigs[(type as string) as keyof typeof nodeConfigs] || nodeConfigs['whatsapp-message'];
  const Icon = config.icon;
  const { selectedNodeId, setSelectedNode, deleteNode } = useWorkflowStore();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      className="select-none group"
      onClick={() => setSelectedNode(id)}
    >
      {/* Input Handle (target) */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="-left-2"
      />

      {/* Node body */}
      <div
        className={cn(
          "relative bg-gradient-node border border-node-border rounded-lg p-4 min-w-[150px] shadow-node",
          "hover:border-primary/50 transition-all duration-300 hover:shadow-glow",
          selectedNodeId === id && "border-primary shadow-glow"
        )}
      >
        {/* Node header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("p-2 rounded-md", config.color)}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{config.label}</h3>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {/* Node content */}
        {data?.message && (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-background/50 rounded">
            {data.message}
          </div>
        )}

        {/* Delete button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleDeleteClick}
        >
          <X className="w-3 h-3" />
        </Button>

        {/* Status indicator */}
        <div className="absolute top-2 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      {/* Output Handles (source) */}
      {type === 'condition' ? (
        <div className="absolute right-0 top-1/3 flex flex-col gap-2 -translate-x-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Yes</span>
            <Handle type="source" position={Position.Right} id="yes" className="!w-4 !h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">No</span>
            <Handle type="source" position={Position.Right} id="no" className="!w-4 !h-4" />
          </div>
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="-right-2"
        />
      )}
    </div>
  );
};