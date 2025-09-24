// // import React, { useEffect, useState } from 'react';
// // // --- FIX: Added 'X' to the import list ---
// // import { Settings, Trash2, Copy, HelpCircle, X } from 'lucide-react'; 
// // import { Button } from './ui/button';
// // import { Input } from './ui/input';
// // import { Label } from './ui/label';
// // import { Textarea } from './ui/textarea';
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// // import { Separator } from './ui/separator';
// // import { useWorkflowStore } from '../../store/workflowStore';
// // import { useToast } from '../../hooks/use-toast';
// // import { cn } from '../../lib/utils';
// // import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// // // Helper component for consistent section titles
// // const PanelSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
// //   <div className="space-y-4">
// //     <h4 className="text-sm font-semibold text-foreground">{title}</h4>
// //     <div className="space-y-4 pl-2 border-l-2 border-border ml-2">{children}</div>
// //   </div>
// // );

// // // Helper for labels with tooltips
// // const TooltipLabel = ({ htmlFor, children, tooltipText }: { htmlFor: string; children: React.ReactNode; tooltipText: string }) => (
// //   <div className="flex items-center gap-2">
// //     <Label htmlFor={htmlFor}>{children}</Label>
// //     <TooltipProvider>
// //       <Tooltip>
// //         <TooltipTrigger asChild>
// //           <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
// //         </TooltipTrigger>
// //         <TooltipContent>
// //           <p>{tooltipText}</p>
// //         </TooltipContent>
// //       </Tooltip>
// //     </TooltipProvider>
// //   </div>
// // );

// // // Small component to fetch templates and let the user pick one
// // function TemplatePicker({ value, onSelect }: { value?: string; onSelect: (t: { temp_title?: string; id?: string; raw?: any } | null) => void }) {
// //   const [templates, setTemplates] = useState<Array<any>>([]);
// //   const [loadingTemplates, setLoadingTemplates] = useState(false);
// //   const [templatesError, setTemplatesError] = useState<string | null>(null);

// //   useEffect(() => {
// //     let mounted = true;
// //     setLoadingTemplates(true);
// //     fetch('http://localhost:8080/templates')
// //       .then(async (res) => {
// //         const text = await res.text();
// //         try {
// //           return JSON.parse(text);
// //         } catch {
// //           try {
// //             return res.json();
// //           } catch (err) {
// //             throw new Error('Failed to parse templates response');
// //           }
// //         }
// //       })
// //       .then((data) => {
// //         if (!mounted) return;
// //         // ensure array
// //         const list = Array.isArray(data) ? data : (data?.templates ?? []);
// //         setTemplates(list);
// //       })
// //       .catch((err) => {
// //         console.error('Templates fetch error', err);
// //         if (mounted) setTemplatesError(String(err));
// //       })
// //       .finally(() => {
// //         if (mounted) setLoadingTemplates(false);
// //       });

// //     return () => { mounted = false; };
// //   }, []);

// //   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const id = e.target.value;
// //     if (!id) {
// //       onSelect(null);
// //       return;
// //     }
// //     const sel = templates.find((t: any) => String(t.id) === id || String(t.temp_title) === id);
// //     if (sel) {
// //       // Pass minimal data: temp_title and id, and raw object for future use
// //       onSelect({ temp_title: sel.temp_title ?? sel.name ?? '', id: sel.id, raw: sel });
// //     } else {
// //       onSelect(null);
// //     }
// //   };

// //   return (
// //     <div className="mb-3">
// //       <label className="block text-sm font-medium mb-1">Choose Template</label>
// //       {loadingTemplates && <div>Loading templates...</div>}
// //       {templatesError && <div className="text-red-600">Error loading templates: {templatesError}</div>}
// //       {!loadingTemplates && !templatesError && (
// //         <select value={value ?? ''} onChange={handleChange} className="w-full border rounded px-2 py-1">
// //           <option value="">-- select template --</option>
// //           {templates.map((t: any) => (
// //             <option key={t.id ?? t.temp_title} value={t.id ?? t.temp_title}>
// //               {t.temp_title ?? t.name ?? `Template ${t.id ?? ''}`}
// //             </option>
// //           ))}
// //         </select>
// //       )}
// //     </div>
// //   );
// // }

// // export const PropertiesPanel = () => {
// //   const { selectedNodeId, nodes, updateNodeData, deleteNode, addNode, setSelectedNode } = useWorkflowStore();
// //   const { toast } = useToast();

// //   const node = nodes.find(n => n.id === selectedNodeId);

// //   if (!selectedNodeId || !node) {
// //     return (
// //       <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full p-4 flex flex-col">
// //         <div className="flex items-center gap-2 mb-6">
// //           <Settings className="w-5 h-5 text-primary" />
// //           <h2 className="text-lg font-semibold text-foreground">Properties</h2>
// //         </div>
// //         <div className="text-center text-muted-foreground my-auto">
// //           <div className="w-16 h-16 bg-node-bg rounded-lg mx-auto mb-4 flex items-center justify-center">
// //             <Settings className="w-8 h-8 text-muted-foreground/50" />
// //           </div>
// //           <p>Select a node to edit its properties</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Build and set the full node.data payload depending on node type and inputs.
// //   const handleDataChange = (partial: any) => {
// //     // For simplicity the panel constructs the full payload object and replaces node.data
// //     const base = { ...node.data };
// //     const next = { ...base, ...partial };
// //     // keep a form-friendly lowercase messageType if provided so the Select shows the correct value
// //     if (partial.messageType) {
// //       next._formMessageType = String(partial.messageType).toLowerCase();
// //     }
// //     if (partial.interactiveType) {
// //       // keep interactiveType at top-level for the select to bind to
// //       next.interactiveType = String(partial.interactiveType).toLowerCase();
// //     }
// //     // If this is a whatsapp-message node we must transform form fields into the correct WhatsApp API JSON
// //     if (node.type === 'whatsapp-message') {
// //       const messageType = (next.messageType || 'sessional').toLowerCase();

// //       if (messageType === 'sessional') {
// //         const textBody = next.message || '';
// //         updateNodeData(selectedNodeId, {
// //           messageType: 'SESSIONAL',
// //           _formMessageType: 'sessional',
// //           text: {
// //             preview_url: false,
// //             body: textBody,
// //           },
// //           // keep a friendly preview field for the UI
// //           _preview: textBody,
// //         });
// //         return;
// //       }

// //       if (messageType === 'template') {
// //         // expect next.templateName or next.template (from TemplatePicker)
// //         const template = next.template || (next.templateName ? { name: next.templateName, language: { code: 'en_US' } } : null);
// //         updateNodeData(selectedNodeId, {
// //           messageType: 'TEMPLATE',
// //           _formMessageType: 'template',
// //           template: template,
// //           _preview: template?.name ?? 'No template selected',
// //         });
// //         return;
// //       }

// //       if (messageType === 'interactive') {
// //         const interactiveType = (next.interactiveType || 'button').toLowerCase();
// //         if (interactiveType === 'button') {
// //           const body = { text: next.interactiveBody || '' };
// //           const buttons = (next.replyButtons || []).slice(0, 3).map((b: any, idx: number) => ({ type: 'reply', reply: { id: b.id || `btn-${idx + 1}-${Date.now()}`, title: b.title || `Button ${idx + 1}` } }));
// //           updateNodeData(selectedNodeId, {
// //             messageType: 'INTERACTIVE',
// //             _formMessageType: 'interactive',
// //             interactiveType: 'button',
// //             interactive: {
// //               type: 'button',
// //               body,
// //               action: { buttons },
// //             },
// //             _preview: body.text,
// //           });
// //           return;
// //         }

// //         if (interactiveType === 'list') {
// //           const header = next.listHeader ? { type: 'text', text: next.listHeader } : undefined;
// //           const body = { text: next.listBody || '' };
// //           const footer = next.listFooter ? { text: next.listFooter } : undefined;
// //           const action = {
// //             button: next.listButton || 'Select',
// //             sections: (next.listSections || []).map((s: any, sIdx: number) => ({
// //               title: s.title || `Section ${sIdx + 1}`,
// //               rows: (s.rows || []).map((r: any, rIdx: number) => ({ id: r.id || `s${sIdx + 1}-r${rIdx + 1}`, title: r.title || `Row ${rIdx + 1}`, description: r.description || '' })),
// //             })),
// //           };
// //           const payload: any = {
// //             messageType: 'INTERACTIVE',
// //             _formMessageType: 'interactive',
// //             interactiveType: 'list',
// //             interactive: {
// //               type: 'list',
// //               body,
// //               action,
// //             },
// //             _preview: body.text,
// //           };
// //           if (header) payload.interactive.header = header;
// //           if (footer) payload.interactive.footer = footer;
// //           updateNodeData(selectedNodeId, payload);
// //           return;
// //         }

// //         // Fallback: simple text interactive
// //         updateNodeData(selectedNodeId, {
// //           messageType: 'SESSIONAL',
// //           text: { preview_url: false, body: next.message || '' },
// //         });
// //         return;
// //       }
// //     }

// //     // Default behavior for other node types: merge partial data
// //     updateNodeData(selectedNodeId, next);
// //   };

// //   const handleDeleteNode = () => {
// //     deleteNode(selectedNodeId);
// //     toast({ title: "Node Deleted" });
// //   };

// //   const handleDuplicateNode = () => {
// //     const newNode = {
// //       ...node,
// //       id: `node-${Date.now()}`,
// //       position: { x: (node.position?.x || 0) + 50, y: (node.position?.y || 0) + 50 }
// //     };
// //     addNode(newNode);
// //     toast({ title: "Node Duplicated" });
// //   };

// //   const renderNodeSettings = () => {
// //     switch (node.type) {
// //       // --- 1. Trigger Node Settings ---
// //       case 'trigger':
// //         return (
// //           <PanelSection title="Trigger Configuration">
// //             <div>
// //               <Label htmlFor="triggerType">Trigger Type</Label>
// //               <Select value={node.data.triggerType || 'keyword'} onValueChange={(value) => handleDataChange({ triggerType: value })}>
// //                 <SelectTrigger id="triggerType" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="keyword">Keyword</SelectItem>
// //                   <SelectItem value="first-message">First Message</SelectItem>
// //                   <SelectItem value="webhook">Webhook URL</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             {node.data.triggerType === 'keyword' && (
// //               <div>
// //                 <Label htmlFor="keyword">Keyword(s)</Label>
// //                 <Input
// //                   id="keyword"
// //                   placeholder="e.g., hi, hello, start"
// //                   value={node.data.keyword || ''}
// //                   onChange={(e) => handleDataChange({ triggerType: 'keyword', keyword: e.target.value })}
// //                   className="mt-1"
// //                 />
// //                  <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with a comma.</p>
// //                 <div className="mt-3">
// //                   <Label htmlFor="triggerOutput">Output</Label>
// //                   <Input id="triggerOutput" placeholder="e.g., next_node_id_or_label" value={node.data.output || ''} onChange={(e) => handleDataChange({ output: e.target.value })} className="mt-1" />
// //                   <p className="text-xs text-muted-foreground mt-1">Optional: identifier of the outgoing connection or label for clarity.</p>
// //                 </div>
// //               </div>
// //             )}
// //           </PanelSection>
// //         );

// //       // --- 2. WhatsApp Message Node Settings ---
// //       case 'whatsapp-message':
// //         return (
// //           <PanelSection title="Message Configuration">
// //             <div>
// //               <Label htmlFor="messageType">Message Type</Label>
// //               <Select value={node.data._formMessageType || node.data.messageType || 'sessional'} onValueChange={(value) => handleDataChange({ messageType: value })}>
// //                 <SelectTrigger id="messageType" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="interactive">Interactive</SelectItem>
// //                   <SelectItem value="sessional">Sessional</SelectItem>
// //                   <SelectItem value="template">Template</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             {/* Template path: when selected, fetch templates and allow picking one */}
// //             {node.data.messageType === 'template' && (
// //               <TemplatePicker value={node.data.template?.name || node.data.templateName} onSelect={(template) => handleDataChange({ template: template ? { name: template.temp_title || template.id, language: { code: 'en_US' }, raw: template.raw } : null })} />
// //             )}

// //             {/* Interactive: additional options */}
// //             {node.data.messageType === 'interactive' && (
// //               <div>
// //                 <Label htmlFor="interactiveType">Interactive Type</Label>
// //                 <Select value={node.data.interactiveType || 'button'} onValueChange={(value) => handleDataChange({ interactiveType: value })}>
// //                   <SelectTrigger id="interactiveType" className="mt-1">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="button">Buttons (Reply)</SelectItem>
// //                     <SelectItem value="list">List Message</SelectItem>
// //                     <SelectItem value="text">Text</SelectItem>
// //                     <SelectItem value="image">Image</SelectItem>
// //                     <SelectItem value="video">Video</SelectItem>
// //                     <SelectItem value="document">Document</SelectItem>
// //                     <SelectItem value="location">Location</SelectItem>
// //                   </SelectContent>
// //                 </Select>

// //                 {/* Media inputs for interactive media types */}
// //                 {['image', 'video', 'document'].includes(node.data.interactiveType) && (
// //                   <div className="mt-3">
// //                     <Label>Media URL</Label>
// //                     <Input value={node.data.mediaUrl || ''} onChange={(e) => handleDataChange({ mediaUrl: e.target.value })} placeholder="https://..." />
// //                     <p className="text-xs text-muted-foreground mt-1">Public URL for the media to include in the message.</p>
// //                   </div>
// //                 )}

// //                 {node.data.interactiveType === 'location' && (
// //                   <div className="mt-3">
// //                     <Label>Location (lat,lng)</Label>
// //                     <Input value={node.data.location || ''} onChange={(e) => handleDataChange({ location: e.target.value })} placeholder="12.34,56.78" />
// //                     <p className="text-xs text-muted-foreground mt-1">Provide latitude and longitude separated by a comma.</p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Default / sessional message content */}
// //             {(node.data.messageType === 'sessional' || !node.data.messageType) && (
// //               <div>
// //                 <Label htmlFor="message">Message Text</Label>
// //                 <Textarea
// //                   id="message"
// //                   placeholder="Enter your WhatsApp message..."
// //                   value={node.data._preview || node.data.text?.body || node.data.message || ''}
// //                   onChange={(e) => handleDataChange({ message: e.target.value })}
// //                   className="mt-1 h-32"
// //                 />
// //                 <p className="text-xs text-muted-foreground mt-1">Use {'{{variable}}'} to insert dynamic content.</p>

// //                 <div className="mt-3">
// //                   <Label>Optional Media</Label>
// //                   <Select value={node.data.mediaType || 'none'} onValueChange={(v) => handleDataChange({ mediaType: v })}>
// //                     <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="none">None</SelectItem>
// //                       <SelectItem value="image">Image</SelectItem>
// //                       <SelectItem value="video">Video</SelectItem>
// //                       <SelectItem value="document">Document</SelectItem>
// //                       <SelectItem value="location">Location</SelectItem>
// //                     </SelectContent>
// //                   </Select>

// //                   {['image','video','document'].includes(node.data.mediaType) && (
// //                     <div className="mt-2">
// //                       <Label>Media URL</Label>
// //                       <Input value={node.data.mediaUrl || ''} onChange={(e) => handleDataChange({ mediaUrl: e.target.value })} placeholder="https://..." />
// //                     </div>
// //                   )}

// //                   {node.data.mediaType === 'location' && (
// //                     <div className="mt-2">
// //                       <Label>Location (lat,lng)</Label>
// //                       <Input value={node.data.location || ''} onChange={(e) => handleDataChange({ location: e.target.value })} placeholder="12.34,56.78" />
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Interactive: Button-specific editor */}
// //             {node.data.messageType === 'interactive' && node.data.interactive?.type === 'button' && (
// //               <div className="space-y-2">
// //                 <Label>Button Message Body</Label>
// //                 <Textarea value={node.data.interactive?.body?.text || node.data._interactiveBody || ''} onChange={(e) => handleDataChange({ interactiveBody: e.target.value })} className="mt-1 h-20" />
// //                 <div>
// //                   <Label>Reply Buttons (max 3)</Label>
// //                   {(node.data.replyButtons || []).map((b: any, i: number) => (
// //                     <div key={i} className="flex gap-2 items-center mt-2">
// //                       <Input placeholder="Button title" value={b.title} onChange={(e) => {
// //                         const copy = (node.data.replyButtons || []).slice();
// //                         copy[i] = { ...copy[i], title: e.target.value };
// //                         handleDataChange({ replyButtons: copy });
// //                       }} />
// //                       <Button variant="ghost" size="icon" onClick={() => {
// //                         const copy = (node.data.replyButtons || []).slice();
// //                         copy.splice(i, 1);
// //                         handleDataChange({ replyButtons: copy });
// //                       }}> <Trash2 className="w-4 h-4" /> </Button>
// //                     </div>
// //                   ))}
// //                   {(node.data.replyButtons || []).length < 3 && (
// //                     <Button size="sm" onClick={() => {
// //                       const copy = (node.data.replyButtons || []).slice();
// //                       copy.push({ id: `btn-${Date.now()}`, title: `Button ${copy.length + 1}` });
// //                       handleDataChange({ replyButtons: copy });
// //                     }}>Add Button</Button>
// //                   )}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Interactive: List-specific editor */}
// //             {node.data.messageType === 'interactive' && node.data.interactive?.type === 'list' && (
// //               <div className="space-y-2">
// //                 <Label>Header</Label>
// //                 <Input value={node.data.interactive?.header?.text || node.data.listHeader || ''} onChange={(e) => handleDataChange({ listHeader: e.target.value })} />
// //                 <Label>Body</Label>
// //                 <Textarea value={node.data.interactive?.body?.text || node.data.listBody || ''} onChange={(e) => handleDataChange({ listBody: e.target.value })} className="h-20" />
// //                 <Label>Footer</Label>
// //                 <Input value={node.data.interactive?.footer?.text || node.data.listFooter || ''} onChange={(e) => handleDataChange({ listFooter: e.target.value })} />
// //                 <Label>Main Button Text</Label>
// //                 <Input value={(node.data.listButton) || 'Select'} onChange={(e) => handleDataChange({ listButton: e.target.value })} />

// //                 <div>
// //                   <Label>Sections</Label>
// //                   {(node.data.listSections || []).map((s: any, si: number) => (
// //                     <div key={si} className="p-2 border rounded mt-2">
// //                       <div className="flex justify-between items-center">
// //                         <Input value={s.title} onChange={(e) => {
// //                           const copy = (node.data.listSections || []).slice();
// //                           copy[si] = { ...copy[si], title: e.target.value };
// //                           handleDataChange({ listSections: copy });
// //                         }} />
// //                         <Button variant="ghost" size="icon" onClick={() => {
// //                           const copy = (node.data.listSections || []).slice();
// //                           copy.splice(si, 1);
// //                           handleDataChange({ listSections: copy });
// //                         }}><Trash2 className="w-4 h-4" /></Button>
// //                       </div>
// //                       <div className="mt-2">
// //                         {(s.rows || []).map((r: any, ri: number) => (
// //                           <div key={ri} className="flex gap-2 items-start mt-2">
// //                             <div className="flex-1">
// //                               <Input value={r.title} onChange={(e) => {
// //                                 const copy = (node.data.listSections || []).slice();
// //                                 copy[si].rows[ri] = { ...copy[si].rows[ri], title: e.target.value };
// //                                 handleDataChange({ listSections: copy });
// //                               }} placeholder="Row title" />
// //                               <Input value={r.description} onChange={(e) => {
// //                                 const copy = (node.data.listSections || []).slice();
// //                                 copy[si].rows[ri] = { ...copy[si].rows[ri], description: e.target.value };
// //                                 handleDataChange({ listSections: copy });
// //                               }} placeholder="Row description" />
// //                             </div>
// //                             <Button variant="ghost" size="icon" onClick={() => {
// //                               const copy = (node.data.listSections || []).slice();
// //                               copy[si].rows.splice(ri, 1);
// //                               handleDataChange({ listSections: copy });
// //                             }}><Trash2 className="w-4 h-4" /></Button>
// //                           </div>
// //                         ))}
// //                         <Button size="sm" onClick={() => {
// //                           const copy = (node.data.listSections || []).slice();
// //                           copy[si].rows = copy[si].rows || [];
// //                           copy[si].rows.push({ id: `s${si + 1}-r${(copy[si].rows || []).length + 1}`, title: `Row ${(copy[si].rows || []).length + 1}`, description: '' });
// //                           handleDataChange({ listSections: copy });
// //                         }}>Add Row</Button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                   <Button size="sm" onClick={() => {
// //                     const copy = (node.data.listSections || []).slice();
// //                     copy.push({ title: `Section ${copy.length + 1}`, rows: [] });
// //                     handleDataChange({ listSections: copy });
// //                   }}>Add Section</Button>
// //                 </div>
// //               </div>
// //             )}

// //             {/* <div>
// //               <Label htmlFor="recipient">Recipient</Label>
// //               <Input
// //                 id="recipient"
// //                 placeholder="Phone number or contact"
// //                 value={node.data.recipient || ''}
// //                 onChange={(e) => handleDataChange('recipient', e.target.value)}
// //                 className="mt-1"
// //               />
// //             </div> */}
// //           </PanelSection>
// //         );

// //       // --- 3. Delay Node Settings ---
// //       case 'delay':
// //         return (
// //           <PanelSection title="Delay Configuration">
// //             <div>
// //               <Label htmlFor="duration">Wait For</Label>
// //               <Input
// //                 id="duration"
// //                 type="number"
// //                 placeholder="5"
// //                 value={node.data.duration || ''}
// //                 onChange={(e) => handleDataChange({ duration: parseInt(e.target.value, 10) || 0 })}
// //                 className="mt-1"
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="unit">Time Unit</Label>
// //               <Select value={node.data.unit || 'seconds'} onValueChange={(value) => handleDataChange({ unit: value })}>
// //                 <SelectTrigger id="unit" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="seconds">Seconds</SelectItem>
// //                   <SelectItem value="minutes">Minutes</SelectItem>
// //                   <SelectItem value="hours">Hours</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </PanelSection>
// //         );

// //       // --- 4. Condition Node Settings ---
// //       case 'condition':
// //         return (
// //           <PanelSection title="Condition Rule (If...)">
// //             <div>
// //               <TooltipLabel htmlFor="variable" tooltipText="The value from the workflow to check.">
// //                 Variable to Check
// //               </TooltipLabel>
// //               <Input
// //                 id="variable"
// //                 placeholder="e.g., {{last_reply}}"
// //                 value={node.data.variable || ''}
// //                 onChange={(e) => handleDataChange({ variable: e.target.value })}
// //                 className="mt-1"
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="operator">Operator</Label>
// //               <Select value={node.data.operator || 'equals'} onValueChange={(value) => handleDataChange({ operator: value })}>
// //                 <SelectTrigger id="operator" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="equals">Equals</SelectItem>
// //                   <SelectItem value="contains">Contains</SelectItem>
// //                   <SelectItem value="startsWith">Starts With</SelectItem>
// //                   <SelectItem value="isNumber">Is a Number</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //              <div>
// //               <TooltipLabel htmlFor="value" tooltipText="The value to compare against. Leave empty for 'Is a Number'.">
// //                 Value
// //               </TooltipLabel>
// //               <Input
// //                 id="value"
// //                 placeholder="e.g., 'Yes' or 123"
// //                 value={node.data.value || ''}
// //                 onChange={(e) => handleDataChange({ value: e.target.value })}
// //                 className="mt-1"
// //               />
// //             </div>
// //           </PanelSection>
// //         );
      
// //       // --- 5. Database Node Settings ---
// //       case 'database':
// //         return (
// //           <PanelSection title="Database Operation">
// //              <div>
// //               <Label htmlFor="dbAction">Action</Label>
// //               <Select value={node.data.dbAction || 'get'} onValueChange={(value) => handleDataChange({ dbAction: value })}>
// //                 <SelectTrigger id="dbAction" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="get">Get Row</SelectItem>
// //                   <SelectItem value="insert">Insert Row</SelectItem>
// //                   <SelectItem value="update">Update Row</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div>
// //               <Label htmlFor="tableName">Table Name</Label>
// //               <Input
// //                 id="tableName"
// //                 placeholder="e.g., users"
// //                 value={node.data.tableName || ''}
// //                 onChange={(e) => handleDataChange({ tableName: e.target.value })}
// //                 className="mt-1"
// //               />
// //             </div>
// //             <div>
// //               <TooltipLabel htmlFor="dbData" tooltipText={'Use JSON to map columns to workflow variables. e.g., { "email": "{{user_email}}" }'}>
// //                 Data / Query
// //               </TooltipLabel>
// //               <Textarea
// //                 id="dbData"
// //                 placeholder={`{ "column": "{{variable}}" }`}
// //                 value={node.data.dbData || ''}
// //                 onChange={(e) => handleDataChange({ dbData: e.target.value })}
// //                 className="mt-1 h-32 font-mono text-xs"
// //               />
// //             </div>
// //           </PanelSection>
// //         );

// //       // --- 6. Webhook Node Settings ---
// //       case 'webhook':
// //         return (
// //           <PanelSection title="Webhook Configuration">
// //              <div>
// //               <Label htmlFor="httpMethod">Method</Label>
// //               <Select value={node.data.httpMethod || 'POST'} onValueChange={(value) => handleDataChange({ httpMethod: value })}>
// //                 <SelectTrigger id="httpMethod" className="mt-1">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="POST">POST</SelectItem>
// //                   <SelectItem value="GET">GET</SelectItem>
// //                   <SelectItem value="PUT">PUT</SelectItem>
// //                   <SelectItem value="DELETE">DELETE</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div>
// //               <Label htmlFor="url">URL</Label>
// //               <Input
// //                 id="url"
// //                 placeholder="https://api.example.com/data"
// //                 value={node.data.url || ''}
// //                 onChange={(e) => handleDataChange({ url: e.target.value })}
// //                 className="mt-1"
// //               />
// //             </div>
// //             <div>
// //               <TooltipLabel htmlFor="jsonBody" tooltipText="Enter the JSON body for your request. Use {{variables}} for dynamic data.">
// //                 JSON Body
// //               </TooltipLabel>
// //               <Textarea
// //                 id="jsonBody"
// //                 placeholder={`{ "key": "{{variable}}" }`}
// //                 value={node.data.jsonBody || ''}
// //                 onChange={(e) => handleDataChange({ jsonBody: e.target.value })}
// //                 className="mt-1 h-32 font-mono text-xs"
// //               />
// //             </div>
// //           </PanelSection>
// //         );

// //       default:
// //         return (
// //           <p className="text-sm text-muted-foreground">No properties to configure for this node type.</p>
// //         );
// //     }
// //   };

// //   return (
// //     <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full flex flex-col">
// //       {/* Header */}
// //       <div className="flex items-center justify-between p-4 border-b border-border">
// //         <h2 className="text-lg font-semibold text-foreground">Properties</h2>
// //         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedNode(null)}>
// //           <X className="w-4 h-4" />
// //         </Button>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-6">
// //         {/* Node Info Section */}
// //         <div>
// //           <Label htmlFor="nodeLabel">Node Label</Label>
// //             <Input
// //             id="nodeLabel"
// //             placeholder="Enter a descriptive label..."
// //             value={node.data.label || ''}
// //             onChange={(e) => handleDataChange({ label: e.target.value })}
// //             className="mt-1"
// //           />
// //           <p className="text-xs text-muted-foreground mt-2">
// //             Type: <span className="font-mono bg-muted px-1 py-0.5 rounded">{node.type}</span>
// //           </p>
// //         </div>

// //         <Separator />
        
// //         {renderNodeSettings()}
// //       </div>

// //       {/* Footer Actions */}
// //       <div className="p-4 border-t border-border space-y-2">
// //         <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDuplicateNode}>
// //           <Copy className="w-4 h-4 mr-2" />
// //           Duplicate Node
// //         </Button>
// //         <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleDeleteNode}>
// //           <Trash2 className="w-4 h-4 mr-2" />
// //           Delete Node
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // };

// import React, { useEffect, useState } from 'react';
// import { Settings, Trash2, Copy, HelpCircle, X } from 'lucide-react'; 
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Textarea } from './ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Separator } from './ui/separator';
// import { useWorkflowStore } from '../../store/workflowStore';
// import { useToast } from '../../hooks/use-toast';
// import { cn } from '../../lib/utils';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// // Helper component for consistent section titles
// const PanelSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
//   <div className="space-y-4">
//     <h4 className="text-sm font-semibold text-foreground">{title}</h4>
//     <div className="space-y-4 pl-2 border-l-2 border-border ml-2">{children}</div>
//   </div>
// );

// // Helper for labels with tooltips
// const TooltipLabel = ({ htmlFor, children, tooltipText }: { htmlFor: string; children: React.ReactNode; tooltipText: string }) => (
//   <div className="flex items-center gap-2">
//     <Label htmlFor={htmlFor}>{children}</Label>
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>{tooltipText}</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   </div>
// );

// // Small component to fetch templates and let the user pick one
// function TemplatePicker({ value, onSelect }: { value?: string; onSelect: (t: { temp_title?: string; id?: string; raw?: any } | null) => void }) {
//   const [templates, setTemplates] = useState<Array<any>>([]);
//   const [loadingTemplates, setLoadingTemplates] = useState(false);
//   const [templatesError, setTemplatesError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     setLoadingTemplates(true);
//     fetch('http://localhost:8080/templates')
//       .then(async (res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         const text = await res.text();
//         try {
//           return JSON.parse(text);
//         } catch {
//           throw new Error('Failed to parse templates response');
//         }
//       })
//       .then((data) => {
//         if (!mounted) return;
//         const list = Array.isArray(data) ? data : (data?.templates ?? []);
//         setTemplates(list);
//       })
//       .catch((err) => {
//         console.error('Templates fetch error', err);
//         if (mounted) setTemplatesError(String(err));
//       })
//       .finally(() => {
//         if (mounted) setLoadingTemplates(false);
//       });

//     return () => { mounted = false; };
//   }, []);

//   const handleChange = (selectedValue: string) => {
//     if (!selectedValue) {
//       onSelect(null);
//       return;
//     }
//     const sel = templates.find((t: any) => String(t.temp_title) === selectedValue);
//     if (sel) {
//       onSelect({ temp_title: sel.temp_title, id: sel.tempid, raw: sel });
//     } else {
//       onSelect(null);
//     }
//   };

//   return (
//     <div className="mb-3">
//       <label className="block text-sm font-medium mb-1">Choose Template</label>
//       {loadingTemplates && <div>Loading templates...</div>}
//       {templatesError && <div className="text-red-600">Error loading templates: {templatesError}</div>}
//       {!loadingTemplates && !templatesError && (
//         <Select onValueChange={handleChange} value={value}>
//           <SelectTrigger>
//             <SelectValue placeholder="-- select template --" />
//           </SelectTrigger>
//           <SelectContent>
//             {templates.map((t: any) => (
//               <SelectItem key={t.tempid} value={t.temp_title}>
//                 {t.temp_title}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       )}
//     </div>
//   );
// }

// export const PropertiesPanel = () => {
//   const { selectedNodeId, nodes, updateNodeData, deleteNode, addNode, setSelectedNode } = useWorkflowStore();
//   const { toast } = useToast();

//   const node = nodes.find(n => n.id === selectedNodeId);

//   if (!selectedNodeId || !node) {
//     return (
//       <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full p-4 flex flex-col">
//         <div className="flex items-center gap-2 mb-6">
//           <Settings className="w-5 h-5 text-primary" />
//           <h2 className="text-lg font-semibold text-foreground">Properties</h2>
//         </div>
//         <div className="text-center text-muted-foreground my-auto">
//           <div className="w-16 h-16 bg-node-bg rounded-lg mx-auto mb-4 flex items-center justify-center">
//             <Settings className="w-8 h-8 text-muted-foreground/50" />
//           </div>
//           <p>Select a node to edit its properties</p>
//         </div>
//       </div>
//     );
//   }

//   const handleDataChange = (partial: any) => {
//     const base = { ...node.data };
//     let next = { ...base, ...partial };

//     if (node.type === 'whatsapp-message') {
//         if (partial.messageType) {
//             next._formMessageType = String(partial.messageType).toLowerCase();
//         }
//         if (partial.interactiveType) {
//             next.interactiveType = String(partial.interactiveType).toLowerCase();
//         }
//     }
    
//     updateNodeData(selectedNodeId, next);
// };

//   const handleDeleteNode = () => {
//     deleteNode(selectedNodeId);
//     toast({ title: "Node Deleted" });
//   };

//   const handleDuplicateNode = () => {
//     const newNode = {
//       ...node,
//       position: { x: (node.position?.x || 0) + 50, y: (node.position?.y || 0) + 50 }
//     };
//     addNode(newNode);
//     toast({ title: "Node Duplicated" });
//   };

//   const renderNodeSettings = () => {
//     switch (node.type) {
//       case 'trigger':
//         return (
//           <PanelSection title="Trigger Configuration">
//             <div>
//               <Label htmlFor="triggerType">Trigger Type</Label>
//               <Select value={node.data.triggerType || 'keyword'} onValueChange={(value) => handleDataChange({ triggerType: value })}>
//                 <SelectTrigger id="triggerType" className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="keyword">Keyword</SelectItem>
//                   <SelectItem value="first-message">First Message</SelectItem>
//                   <SelectItem value="webhook">Webhook URL</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             {node.data.triggerType === 'keyword' && (
//               <div>
//                 <Label htmlFor="keyword">Keyword(s)</Label>
//                 <Input
//                   id="keyword"
//                   placeholder="e.g., hi, hello, start"
//                   value={node.data.keyword || ''}
//                   onChange={(e) => handleDataChange({ triggerType: 'keyword', keyword: e.target.value })}
//                   className="mt-1"
//                 />
//                  <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with a comma.</p>
//                 <div className="mt-3">
//                   <Label htmlFor="triggerOutput">Output</Label>
//                   <Input id="triggerOutput" placeholder="e.g., next_node_id_or_label" value={node.data.output || ''} onChange={(e) => handleDataChange({ output: e.target.value })} className="mt-1" />
//                   <p className="text-xs text-muted-foreground mt-1">Optional: identifier of the outgoing connection or label for clarity.</p>
//                 </div>
//               </div>
//             )}
//           </PanelSection>
//         );
//       case 'whatsapp-message':
//         return (
//           <PanelSection title="Message Configuration">
//             <div>
//               <Label htmlFor="messageType">Message Type</Label>
//               <Select value={node.data.messageType || 'SESSIONAL'} onValueChange={(value) => handleDataChange({ messageType: value })}>
//                 <SelectTrigger id="messageType" className="mt-1">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="INTERACTIVE">Interactive</SelectItem>
//                   <SelectItem value="SESSIONAL">Sessional</SelectItem>
//                   <SelectItem value="TEMPLATE">Template</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             {node.data.messageType === 'TEMPLATE' && (
//                 <TemplatePicker 
//                     value={node.data.template_name} 
//                     onSelect={(template) => {
//                         if (template) {
//                             handleDataChange({ template_name: template.temp_title, messageType: 'TEMPLATE' });
//                         }
//                     }} 
//                 />
//             )}
//             {node.data.messageType === 'SESSIONAL' && (
//               <div>
//                 <Label htmlFor="message">Message Text</Label>
//                 <Textarea
//                   id="message"
//                   placeholder="Enter your WhatsApp message..."
//                   value={node.data.message || ''}
//                   onChange={(e) => handleDataChange({ message: e.target.value })}
//                   className="mt-1 h-32"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">Use {'{{variable}}'} to insert dynamic content.</p>
//               </div>
//             )}
//           </PanelSection>
//         );
//       default:
//         return (
//           <p className="text-sm text-muted-foreground">No properties to configure for this node type.</p>
//         );
//     }
//   };

//   return (
//     <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full flex flex-col">
//       <div className="flex items-center justify-between p-4 border-b border-border">
//         <h2 className="text-lg font-semibold text-foreground">Properties</h2>
//         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedNode(null)}>
//           <X className="w-4 h-4" />
//         </Button>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-6">
//         <div>
//           <Label htmlFor="nodeLabel">Node Label</Label>
//             <Input
//             id="nodeLabel"
//             placeholder="Enter a descriptive label..."
//             value={node.data.label || ''}
//             onChange={(e) => handleDataChange({ label: e.target.value })}
//             className="mt-1"
//           />
//           <p className="text-xs text-muted-foreground mt-2">
//             Type: <span className="font-mono bg-muted px-1 py-0.5 rounded">{node.type}</span>
//           </p>
//         </div>

//         <Separator />
        
//         {renderNodeSettings()}
//       </div>

//       <div className="p-4 border-t border-border space-y-2">
//         <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDuplicateNode}>
//           <Copy className="w-4 h-4 mr-2" />
//           Duplicate Node
//         </Button>
//         <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleDeleteNode}>
//           <Trash2 className="w-4 h-4 mr-2" />
//           Delete Node
//         </Button>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
// --- FIX: Added 'X' to the import list ---
import { Settings, Trash2, Copy, HelpCircle, X } from 'lucide-react'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useWorkflowStore } from '../../store/workflowStore';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Helper component for consistent section titles
const PanelSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h4 className="text-sm font-semibold text-foreground">{title}</h4>
    <div className="space-y-4 pl-2 border-l-2 border-border ml-2">{children}</div>
  </div>
);

// Helper for labels with tooltips
const TooltipLabel = ({ htmlFor, children, tooltipText }: { htmlFor: string; children: React.ReactNode; tooltipText: string }) => (
  <div className="flex items-center gap-2">
    <Label htmlFor={htmlFor}>{children}</Label>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

// Small component to fetch templates and let the user pick one
function TemplatePicker({ value, onSelect }: { value?: string; onSelect: (t: { temp_title?: string; id?: string; raw?: any } | null) => void }) {
  const [templates, setTemplates] = useState<Array<any>>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingTemplates(true);
    fetch('http://localhost:8080/templates')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('Failed to parse templates response');
        }
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : (data?.templates ?? []);
        setTemplates(list);
      })
      .catch((err) => {
        console.error('Templates fetch error', err);
        if (mounted) setTemplatesError(String(err));
      })
      .finally(() => {
        if (mounted) setLoadingTemplates(false);
      });

    return () => { mounted = false; };
  }, []);

  const handleChange = (selectedValue: string) => {
    if (!selectedValue) {
      onSelect(null);
      return;
    }
    const sel = templates.find((t: any) => String(t.temp_title) === selectedValue);
    if (sel) {
      onSelect({ temp_title: sel.temp_title, id: sel.tempid, raw: sel });
    } else {
      onSelect(null);
    }
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Choose Template</label>
      {loadingTemplates && <div>Loading templates...</div>}
      {templatesError && <div className="text-red-600">Error loading templates: {templatesError}</div>}
      {!loadingTemplates && !templatesError && (
        <Select onValueChange={handleChange} value={value}>
          <SelectTrigger>
            <SelectValue placeholder="-- select template --" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t: any) => (
              <SelectItem key={t.tempid} value={t.temp_title}>
                {t.temp_title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export const PropertiesPanel = () => {
  const { selectedNodeId, nodes, updateNodeData, deleteNode, addNode, setSelectedNode } = useWorkflowStore();
  const { toast } = useToast();

  const node = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNodeId || !node) {
    return (
      <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Properties</h2>
        </div>
        <div className="text-center text-muted-foreground my-auto">
          <div className="w-16 h-16 bg-node-bg rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Settings className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p>Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleDataChange = (partial: any) => {
    const base = { ...node.data };
    let next = { ...base, ...partial };

    if (node.type === 'whatsapp-message') {
        if (partial.messageType) {
            next._formMessageType = String(partial.messageType).toLowerCase();
        }
        if (partial.interactiveType) {
            next.interactiveType = String(partial.interactiveType).toLowerCase();
        }
    }
    
    updateNodeData(selectedNodeId, next);
};

  const handleDeleteNode = () => {
    deleteNode(selectedNodeId);
    toast({ title: "Node Deleted" });
  };

  const handleDuplicateNode = () => {
    const newNode = {
      ...node,
      position: { x: (node.position?.x || 0) + 50, y: (node.position?.y || 0) + 50 }
    };
    addNode(newNode);
    toast({ title: "Node Duplicated" });
  };

  const renderNodeSettings = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <PanelSection title="Trigger Configuration">
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <Select value={node.data.triggerType || 'keyword'} onValueChange={(value) => handleDataChange({ triggerType: value })}>
                <SelectTrigger id="triggerType" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keyword">Keyword</SelectItem>
                  <SelectItem value="webhookurl">Webhook URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(node.data.triggerType === 'keyword' || !node.data.triggerType) && (
              <div>
                <Label htmlFor="keyword">Keyword(s)</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., hi, hello, start"
                  value={node.data.keyword || ''}
                  onChange={(e) => handleDataChange({ triggerType: 'keyword', keyword: e.target.value })}
                  className="mt-1"
                />
                 <p className="text-xs text-muted-foreground mt-1">Separate multiple keywords with a comma.</p>
              </div>
            )}
            {node.data.triggerType === 'webhookurl' && (
                <div>
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                        id="webhookUrl"
                        readOnly
                        value="https://dummy-url.com/webhook"
                        className="mt-1 bg-gray-100"
                    />
                </div>
            )}
          </PanelSection>
        );
      case 'whatsapp-message':
        return (
          <PanelSection title="Message Configuration">
            <div>
              <Label htmlFor="messageType">Message Type</Label>
              <Select value={node.data.messageType || 'SESSIONAL'} onValueChange={(value) => handleDataChange({ messageType: value })}>
                <SelectTrigger id="messageType" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERACTIVE">Interactive</SelectItem>
                  <SelectItem value="SESSIONAL">Sessional</SelectItem>
                  <SelectItem value="TEMPLATE">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {node.data.messageType === 'TEMPLATE' && (
                <TemplatePicker 
                    value={node.data.template_name} 
                    onSelect={(template) => {
                        if (template) {
                            handleDataChange({ template_name: template.temp_title, messageType: 'TEMPLATE' });
                        }
                    }} 
                />
            )}
            {node.data.messageType === 'SESSIONAL' && (
              <div>
                <Label htmlFor="message">Message Text</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your WhatsApp message..."
                  value={node.data.message || ''}
                  onChange={(e) => handleDataChange({ message: e.target.value })}
                  className="mt-1 h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">Use {'{{variable}}'} to insert dynamic content.</p>
              </div>
            )}
          </PanelSection>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">No properties to configure for this node type.</p>
        );
    }
  };

  return (
    <div className="w-80 bg-gradient-glass backdrop-blur-sm border-l border-border h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Properties</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedNode(null)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <Label htmlFor="nodeLabel">Node Label</Label>
            <Input
            id="nodeLabel"
            placeholder="Enter a descriptive label..."
            value={node.data.label || ''}
            onChange={(e) => handleDataChange({ label: e.target.value })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Type: <span className="font-mono bg-muted px-1 py-0.5 rounded">{node.type}</span>
          </p>
        </div>

        <Separator />
        
        {renderNodeSettings()}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDuplicateNode}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate Node
        </Button>
        <Button variant="destructive" size="sm" className="w-full justify-start" onClick={handleDeleteNode}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};