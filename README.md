# paw-kelompok-10
An API used as a repository of assignments to help remind each other of assignments and their deadlines.

**Tech stack:**
* Express
* MongoDB
* Redis

## Team Members
1. Aditya Dwi Cahyo Putra (19/444035/TK/49231)
2. Firdaus Bisma Suryakusuma (19/444051/TK/49247)
3. Hafidz Arifudin (19/444052/TK/49248)
4. Lathif Ma’arif (19/444058/TK/49254)

## Directory Structure
```
base
|-- common (Enums and global utilities.)
|-- configuration (Configuration-related files.)
|-- error-handlers (Express error handlers.)
|-- mappers (Object-to-object mappers.)
|-- public (The public directory to be served by express.)
    |-- images (Image files.)
    |-- javascripts (Frontend javascript files.)
    |-- stylesheets (CSS files.)
|-- repositories (Components used to encapsulate data access that adhere to the repository pattern.)
|-- routes (Router instances and route handlers.)
|-- schemas (Mongoose schemas.)
|-- services (Utilities use by route handlers such as logging and caching.)
```

## How to Run
**Install dependencies.** (Make sure you're using node.js version 16.x or higher).
```
npm install
```

**Configure environment variables.**
* `MONGODB_CONNECTION`: The connection string used to connect to MongoDB.
* `REDIS_CONNECTION`: The connection string used to connect to Redis for caching purposes.
* `LOGGER_TYPE`: The method used for logging. Choose between `Discord` or `Console`. (Default: `Console`)
* `PORT`: The port number express will listen to.

If you choose `Discord` for logging, set up these environment variables:
* `DISCORD_TOKEN`: Secret token for your discord bot.
* `DISCORD_SERVER_ID`: The discord server to send the application logs to.
* `DISCORD_CHANNEL_ID`: The channel in your server where you want the application logs to be sent.

**Start the server.**
```
npm start
```
# [API Documentation]
# Courses
## Create a course
### Request
**Endpoint:** `POST /api/courses`

**Body:** The created course.
```

```

### Successful Response
**Status code:** `201 Created`

**Body:**
```

```

## Search for courses
### Request
**Endpoint:** `GET /api/courses`

**Query string parameters:**
* `keywords`: Search keywords.
* `start`: Search result offset. (example: if you set this to 5 then the first 5 items of the search result won't be returned. default: 0)
* `count`: The maximum number of search results to return. (default: 1000)

### Successful Response
**Status code:** `200 OK`

**Body:** An array of matching courses.
```

```

## Get a single course
### Request
**Endpoint:** `GET /api/courses/:id`

**Route parameters:**
* `id`: The ID of the course you want to fetch.

### Successful Response
**Status code:** `200 OK`

**Body:** The fetched course.
```

```

## Update a course
### Request
**Endpoint:** `PUT /api/courses/:id`

**Route parameters:**
* `id`: The ID of the course you want to update.

### Successful Response
**Status code:** `200 OK`

**Body:** The updated course.
```

```

## Delete a course
### Request
**Endpoint:** `DELETE /api/courses/:id`

**Route parameters:**
* `id`: The ID of the course you want to delete.

### Successful Response
**Status code:** `200 OK`

**Body:** The deleted course.
```

```

# Assignments
## Add an assignment to a course
### Request
**Endpoint:** `POST /api/courses/:courseid/assignments`

**Route parameters**
* `courseid`: The ID of the course you want to add an assigment to.

**Body:** The created assignment.
```

```

### Successful Response
**Status code:** `201 Created`

**Body:**
```

```

## Search for assignments
### Request
**Endpoint:** `GET /api/assignments`

**Query string parameters:**
* `keywords`: Search keywords.
* `start`: Search result offset. (example: if you set this to 5 then the first 5 items of the search result won't be returned. default: 0)
* `count`: The maximum number of search results to return. (default: 1000)

### Successful Response
**Status code:** `200 OK`

**Body:** An array of matching assignments.
```

```

## Get a single assignment
### Request
**Endpoint:** `GET /api/assignments/:id`

**Route parameters**
* `id`: The ID of the assignment you want to fetch.



### Successful Response
**Status code:** `200 OK`

**Body:** The fetched assignment.
```

```

## Update an assignment
### Request
**Endpoint:** `PUT /api/assignments/:id`

**Route parameters:**
* `id`: The ID of the assignment you want to update.

### Successful Response
**Status code:** `200 OK`

**Body:** The updated assignment.
```

```

## Delete an assignment
### Request
**Endpoint:** `DELETE /api/assignments/:id`

**Route parameters:**
* `id`: The ID of the assignment you want to delete.

### Successful Response
**Status code:** `200 OK`

**Body:** The deleted assignment.
```

```

# Errors
## Missing resources
This response is returned if you attempt to update/delete or fetch a single non-existent resource. Fetching multiple resources(e.g. searching for courses) doesn't return this response and simply returns an empty array.

### Response
**Status code:** `404 Not found`

**Body:**
```
Not found.
```

## Unhandled exceptions
If you were to send an HTTP request that somehow causes an unhandled exception, this response will be returned.

### Response
**Status code:** `500 Internal server error`

**Body:**
```
Internal server error.
```
