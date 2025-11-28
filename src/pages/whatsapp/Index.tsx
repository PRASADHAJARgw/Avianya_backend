// import React from 'react';
// import { WorkflowCanvas } from '../../components/whatsapp/WorkflowCanvas';
// import { NodeLibrary } from '../../components/whatsapp/NodeLibrary';
// import { PropertiesPanel } from '../../components/whatsapp/PropertiesPanel';
// import { WorkflowToolbar } from '../../components/whatsapp/WorkflowToolbar';

// const Index = () => {
//   return (
//     <div className='w-auto'>
//     <div className="h-screen bg-gradient-canvas flex flex-col overflow-hidden w-auto">
//       <WorkflowToolbar />
      
//       <div className="flex-1 flex">
//         <NodeLibrary />
        
//         <div className="flex-1 relative">
//           <WorkflowCanvas />
//         </div>
        
//         <PropertiesPanel />
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Index;

import React from 'react';
import { Header } from '../../components/whatsapp/Header';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css'; // Import React Flow styles

import { WorkflowCanvas } from '../../components/whatsapp/WorkflowCanvas';
import { NodeLibrary } from '../../components/whatsapp/NodeLibrary';
import { PropertiesPanel } from '../../components/whatsapp/PropertiesPanel';
import { WorkflowToolbar } from '../../components/whatsapp/WorkflowToolbar';

const Index = () => {
  return (
    <div className='w-auto'>
      {/* <Header /> */}
      <div className="h-screen bg-gradient-canvas flex flex-col overflow-hidden w-auto">
        <ReactFlowProvider>
          <WorkflowToolbar />
          <div className="flex-1 flex">
            <NodeLibrary />
            <div className="flex-1 relative">
              <WorkflowCanvas />
            </div>
            <PropertiesPanel />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;