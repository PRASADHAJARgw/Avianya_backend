export interface TemplateRequest {
  template_id: string;
  template_name: string;
  language: string;
  parameters?: Record<string, unknown>;
}