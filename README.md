# Task-manager

This project is a simple task manager application with separate frontend and backend services. The frontend is built with [Vuetify](https://vuetifyjs.com/) and runs on [http://localhost:8080](http://localhost:8080), while the backend is built with [Node.js](https://nodejs.org/) and runs on [http://localhost:3000](http://localhost:3000).

## Prerequisites

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine. Docker is required to containerize and run both the frontend and backend components seamlessly.

## Getting Started

1. **Clone the Repository**
    ```sh
    git clone https://github.com/deoninja/Task-manager-vuetify.git
    cd Task-manager-vuetify
    ```

2. **Set Up Environment Variables**

    Ensure you have a `.env` file in the root of the project to manage environment variables (if necessary for the backend service). Here’s an example:

    Task-manager/ 
        ├── frontend/          
        └── .env.example  # Rename the .env.example to .env
    
    ```plaintext
    PORT=3000
    ```

<<<<<<< HEAD
3. **Build and Run the Project**

    Use Docker Compose to build and run the containers:

    ```sh
    docker-compose up --build
    ```

    This command will pull required images, build your services, and start both the frontend and backend. The frontend will be accessible at [http://localhost:8080](http://localhost:8080), and the backend will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure
```ssh
Task-manager/ 
    ├── frontend/               # Frontend files and Vue/Vuetify setup 
    ├── backend/                # Backend API and server configuration 
    ├── docker-compose.yml      # Docker Compose file to orchestrate services 
    └── README.md               # Project documentation
=======
```sh
git clone https://github.com/deoninja/Task-manager-vuetify.git
>>>>>>> fa779344278209a2d2e77d18e5a5def0880e4544
```

## Available Scripts

### Stopping the Services

To stop the containers, run:

```sh
docker-compose down
```
This will stop and remove the containers but keep the built images for faster restart.

## Rebuilding the Containers

To rebuild without using cache, you can run:

```sh
docker-compose up --build --no-cache
```

## Troubleshooting
Port Conflicts: Ensure that ports 8080 and 3000 are not occupied by other services on your machine.

Docker Issues: If you encounter issues with Docker, try restarting Docker or check the Docker documentation for common troubleshooting steps.

Network Issues: Verify that your network connection is stable and that there are no firewall rules blocking the services

## License
This project is licensed under the MIT License. See the LICENSE file for details.

```sh
This README includes details about Docker setup, port information, basic troubleshooting, and project structure, which will make it easier for others to understand
```