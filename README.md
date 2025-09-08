# 🌐 Network Topology VR Viewer

This project is a **VR network topology visualization tool** built with **React** and **Vite**.

It renders switches, links, and metrics in a VR environment, making it easier to analyze and interact with complex network infrastructures.

---

## 🚀 Features

- **3D Network Topology** – Interactive visualization of switches and links in a 3D space.
- **Data Abstraction with Adapters** – Clean separation between backend and frontend domain models.
- **Mocked & Real Data** – Works with both local JSON data and API endpoints via Axios.
- **Custom Textures** – Dynamic table and metrics rendering on 3D objects.
- **Hooks-based Data Layer** – Custom React hooks for fetching and managing network data.

---

## 📂 Project Main Structure

```
src
 ┣ 📂 api/                # Data layer: adapters, axios instance, types, mock data
 ┣ 📂 components/         # UI components (3D network topology visualization)
 ┣ 📂 config/             # Environment Config Variables
 ┣ 📂 constants/          # Shared constants (e.g., colors)
 ┣ 📂 helpers/            # Utility functions
 ┣ 📂 hooks/              # Custom hooks for fetching switches, links, and metrics
 ┣ 📂 lib/                # Low-level libraries utilities for canvas and texture rendering
 ┣ 📂 pages/              # Application pages
 ┣ 📜 app.tsx             # Root application component
 ┣ 📜 main.tsx            # Entry point
 ┣ 📜 index.css           # Global styles
```

---

## 🛠️ Tech Stack

- **React + Vite** – Frontend framework & bundler
- **TypeScript** – Type safety
- **Axios** – HTTP client
- **Tanstack Query** – Server state management
- **Three.js & react-force-graph-vr** – VR graph support
- **TailwindCSS** – Styling with utility classes
- **ESLint + Prettier** – Code linting & formatting

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JorgeAVargasC/react-3d-models
   ```

2. **Navigate to the project directory**

   ```bash
   cd react-3d-models
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

---

## 📜 Commands

| Command           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Start the development server with Vite.                          |
| `npm run build`   | Type-check with TypeScript and build the project for production. |
| `npm run preview` | Preview the production build locally.                            |
| `npm run lint`    | Run ESLint to analyze and fix code quality issues.               |
| `npm run format`  | Format the entire codebase with Prettier.                        |

---

## 📡 API & Data Flow

1. **API / Mock Data** (JSON or backend service)
2. **Adapters** – Convert raw backend data into frontend models
3. **Hooks** – Handle fetching, caching, and state with Tanstack Query
4. **Components** – Render the network topology

```mermaid
flowchart TD

subgraph Backend["🌐 Backend"]
    API1["/switches"]
    API2["/links"]
    API3["/metrics"]
end

subgraph API["🔌 API Layer (api.ts)"]
    DEV["devApi (JSON mocks)"]
    PROD["prodApi (Axios)"]
end

subgraph Adapters["🔧 Adapters (DTO → Model)"]
    A1["switches.adapter.ts"]
    A2["links.adapter.ts"]
    A3["link-metrics.adapter.ts"]
end

subgraph Hooks["⚛️ Custom Hooks"]
    H1["use-get-switches"]
    H2["use-get-links"]
    H3["use-get-link-metrics"]
end

subgraph Components["🖼️ Components (3D)"]
    C1["use-get-node-objects"]
    C2["use-get-links-objects"]
    C3["NetworkTopology3D"]
end

Backend --> API
API --> Adapters
Adapters --> Hooks
Hooks --> Components
C1 --> C3
C2 --> C3
```

---

## 📌 Future Improvements

- Real-time updates with WebSockets

---

## 📄 License

This project is licensed under the **MIT License**.

# API

```ts
const switchesAdapter: (switches: ISwitch[]) => ISwitchDTO[]
```

```json
// ISwitch[]
[
  {
    "switches": {
      "puerto3_numero": {
        "low": 3,
        "high": 0
      },
      "puerto2_dpid": "s6-eth2",
      "port0_status": "DOWN",
      "port3_status": "UP",
      "port1_status": "UP",
      "port2_status": "UP",
      "puerto0_numero": {
        "low": -2,
        "high": 0
      },
      "puerto1_dpid": "s6-eth1",
      "switch_dpid": {
        "low": 6,
        "high": 0
      },
      "puerto2_numero": {
        "low": 2,
        "high": 0
      },
      "puerto1_numero": {
        "low": 1,
        "high": 0
      },
      "puerto0_dpid": "s6",
      "puerto3_dpid": "s6-eth3"
    }
  }
]
```

```json
// ISwitchDTO[]
[
  {
    "switchId": 6,
    "name": "s6",
    "ports": [
      {
        "label": "Port 0",
        "isActive": false,
        "dpid": "s6",
        "number": -2
      },
      {
        "label": "Port 1",
        "isActive": true,
        "dpid": "s6-eth1",
        "number": 1
      },
      {
        "label": "Port 2",
        "isActive": true,
        "dpid": "s6-eth2",
        "number": 2
      },
      {
        "label": "Port 3",
        "isActive": true,
        "dpid": "s6-eth3",
        "number": 3
      }
    ],
    "switchPort": 6
  }
]
```


