# Task Management System

## Overview

This project is a RESTful API for a simple task management system built using Node.js with Express and MongoDB. It allows users to register, log in, manage users (admin functionality), create, read, update, delete tasks, assign tasks to users, and filter/sort tasks. Authentication is implemented using JWT (JSON Web Tokens).

This document provides instructions on how to set up and run the API using Docker and Docker Compose.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

*   **Docker:** [Install Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system (Windows, macOS, or Linux). Docker Desktop bundles Docker Engine, Docker CLI, Docker Compose, and Kubernetes, making it the easiest way to get started.
*   **Docker Compose:** Docker Compose is usually included with Docker Desktop installations. If you are using Docker Engine separately, you may need to install Docker Compose separately. [Check Docker Compose Installation Guide](https://docs.docker.com/compose/install/).

## Setup Instructions

Follow these steps to set up and run the Task Management API:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/code-by-tanveer/task-management-system.git
    cd task-management-system
    ```
    If you downloaded a ZIP file, extract it and navigate to the extracted directory in your terminal.

2.  **Navigate to the Project Directory:**

    Ensure your terminal's current working directory is the root directory of the cloned/extracted repository. This directory should contain `docker-compose.yml` and `Dockerfile`.

3.  **Configure Environment Variables:**

    *   Check if a `.env` file exists in the root directory of the project. If not, create one.
    *   Open the `.env` file with a text editor and configure the following environment variables:

        ```env
        MONGODB_URI=mongodb://localhost:27017/task_management_db  # MongoDB connection URI for local development within Docker.
        JWT_SECRET=your_strong_jwt_secret_key_here  # **IMPORTANT:** Replace with a strong, random secret key for JWT signing!
        ```

4.  **Run with Docker Compose:**

    Open your terminal in the project root directory and execute the following command:

    ```bash
    docker-compose up --build
    ```

    After running the command, Docker Compose will:

    *   Download necessary Docker images (like Node.js and MongoDB).
    *   Build the Docker image for your API application using the instructions in the `Dockerfile`.
    *   Start containers for both the API and MongoDB.
    *   Stream logs from both containers to your terminal.

    Wait for the process to complete. Look for log messages indicating successful startup:

    *   **MongoDB container logs:**  You should see messages indicating MongoDB server initialization and readiness.
    *   **API container logs:** Look for messages like "MongoDB connected" and "Server listening on port 3000", confirming the API has started and connected to the database.

## Accessing the API

Once Docker Compose has successfully started the containers, the Task Management API will be running and accessible at the following base URL in your web browser or API testing tool (like Postman, curl, etc.):

*   **Base URL:** `http://localhost:3000/api`

    You can now send HTTP requests to the API endpoints to register users, log in, manage tasks, etc.

## Stopping the API

To stop the API and the MongoDB database containers, and to clean up the Docker Compose environment, execute the following command in your terminal, from the same project root directory where you ran `docker-compose up`:

```bash
docker-compose down
