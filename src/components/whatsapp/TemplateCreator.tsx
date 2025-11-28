// import React, { useState, useEffect, useRef } from 'react';
// import Preview from './preview';


// let buttonIdCounter = 0;
// let appIdCounter = 0;

// const TemplateCreator = ({ isSidebarHovered,initialTemplateJson }) => {
//     // Core Info
//     const [templateName, setTemplateName] = useState("");
//     const [language, setLanguage] = useState("en_US");
//     const [category, setCategory] = useState("");
//     const [loading, setLoading] = useState(false);

//     // Sub-category state
//     const [templateType, setTemplateType] = useState("Default");
//     const [catalogFormat, setCatalogFormat] = useState("Catalog message");

//     // UI State for Form
//     const [bodyText, setBodyText] = useState("");
//     const [headerType, setHeaderType] = useState("NONE");
//     const [headerText, setHeaderText] = useState("");
//     const [headerSampleContents, setHeaderSampleContents] = useState({});
//     const [footerText, setFooterText] = useState("");
//     const [buttons, setButtons] = useState([]);
//     const [sampleContents, setSampleContents] = useState({});
//     const [headerFile, setHeaderFile] = useState(null); // State for the uploaded media file preview
//     // When editing an existing template, this holds the media link previously stored in the template
//     const [headerExistingMediaLink, setHeaderExistingMediaLink] = useState(null);

//     // Authentication Specific State
//     const [authType, setAuthType] = useState("COPY_CODE");
//     const [addSecurityRecommendation, setAddSecurityRecommendation] = useState(false);
//     const [addExpiry, setAddExpiry] = useState(false);
//     const [expiryMinutes, setExpiryMinutes] = useState(5);
//     const [supportedApps, setSupportedApps] = useState([{ id: 0, package_name: '', signature_hash: '' }]);
//     const [autofillText] = useState("Autofill");
//     const [copyCodeText] = useState("Copy Code");
//     const [addValidityPeriod, setAddValidityPeriod] = useState(false);
//     const [validityPeriodSeconds, setValidityPeriodSeconds] = useState(60);
//     const [zeroTapConsent, setZeroTapConsent] = useState(false);

//     // Central state for the final JSON object
//     const [templateJson, setTemplateJson] = useState({});
//     // State for send message JSON
//     const [sendMessageJson, setSendMessageJson] = useState({});

//     // Ref to detect initial mount so we don't reset form while populating for edit
//     const isInitialMount = useRef(true);

//         // --- EFFECT TO POPULATE FORM FOR EDITING ---
//         useEffect(() => {
//                 // If no initial JSON is provided, do nothing (we are in "create" mode)
//                 if (!initialTemplateJson || !initialTemplateJson.components) return;

//                 // --- 1. Populate Core Info ---
//                 setTemplateName(initialTemplateJson.name.replace(/_/g, ' ')); // Convert snake_case back to normal
//                 setLanguage(initialTemplateJson.language);
//                 setCategory(initialTemplateJson.category);
//                 if (initialTemplateJson.message_send_ttl_seconds) {
//                         setAddValidityPeriod(true);
//                         setValidityPeriodSeconds(initialTemplateJson.message_send_ttl_seconds);
//                 }

//                 // --- 2. Find and Parse Components ---
//                 const components = initialTemplateJson.components;
//                 const headerComponent = components.find(c => c.type === 'HEADER');
//                 const bodyComponent = components.find(c => c.type === 'BODY');
//                 const footerComponent = components.find(c => c.type === 'FOOTER');
//                 const buttonsComponent = components.find(c => c.type === 'BUTTONS');
//                 const callPermissionComponent = components.find(c => c.type === 'CALL_PERMISSION_REQUEST');


//                 // --- 3. Set Component States ---

//                 // HEADER
//                 if (headerComponent) {
//                         setHeaderType(headerComponent.format);
//                         if (headerComponent.format === 'TEXT') {
//                                 setHeaderText(headerComponent.text);
//                                 // Repopulate header sample contents
//                                 if (headerComponent.example && headerComponent.example.header_text) {
//                                         const headerVars = headerComponent.text.match(/{{\d+}}/g) || [];
//                                         const newHeaderSamples = {};
//                                         headerVars.forEach((variable, index) => {
//                                                 const varNum = variable.match(/\d+/)[0];
//                                                 newHeaderSamples[varNum] = headerComponent.example.header_text[index];
//                                         });
//                                         setHeaderSampleContents(newHeaderSamples);
//                                 }
//                         }
//             // If header is media and has example/header_handle or example.header_handle, capture the existing link so we can use it in send JSON when editing
//             if (headerComponent.format !== 'TEXT' && headerComponent.example) {
//                 // try a few common shapes: example.header_handle, example.header_handle[0], example.header_handle?.[0]
//                 const h = headerComponent.example.header_handle || (Array.isArray(headerComponent.example) ? headerComponent.example[0] : undefined) || headerComponent.example.header_handle?.[0];
//                 if (h) setHeaderExistingMediaLink(h[0] || h);
//             }
//                         // For media, the user will have to re-upload. We can't reconstruct the file object.
//                 }

//                 // BODY
//                 if (bodyComponent) {
//                         setBodyText(bodyComponent.text || (initialTemplateJson.category === "AUTHENTICATION" ? "{{1}} is your verification code." : ""));
//                          if (bodyComponent.add_security_recommendation) {
//                                 setAddSecurityRecommendation(true);
//                         }
//                         // Repopulate body sample contents
//                         if (bodyComponent.example && bodyComponent.example.body_text && bodyComponent.example.body_text[0]) {
//                                 const bodyVars = bodyComponent.text.match(/{{\d+}}/g) || [];
//                                 const newBodySamples = {};
//                                 bodyVars.forEach((variable, index) => {
//                                         const varNum = variable.match(/\d+/)[0];
//                                         newBodySamples[varNum] = bodyComponent.example.body_text[0][index];
//                                 });
//                                 setSampleContents(newBodySamples);
//                         }
//                 }

//                 // FOOTER
//                 if (footerComponent) {
//                         if (footerComponent.text) {
//                                 setFooterText(footerComponent.text);
//                         }
//                         if (footerComponent.code_expiration_minutes) {
//                                 setAddExpiry(true);
//                                 setExpiryMinutes(footerComponent.code_expiration_minutes);
//                         }
//                 }

//                 // BUTTONS & TEMPLATE TYPE
//                 if (callPermissionComponent) {
//                         setTemplateType('Calling permissions request');
//                 } else if (buttonsComponent && buttonsComponent.buttons) {
//                         const firstButtonType = buttonsComponent.buttons[0]?.type;
//                         if (firstButtonType === 'CATALOG' || firstButtonType === 'MPM') {
//                                 setTemplateType('Catalog');
//                                 setCatalogFormat(firstButtonType === 'CATALOG' ? 'Catalog message' : 'Multi-product message');
//                         } else if (firstButtonType === 'OTP') {
//                                 setTemplateType('One-time Passcode'); // For AUTH category
//                                 const otpButton = buttonsComponent.buttons[0];
//                                 setAuthType(otpButton.otp_type);
//                                 if (otpButton.supported_apps?.length > 0) {
//                                         // Add back the local 'id' for the UI key prop
//                                         setSupportedApps(otpButton.supported_apps.map((app, index) => ({ ...app, id: index })));
//                                 }
//                                  if (otpButton.zero_tap_terms_accepted) {
//                                         setZeroTapConsent(true);
//                                 }
//                         } else {
//                                 // Handle standard buttons (Quick Reply, URL, Phone)
//                                 setTemplateType('Default');
//                                 const uiButtons = buttonsComponent.buttons.map((apiBtn, index) => {
//                                         buttonIdCounter++;
//                                         const newButton = {
//                                                 id: buttonIdCounter,
//                                                 type: apiBtn.type,
//                                                 text: apiBtn.text,
//                                                 phone: apiBtn.phone_number || '',
//                                                 url: apiBtn.url || '',
//                                                 // Reverse engineer the URL type
//                                                 urlType: apiBtn.example ? 'dynamic' : 'static',
//                                                 urlExample: apiBtn.example ? apiBtn.example[0] : ''
//                                         };
//                                         return newButton;
//                                 });
//                                 setButtons(uiButtons);
//                         }
//                 }

//         }, [initialTemplateJson]); // This effect depends only on the incoming JSON

//         // --- MAIN EFFECT: Syncs All UI STATE TO THE Final JSON STATE ---
//         useEffect(() => {
//                 // Build components array from current UI state
//                 const componentsArr = [];
//                 if (headerType !== 'NONE' && (templateType !== 'Catalog' || (templateType === 'Catalog' && catalogFormat === 'Multi-product message'))) {
//                         const headerComp = { type: 'HEADER', format: headerType.toUpperCase() };
//                         if (headerType === 'TEXT') {
//                                 headerComp.text = headerText;
//                                 const headerVars = [...new Set(headerText.match(/{{\d+}}/g) || [])];
//                                 if (headerVars.length > 0) {
//                                         headerComp.example = { header_text: headerVars.map(v => { const varNum = v.match(/\d+/)[0]; return headerSampleContents[varNum] || `[Sample]`; }) };
//                                 }
//                         } else if (headerType === 'LOCATION') {
//                                 // location headers don't use example handles
//                         } else {
//                                 if (headerFile && headerFile.url) headerComp.example = { header_handle: ['https://www.example.com/media.png'] };
//                                 else headerComp.example = { header_handle: ['https://www.example.com/media.png'] };
//                         }
//                         componentsArr.push(headerComp);
//                 }

//                 // Body
//                 const bodyComp = { type: 'BODY' };
//                 if (category === 'AUTHENTICATION') {
//                         if (addSecurityRecommendation) bodyComp.add_security_recommendation = true;
//                 } else {
//                         bodyComp.text = bodyText;
//                         const vars = [...new Set(bodyText.match(/{{\d+}}/g) || [])];
//                         if (vars.length > 0) bodyComp.example = { body_text: [vars.map(v => { const varNum = v.match(/\d+/)[0]; return sampleContents[varNum] || `[Sample]`; })] };
//                 }
//                 componentsArr.push(bodyComp);

//                 // Footer & Buttons
//                 if (footerText) componentsArr.push({ type: 'FOOTER', text: footerText });
//                 else if (category === 'AUTHENTICATION' && addExpiry) componentsArr.push({ type: 'FOOTER', code_expiration_minutes: expiryMinutes });

//                 if (templateType === 'Catalog') {
//                         const btn = catalogFormat === 'Catalog message' ? { type: 'CATALOG', text: 'View catalog' } : { type: 'MPM', text: 'View items' };
//                         componentsArr.push({ type: 'BUTTONS', buttons: [btn] });
//                 } else if (templateType === 'Calling permissions request') {
//                         componentsArr.push({ type: 'CALL_PERMISSION_REQUEST' });
//                 } else if (category === 'AUTHENTICATION') {
//                         const otpBtn = { type: 'OTP', otp_type: authType, text: copyCodeText };
//                         if (authType !== 'COPY_CODE') {
//                                 otpBtn.autofill_text = autofillText;
//                                 otpBtn.supported_apps = supportedApps.filter(app => app.package_name && app.signature_hash).map(({ package_name, signature_hash }) => ({ package_name, signature_hash }));
//                                 if (authType === 'ZERO_TAP' && zeroTapConsent) otpBtn.zero_tap_terms_accepted = true;
//                         }
//                         componentsArr.push({ type: 'BUTTONS', buttons: [otpBtn] });
//                 } else if (buttons.length > 0) {
//                         const apiBtns = buttons.map(b => {
//                                 const base = { type: b.type, text: b.text };
//                                 if (b.type === 'URL') {
//                                         base.url = b.url;
//                                         if (b.urlType === 'dynamic' && b.urlExample) base.example = [b.urlExample];
//                                 }
//                                 if (b.type === 'PHONE_NUMBER') base.phone_number = b.phone;
//                                 return base;
//                         });
//                         componentsArr.push({ type: 'BUTTONS', buttons: apiBtns });
//                 }

//                 const finalJson = { name: templateName.toLowerCase().replace(/\s+/g, '_'), language: language, category: category, components: componentsArr };
//                 if (addValidityPeriod) finalJson.message_send_ttl_seconds = validityPeriodSeconds;
//                 setTemplateJson(finalJson);

//                 // --- Generate Send Message JSON with parameters ---
//                 const sendComponents = [];
//                 if (category === 'AUTHENTICATION') {
//                         const authBodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Code]' }));
//                         if (authBodyParams.length > 0) sendComponents.push({ type: 'body', parameters: authBodyParams });
//                         sendComponents.push({ type: 'button', sub_type: 'otp', index: '0', parameters: [{ type: 'text', text: sampleContents['1'] || '[Sample Code]' }] });
//                 } else if (templateType === 'Catalog' && catalogFormat === 'Catalog message') {
//                         if (/{{\d+}}/.test(bodyText)) {
//                                 const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Body]' }));
//                                 sendComponents.push({ type: 'body', parameters: bodyParams });
//                         }
//                         sendComponents.push({ type: 'button', sub_type: 'CATALOG', index: 0, parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<THUMBNAIL_PRODUCT_RETAILER_ID>' } }] });
//                 } else if (templateType === 'Catalog' && catalogFormat === 'Multi-product message') {
//                         if (headerType === 'TEXT' && /{{\d+}}/.test(headerText)) {
//                                 const headerParams = [...new Set(headerText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: headerSampleContents[v.match(/\d+/)[0]] || '[Sample Header]' }));
//                                 sendComponents.push({ type: 'header', parameters: headerParams });
//                         }
//                         if (/{{\d+}}/.test(bodyText)) {
//                                 const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Body]' }));
//                                 sendComponents.push({ type: 'body', parameters: bodyParams });
//                         }
//                         sendComponents.push({ type: 'button', sub_type: 'mpm', index: '0', parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<product_id>', sections: [{ title: 'Featured Items', product_items: [{ product_retailer_id: '<product_id_1>' }, { product_retailer_id: '<product_id_2>' }] }] } }] });
//                 } else {
//                         if (headerType === 'TEXT' && /{{\d+}}/.test(headerText)) {
//                                 const headerParams = [...new Set(headerText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: headerSampleContents[v.match(/\d+/)[0]] || '[Sample]' }));
//                                 sendComponents.push({ type: 'header', parameters: headerParams });
//                         }
//             if ((headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && ( (headerFile && headerFile.url) || headerExistingMediaLink )) {
//                 // prefer an uploaded file URL during this editing session, otherwise fall back to the existing media link
//                 const uploadedOrExisting = (headerFile && headerFile.url) ? headerFile.url : headerExistingMediaLink;
//                 const imagelink = "https://picsum.photos/seed/picsum/200/300";
//                 const videoLink = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
//                 const documentLink = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
//                 let mediaParam = null;
//                 if (headerType === 'IMAGE') mediaParam = { type: 'image', image: { link: imagelink } };
//                 else if (headerType === 'VIDEO') mediaParam = { type: 'video', video: { link: videoLink } };
//                 else mediaParam = { type: 'document', document: { link: documentLink } };
//                 sendComponents.push({ type: 'header', parameters: [mediaParam] });
//             }
//                         if (/{{\d+}}/.test(bodyText)) {
//                                 const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample]' }));
//                                 sendComponents.push({ type: 'body', parameters: bodyParams });
//                         }
//                         buttons.forEach((btn, index) => {
//                                 if (btn.type === 'URL' && btn.urlType === 'dynamic' && btn.urlExample) sendComponents.push({ type: 'button', sub_type: 'url', index: index.toString(), parameters: [{ type: 'text', text: btn.urlExample }] });
//                         });
//                 }
//                 const sendJson = { messaging_product: 'whatsapp', to: '<recipient_phone_number>', type: 'template', template: { name: finalJson.name, language: { code: language }, components: sendComponents } };
//                 setSendMessageJson(sendJson);

//         }, [templateName, language, category, templateType, catalogFormat, headerType, headerText, bodyText, footerText, buttons, authType, addSecurityRecommendation, addExpiry, expiryMinutes, sampleContents, headerSampleContents, supportedApps, autofillText, copyCodeText, addValidityPeriod, validityPeriodSeconds, headerFile]);

//     // Effect to reset form on category change, and also reset templateType and catalogFormat
//     useEffect(() => {
//         setBodyText(category === "AUTHENTICATION" ? "{{1}} is your verification code." : "");
//         setFooterText("");
//         setHeaderText("");
//         setHeaderType("NONE");
//         setButtons([]);
//         setSampleContents({});
//         setHeaderFile(null);
//         setHeaderSampleContents({});
//         setAuthType("COPY_CODE");
//         setAddSecurityRecommendation(false);
//         setAddExpiry(false);
//         setAddValidityPeriod(false);
//         setSupportedApps([{ id: 0, package_name: '', signature_hash: '' }]);
//         setZeroTapConsent(false);

//         // Reset template type and catalog format based on category
//         if (category === "AUTHENTICATION") {
//             setTemplateType("One-time Passcode");
//             setCatalogFormat("Catalog message"); // reset just in case
//         } else if (category === "MARKETING") {
//             setTemplateType("Default");
//             setCatalogFormat("Catalog message");
//         } else if (category === "UTILITY") {
//             setTemplateType("Default");
//             setCatalogFormat("Catalog message");
//         }
//     }, [category]);
    
//     // --- UI HANDLERS ---
//     const handleAddApp = () => { if (supportedApps.length < 5) { appIdCounter++; setSupportedApps(prev => [...prev, { id: appIdCounter, package_name: '', signature_hash: '' }]); } else { alert("A maximum of 5 apps is allowed."); } };
//     const handleRemoveApp = (id) => setSupportedApps(prev => prev.filter(app => app.id !== id));
//     const handleAppChange = (id, field, value) => setSupportedApps(prev => prev.map(app => app.id === id ? { ...app, [field]: value } : app));
//     // Validation helpers for app fields
//     const validatePackageName = (pkg) => {
//         if (!pkg) return false;
//         // At least two segments separated by dots
//         const segments = pkg.split('.');
//         if (segments.length < 2) return false;
//         const segRe = /^[A-Za-z][A-Za-z0-9_]*$/;
//         return segments.every(s => segRe.test(s));
//     };
//     const validateSignatureHash = (hash) => {
//         if (!hash) return false;
//         // enforce exact length 11
//         return hash.length === 11;
//     };
//     // const handleAddButton = (type) => { buttonIdCounter++; setButtons(prev => [...prev, { id: buttonIdCounter, type, text: '', url: '', phone: '' }]); };
//     const handleRemoveButton = id => setButtons(prev => prev.filter(btn => btn.id !== id));
//     const handleButtonChange = (id, field, value) => setButtons(prev => prev.map(btn => btn.id === id ? { ...btn, [field]: value } : btn));
//     const handleSampleContentChange = (varNum, value) => setSampleContents(prev => ({ ...prev, [varNum]: value }));
//     const handleHeaderSampleContentChange = (varNum, value) => setHeaderSampleContents(prev => ({ ...prev, [varNum]: value }));
//     const handleAddButton = (type) => {
//         buttonIdCounter++;
//         const newButton = { id: buttonIdCounter, type, text: '', url: '', phone: '' };
//         // ** R4: State Management **
//         if (type === 'URL') {
//             newButton.urlType = 'static';
//             newButton.urlExample = '';
//         }
//         // Enforce max 10 buttons
//         setButtons(prev => {
//             if (prev.length >= 10) {
//                 alert('A maximum of 10 buttons is allowed.');
//                 return prev;
//             }
//             return [...prev, newButton];
//         });
//     };
//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setHeaderFile({
//                     url: e.target.result,
//                     type: file.type
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Validate button grouping rules for Default template type
//     // Accepts array of button types like ['QUICK_REPLY','URL','PHONE_NUMBER']
//     const validateButtonGrouping = (types) => {
//         if (!types || types.length === 0) return true;
//         if (types.length > 10) return false;

//         // Normalize types to three categories: QR (quick reply), URL, PHONE
//         const mapped = types.map(t => {
//             if (t === 'QUICK_REPLY') return 'QR';
//             if (t === 'URL') return 'URL';
//             if (t === 'PHONE_NUMBER') return 'PHONE';
//             return t;
//         });

//         // Valid grouping rules (when templateType === 'Default'):
//         // - QR buttons may appear together in a contiguous block(s)
//         // - URL/PHONE may appear together in contiguous region(s)
//         // - Sequences like QR, URL, QR are invalid
//         // Simplest approach: there must be at most two transitions between QR-block and (URL/PHONE)-block.

//         // Map URL and PHONE to same group 'ACTION'
//         const groups = mapped.map(m => (m === 'QR' ? 'QR' : 'ACTION'));

//         // Collapse consecutive duplicates
//         const collapsed = groups.reduce((acc, cur) => {
//             if (acc.length === 0 || acc[acc.length - 1] !== cur) acc.push(cur);
//             return acc;
//         }, []);

//         // Allowed collapsed patterns:
//         // ['QR']
//         // ['ACTION']
//         // ['QR','ACTION']
//         // ['ACTION','QR']
//         // ['QR','ACTION','QR'] is invalid (this would be length 3 and start/end QR)

//         if (collapsed.length === 1) return true;
//         if (collapsed.length === 2) return true;
//         // if length >=3, it's invalid
//         return false;
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // ** R3: Input Validation **
//         for (const btn of buttons) {
//             if (btn.type === 'URL' && btn.urlType === 'dynamic' && !btn.url.includes('{{1}}')) {
//                 alert(`Error for button "${btn.text || 'Untitled'}": A dynamic URL must contain the placeholder {{1}}.`);
//                 return;
//             }
//         }

//         // Validate button grouping when templateType === 'Default'
//         if (templateType === 'Default') {
//             const groupingValid = validateButtonGrouping(buttons.map(b => b.type));
//             if (!groupingValid) {
//                 alert('Button grouping is invalid. Ensure Quick Reply and URL/Phone buttons are grouped in valid sequences.');
//                 return;
//             }
//         }

//         setLoading(true);
//         try {
//             // Single atomic request: POST combined payload to /template
//             const combinedPayload = { template: templateJson, send_message: sendMessageJson };
//             console.log("SENDING COMBINED PAYLOAD TO /template:", JSON.stringify(combinedPayload, null, 2));

//             const resp = await fetch('http://localhost:8080/template', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(combinedPayload)
//             }).catch(err => {
//                 console.error('Network error posting combined payload to /template:', err);
//                 return null;
//             });

//             if (resp && resp.ok) {
//                 const data = await resp.json().catch(() => null);
//                 console.log('Combined /template response:', data);
//                 alert('Template created and message sent successfully.');
//             } else {
//                 const status = resp ? resp.status : 'network-failure';
//                 const bodyText = resp ? await resp.text().catch(() => null) : null;
//                 console.error('Combined /template failed:', status, bodyText);
//                 alert('Failed to create template and send message. See console for details.');
//             }
//         } catch (err) {
//             console.error('Unexpected error while submitting template and message:', err);
//             alert('Failed to submit template and send message. Check the console for details and ensure the backend is running at http://localhost:8080.');
//         } finally {
//             setLoading(false);
//         }
//     };


//     const anyAppInvalid = supportedApps.some(app => !(validatePackageName(app.package_name) && validateSignatureHash(app.signature_hash)));
//     const groupingValid = templateType === 'Default' ? validateButtonGrouping(buttons.map(b => b.type)) : true;
//     const isSubmitDisabled = loading || !category || (category === 'AUTHENTICATION' && authType === 'ZERO_TAP' && !zeroTapConsent) || ((authType === 'ONE_TAP' || authType === 'ZERO_TAP') && anyAppInvalid) || !groupingValid;
//     const variablesInBody = [...new Set(bodyText.match(/{{\d+}}/g) || [])];

//     // Helper for file input accept attribute
//     const getAcceptType = () => {
//         switch(headerType) {
//             case 'IMAGE': return 'image/*';
//             case 'VIDEO': return 'video/*';
//             case 'DOCUMENT': return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
//             default: return '';
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-rose-100 via-sky-100 to-green-100 text-left">
//             <div className="main-content flex-grow md:p-6" style={{ paddingLeft: isSidebarHovered ? "160px" : "70px", transition: "padding-left 0.3s" }}>
//                 <h1 className="text-lg font-semibold  mb-6 text-black">Create Message Template</h1>
//                 <div className="flex flex-col lg:flex-row gap-6">
//                     <div className="lg:w-2/3">
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                              <div className="bg-white p-5 rounded-lg shadow text-black"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-semibold text-gray-700">Category *</label><select required value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="" disabled>Select...</option><option value="MARKETING">Marketing</option><option value="UTILITY">Utility</option><option value="AUTHENTICATION">Authentication</option></select></div><div><label className="block text-sm font-semibold text-gray-700">Template Name *</label><input required type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., summer_sale"/></div><div><label className="block text-sm font-semibold text-gray-700">Language *</label><select value={language} onChange={e => setLanguage(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
//                               <option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="az">Azerbaijani</option><option value="bn">Bengali</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="zh_CN">Chinese (CHN)</option><option value="zh_HK">Chinese (HKG)</option><option value="zh_TW">Chinese (TAI)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="en_GB">English (UK)</option><option value="en_US">English (US)</option><option value="et">Estonian</option><option value="fil">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="he">Hebrew</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="kn">Kannada</option><option value="kk">Kazakh</option><option value="ko">Korean</option><option value="lo">Lao</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="ml">Malayalam</option><option value="mr">Marathi</option><option value="nb">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt_BR">Portuguese (BR)</option><option value="pt_PT">Portuguese (POR)</option><option value="pa">Punjabi</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option><option value="es_AR">Spanish (ARG)</option><option value="es_MX">Spanish (MEX)</option><option value="es_ES">Spanish (SPA)</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="uz">Uzbek</option><option value="vi">Vietnamese</option>
//                               </select></div></div></div>
                            
//                             {category && (
//                                 <div className="bg-white p-5 rounded-lg shadow text-black">
//                                     <h3 className="text-lg font-semibold text-black">Template Type</h3>
//                                     <select value={templateType} onChange={e => setTemplateType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
//                                         {category === 'MARKETING' && (<>
//                                             <option value="Default">Default</option>
//                                             <option value="Catalog">Catalog</option>
//                                             <option value="Calling permissions request">Calling permissions request</option>
//                                         </>)}
//                                         {category === 'UTILITY' && (<>
//                                             <option value="Default">Default</option>
//                                             <option value="Calling permissions request">Calling permissions request</option>
//                                         </>)}
//                                         {category === 'AUTHENTICATION' && (<option value="One-time Passcode">One-time Passcode</option>)}
//                                     </select>
//                                 </div>
//                             )}

//                             {templateType === 'Default' && (category === "MARKETING" || category === "UTILITY") && (
//                                 <>
//                                     <div className="bg-white p-5 rounded-lg shadow text-black">
//                                         <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
//                                         <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
//                                             <option value="NONE">None</option><option value="TEXT">Text</option><option value="IMAGE">Image</option><option value="VIDEO">Video</option><option value="DOCUMENT">Document</option><option value="LOCATION">Location</option>
//                                         </select>
//                                         {/* {headerType === 'TEXT' && <div><input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/><p className="text-xs text-gray-500 text-right mt-1">{headerText.length} / 60</p></div>} */}
//                                         {headerType === 'TEXT' && <div>
//                                             <input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/>
//                                             <div className="flex justify-between items-center mt-2">
//                                                 <button type="button" onClick={() => setHeaderText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button>
//                                                 <p className="text-xs text-gray-500">{headerText.length} / 60</p>
//                                             </div>
//                                         </div>}
//                                             {headerType === 'TEXT' && (Array.from(new Set(headerText.match(/{{\d+}}/g) || []))).length > 0 && (
//                                                 <div className="bg-white p-5 rounded-lg shadow mt-3">
//                                                     <h3 className="text-lg font-bold ">Header Sample Content</h3>
//                                                     <p className="text-sm text-gray-500 mb-2">Provide an example for each header variable.</p>
//                                                     {(Array.from(new Set(headerText.match(/{{\d+}}/g) || []))).map(variable => { const varNum = variable.match(/\d+/)[0]; return (
//                                                         <div key={varNum} className="mt-2">
//                                                             <label className="block text-sm font-semibold text-gray-600">{`{{${varNum}}}`}</label>
//                                                             <input type="text" value={headerSampleContents[varNum] || ""} onChange={(e) => handleHeaderSampleContentChange(varNum, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder={`Example for {{${varNum}}}`} />
//                                                         </div>
//                                                     ); })}
//                                                 </div>
//                                             )}
//                                         {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
//                                             <div className="mt-2">
//                                                 <label className="block text-sm font-semibold text-gray-700">Upload {headerType.toLowerCase()}</label>
//                                                 <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="bg-white p-5 rounded-lg shadow text-black"><h3 className="text-lg font-bold">Body *</h3>
//                                     <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="7" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>

//                                     <div className="flex justify-between items-center mt-2"><button type="button" onClick={() => setBodyText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button><p className="text-xs text-gray-500">{bodyText.length} / 1024</p></div>
//                                     </div>
//                                     {variablesInBody.length > 0 && (<div className="bg-white p-5 rounded-lg shadow"><h3 className="text-lg font-bold">Sample Content</h3><p className="text-sm text-gray-500 mb-2">Provide an example for each variable.</p>{variablesInBody.map((variable) => { const varNum = variable.match(/\d+/)[0]; return (<div key={varNum} className="mt-2"><label className="block text-sm font-semibold text-gray-600">{`{{${varNum}}}`}</label><input type="text" value={sampleContents[varNum] || ""} onChange={(e) => handleSampleContentChange(varNum, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder={`Example for {{${varNum}}}`} /></div>)})}</div>)}

//                                     <div className="bg-white p-5 rounded-lg shadow text-black"><h3 className="text-lg font-bold">Footer <span className="text-gray-400 font-normal">(Optional)</span></h3><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter footer text..." /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div>
//                                     {/* <div className="bg-white p-5 rounded-lg shadow"><h3 className="text-lg font-bold">Buttons <span className="text-gray-400 font-normal">(Optional)</span></h3>{buttons.map(btn => (<div key={btn.id} className="p-3 border rounded-md mt-2 space-y-2"><div className="flex justify-between items-center"><p className="font-semibold">{btn.type.replace('_', ' ')}</p><button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-red-500 font-bold">✕</button></div><input type="text" value={btn.text} onChange={e => handleButtonChange(btn.id, 'text', e.target.value)} placeholder="Button Text" className="block w-full p-2 border border-gray-300 rounded-md"/>{btn.type === 'URL' && <input type="text" value={btn.url} onChange={e => handleButtonChange(btn.id, 'url', e.target.value)} placeholder="URL (e.g., https://...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}{btn.type === 'PHONE_NUMBER' && <input type="text" value={btn.phone} onChange={e => handleButtonChange(btn.id, 'phone', e.target.value)} placeholder="Phone Number (+1555...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}</div>))}<div className="mt-3"><button type="button" onClick={() => handleAddButton('QUICK_REPLY')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Quick Reply</button><button type="button" onClick={() => handleAddButton('URL')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add URL Button</button><button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} className="bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Call Button</button></div></div> */}
//                                     <div className="bg-white p-5 rounded-lg shadow text-black">
//                                         <h3 className="text-lg font-bold">Buttons <span className="text-gray-400 font-normal">(Optional)</span></h3>
//                                         {templateType === 'Default' && !groupingValid && (
//                                             <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded">Invalid button grouping: Quick Reply buttons must not be separated by URL/Phone buttons. Keep Quick Reply buttons contiguous or put URL/Phone buttons together.</div>
//                                         )}
//                                         {buttons.map(btn => (
//                                             <div key={btn.id} className="p-3 border rounded-md mt-2 space-y-2">
//                                                 <div className="flex justify-between items-center"><p className="font-semibold">{btn.type.replace('_', ' ')}</p><button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-red-500 font-bold">✕</button></div>
//                                                 <input type="text" value={btn.text} onChange={e => handleButtonChange(btn.id, 'text', e.target.value)} placeholder="Button Text" className="block w-full p-2 border border-gray-300 rounded-md"/>
//                                                 {btn.type === 'URL' && (
//                                                     <div className="space-y-2">
//  <label className="block text-sm font-semibold text-gray-700 mt-2">URL Type</label>
//                                                         {/* R1: UI Modification */}
//                                                         <select value={btn.urlType} onChange={e => handleButtonChange(btn.id, 'urlType', e.target.value)} className="block w-full p-2 border border-gray-300 rounded-md">
//                                                             <option value="static">Static</option>
//                                                             <option value="dynamic">Dynamic</option>
//                                                         </select>
// <label className="block text-sm font-semibold text-gray-700 mt-2">URL</label>
//                                                         <input type="text" value={btn.url} onChange={e => handleButtonChange(btn.id, 'url', e.target.value)} placeholder="URL (https://...)" className="block w-full p-2 border border-gray-300 rounded-md"/>
//                                                         {/* R2: Conditional UI */}
//                                                         {btn.urlType === 'dynamic' && (
//                                                           <div>
//                                                           <label className="block text-sm font-semibold text-gray-700 mt-2">Sample Value for {'{{1}}'}</label>
//                                                           <input type="text" value={btn.urlExample} onChange={e => handleButtonChange(btn.id, 'urlExample', e.target.value)} placeholder="Sample Value (e.g., summer-sale)" className="block w-full p-2 border border-gray-300 rounded-md"/>
//                                                           </div>
//                                                         )}
//                                                     </div>
//                                                 )}

//                                                 {btn.type === 'PHONE_NUMBER' && <input type="text" value={btn.phone} onChange={e => handleButtonChange(btn.id, 'phone', e.target.value)} placeholder="Phone Number (+1555...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}
//                                             </div>
//                                         ))}
//                                         <div className="mt-3"><button type="button" onClick={() => handleAddButton('QUICK_REPLY')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Quick Reply</button><button type="button" onClick={() => handleAddButton('URL')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add URL Button</button><button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Call Button</button></div>
//                                     </div>
//                                 </>
//                             )}
//                                                     {templateType === 'Catalog' && (
//                                                         <div className="bg-white p-5 rounded-lg shadow space-y-6">
//                                                             <div><h3 className="text-lg font-bold">Catalog Format</h3><div className="mt-2 space-y-2"><div className="flex items-start"><input className="mt-1" type="radio" id="catalog_message" name="catalogFormat" value="Catalog message" checked={catalogFormat === 'Catalog message'} onChange={e => setCatalogFormat(e.target.value)} /><label htmlFor="catalog_message" className="ml-2 text-sm"><b className="block">Catalog message</b>Include the entire catalog.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="multi_product_message" name="catalogFormat" value="Multi-product message" checked={catalogFormat === 'Multi-product message'} onChange={e => setCatalogFormat(e.target.value)} /><label htmlFor="multi_product_message" className="ml-2 text-sm"><b className="block">Multi-product message</b>Include up to 30 products.</label></div></div></div>
//                                                             {catalogFormat === 'Multi-product message' && (
//                                                               <div className="bg-white p-5 rounded-lg shadow">
//                                         <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
//                                         <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
//                                             <option value="NONE">None</option><option value="TEXT">Text</option><option value="IMAGE">Image</option><option value="VIDEO">Video</option><option value="DOCUMENT">Document</option><option value="LOCATION">Location</option>
//                                         </select>
//                                                                 {headerType === 'TEXT' && <div>
//                                                                     <input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/>
//                                                                     <div className="flex justify-between items-center mt-2">
//                                                                         <button type="button" onClick={() => setHeaderText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button>
//                                                                         <p className="text-xs text-gray-500">{headerText.length} / 60</p>
//                                                                     </div>
//                                                                 </div>}
//                                         {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
//                                             <div className="mt-2">
//                                                 <label className="block text-sm font-semibold text-gray-700">Upload {headerType.toLowerCase()}</label>
//                                                 <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
//                                             </div>
//                                         )}
//                                     </div>
//                                                                 // <div className="bg-white p-5 rounded-lg shadow -mt-2">
//                                                                 //     <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
//                                                                 //     <p className="text-xs text-gray-500 mb-2">You can add an optional header for your multi-product message.</p>
//                                                                 //     <label className="block text-sm font-semibold text-gray-700 mt-2">Header Type</label>
//                                                                 //     <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
//                                                                 //         <option value="NONE">None</option>
//                                                                 //         <option value="TEXT">Text</option>
//                                                                 //         <option value="IMAGE">Image</option>
//                                                                 //         <option value="VIDEO">Video</option>
//                                                                 //         <option value="DOCUMENT">Document</option>
//                                                                 //         <option value="LOCATION">Location</option>
//                                                                 //     </select>
//                                                                 //     {headerType === 'TEXT' && (
//                                                                 //         <div className="mt-2">
//                                                                 //             <input type="text" value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="Header text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
//                                                                 //             <p className="text-xs text-gray-500 text-right mt-1">{headerText.length} / 60</p>
//                                                                 //         </div>
//                                                                 //     )}
//                                                                 //     {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
//                                                                 //         <div className="mt-2">
//                                                                 //             <label className="block text-sm font-semibold text-gray-700">Upload header {headerType.toLowerCase()}</label>
//                                                                 //             <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500" />
//                                                                 //         </div>
//                                                                 //     )}
//                                                                 // </div>
//                                                             )}
//                                     <div><h3 className="text-lg font-bold">Content</h3><div className="space-y-4"><div><label className="block text-sm font-semibold">Body *
//                                       </label>
//                                        <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="7" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
//                                        <p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p>
//                                        <div className="flex justify-between items-center mt-2"><button type="button" onClick={() => setBodyText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button><p className="text-xs text-gray-500">{bodyText.length} / 1024</p></div>
//                                       {/* <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea>*/}
//                                       {/* <p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p> */}
//                                       </div><div><label className="block text-sm font-semibold">Footer (Optional)</label><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div></div></div>
//                                     <div><h3 className="text-lg font-bold">Buttons</h3><div className="p-3 border rounded-md mt-2 bg-gray-100"><p className="font-semibold text-gray-500">{catalogFormat === 'Catalog message' ? 'View catalog (fixed)' : 'View items (fixed)'}</p></div></div>
//                                     <div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>
//                                 </div>
//                             )}

//                             {templateType === 'Calling permissions request' && (
//                                 <div className="bg-white p-5 rounded-lg shadow space-y-6">
//                                      <div><h3 className="text-lg font-bold">Content</h3><div className="space-y-4"><div><label className="block text-sm font-semibold">Body *</label><textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea><p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p></div><div><label className="block text-sm font-semibold">Footer (Optional)</label><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div></div></div>
//                                      <div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>
//                                 </div>
//                             )}
//                             {category === "AUTHENTICATION" && (
//                                  <div className="bg-white p-5 rounded-lg shadow space-y-6">
//                                     <div><h3 className="text-lg font-bold">Authentication Type</h3><div className="mt-2 space-y-3"><div className="flex items-start"><input className="mt-1" type="radio" id="one_tap" name="authType" value="ONE_TAP" checked={authType==='ONE_TAP'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="one_tap" className="ml-2 text-sm"><b className="block">One-tap auto-fill</b>This is recommended as the easiest option for your customers.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="zero_tap" name="authType" value="ZERO_TAP" checked={authType==='ZERO_TAP'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="zero_tap" className="ml-2 text-sm"><b className="block">Zero-tap</b>When zero-tap has been turned on, the code will automatically be sent.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="copy_code" name="authType" value="COPY_CODE" checked={authType==='COPY_CODE'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="copy_code" className="ml-2 text-sm"><b className="block">Copy code</b>Basic authentication with quick setup.</label></div></div></div>
//                                     {(authType === 'ONE_TAP' || authType === 'ZERO_TAP') && (<div><h3 className="text-lg font-bold">App Information</h3><p className="text-sm text-gray-500 mb-2">Required for auto-fill and zero-tap functionality.</p>{supportedApps.map((app, index) => {
//                                         const pkgValid = validatePackageName(app.package_name);
//                                         const sigValid = validateSignatureHash(app.signature_hash);
//                                         return (
//                                             <div key={app.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-2 mt-2">
//                                                 <div>
//                                                     <label className="block text-sm font-semibold text-gray-700">Package Name</label>
//                                                     <input type="text" value={app.package_name} onChange={e => handleAppChange(app.id, 'package_name', e.target.value)} placeholder="Package Name (e.g., com.example.app)" className={`p-2 border rounded-md w-full ${pkgValid ? '' : 'border-red-500'}`} />
//                                                     {!pkgValid && <p className="text-xs text-red-500 mt-1">application ID must have at least two segments, separated by dots. Each segment should begin with a letter, and all characters in a segment should be alphanumeric or underscore.</p>}
//                                                 </div>
//                                                 <div>
//                                                     <label className="block text-sm font-semibold text-gray-700">App Signature Hash</label>
//                                                     <div className="flex items-center gap-2">
//                                                         <input type="text" value={app.signature_hash} onChange={e => handleAppChange(app.id, 'signature_hash', e.target.value)} placeholder="App Signature Hash (11 chars)" className={`p-2 border rounded-md flex-grow ${sigValid ? '' : 'border-red-500'}`} />
//                                                         {index > 0 && <button type="button" onClick={() => handleRemoveApp(app.id)} className="text-red-500 font-bold">✕</button>}
//                                                     </div>
//                                                     {!sigValid && <p className="text-xs text-red-500 mt-1">Signature hash must be exactly 11 characters.</p>}
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}<button type="button" onClick={handleAddApp} className="mt-2 text-blue-600 text-sm font-semibold">Add Another App</button></div>)}
//                                     {authType === 'ZERO_TAP' && (<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm"><div className="flex items-start"><input id="zero-tap-consent" type="checkbox" checked={zeroTapConsent} onChange={e => setZeroTapConsent(e.target.checked)} className="h-4 w-4 mt-1"/><label htmlFor="zero-tap-consent" className="ml-3">By selecting zero-tap, I understand that my use is subject to the <a href="https://www.whatsapp.com/legal/business-terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">WhatsApp Business Terms of Service</a>. It is my responsibility to ensure customers expect an automatic code fill-in.<a href="https://business.facebook.com/business/help/285737223876109" target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline">Learn more</a></label></div></div>)}
//                                     <div><h3 className="text-lg font-bold">Message Content</h3><div className="flex items-center mt-2"><input type="checkbox" id="security" checked={addSecurityRecommendation} onChange={e => setAddSecurityRecommendation(e.target.checked)} className="h-4 w-4" /><label htmlFor="security" className="ml-2">Add security recommendation</label></div><div className="flex items-center mt-2"><input type="checkbox" id="expiry" checked={addExpiry} onChange={e => setAddExpiry(e.target.checked)} className="h-4 w-4" /><label htmlFor="expiry" className="ml-2">Add expiry time for the code</label></div>{addExpiry && <div className="mt-2"><label className="block text-sm">Expires in (minutes)</label><input type="number" min="1" max="10" value={expiryMinutes} onChange={e => setExpiryMinutes(parseInt(e.target.value))} className="mt-1 p-2 border rounded-md w-full"/></div>}</div>
//                                     <div><h3 className="text-lg font-bold">Message Validity Period</h3><div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>{addValidityPeriod && <select value={validityPeriodSeconds} onChange={e => setValidityPeriodSeconds(parseInt(e.target.value))} className="mt-2 w-full p-2 border rounded-md"><option value={60}>1 minute</option><option value={300}>5 minutes</option></select>}</div>
//                                  </div>
//                             )}
//                             <div className="flex justify-end pt-4"><button type="submit" disabled={isSubmitDisabled} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">{loading ? 'Submitting...' : 'Submit'}</button></div>
//                         </form>
//                         <div className="mt-6">
//                           <h3 className="text-lg font-semibold text-black">Generated JSON (Create Template)</h3>
//                           <pre className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm overflow-x-auto">{JSON.stringify(templateJson, null, 2)}</pre>
//                         </div>
//                         <div className="mt-6">
//                           <h3 className="text-lg font-semibold text-black">Generated JSON (Send Template Message)</h3>
//                           <pre className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm overflow-x-auto">{JSON.stringify(sendMessageJson, null, 2)}</pre>
//                         </div>
//                     </div>
//                     <div className="lg:w-1/3"><div className="sticky top-6 text-black"><h3 className="text-lg font-semibold text-gray-600 mb-2 text-black">Live Preview</h3><Preview components={templateJson.components} category={category} addSecurityRecommendation={addSecurityRecommendation} authType={authType} sampleContents={sampleContents} headerFile={headerFile} headerSampleContents={headerSampleContents} /></div></div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TemplateCreator;
import React, { useState, useEffect, useRef } from 'react';
import Preview from './preview';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';


let buttonIdCounter = 0;
let appIdCounter = 0;

const TemplateCreator = ({ isSidebarHovered,initialTemplateJson }) => {
    // Get current user from auth context
    const { user } = useAuth();
    
    // Core Info
    const [templateName, setTemplateName] = useState("");
    const [language, setLanguage] = useState("en_US");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Sub-category state
    const [templateType, setTemplateType] = useState("Default");
    const [catalogFormat, setCatalogFormat] = useState("Catalog message");

    // UI State for Form
    const [bodyText, setBodyText] = useState("");
    const [headerType, setHeaderType] = useState("NONE");
    const [headerText, setHeaderText] = useState("");
    const [headerSampleContents, setHeaderSampleContents] = useState({});
    const [footerText, setFooterText] = useState("");
    const [buttons, setButtons] = useState([]);
    const [sampleContents, setSampleContents] = useState({});
    const [headerFile, setHeaderFile] = useState(null); // State for the uploaded media file preview
    // When editing an existing template, this holds the media link previously stored in the template
    const [headerExistingMediaLink, setHeaderExistingMediaLink] = useState(null);

    // Authentication Specific State
    const [authType, setAuthType] = useState("COPY_CODE");
    const [addSecurityRecommendation, setAddSecurityRecommendation] = useState(false);
    const [addExpiry, setAddExpiry] = useState(false);
    const [expiryMinutes, setExpiryMinutes] = useState(5);
    const [supportedApps, setSupportedApps] = useState([{ id: 0, package_name: '', signature_hash: '' }]);
    const [autofillText] = useState("Autofill");
    const [copyCodeText] = useState("Copy Code");
    const [addValidityPeriod, setAddValidityPeriod] = useState(false);
    const [validityPeriodSeconds, setValidityPeriodSeconds] = useState(60);
    const [zeroTapConsent, setZeroTapConsent] = useState(false);

    // Central state for the final JSON object
    const [templateJson, setTemplateJson] = useState({});
    // State for send message JSON
    const [sendMessageJson, setSendMessageJson] = useState({});

    // Ref to detect initial mount so we don't reset form while populating for edit
    const isInitialMount = useRef(true);

        // --- EFFECT TO POPULATE FORM FOR EDITING ---
        useEffect(() => {
                // If no initial JSON is provided, do nothing (we are in "create" mode)
                if (!initialTemplateJson || !initialTemplateJson.components) return;

                // --- 1. Populate Core Info ---
                setTemplateName(initialTemplateJson.name.replace(/_/g, ' ')); // Convert snake_case back to normal
                setLanguage(initialTemplateJson.language);
                setCategory(initialTemplateJson.category);
                if (initialTemplateJson.message_send_ttl_seconds) {
                        setAddValidityPeriod(true);
                        setValidityPeriodSeconds(initialTemplateJson.message_send_ttl_seconds);
                }

                // --- 2. Find and Parse Components ---
                const components = initialTemplateJson.components;
                const headerComponent = components.find(c => c.type === 'HEADER');
                const bodyComponent = components.find(c => c.type === 'BODY');
                const footerComponent = components.find(c => c.type === 'FOOTER');
                const buttonsComponent = components.find(c => c.type === 'BUTTONS');
                const callPermissionComponent = components.find(c => c.type === 'CALL_PERMISSION_REQUEST');


                // --- 3. Set Component States ---

                // HEADER
                if (headerComponent) {
                        setHeaderType(headerComponent.format);
                        if (headerComponent.format === 'TEXT') {
                                setHeaderText(headerComponent.text);
                                // Repopulate header sample contents
                                if (headerComponent.example && headerComponent.example.header_text) {
                                        const headerVars = headerComponent.text.match(/{{\d+}}/g) || [];
                                        const newHeaderSamples = {};
                                        headerVars.forEach((variable, index) => {
                                                const varNum = variable.match(/\d+/)[0];
                                                newHeaderSamples[varNum] = headerComponent.example.header_text[index];
                                        });
                                        setHeaderSampleContents(newHeaderSamples);
                                }
                        }
            // If header is media and has example/header_handle or example.header_handle, capture the existing link so we can use it in send JSON when editing
            if (headerComponent.format !== 'TEXT' && headerComponent.example) {
                // try a few common shapes: example.header_handle, example.header_handle[0], example.header_handle?.[0]
                const h = headerComponent.example.header_handle || (Array.isArray(headerComponent.example) ? headerComponent.example[0] : undefined) || headerComponent.example.header_handle?.[0];
                if (h) setHeaderExistingMediaLink(h[0] || h);
            }
                        // For media, the user will have to re-upload. We can't reconstruct the file object.
                }

                // BODY
                if (bodyComponent) {
                        setBodyText(bodyComponent.text || (initialTemplateJson.category === "AUTHENTICATION" ? "{{1}} is your verification code." : ""));
                         if (bodyComponent.add_security_recommendation) {
                                setAddSecurityRecommendation(true);
                        }
                        // Repopulate body sample contents
                        if (bodyComponent.example && bodyComponent.example.body_text && bodyComponent.example.body_text[0]) {
                                const bodyVars = bodyComponent.text.match(/{{\d+}}/g) || [];
                                const newBodySamples = {};
                                bodyVars.forEach((variable, index) => {
                                        const varNum = variable.match(/\d+/)[0];
                                        newBodySamples[varNum] = bodyComponent.example.body_text[0][index];
                                });
                                setSampleContents(newBodySamples);
                        }
                }

                // FOOTER
                if (footerComponent) {
                        if (footerComponent.text) {
                                setFooterText(footerComponent.text);
                        }
                        if (footerComponent.code_expiration_minutes) {
                                setAddExpiry(true);
                                setExpiryMinutes(footerComponent.code_expiration_minutes);
                        }
                }

                // BUTTONS & TEMPLATE TYPE
                if (callPermissionComponent) {
                        setTemplateType('Calling permissions request');
                } else if (buttonsComponent && buttonsComponent.buttons) {
                        const firstButtonType = buttonsComponent.buttons[0]?.type;
                        if (firstButtonType === 'CATALOG' || firstButtonType === 'MPM') {
                                setTemplateType('Catalog');
                                setCatalogFormat(firstButtonType === 'CATALOG' ? 'Catalog message' : 'Multi-product message');
                        } else if (firstButtonType === 'OTP') {
                                setTemplateType('One-time Passcode'); // For AUTH category
                                const otpButton = buttonsComponent.buttons[0];
                                setAuthType(otpButton.otp_type);
                                if (otpButton.supported_apps?.length > 0) {
                                        // Add back the local 'id' for the UI key prop
                                        setSupportedApps(otpButton.supported_apps.map((app, index) => ({ ...app, id: index })));
                                }
                                 if (otpButton.zero_tap_terms_accepted) {
                                        setZeroTapConsent(true);
                                }
                        } else {
                                // Handle standard buttons (Quick Reply, URL, Phone)
                                setTemplateType('Default');
                                const uiButtons = buttonsComponent.buttons.map((apiBtn, index) => {
                                        buttonIdCounter++;
                                        const newButton = {
                                                id: buttonIdCounter,
                                                type: apiBtn.type,
                                                text: apiBtn.text,
                                                phone: apiBtn.phone_number || '',
                                                url: apiBtn.url || '',
                                                // Reverse engineer the URL type
                                                urlType: apiBtn.example ? 'dynamic' : 'static',
                                                urlExample: apiBtn.example ? apiBtn.example[0] : ''
                                        };
                                        return newButton;
                                });
                                setButtons(uiButtons);
                        }
                }

        }, [initialTemplateJson]); // This effect depends only on the incoming JSON

        // --- MAIN EFFECT: Syncs All UI STATE TO THE Final JSON STATE ---
        useEffect(() => {
                // Build components array from current UI state
                const componentsArr = [];
                if (headerType !== 'NONE' && (templateType !== 'Catalog' || (templateType === 'Catalog' && catalogFormat === 'Multi-product message'))) {
                        const headerComp = { type: 'HEADER', format: headerType.toUpperCase() };
                        if (headerType === 'TEXT') {
                                headerComp.text = headerText;
                                const headerVars = [...new Set(headerText.match(/{{\d+}}/g) || [])];
                                if (headerVars.length > 0) {
                                        headerComp.example = { header_text: headerVars.map(v => { const varNum = v.match(/\d+/)[0]; return headerSampleContents[varNum] || `[Sample]`; }) };
                                }
                        } else if (headerType === 'LOCATION') {
                                // location headers don't use example handles
                        } else {
                                if (headerFile && headerFile.url) headerComp.example = { header_handle: ['https://www.example.com/media.png'] };
                                else headerComp.example = { header_handle: ['https://www.example.com/media.png'] };
                        }
                        componentsArr.push(headerComp);
                }

                // Body
                const bodyComp = { type: 'BODY' };
                if (category === 'AUTHENTICATION') {
                        if (addSecurityRecommendation) bodyComp.add_security_recommendation = true;
                } else {
                        bodyComp.text = bodyText;
                        const vars = [...new Set(bodyText.match(/{{\d+}}/g) || [])];
                        if (vars.length > 0) bodyComp.example = { body_text: [vars.map(v => { const varNum = v.match(/\d+/)[0]; return sampleContents[varNum] || `[Sample]`; })] };
                }
                componentsArr.push(bodyComp);

                // Footer & Buttons
                if (footerText) componentsArr.push({ type: 'FOOTER', text: footerText });
                else if (category === 'AUTHENTICATION' && addExpiry) componentsArr.push({ type: 'FOOTER', code_expiration_minutes: expiryMinutes });

                if (templateType === 'Catalog') {
                        const btn = catalogFormat === 'Catalog message' ? { type: 'CATALOG', text: 'View catalog' } : { type: 'MPM', text: 'View items' };
                        componentsArr.push({ type: 'BUTTONS', buttons: [btn] });
                } else if (templateType === 'Calling permissions request') {
                        componentsArr.push({ type: 'CALL_PERMISSION_REQUEST' });
                } else if (category === 'AUTHENTICATION') {
                        const otpBtn = { type: 'OTP', otp_type: authType, text: copyCodeText };
                        if (authType !== 'COPY_CODE') {
                                otpBtn.autofill_text = autofillText;
                                otpBtn.supported_apps = supportedApps.filter(app => app.package_name && app.signature_hash).map(({ package_name, signature_hash }) => ({ package_name, signature_hash }));
                                if (authType === 'ZERO_TAP' && zeroTapConsent) otpBtn.zero_tap_terms_accepted = true;
                        }
                        componentsArr.push({ type: 'BUTTONS', buttons: [otpBtn] });
                } else if (buttons.length > 0) {
                        const apiBtns = buttons.map(b => {
                                const base = { type: b.type, text: b.text };
                                if (b.type === 'URL') {
                                        base.url = b.url;
                                        if (b.urlType === 'dynamic' && b.urlExample) base.example = [b.urlExample];
                                }
                                if (b.type === 'PHONE_NUMBER') base.phone_number = b.phone;
                                return base;
                        });
                        componentsArr.push({ type: 'BUTTONS', buttons: apiBtns });
                }

                const finalJson = { name: templateName.toLowerCase().replace(/\s+/g, '_'), language: language, category: category, components: componentsArr };
                if (addValidityPeriod) finalJson.message_send_ttl_seconds = validityPeriodSeconds;
                setTemplateJson(finalJson);

                // --- Generate Send Message JSON with parameters ---
                const sendComponents = [];
                if (category === 'AUTHENTICATION') {
                        const authBodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Code]' }));
                        if (authBodyParams.length > 0) sendComponents.push({ type: 'body', parameters: authBodyParams });
                        sendComponents.push({ type: 'button', sub_type: 'otp', index: '0', parameters: [{ type: 'text', text: sampleContents['1'] || '[Sample Code]' }] });
                } else if (templateType === 'Catalog' && catalogFormat === 'Catalog message') {
                        if (/{{\d+}}/.test(bodyText)) {
                                const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Body]' }));
                                sendComponents.push({ type: 'body', parameters: bodyParams });
                        }
                        sendComponents.push({ type: 'button', sub_type: 'CATALOG', index: 0, parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<THUMBNAIL_PRODUCT_RETAILER_ID>' } }] });
                } else if (templateType === 'Catalog' && catalogFormat === 'Multi-product message') {
                        if (headerType === 'TEXT' && /{{\d+}}/.test(headerText)) {
                                const headerParams = [...new Set(headerText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: headerSampleContents[v.match(/\d+/)[0]] || '[Sample Header]' }));
                                sendComponents.push({ type: 'header', parameters: headerParams });
                        }
                        if (/{{\d+}}/.test(bodyText)) {
                                const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample Body]' }));
                                sendComponents.push({ type: 'body', parameters: bodyParams });
                        }
                        sendComponents.push({ type: 'button', sub_type: 'mpm', index: '0', parameters: [{ type: 'action', action: { thumbnail_product_retailer_id: '<product_id>', sections: [{ title: 'Featured Items', product_items: [{ product_retailer_id: '<product_id_1>' }, { product_retailer_id: '<product_id_2>' }] }] } }] });
                } else {
                        if (headerType === 'TEXT' && /{{\d+}}/.test(headerText)) {
                                const headerParams = [...new Set(headerText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: headerSampleContents[v.match(/\d+/)[0]] || '[Sample]' }));
                                sendComponents.push({ type: 'header', parameters: headerParams });
                        }
            if ((headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && ( (headerFile && headerFile.url) || headerExistingMediaLink )) {
                // prefer an uploaded file URL during this editing session, otherwise fall back to the existing media link
                const uploadedOrExisting = (headerFile && headerFile.url) ? headerFile.url : headerExistingMediaLink;
                const imagelink = "https://picsum.photos/seed/picsum/200/300";
                const videoLink = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
                const documentLink = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
                let mediaParam = null;
                if (headerType === 'IMAGE') mediaParam = { type: 'image', image: { link: imagelink } };
                else if (headerType === 'VIDEO') mediaParam = { type: 'video', video: { link: videoLink } };
                else mediaParam = { type: 'document', document: { link: documentLink } };
                sendComponents.push({ type: 'header', parameters: [mediaParam] });
            }
                        if (/{{\d+}}/.test(bodyText)) {
                                const bodyParams = [...new Set(bodyText.match(/{{\d+}}/g) || [])].map(v => ({ type: 'text', text: sampleContents[v.match(/\d+/)[0]] || '[Sample]' }));
                                sendComponents.push({ type: 'body', parameters: bodyParams });
                        }
                        buttons.forEach((btn, index) => {
                                if (btn.type === 'URL' && btn.urlType === 'dynamic' && btn.urlExample) {
                                    sendComponents.push({ type: 'button', sub_type: 'url', index: index.toString(), parameters: [{ type: 'text', text: btn.urlExample }] });
                                }
                                if (btn.type === 'QUICK_REPLY') {
                                    sendComponents.push({
                                        type: 'button',
                                        sub_type: 'quick_reply',
                                        index: index.toString(),
                                        parameters: [{
                                            type: 'payload',
                                            payload: uuidv4()
                                        }]
                                    });
                                }
                        });
                }
                const sendJson = { messaging_product: 'whatsapp', to: '<recipient_phone_number>', type: 'template', template: { name: finalJson.name, language: { code: language }, components: sendComponents } };
                setSendMessageJson(sendJson);

        }, [templateName, language, category, templateType, catalogFormat, headerType, headerText, bodyText, footerText, buttons, authType, addSecurityRecommendation, addExpiry, expiryMinutes, sampleContents, headerSampleContents, supportedApps, autofillText, copyCodeText, addValidityPeriod, validityPeriodSeconds, headerFile]);

    // Effect to reset form on category change, and also reset templateType and catalogFormat
    useEffect(() => {
        setBodyText(category === "AUTHENTICATION" ? "{{1}} is your verification code." : "");
        setFooterText("");
        setHeaderText("");
        setHeaderType("NONE");
        setButtons([]);
        setSampleContents({});
        setHeaderFile(null);
        setHeaderSampleContents({});
        setAuthType("COPY_CODE");
        setAddSecurityRecommendation(false);
        setAddExpiry(false);
        setAddValidityPeriod(false);
        setSupportedApps([{ id: 0, package_name: '', signature_hash: '' }]);
        setZeroTapConsent(false);

        // Reset template type and catalog format based on category
        if (category === "AUTHENTICATION") {
            setTemplateType("One-time Passcode");
            setCatalogFormat("Catalog message"); // reset just in case
        } else if (category === "MARKETING") {
            setTemplateType("Default");
            setCatalogFormat("Catalog message");
        } else if (category === "UTILITY") {
            setTemplateType("Default");
            setCatalogFormat("Catalog message");
        }
    }, [category]);
    
    // --- UI HANDLERS ---
    const handleAddApp = () => { if (supportedApps.length < 5) { appIdCounter++; setSupportedApps(prev => [...prev, { id: appIdCounter, package_name: '', signature_hash: '' }]); } else { alert("A maximum of 5 apps is allowed."); } };
    const handleRemoveApp = (id) => setSupportedApps(prev => prev.filter(app => app.id !== id));
    const handleAppChange = (id, field, value) => setSupportedApps(prev => prev.map(app => app.id === id ? { ...app, [field]: value } : app));
    // Validation helpers for app fields
    const validatePackageName = (pkg) => {
        if (!pkg) return false;
        // At least two segments separated by dots
        const segments = pkg.split('.');
        if (segments.length < 2) return false;
        const segRe = /^[A-Za-z][A-Za-z0-9_]*$/;
        return segments.every(s => segRe.test(s));
    };
    const validateSignatureHash = (hash) => {
        if (!hash) return false;
        // enforce exact length 11
        return hash.length === 11;
    };
    // const handleAddButton = (type) => { buttonIdCounter++; setButtons(prev => [...prev, { id: buttonIdCounter, type, text: '', url: '', phone: '' }]); };
    const handleRemoveButton = id => setButtons(prev => prev.filter(btn => btn.id !== id));
    const handleButtonChange = (id, field, value) => setButtons(prev => prev.map(btn => btn.id === id ? { ...btn, [field]: value } : btn));
    const handleSampleContentChange = (varNum, value) => setSampleContents(prev => ({ ...prev, [varNum]: value }));
    const handleHeaderSampleContentChange = (varNum, value) => setHeaderSampleContents(prev => ({ ...prev, [varNum]: value }));
    const handleAddButton = (type) => {
        buttonIdCounter++;
        const newButton = { id: buttonIdCounter, type, text: '', url: '', phone: '' };
        // ** R4: State Management **
        if (type === 'URL') {
            newButton.urlType = 'static';
            newButton.urlExample = '';
        }
        // Enforce max 10 buttons
        setButtons(prev => {
            if (prev.length >= 10) {
                alert('A maximum of 10 buttons is allowed.');
                return prev;
            }
            return [...prev, newButton];
        });
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setHeaderFile({
                    url: e.target.result,
                    type: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Validate button grouping rules for Default template type
    // Accepts array of button types like ['QUICK_REPLY','URL','PHONE_NUMBER']
    const validateButtonGrouping = (types) => {
        if (!types || types.length === 0) return true;
        if (types.length > 10) return false;

        // Normalize types to three categories: QR (quick reply), URL, PHONE
        const mapped = types.map(t => {
            if (t === 'QUICK_REPLY') return 'QR';
            if (t === 'URL') return 'URL';
            if (t === 'PHONE_NUMBER') return 'PHONE';
            return t;
        });

        // Valid grouping rules (when templateType === 'Default'):
        // - QR buttons may appear together in a contiguous block(s)
        // - URL/PHONE may appear together in contiguous region(s)
        // - Sequences like QR, URL, QR are invalid
        // Simplest approach: there must be at most two transitions between QR-block and (URL/PHONE)-block.

        // Map URL and PHONE to same group 'ACTION'
        const groups = mapped.map(m => (m === 'QR' ? 'QR' : 'ACTION'));

        // Collapse consecutive duplicates
        const collapsed = groups.reduce((acc, cur) => {
            if (acc.length === 0 || acc[acc.length - 1] !== cur) acc.push(cur);
            return acc;
        }, []);

        // Allowed collapsed patterns:
        // ['QR']
        // ['ACTION']
        // ['QR','ACTION']
        // ['ACTION','QR']
        // ['QR','ACTION','QR'] is invalid (this would be length 3 and start/end QR)

        if (collapsed.length === 1) return true;
        if (collapsed.length === 2) return true;
        // if length >=3, it's invalid
        return false;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // ** R3: Input Validation **
        for (const btn of buttons) {
            if (btn.type === 'URL' && btn.urlType === 'dynamic' && !btn.url.includes('{{1}}')) {
                alert(`Error for button "${btn.text || 'Untitled'}": A dynamic URL must contain the placeholder {{1}}.`);
                return;
            }
        }

        // Validate button grouping when templateType === 'Default'
        if (templateType === 'Default') {
            const groupingValid = validateButtonGrouping(buttons.map(b => b.type));
            if (!groupingValid) {
                alert('Button grouping is invalid. Ensure Quick Reply and URL/Phone buttons are grouped in valid sequences.');
                return;
            }
        }

        setLoading(true);
        try {
            // Get user info for tracking
            const userId = user?.id || 'anonymous';
            const userEmail = user?.email || '';
            const userRole = user?.user_metadata?.role || 'user';
            
            console.log('Creating template for user:', { userId, userEmail, userRole });
            
            // Single atomic request: POST combined payload to /template with user info
            const combinedPayload = { 
                template: templateJson, 
                send_message: sendMessageJson,
                user_id: userId,
                user_email: userEmail,
                user_role: userRole
            };
            console.log("SENDING COMBINED PAYLOAD TO /template:", JSON.stringify(combinedPayload, null, 2));

            const resp = await fetch('http://localhost:8080/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(combinedPayload)
            }).catch(err => {
                console.error('Network error posting combined payload to /template:', err);
                return null;
            });

            if (resp && resp.ok) {
                const data = await resp.json().catch(() => null);
                console.log('Combined /template response:', data);
                alert('Template created and message sent successfully.');
            } else {
                const status = resp ? resp.status : 'network-failure';
                const bodyText = resp ? await resp.text().catch(() => null) : null;
                console.error('Combined /template failed:', status, bodyText);
                alert('Failed to create template and send message. See console for details.');
            }
        } catch (err) {
            console.error('Unexpected error while submitting template and message:', err);
            alert('Failed to submit template and send message. Check the console for details and ensure the backend is running at http://localhost:8080.');
        } finally {
            setLoading(false);
        }
    };


    const anyAppInvalid = supportedApps.some(app => !(validatePackageName(app.package_name) && validateSignatureHash(app.signature_hash)));
    const groupingValid = templateType === 'Default' ? validateButtonGrouping(buttons.map(b => b.type)) : true;
    const isSubmitDisabled = loading || !category || (category === 'AUTHENTICATION' && authType === 'ZERO_TAP' && !zeroTapConsent) || ((authType === 'ONE_TAP' || authType === 'ZERO_TAP') && anyAppInvalid) || !groupingValid;
    const variablesInBody = [...new Set(bodyText.match(/{{\d+}}/g) || [])];

    // Helper for file input accept attribute
    const getAcceptType = () => {
        switch(headerType) {
            case 'IMAGE': return 'image/*';
            case 'VIDEO': return 'video/*';
            case 'DOCUMENT': return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-sky-100 to-green-100 text-left">
            <div className="main-content flex-grow md:p-6" style={{ paddingLeft: isSidebarHovered ? "160px" : "70px", transition: "padding-left 0.3s" }}>
                <h1 className="text-lg font-semibold  mb-6 text-black">Create Message Template</h1>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="bg-white p-5 rounded-lg shadow text-black"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="block text-sm font-semibold text-gray-700">Category *</label><select required value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="" disabled>Select...</option><option value="MARKETING">Marketing</option><option value="UTILITY">Utility</option><option value="AUTHENTICATION">Authentication</option></select></div><div><label className="block text-sm font-semibold text-gray-700">Template Name *</label><input required type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., summer_sale"/></div><div><label className="block text-sm font-semibold text-gray-700">Language *</label><select value={language} onChange={e => setLanguage(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                              <option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="az">Azerbaijani</option><option value="bn">Bengali</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="zh_CN">Chinese (CHN)</option><option value="zh_HK">Chinese (HKG)</option><option value="zh_TW">Chinese (TAI)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="en_GB">English (UK)</option><option value="en_US">English (US)</option><option value="et">Estonian</option><option value="fil">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="he">Hebrew</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="kn">Kannada</option><option value="kk">Kazakh</option><option value="ko">Korean</option><option value="lo">Lao</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="ml">Malayalam</option><option value="mr">Marathi</option><option value="nb">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt_BR">Portuguese (BR)</option><option value="pt_PT">Portuguese (POR)</option><option value="pa">Punjabi</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="es">Spanish</option><option value="es_AR">Spanish (ARG)</option><option value="es_MX">Spanish (MEX)</option><option value="es_ES">Spanish (SPA)</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="uz">Uzbek</option><option value="vi">Vietnamese</option>
                              </select></div></div></div>
                            
                            {category && (
                                <div className="bg-white p-5 rounded-lg shadow text-black">
                                    <h3 className="text-lg font-semibold text-black">Template Type</h3>
                                    <select value={templateType} onChange={e => setTemplateType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                                        {category === 'MARKETING' && (<>
                                            <option value="Default">Default</option>
                                            <option value="Catalog">Catalog</option>
                                            <option value="Calling permissions request">Calling permissions request</option>
                                        </>)}
                                        {category === 'UTILITY' && (<>
                                            <option value="Default">Default</option>
                                            <option value="Calling permissions request">Calling permissions request</option>
                                        </>)}
                                        {category === 'AUTHENTICATION' && (<option value="One-time Passcode">One-time Passcode</option>)}
                                    </select>
                                </div>
                            )}

                            {templateType === 'Default' && (category === "MARKETING" || category === "UTILITY") && (
                                <>
                                    <div className="bg-white p-5 rounded-lg shadow text-black">
                                        <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
                                        <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                                            <option value="NONE">None</option><option value="TEXT">Text</option><option value="IMAGE">Image</option><option value="VIDEO">Video</option><option value="DOCUMENT">Document</option><option value="LOCATION">Location</option>
                                        </select>
                                        {/* {headerType === 'TEXT' && <div><input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/><p className="text-xs text-gray-500 text-right mt-1">{headerText.length} / 60</p></div>} */}
                                        {headerType === 'TEXT' && <div>
                                            <input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/>
                                            <div className="flex justify-between items-center mt-2">
                                                <button type="button" onClick={() => setHeaderText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button>
                                                <p className="text-xs text-gray-500">{headerText.length} / 60</p>
                                            </div>
                                        </div>}
                                            {headerType === 'TEXT' && (Array.from(new Set(headerText.match(/{{\d+}}/g) || []))).length > 0 && (
                                                <div className="bg-white p-5 rounded-lg shadow mt-3">
                                                    <h3 className="text-lg font-bold ">Header Sample Content</h3>
                                                    <p className="text-sm text-gray-500 mb-2">Provide an example for each header variable.</p>
                                                    {(Array.from(new Set(headerText.match(/{{\d+}}/g) || []))).map(variable => { const varNum = variable.match(/\d+/)[0]; return (
                                                        <div key={varNum} className="mt-2">
                                                            <label className="block text-sm font-semibold text-gray-600">{`{{${varNum}}}`}</label>
                                                            <input type="text" value={headerSampleContents[varNum] || ""} onChange={(e) => handleHeaderSampleContentChange(varNum, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder={`Example for {{${varNum}}}`} />
                                                        </div>
                                                    ); })}
                                                </div>
                                            )}
                                        {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
                                            <div className="mt-2">
                                                <label className="block text-sm font-semibold text-gray-700">Upload {headerType.toLowerCase()}</label>
                                                <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-white p-5 rounded-lg shadow text-black"><h3 className="text-lg font-bold">Body *</h3>
                                    <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="7" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>

                                    <div className="flex justify-between items-center mt-2"><button type="button" onClick={() => setBodyText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button><p className="text-xs text-gray-500">{bodyText.length} / 1024</p></div>
                                    </div>
                                    {variablesInBody.length > 0 && (<div className="bg-white p-5 rounded-lg shadow"><h3 className="text-lg font-bold">Sample Content</h3><p className="text-sm text-gray-500 mb-2">Provide an example for each variable.</p>{variablesInBody.map((variable) => { const varNum = variable.match(/\d+/)[0]; return (<div key={varNum} className="mt-2"><label className="block text-sm font-semibold text-gray-600">{`{{${varNum}}}`}</label><input type="text" value={sampleContents[varNum] || ""} onChange={(e) => handleSampleContentChange(varNum, e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder={`Example for {{${varNum}}}`} /></div>)})}</div>)}

                                    <div className="bg-white p-5 rounded-lg shadow text-black"><h3 className="text-lg font-bold">Footer <span className="text-gray-400 font-normal">(Optional)</span></h3><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter footer text..." /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div>
                                    {/* <div className="bg-white p-5 rounded-lg shadow"><h3 className="text-lg font-bold">Buttons <span className="text-gray-400 font-normal">(Optional)</span></h3>{buttons.map(btn => (<div key={btn.id} className="p-3 border rounded-md mt-2 space-y-2"><div className="flex justify-between items-center"><p className="font-semibold">{btn.type.replace('_', ' ')}</p><button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-red-500 font-bold">✕</button></div><input type="text" value={btn.text} onChange={e => handleButtonChange(btn.id, 'text', e.target.value)} placeholder="Button Text" className="block w-full p-2 border border-gray-300 rounded-md"/>{btn.type === 'URL' && <input type="text" value={btn.url} onChange={e => handleButtonChange(btn.id, 'url', e.target.value)} placeholder="URL (e.g., https://...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}{btn.type === 'PHONE_NUMBER' && <input type="text" value={btn.phone} onChange={e => handleButtonChange(btn.id, 'phone', e.target.value)} placeholder="Phone Number (+1555...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}</div>))}<div className="mt-3"><button type="button" onClick={() => handleAddButton('QUICK_REPLY')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Quick Reply</button><button type="button" onClick={() => handleAddButton('URL')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add URL Button</button><button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} className="bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Call Button</button></div></div> */}
                                    <div className="bg-white p-5 rounded-lg shadow text-black">
                                        <h3 className="text-lg font-bold">Buttons <span className="text-gray-400 font-normal">(Optional)</span></h3>
                                        {templateType === 'Default' && !groupingValid && (
                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded">Invalid button grouping: Quick Reply buttons must not be separated by URL/Phone buttons. Keep Quick Reply buttons contiguous or put URL/Phone buttons together.</div>
                                        )}
                                        {buttons.map(btn => (
                                            <div key={btn.id} className="p-3 border rounded-md mt-2 space-y-2">
                                                <div className="flex justify-between items-center"><p className="font-semibold">{btn.type.replace('_', ' ')}</p><button type="button" onClick={() => handleRemoveButton(btn.id)} className="text-red-500 font-bold">✕</button></div>
                                                <input type="text" value={btn.text} onChange={e => handleButtonChange(btn.id, 'text', e.target.value)} placeholder="Button Text" className="block w-full p-2 border border-gray-300 rounded-md"/>
                                                {btn.type === 'URL' && (
                                                    <div className="space-y-2">
 <label className="block text-sm font-semibold text-gray-700 mt-2">URL Type</label>
                                                        {/* R1: UI Modification */}
                                                        <select value={btn.urlType} onChange={e => handleButtonChange(btn.id, 'urlType', e.target.value)} className="block w-full p-2 border border-gray-300 rounded-md">
                                                            <option value="static">Static</option>
                                                            <option value="dynamic">Dynamic</option>
                                                        </select>
<label className="block text-sm font-semibold text-gray-700 mt-2">URL</label>
                                                        <input type="text" value={btn.url} onChange={e => handleButtonChange(btn.id, 'url', e.target.value)} placeholder="URL (https://...)" className="block w-full p-2 border border-gray-300 rounded-md"/>
                                                        {/* R2: Conditional UI */}
                                                        {btn.urlType === 'dynamic' && (
                                                          <div>
                                                          <label className="block text-sm font-semibold text-gray-700 mt-2">Sample Value for {'{{1}}'}</label>
                                                          <input type="text" value={btn.urlExample} onChange={e => handleButtonChange(btn.id, 'urlExample', e.target.value)} placeholder="Sample Value (e.g., summer-sale)" className="block w-full p-2 border border-gray-300 rounded-md"/>
                                                          </div>
                                                        )}
                                                    </div>
                                                )}

                                                {btn.type === 'PHONE_NUMBER' && <input type="text" value={btn.phone} onChange={e => handleButtonChange(btn.id, 'phone', e.target.value)} placeholder="Phone Number (+1555...)" className="block w-full p-2 border border-gray-300 rounded-md"/>}
                                            </div>
                                        ))}
                                        <div className="mt-3"><button type="button" onClick={() => handleAddButton('QUICK_REPLY')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Quick Reply</button><button type="button" onClick={() => handleAddButton('URL')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add URL Button</button><button type="button" onClick={() => handleAddButton('PHONE_NUMBER')} className="mr-2 bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md text-sm">Add Call Button</button></div>
                                    </div>
                                </>
                            )}
                                                    {templateType === 'Catalog' && (
                                                        <div className="bg-white p-5 rounded-lg shadow space-y-6">
                                                            <div><h3 className="text-lg font-bold">Catalog Format</h3><div className="mt-2 space-y-2"><div className="flex items-start"><input className="mt-1" type="radio" id="catalog_message" name="catalogFormat" value="Catalog message" checked={catalogFormat === 'Catalog message'} onChange={e => setCatalogFormat(e.target.value)} /><label htmlFor="catalog_message" className="ml-2 text-sm"><b className="block">Catalog message</b>Include the entire catalog.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="multi_product_message" name="catalogFormat" value="Multi-product message" checked={catalogFormat === 'Multi-product message'} onChange={e => setCatalogFormat(e.target.value)} /><label htmlFor="multi_product_message" className="ml-2 text-sm"><b className="block">Multi-product message</b>Include up to 30 products.</label></div></div></div>
                                                            {catalogFormat === 'Multi-product message' && (
                                                              <div className="bg-white p-5 rounded-lg shadow">
                                        <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
                                        <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
                                            <option value="NONE">None</option><option value="TEXT">Text</option><option value="IMAGE">Image</option><option value="VIDEO">Video</option><option value="DOCUMENT">Document</option><option value="LOCATION">Location</option>
                                        </select>
                                                                {headerType === 'TEXT' && <div>
                                                                    <input type="text" value={headerText} maxLength="60" onChange={e => setHeaderText(e.target.value)} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" placeholder="Enter header text..."/>
                                                                    <div className="flex justify-between items-center mt-2">
                                                                        <button type="button" onClick={() => setHeaderText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button>
                                                                        <p className="text-xs text-gray-500">{headerText.length} / 60</p>
                                                                    </div>
                                                                </div>}
                                        {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
                                            <div className="mt-2">
                                                <label className="block text-sm font-semibold text-gray-700">Upload {headerType.toLowerCase()}</label>
                                                <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                                            </div>
                                        )}
                                    </div>
                                                                // <div className="bg-white p-5 rounded-lg shadow -mt-2">
                                                                //     <h3 className="text-lg font-bold">Header <span className="text-gray-400 font-normal">(Optional)</span></h3>
                                                                //     <p className="text-xs text-gray-500 mb-2">You can add an optional header for your multi-product message.</p>
                                                                //     <label className="block text-sm font-semibold text-gray-700 mt-2">Header Type</label>
                                                                //     <select value={headerType} onChange={e => setHeaderType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                                                //         <option value="NONE">None</option>
                                                                //         <option value="TEXT">Text</option>
                                                                //         <option value="IMAGE">Image</option>
                                                                //         <option value="VIDEO">Video</option>
                                                                //         <option value="DOCUMENT">Document</option>
                                                                //         <option value="LOCATION">Location</option>
                                                                //     </select>
                                                                //     {headerType === 'TEXT' && (
                                                                //         <div className="mt-2">
                                                                //             <input type="text" value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="Header text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                                                //             <p className="text-xs text-gray-500 text-right mt-1">{headerText.length} / 60</p>
                                                                //         </div>
                                                                //     )}
                                                                //     {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
                                                                //         <div className="mt-2">
                                                                //             <label className="block text-sm font-semibold text-gray-700">Upload header {headerType.toLowerCase()}</label>
                                                                //             <input type="file" onChange={handleFileChange} accept={getAcceptType()} className="mt-1 block w-full text-sm text-gray-500" />
                                                                //         </div>
                                                                //     )}
                                                                // </div>
                                                            )}
                                    <div><h3 className="text-lg font-bold">Content</h3><div className="space-y-4"><div><label className="block text-sm font-semibold">Body *
                                      </label>
                                       <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="7" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
                                       <p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p>
                                       <div className="flex justify-between items-center mt-2"><button type="button" onClick={() => setBodyText(prev => prev + `{{${(prev.match(/{{\d+}}/g) || []).length + 1}}}`)} className="bg-blue-100 text-blue-800 font-semibold py-1 px-3 rounded-md text-sm">Add Variable</button><p className="text-xs text-gray-500">{bodyText.length} / 1024</p></div>
                                      {/* <textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea>*/}
                                      {/* <p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p> */}
                                      </div><div><label className="block text-sm font-semibold">Footer (Optional)</label><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div></div></div>
                                    <div><h3 className="text-lg font-bold">Buttons</h3><div className="p-3 border rounded-md mt-2 bg-gray-100"><p className="font-semibold text-gray-500">{catalogFormat === 'Catalog message' ? 'View catalog (fixed)' : 'View items (fixed)'}</p></div></div>
                                    <div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>
                                </div>
                            )}

                            {templateType === 'Calling permissions request' && (
                                <div className="bg-white p-5 rounded-lg shadow space-y-6">
                                     <div><h3 className="text-lg font-bold">Content</h3><div className="space-y-4"><div><label className="block text-sm font-semibold">Body *</label><textarea required value={bodyText} maxLength="1024" onChange={e => setBodyText(e.target.value)} rows="4" className="mt-1 w-full p-2 border rounded-md"></textarea><p className="text-xs text-gray-500 text-right mt-1">{bodyText.length} / 1024</p></div><div><label className="block text-sm font-semibold">Footer (Optional)</label><input type="text" value={footerText} maxLength="60" onChange={e => setFooterText(e.target.value)} className="mt-1 w-full p-2 border rounded-md" /><p className="text-xs text-gray-500 text-right mt-1">{footerText.length} / 60</p></div></div></div>
                                     <div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>
                                </div>
                            )}
                            {category === "AUTHENTICATION" && (
                                 <div className="bg-white p-5 rounded-lg shadow space-y-6">
                                    <div><h3 className="text-lg font-bold">Authentication Type</h3><div className="mt-2 space-y-3"><div className="flex items-start"><input className="mt-1" type="radio" id="one_tap" name="authType" value="ONE_TAP" checked={authType==='ONE_TAP'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="one_tap" className="ml-2 text-sm"><b className="block">One-tap auto-fill</b>This is recommended as the easiest option for your customers.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="zero_tap" name="authType" value="ZERO_TAP" checked={authType==='ZERO_TAP'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="zero_tap" className="ml-2 text-sm"><b className="block">Zero-tap</b>When zero-tap has been turned on, the code will automatically be sent.</label></div><div className="flex items-start"><input className="mt-1" type="radio" id="copy_code" name="authType" value="COPY_CODE" checked={authType==='COPY_CODE'} onChange={e => setAuthType(e.target.value)} /><label htmlFor="copy_code" className="ml-2 text-sm"><b className="block">Copy code</b>Basic authentication with quick setup.</label></div></div></div>
                                    {(authType === 'ONE_TAP' || authType === 'ZERO_TAP') && (<div><h3 className="text-lg font-bold">App Information</h3><p className="text-sm text-gray-500 mb-2">Required for auto-fill and zero-tap functionality.</p>{supportedApps.map((app, index) => {
                                        const pkgValid = validatePackageName(app.package_name);
                                        const sigValid = validateSignatureHash(app.signature_hash);
                                        return (
                                            <div key={app.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t pt-2 mt-2">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700">Package Name</label>
                                                    <input type="text" value={app.package_name} onChange={e => handleAppChange(app.id, 'package_name', e.target.value)} placeholder="Package Name (e.g., com.example.app)" className={`p-2 border rounded-md w-full ${pkgValid ? '' : 'border-red-500'}`} />
                                                    {!pkgValid && <p className="text-xs text-red-500 mt-1">application ID must have at least two segments, separated by dots. Each segment should begin with a letter, and all characters in a segment should be alphanumeric or underscore.</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700">App Signature Hash</label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="text" value={app.signature_hash} onChange={e => handleAppChange(app.id, 'signature_hash', e.target.value)} placeholder="App Signature Hash (11 chars)" className={`p-2 border rounded-md flex-grow ${sigValid ? '' : 'border-red-500'}`} />
                                                        {index > 0 && <button type="button" onClick={() => handleRemoveApp(app.id)} className="text-red-500 font-bold">✕</button>}
                                                    </div>
                                                    {!sigValid && <p className="text-xs text-red-500 mt-1">Signature hash must be exactly 11 characters.</p>}
                                                </div>
                                            </div>
                                        );
                                    })}<button type="button" onClick={handleAddApp} className="mt-2 text-blue-600 text-sm font-semibold">Add Another App</button></div>)}
                                    {authType === 'ZERO_TAP' && (<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm"><div className="flex items-start"><input id="zero-tap-consent" type="checkbox" checked={zeroTapConsent} onChange={e => setZeroTapConsent(e.target.checked)} className="h-4 w-4 mt-1"/><label htmlFor="zero-tap-consent" className="ml-3">By selecting zero-tap, I understand that my use is subject to the <a href="https://www.whatsapp.com/legal/business-terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">WhatsApp Business Terms of Service</a>. It is my responsibility to ensure customers expect an automatic code fill-in.<a href="https://business.facebook.com/business/help/285737223876109" target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline">Learn more</a></label></div></div>)}
                                    <div><h3 className="text-lg font-bold">Message Content</h3><div className="flex items-center mt-2"><input type="checkbox" id="security" checked={addSecurityRecommendation} onChange={e => setAddSecurityRecommendation(e.target.checked)} className="h-4 w-4" /><label htmlFor="security" className="ml-2">Add security recommendation</label></div><div className="flex items-center mt-2"><input type="checkbox" id="expiry" checked={addExpiry} onChange={e => setAddExpiry(e.target.checked)} className="h-4 w-4" /><label htmlFor="expiry" className="ml-2">Add expiry time for the code</label></div>{addExpiry && <div className="mt-2"><label className="block text-sm">Expires in (minutes)</label><input type="number" min="1" max="10" value={expiryMinutes} onChange={e => setExpiryMinutes(parseInt(e.target.value))} className="mt-1 p-2 border rounded-md w-full"/></div>}</div>
                                    <div><h3 className="text-lg font-bold">Message Validity Period</h3><div className="flex items-center justify-between mt-2"><p className="text-sm">Set custom validity period</p><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={addValidityPeriod} onChange={e => setAddValidityPeriod(e.target.checked)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></div>{addValidityPeriod && <select value={validityPeriodSeconds} onChange={e => setValidityPeriodSeconds(parseInt(e.target.value))} className="mt-2 w-full p-2 border rounded-md"><option value={60}>1 minute</option><option value={300}>5 minutes</option></select>}</div>
                                 </div>
                            )}
                            <div className="flex justify-end pt-4"><button type="submit" disabled={isSubmitDisabled} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">{loading ? 'Submitting...' : 'Submit'}</button></div>
                        </form>
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-black">Generated JSON (Create Template)</h3>
                          <pre className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm overflow-x-auto">{JSON.stringify(templateJson, null, 2)}</pre>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-black">Generated JSON (Send Template Message)</h3>
                          <pre className="bg-gray-800 text-white p-4 rounded-md mt-2 text-sm overflow-x-auto">{JSON.stringify(sendMessageJson, null, 2)}</pre>
                        </div>
                    </div>
                    <div className="lg:w-1/3"><div className="sticky top-6 text-black"><h3 className="text-lg font-semibold text-gray-600 mb-2 text-black">Live Preview</h3><Preview components={templateJson.components} category={category} addSecurityRecommendation={addSecurityRecommendation} authType={authType} sampleContents={sampleContents} headerFile={headerFile} headerSampleContents={headerSampleContents} /></div></div>
                </div>
            </div>
        </div>
    );
};

export default TemplateCreator;