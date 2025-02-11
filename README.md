# task-management-system

# Task Management API - README

## Overview

This project is a RESTful API for a simple task management system built using Node.js with Express and MongoDB. It allows users to register, log in, manage users (admin functionality), create, read, update, delete tasks, assign tasks to users, and filter/sort tasks. Authentication is implemented using JWT.

This document provides instructions on how to set up and run the API using Docker and Docker Compose.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

*   **Docker:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system (Windows, macOS, or Linux).
*   **Docker Compose:** Docker Compose is usually included with Docker Desktop installations. If you are using Docker Engine separately, you may need to install Docker Compose separately. [Check Docker Compose Installation Guide](https://docs.docker.com/compose/install/).

## Setup Instructions

Follow these steps to set up and run the Task Management API:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/code-by-tanveer/task-management-system.git
    cd task-management-system
    ```

2.  **Navigate to the Project Directory:**

    Make sure you are in the root directory of the cloned repository, where the `docker-compose.yml` and `Dockerfile` are located.

3.  **Configure Environment Variables:**

    *   Create a `.env` file in the root directory of the project if it doesn't exist.
    *   Open the `.env` file and configure the following environment variables:

        ```env
        MONGODB_URI=mongodb://localhost:27017/task_management_db  # MongoDB URI for local development (adjust if needed if running MongoDB outside Docker for local dev)
        JWT_SECRET=your_strong_jwt_secret_key_here
        ```

4.  **Run with Docker Compose:**

Execute the following command in your terminal from the project root directory:

    ```bash
    docker-compose up --build
    ```

    *   `docker-compose up`:  This command starts the services defined in your `docker-compose.yml` file.
    *   `--build`: This flag ensures that the Docker image for your API is built first if it doesn't exist or if the `Dockerfile` has been modified.

    Wait for Docker Compose to download the necessary images, build the API image, and start the containers. You should see logs from both the API and MongoDB in your terminal. Look for messages indicating successful startup, such as "MongoDB connected" and "Server listening on port 3000" in the API logs.

## Running the API

Once Docker Compose has successfully started the containers, the Task Management API will be accessible at:

*   **Base URL:** `http://localhost:3000/api`

## Stopping the API

To stop the API and the MongoDB database, execute the following command in your terminal:

```bash
docker-compose down
```
