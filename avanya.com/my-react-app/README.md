# Avianya Tech

Avianya Tech is a modern React application built with Vite. It offers a single-page experience that highlights WhatsApp marketing services along with consultancy, web development, and digital marketing solutions. This project uses Tailwind CSS for styling and provides smooth animations as you navigate through the app.

## Features

- **Responsive Design:** Built with Tailwind CSS and custom animations.
- **SPA Navigation:** Uses URL paths for different sections like Home, Services, Consultancy, Contact, Privacy Policy, and Terms & Conditions.
- **Neumorphic UI:** Components with soft shadows and scale effects on hover.
- **Contact Form:** Includes client-side validation for collecting user inputs.

## Getting Started

### Prerequisites
- Node.js (version 14 or above)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd my-react-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```
   or if you use yarn:
   ```sh
   yarn install
   ```

### Running the App

Start the development server:

```sh
npm run dev
```
or
```sh
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or the port specified by Vite).

### Building for Production

To build the project for production, run:

```sh
npm run build
```
or
```sh
yarn build
```

Then, preview the build locally:

```sh
npm run preview
```
or
```sh
yarn preview
```

## Project Structure

```
my-react-app/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── App.jsx          // Main App component with navigation and routing logic
│   ├── App.css
│   ├── index.css
│   └── main.jsx         // Entry point for React rendering
└── public/
    └── vite.svg
```

Refer to [`src/App.jsx`](src/App.jsx) for the main application logic and [`src/main.jsx`](src/main.jsx) for the entry point of the app.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../LICENSE) file for more details.

## Acknowledgments

- [Vite](https://vitejs.dev/) – Next Generation Frontend Tooling.
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework.
- [React](https://reactjs.org/) – JavaScript library for building user interfaces.
- [Lucide React](https://github.com/lucide-icons/lucide) – Open source icon library used in the project.