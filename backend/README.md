# Algerian Governmental Institution Document Search Engine API

## Overview

This project is the backend RESTful API for a document search engine tailored for an Algerian governmental institution. Its primary goal is to significantly improve the efficiency of document retrieval, providing quick and accurate access to a vast repository of official documents. This system aims to streamline administrative processes by enabling authorized personnel to locate necessary information with ease.

## Installation Guide

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bna-search-engine-api-v1
    ```
2.  **Install dependencies:**
    This project uses PHP and Laravel. Ensure you have PHP (version ^8.1 recommended) and Composer installed.
    ```bash
    composer install
    ```
3.  **Environment Configuration:**
    -   Copy the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
    -   Generate an application key:
        ```bash
        php artisan key:generate
        ```
    -   Configure your database connection details in the `.env` file (e.g., `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
    -   Configure your cache driver in the `.env` file. The default is `file`.
        ```env
        CACHE_DRIVER=file
        ```
4.  **Database Migration:**
    Run the database migr create the necessary tables.
    ```bash
    php artisan migrate
    ```
    -   `.sql` file is found in the migration folder that you can, if ou incounter any migration problem
5.  **WOLF Synonym Data:**
    Place the [**wolf-1.0b4.xml**](https://almanach.inria.fr/software_and_resources/WOLF-en.html) file in the `storage/app/private/wolf-data/` directory. This file is used for synonym expansion in search queries.
6.  **Start the development server:**
    ```bash
    php artisan serve
    ```
    The API will typically be available at `http://127.0.0.1:8000`.

## Usage Instructions

Interact with the API using standard HTTP requests (GET, POST, PUT, DELETE) to the defined endpoints. Authentication (e.g., API tokens) might be required for certain operations.

**Example Endpoints (Illustrative):**

-   `GET /api/documents`: Retrieve a list of documents (with pagination and filtering options).
-   `GET /api/documents/{id}`: Retrieve a specific document by its ID.
-   `POST /api/search`: Perform a search query. The request body would contain the search terms and any relevant filters.
    ```json
    {
        "query": "your search term here",
        "filters": {
            "date_range": "2023-01-01_to_2023-12-31",
            "category": "official_decrees"
        }
    }
    ```
-   `POST /api/documents`: Upload and index a new document (requires appropriate authorization).

## API Endpoint Documentation

This section provides detailed documentation for the available API endpoints. All endpoints are prefixed with `/api/v1`.

### Authentication

Most endpoints require Bearer Token authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <YOUR_API_TOKEN>
```

### Documents

#### 1. List Documents

-   **Endpoint:** `GET /documents`
-   **Description:** Retrieves a paginated list of documents. Supports filtering and sorting.
-   **Query Parameters:**
    -   `page` (integer, optional): The page number for pagination (default: 1).
    -   `per_page` (integer, optional): Number of documents per page (default: 15).
    -   `sort_by` (string, optional): Attribute to sort by (e.g., `created_at`, `title`).
    -   `sort_direction` (string, optional): Sort direction (`asc` or `desc`, default: `desc`).
    -   `filter[title]` (string, optional): Filter by document title (partial match).
    -   `filter[doc_type_id]` (integer, optional): Filter by document type ID.
    -   `filter[direction_id]` (integer, optional): Filter by direction ID.
    -   `filter[created_at]` (date, optional, format: `YYYY-MM-DD`): Filter documents created from this date. / created from .. to .. : `filter[created_at]=dateFrom,dateTo`
-   **Success Response (200 OK):**

    ```json
    {
        "data": {
            "type": "Document",
            "id": 19,
            "attributes": {
                "title": "test 7.3",
                "fileType": "pdf",
                "docType": "Policy",
                "docCreationDate": "2006-02-02T00:00:00.000000Z",
                "docStatut": "Updates",
                "isActive": 1,
                "createdAt": "2025-05-08T22:29:51.000000Z",
                "updatedAt": "2025-05-08T22:38:31.000000Z"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "admin",
                        "id": 2,
                        "email": "russell.okuneva@example.net"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/users/2"
                    }
                },
                "relatedDocument": {
                    "data": {
                        "type": "document",
                        "id": 18,
                        "title": "test 6 api update2",
                        "docType": "Policy",
                        "docStatuts": "Updated"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/docs/18"
                    }
                },
                "direction": {
                    "data": {
                        "type": "direction",
                        "name": "HR Department"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/directions/3"
                    }
                }
            },
            "links": {
                "self": "http://localhost:8800/api/v1/docs/19"
            }
        },

        // ... rest of documents

        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 2,
            "links": [
                {
                    "url": null,
                    "label": "&laquo; Previous",
                    "active": false
                },
                {
                    "url": "http://localhost:8800/api/v1/docs?page=1",
                    "label": "1",
                    "active": true
                },
                {
                    "url": "http://localhost:8800/api/v1/docs?page=2",
                    "label": "2",
                    "active": false
                },
                {
                    "url": "http://localhost:8800/api/v1/docs?page=2",
                    "label": "Next &raquo;",
                    "active": false
                }
            ],
            "path": "http://localhost:8800/api/v1/docs",
            "per_page": 15,
            "to": 15,
            "total": 20
        }
    }
    ```

#### 2. Get Specific Document

-   **Endpoint:** `GET /documents/{id}`
-   **Description:** Retrieves a single document by its ID.
-   **URL Parameters:**
    -   `id` (integer, required): The ID of the document.
-   **Success Response (200 OK):**
    ```json
    {
        "data": {
            "type": "Document",
            "id": 19,
            "attributes": {
                "title": "test 7.3",
                "fileType": "pdf",
                "docType": "Policy",
                "docCreationDate": "2006-02-02T00:00:00.000000Z",
                "docStatut": "Updates",
                "isActive": 1,
                "createdAt": "2025-05-08T22:29:51.000000Z",
                "updatedAt": "2025-05-08T22:38:31.000000Z"
            },
            "relationships": {
                "author": {
                    "data": {
                        "type": "admin",
                        "id": 2,
                        "email": "russell.okuneva@example.net"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/users/2"
                    }
                },
                "relatedDocument": {
                    "data": {
                        "type": "document",
                        "id": 18,
                        "title": "test 6 api update2",
                        "docType": "Policy",
                        "docStatuts": "Updated"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/docs/18"
                    }
                },
                "direction": {
                    "data": {
                        "type": "direction",
                        "name": "HR Department"
                    },
                    "links": {
                        "self": "http://localhost:8800/api/v1/directions/3"
                    }
                }
            },
            "links": {
                "self": "http://localhost:8800/api/v1/docs/19"
            }
        }
    }
    ```
-   **Error Response (404 Not Found):**
    ```json
    {
        "message": "Document cannot be found.",
        "status": 404,
        "data": []
    }
    ```

#### 3. Create Document

-   **Endpoint:** `POST /documents`
-   **Description:** Creates a new document. Requires file upload (PDF).
-   **Request Body (form-data):**
    -   `title` (string, required): Title of the document.
    -   `file` (file, required): The PDF file to upload.
    -   `doc_type_id` (integer, required): ID of the document type.
    -   `doc_statut_id` (integer, required): ID of the document status.
-   **Success Response (201 Created):**
    ```json
    {
        "data": {
            "id": 101,
            "title": "Newly Created Document"
            // ... other document attributes
        },
        "message": "Document created successfully."
    }
    ```
-   **Error Response :** If document file not included.
    ```json
    {
        "message": "A PDF file is required.",
        "errors": {
            "data.attributes.file": ["A PDF file is required."]
        }
    }
    ```

### todo : document reset of the API endpoints

### Search

#### 1. Perform Search

-   **Endpoint:** `POST /search/{query}`
-   **Description:** Performs a search across documents based on a query string. Utilizes synonym expansion and text normalization.
-   **Request Body (JSON):**
    -   `query` (string, required): The search term or phrase.
-   **Success Response (200 OK):**
    ```json
    {
        "data": [
            {
                "type": "Document",
                "id": 3,
                "attributes": {
                    "title": "Autem architecto quo eius. test"
                },
                "links": {
                    "download": "http://localhost:8800/api/v1/docs/3/pdf"
                }
            }
            // ... more search results
        ],
        "meta": {
            "total_results": 18,
            "query": "test",
            "normalized_query": "test"
        }
    }
    ```
-   **Error Response (500 Internal Server Error):** If an error occurs during search processing.
    ```json
    {
        "message": "An error occurred while processing your search",
        "status": 500,
        "data": []
    }
    ```

### Document Types, Directions, Locations, Statuses (CRUD Endpoints)

These are standard CRUD endpoints for managing auxiliary data.

-   **Endpoints:**
    -   `GET /doc-types`, `POST /doc-types`, `GET /doc-types/{id}`, `PUT /doc-types/{id}`, `DELETE /doc-types/{id}`
    -   `GET /directions`, `POST /directions`, `GET /directions/{id}`, `PUT /directions/{id}`, `DELETE /directions/{id}`
    -   `GET /locations`, `POST /locations`, `GET /locations/{id}`, `PUT /locations/{id}`, `DELETE /locations/{id}`
    -   `GET /doc-statuts`, `POST /doc-statuts`, `GET /doc-statuts/{id}`, `PUT /doc-statuts/{id}`, `DELETE /doc-statuts/{id}`
-   **Description:** Provide full CRUD (Create, Read, Update, Delete) operations for document types, directions, physical locations, and document statuses.
-   **Request/Response:** Follow standard RESTful conventions. Refer to the `Document` CRUD operations for similar request/response structures.
    -   `GET` (list): Paginated list of items.
    -   `GET` (single): Single item by ID.
    -   `POST`: Create a new item. Requires relevant fields (e.g., `name` or `label`).
    -   `PUT`/`PATCH`: Update an existing item.
    -   `DELETE`: Delete an item.

### User Management (Illustrative - Requires Auth & Admin Roles)

#### 1. Register User

-   **Endpoint:** `POST /register`
-   **Description:** Registers a new user. (admin-only ).
-   **Request Body (JSON):**
    -   `fist_name` (string, required)
    -   `last_name` (string, required)
    -   `email` (string, required, unique)
    -   `password` (string, required, min: 8, confirmed)
    -   `isAdmin` (boolean)
    -   `relationshipts.direction.data.name` (string, required)
    -   **Success Response (201 Created):** User object and token.

## Key Features

-   **Advanced Indexing:** Efficiently indexes documents for fast and accurate retrieval.
-   **Robust Query Processing:** Supports complex search queries, including keyword matching, phrase searching, and potentially semantic search capabilities.
-   **Synonym Expansion:** Utilizes the WOLF (WordNet Libre du Français) dataset for French synonym expansion, enhancing search result relevance.
-   **Scalable Architecture:** Designed to handle a growing volume of documents and user requests.
-   **Secure Access:** Implements mechanisms to ensure that only authorized personnel can access and manage documents.
-   **RESTful API Design:** Provides a standardized and easy-to-integrate interface for client applications.

## Technology Stack

-   **Programming Language:** PHP
-   **Framework:** Laravel
-   **Database:** MySQL
-   **Web Server:** (Specify, e.g., Apache, Nginx - often managed by Laravel's `artisan serve` for development)
-   **Caching:** Laravel Cache (File-based by default, with options for Redis, Memcached, Database)
-   **Search Technology:** Custom search algorithm implementation with abstraction layer to support future Elasticsearch integration
-   **Version Control:** Git
-   **Dependency Management:** Composer

## Cache Management

### WOLF Synonyms Caching

The WOLF synonym data is parsed from `wolf-1.0b4.xml` and cached for performance. The default cache driver is `file`.

**Cache Clearing:**

-   If you update your `wolf-1.0b4.xml` file, clear this specific cache entry:
    ```bash
    php artisan cache:forget wolf_synonym_data
    ```
-   To clear all application cache:
    ```bash
    php artisan cache:clear
    ```

## Contributing

This project is currently maintained as a solo endeavor. While external contributions are not accepted at this time, the project may be opened for community contributions in the future. If you're interested in contributing when that time comes, please watch this repository for updates.

When contributions are enabled, the process will likely follow standard GitHub workflow:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and closed-source. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the copyright holder.

The source code and documentation are confidential.

## Acknowledgments

-   To our supervisors and mentors for their guidance and support.
-   The developers of the Laravel framework and other open-source libraries used in this project.
-   The creators of the WOLF (WordNet Libre du Français) dataset.
-   To [Jeremy McPeak](https://x.com/jwmcpeak) for the API Master Class course.
