// import React, { useRef } from 'react';
// import { Play, Square, Save, Download, Upload, Zap, Settings } from 'lucide-react';
// import { Button } from './ui/button';
// import { Separator } from './ui/separator';
// import { useToast } from '../../hooks/use-toast';
// import { useWorkflowStore } from '../../store/workflowStore';
// import { ThemeToggle } from './ThemeToggle';

// export const WorkflowToolbar = () => {
//   const { toast } = useToast();
//   const exportFlow = useWorkflowStore((s) => (s as any).exportFlow);
//   const importFlow = useWorkflowStore((s) => (s as any).importFlow);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleRun = () => {
//     toast({
//       title: "Workflow Started",
//       description: "Your WhatsApp automation workflow is now running.",
//     });
//   };

//   const handleSave = () => {
//     const flowData = exportFlow();
//     const name = window.prompt('Enter a name for this workflow', flowData.name || 'New Workflow') || flowData.name;
//     const payload = { name: name, flow_json: flowData };

//     fetch('http://localhost:8080/api/workflow', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })
//       .then(async (res) => {
//         if (!res.ok) throw new Error(await res.text());
//         toast({
//           title: 'Workflow Saved',
//           description: 'Your workflow has been saved successfully.',
//         });
//       })
//       .catch((err) => {
//         console.error('Save failed', err);
//         toast({
//           title: 'Save Failed',
//           description: 'Failed to save workflow. See console for details.',
//           variant: 'destructive',
//         });
//       });
//   };

//   const handleExport = () => {
//     const flowData = exportFlow();
//     const blob = new Blob([JSON.stringify(flowData, null, 2)], {
//       type: 'application/json',
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `workflow-${flowData.flowId}.json`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
    
//     toast({
//       title: "Workflow Exported",
//       description: "Your workflow has been exported as JSON.",
//     });
//   };

//   const handleImport = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const flowData = JSON.parse(e.target?.result as string);
//         importFlow(flowData);
//         toast({
//           title: "Workflow Imported",
//           description: "Your workflow has been imported successfully.",
//         });
//       } catch (error) {
//         toast({
//           title: "Import Error",
//           description: "Failed to import workflow. Please check the file format.",
//           variant: "destructive",
//         });
//       }
//     };
//     reader.readAsText(file);
    
//     // Reset the input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   return (
//     <div className="h-14 bg-gradient-glass backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-2">
//           <Zap className="w-6 h-6 text-whatsapp" />
//           <h1 className="text-lg font-semibold text-foreground">WhatsApp Automation</h1>
//         </div>
        
//         <Separator orientation="vertical" className="h-6" />
        
//         <div className="flex items-center gap-2">
//           <Button variant="default" size="sm" onClick={handleRun} className="bg-gradient-primary">
//             <Play className="w-4 h-4 mr-2" />
//             Run Workflow
//           </Button>
//           <Button variant="outline" size="sm">
//             <Square className="w-4 h-4 mr-2" />
//             Stop
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <Button variant="ghost" size="sm" onClick={handleSave}>
//           <Save className="w-4 h-4 mr-2" />
//           Save
//         </Button>
//         <Button variant="ghost" size="sm" onClick={handleExport}>
//           <Download className="w-4 h-4 mr-2" />
//           Export
//         </Button>
//         <Button variant="ghost" size="sm" onClick={handleImport}>
//           <Upload className="w-4 h-4 mr-2" />
//           Import
//         </Button>
        
//         <Separator orientation="vertical" className="h-6" />
        
//         <ThemeToggle />
//         <Button variant="ghost" size="sm">
//           <Settings className="w-4 h-4" />
//         </Button>

//         {/* Hidden file input for import */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".json"
//           onChange={handleFileUpload}
//           style={{ display: 'none' }}
//         />
//       </div>
//     </div>
//   );
// };

import React, { useRef } from 'react';
import { Play, Square, Save, Download, Upload, Zap, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useToast } from '../../hooks/use-toast';
import { useWorkflowStore } from '../../store/workflowStore';
import { ThemeToggle } from './ThemeToggle';

export const WorkflowToolbar = () => {
  const { toast } = useToast();
  const exportFlow = useWorkflowStore((s) => (s as any).exportFlow);
  const importFlow = useWorkflowStore((s) => (s as any).importFlow);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRun = () => {
    toast({
      title: "Workflow Started",
      description: "Your WhatsApp automation workflow is now running.",
    });
  };

  const handleSave = () => {
    const flowData = exportFlow();
    const name = window.prompt('Enter a name for this workflow', flowData.name || 'New Workflow') || flowData.name;
    const payload = { name: name, flow_json: flowData };

    fetch('http://localhost:8080/api/workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        toast({
          title: 'Workflow Saved',
          description: 'Your workflow has been saved successfully.',
        });
      })
      .catch((err) => {
        console.error('Save failed', err);
        toast({
          title: 'Save Failed',
          description: 'Failed to save workflow. See console for details.',
          variant: 'destructive',
        });
      });
  };

  const handleExport = () => {
    const flowData = exportFlow();
    const blob = new Blob([JSON.stringify(flowData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${flowData.flowId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Workflow Exported",
      description: "Your workflow has been exported as JSON.",
    });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target?.result as string);
        importFlow(flowData);
        toast({
          title: "Workflow Imported",
          description: "Your workflow has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import workflow. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-14 bg-gradient-glass backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-whatsapp" />
          <h1 className="text-lg font-semibold text-foreground">WhatsApp Automation</h1>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleRun} className="bg-gradient-primary">
            <Play className="w-4 h-4 mr-2" />
            Run Workflow
          </Button>
          <Button variant="outline" size="sm">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="ghost" size="sm" onClick={handleImport}>
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <ThemeToggle />
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};