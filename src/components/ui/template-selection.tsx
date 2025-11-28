import { ReactNode } from 'react';

export interface TemplateRequest {
  template_id: string;
  template_name: string;
  language: string;
  parameters?: Record<string, unknown>;
}

interface TemplateSelectionProps {
  children: ReactNode;
  onTemplateSubmit: (request: TemplateRequest) => Promise<void>;
}

export default function TemplateSelection({ children, onTemplateSubmit }: TemplateSelectionProps) {
  const handleClick = async () => {
    // For now, submit a simple template
    const mockTemplate: TemplateRequest = {
      template_id: 'hello_world',
      template_name: 'Hello World',
      language: 'en',
    };
    
    await onTemplateSubmit(mockTemplate);
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}