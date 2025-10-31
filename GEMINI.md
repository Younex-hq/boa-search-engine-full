# GEMINI.md

**Note to Gemini:** Keep this file updated with the context of each task you perform.

## Project Overview

This project is a document search engine with a web interface. It's a full-stack application with a separate frontend and backend.

The main technologies used are:

*   **Backend:** Laravel v12 (PHP) with a RESTful API. It uses a MySQL database and integrates with the Google Gemini API and Ollama local LLMs for AI-powered features. It also includes a PDF parsing library.
*   **Frontend (Admin):** React v19 with TypeScript, Vite, and Tailwind CSS. It uses TanStack Query for data fetching, React Router for routing, and Zustand for state management.
*   **Frontend (Public):** React v19 with JavaScript, Vite, and Tailwind CSS. It uses TanStack Query for data fetching and React Router for routing.

The database schema and seed data can be found in the `database` directory as `.sql` files.

## Database

The database schema is defined in the `database/create-tables.sql` file. The main tables are:

*   `documents`: Stores document metadata, including the title, creation date, type, and status. The actual file content is stored as a `LONGBLOB` and the extracted text is stored in the `extracted_text` column.
*   `users`: Stores user information, including their name, email, and password. It also has a flag to indicate if a user is an admin.
*   `directions`: Represents departments or organizational units.
*   `locations`: Represents physical locations.
*   `doc_types`: Stores the types of documents (e.g., "invoice", "report").
*   `doc_statuts`: Stores the status of documents (e.g., "draft", "published").

## Building and Running

### Backend (Laravel)

To run the backend development server, you need to have PHP, Composer, and Node.js installed.

1.  **Install dependencies:**
    ```bash
    composer install
    npm install
    ```
2.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and configure your database and other services.
    ```bash
    cp .env.example .env
    ```
3.  **Generate application key:**
    ```bash
    php artisan key:generate
    ```
4.  **Run the development server:**
    This command will start the Laravel development server, the queue listener, and the Vite development server.
    ```bash
    composer run dev
    ```

### Frontend (Admin)

To run the admin frontend development server, you need to have Node.js installed.

1.  **Navigate to the `frontend-admin` directory:**
    ```bash
    cd frontend-admin
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Frontend (Public)

To run the public frontend development server, you need to have Node.js installed.

1.  **Navigate to the `frontend-public` directory:**
    ```bash
    cd frontend-public
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## Development Conventions

### Backend

*   The backend follows the standard Laravel project structure.
*   API routes are defined in `routes/api_v1.php`.
*   Business logic is encapsulated in services (e.g., `DocumentService`, `GeminiService`, `OllamaService`).
*   The `DocumentController` handles the HTTP requests and responses for documents.
*   The `Gemini` service in `app/Services/Ai/Gemini.php` is used to interact with the Google Gemini API.
*   The project uses Laravel Pint for code styling. You can run it with `vendor/bin/pint`.
*   Tests are written with Pest and can be run with `composer test`.

### Frontend

*   Both frontends use Vite for building and development.
*   They use Tailwind CSS for styling.
*   They use ESLint for linting. You can run it with `npm run lint`.
*   They use Prettier for code formatting.
*   The admin frontend is in the `frontend-admin` directory and the main dashboard page is `src/pages/Dashboard.tsx`.
*   The public frontend is in the `frontend-public` directory and the main search page is `src/pages/Home.jsx`.
*   Both frontends use TanStack Query to manage server state and cache data from the backend.

## Development Log

### 2025-10-30

*   **Docker Configuration:**
    *   Created a root `.env` file to manage environment variables for Docker Compose. This includes database credentials and AI service configurations.
    *   Configured the `frontend-admin` and `frontend-public` services to communicate with the backend through the Nginx reverse proxy. Created `.env` files in each frontend directory with relative API URLs (`/api/` and `/api/v1`). This resolves issues with hardcoded IP addresses and ensures proper service communication within the Docker network.