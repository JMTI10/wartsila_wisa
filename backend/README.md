# Wärtsilä Sustainability Intelligence Platform API

Backend API for the Wärtsilä Sustainability Intelligence Platform.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build TypeScript:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Docker Deployment

```bash
docker build -t wartsila-backend .
docker run -p 3000:3000 wartsila-backend
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests

### API Endpoints

- `GET /health` - Health check
- `GET /test/operations-db` - Test operations database
- `GET /test/metrics-db` - Test metrics database  
- `GET /test/all-databases` - Test all databases
- `GET /api/engines` - Get engines data
- `GET /api/metrics` - Get plant metrics