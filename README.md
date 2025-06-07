# Node.js Backend Proxy

This Node.js application serves as a proxy backend that forwards requests to the FastAPI backend running at `http://74.225.190.5:8000/`.

## Features

- **Proxy Server**: Forwards all requests to the FastAPI backend
- **CORS Support**: Enables cross-origin requests
- **Form Data Handling**: Supports both JSON and form-encoded data
- **Error Handling**: Comprehensive error handling and logging
- **Health Check**: Built-in health check endpoint

## Available Routes

All routes are proxied to `http://74.225.190.5:8000/`:

- `GET /` - Read Root
- `POST /update_order_status` - Update Order Status
- `POST /submit_feedback` - Submit Feedback
- `GET /list_csv_links` - List CSV Links
- `POST /update_csv_file` - Update CSV File
- `GET /get_order_details` - Get Order Details
- `GET /health` - Health check (local endpoint)

## Installation

1. Navigate to the nodejs directory:

   ```bash
   cd nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on port 3000 by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## API Examples

### GET Request

```bash
curl http://localhost:3000/list_csv_links
```

### POST Request with Form Data

```bash
curl -X POST http://localhost:3000/update_order_status \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "order_id=12345&confirmation=true"
```

### POST Request with JSON

```bash
curl -X POST http://localhost:3000/submit_feedback \
  -H "Content-Type: application/json" \
  -d '{"salesman_name":"John","company_name":"ABC Corp","rating":5,"date":"2025-01-01"}'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Error Handling

The proxy server handles various error scenarios:

- **Backend Unavailable**: Returns 500 with connection error message
- **Backend Errors**: Forwards the exact error response from the FastAPI backend
- **Invalid Routes**: Returns 404 with list of available routes
- **Server Errors**: Returns 500 with generic error message

## Dependencies

- **express**: Web framework for Node.js
- **axios**: HTTP client for making requests to the FastAPI backend
- **cors**: Enable CORS support
- **multer**: Handle multipart/form-data
- **nodemon**: Development dependency for auto-restarting the server

## Architecture

```
Client Request → Node.js Proxy → FastAPI Backend (74.225.190.5:8000)
                     ↓
Client Response ← Node.js Proxy ← FastAPI Response
```

The Node.js server acts as a middleware layer that:

1. Receives client requests
2. Forwards them to the FastAPI backend
3. Returns the backend response to the client
4. Handles any errors that occur during the process
