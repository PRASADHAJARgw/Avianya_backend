# Copilot Instructions for msg-canvas-flow-main

## Project Overview
This is a Vite + React + TypeScript monorepo for a WhatsApp messaging canvas app. It uses shadcn-ui and Tailwind CSS for UI, and includes a Go backend in `server/`.

## Architecture & Key Components
- **Frontend (src/):**
  - Main entry: `src/main.tsx`, `src/App.tsx`
  - UI components: `src/components/` (ads, whatsapp, ui)
  - Pages: `src/pages/` (ads, whatsapp)
  - State: `src/store/workflowStore.ts`
  - Styles: `src/styles/`, Tailwind config in `tailwind.config.ts`
- **Backend (server/):**
  - Go module: `server/main.go`, `server/go.mod`
- **Assets:**
  - Images: `src/assets/images/`
  - Public files: `public/`

## Developer Workflows
- **Install dependencies:**
  ```sh
  npm i
  ```
- **Start frontend dev server:**
  ```sh
  npm run dev
  ```
- **Build frontend:**
  ```sh
  npm run build
  ```
- **Go backend:**
  - Build/run manually in `server/` (no npm integration)

## Project-Specific Patterns
- **Component organization:**
  - UI primitives in `src/components/ui/` (shadcn-ui)
  - Feature modules in `src/components/ads/` and `src/components/whatsapp/`
- **State management:**
  - Centralized in `src/store/workflowStore.ts`
- **Styling:**
  - Tailwind CSS utility classes, custom styles in `src/styles/`
- **TypeScript:**
  - Strict typing enforced via `tsconfig.json`

## Integration Points
- **Frontend/Backend:**
  - No direct integration scripts; communicate via API endpoints (add docs if endpoints are added)
- **External UI:**
  - Uses shadcn-ui for consistent UI primitives

## Conventions
- **File naming:**
  - PascalCase for React components, camelCase for hooks and utilities
- **Directory structure:**
  - Feature-based grouping in `src/components/` and `src/pages/`

## Examples
- To add a new WhatsApp node UI, create a component in `src/components/whatsapp/` and register it in the canvas logic.
- To add a new page, place it in `src/pages/` and update routing in the main app.

## References
- See `README.md` for onboarding, build, and deployment details.
- See `tailwind.config.ts` and `vite.config.ts` for build and style configuration.

---
**Update this file as project conventions evolve.**
