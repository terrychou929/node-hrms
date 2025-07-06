# MEVN Stack HRMS Application

This is a full-stack HRMS (Human Resource Management System) application built with the MEVN stack (MongoDB, Express.js, Vue.js, Node.js). It includes features for employee management, leave requests (including overtime), and approval records.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup and Installation

Follow these steps to clone the repository and run the application using Docker.

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/your-mevn-hrms.git
cd your-mevn-hrms
```

### 2. Project Structure

The project is structured as follows:

```
your-mevn-hrms/
├── backend/              # Express.js backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── Dockerfile        # Docker configuration for backend
│   └── ...
├── frontend/             # Vue.js frontend
│   ├── src/              # Vue components and assets
│   ├── Dockerfile        # Docker configuration for frontend
│   └── ...
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # This file
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```bash
# backend/.env
MONGO_URI=mongodb://mongo:27017/hrms
PORT=3000
```

Ensure the `.env` file is listed in `.gitignore` to prevent it from being committed to version control.

### 4. Build and Run the Application

From the project root directory, run the following command to build and start the Docker containers:

```bash
docker-compose up --build
```

This command:
- Builds the Docker images for the backend and frontend using the provided Dockerfiles.
- Starts the MongoDB, Express.js backend (on port 3000), and Vue.js frontend (on port 8080) services.
- Creates a bridge network (`mevn-network`) for communication between services.

### 5. Access the Application

Once the containers are running, you can access the application:
- **Frontend**: Open your browser and navigate to `http://localhost:8080`
- **Backend API**: Access the API at `http://localhost:3000`
- **MongoDB**: Connect to MongoDB at `mongodb://localhost:27017/hrms` (if needed for debugging).

### 6. Stopping the Application

To stop the running containers, press `Ctrl+C` in the terminal where `docker-compose up` is running, or run:

```bash
docker-compose down
```

To remove the containers and volumes (including MongoDB data), run:

```bash
docker-compose down -v
```
