# paw-kelompok-10
An API used as a repository of assignments to help remind each other of assignments and their deadlines. API Documentation could be found below.

**Tech stack:**
* Express
* MongoDB (ODM: Mongoose)
* Redis (Client library: ioredis)

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
|-- services (Utilities used by route handlers such as logging and caching.)
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
* `PORT`: The port number express will listen to (Default: 3000).

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
{
  "code":"TIF213146",
  "name":"Pengembangan Aplikasi Web (A)"
}
```

### Successful Response
**Status code:** `201 Created`

**Body:**
```
{
  "id":"61532c60d2fde1de4c775148",
  "code":"TIF213146",
  "name":"Pengembangan Aplikasi Web (A)"
}
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
[
  {
    "id":"61532c60d2fde1de4c775148",
    "code":"TIF213146",
    "name":"Pengembangan Aplikasi Web (A)"
  },
  {
    "id":"61532d08d2fde1de4c77514a",
    "code":"TIF215112",
    "name":"Pengembangan Aplikasi Piranti Bergerak (A)"
  },
  {
    "id":"61532d2ad2fde1de4c77514c",
    "code":"TIF213145",
    "name":"Rekayasa Data (A)"
  }
]
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
{
  "id":"61532c60d2fde1de4c775148",
  "code":"TIF213146",
  "name":"Pengembangan Aplikasi Web (A)",
  "assignments":[
    {
      "id":"61532fc5d2fde1de4c775156",
      "title":"Mengembangkan REST API",
      "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
      "deadline":"2021-09-26T15:54:41.785Z"
    },
    {
      "id":"6153309bd2fde1de4c77515b",
      "title":"Persiapan presentasi untuk tugas REST API",
      "details":"Diambil dari teams. Untuk pertemuan minggu ini, silahkan persiapkan presnetasi maks 5 menit untuk tugas yang dikerjakan besok.",
      "deadline":"2021-09-26T15:54:41.785Z"
    }
  ]
}
```

## Update a course
### Request
**Endpoint:** `PUT /api/courses/:id`

**Route parameters:**
* `id`: The ID of the course you want to update.

**Body:** The new contents.
```
{
  "code": "TIF213146",
  "name": "Pengembangan Aplikasi Web 4 Dimensi (A)"
}
```

### Successful Response
**Status code:** `200 OK`

**Body:** The updated course.
```
{
  "code": "TIF213146",
  "name": "Pengembangan Aplikasi Web 4 Dimensi (A)"
}
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
{
  "id":"61532d2ad2fde1de4c77514c",
  "code":"TIF213145",
  "name":"Rekayasa Data (A)"
}
```

# Assignments
## Add an assignment to a course
### Request
**Endpoint:** `POST /api/courses/:courseid/assignments`

**Route parameters**
* `courseid`: The ID of the course you want to add an assigment to.

**Body:**
```
{
    "title":"Mengembangkan REST API",
    "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
    "deadline":"2021-09-26T15:54:41.785Z"
}
```

### Successful Response
**Status code:** `201 Created`

**Body:** The created assignment.
```
{
  "id":"61532fc5d2fde1de4c775156",
  "title":"Mengembangkan REST API",
  "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
  "deadline":"2021-09-26T15:54:41.785Z"
}
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
[
  {
    "id":"61532fc5d2fde1de4c775156",
    "title":"Mengembangkan REST API",
    "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
    "deadline":"2021-09-26T15:54:41.785Z"
  },
  {
    "id":"6153309bd2fde1de4c77515b",
    "title":"Persiapan presentasi untuk tugas REST API","details":"Diambil dari teams. Untuk pertemuan minggu ini, silahkan persiapkan presnetasi maks 5 menit untuk tugas yang dikerjakan besok.",
    "deadline":"2021-09-26T15:54:41.785Z"
  },
  {
    "id":"615330f4d2fde1de4c77515f",
    "title":"Membuat aplikasi android sederhana",
    "details":"Dengan kelompok yang sudah ditentukan, buat aplikasi android dengan 3 screen dan 3 navigasi. Ikuti github workflow. Nama repo dengan format papb-team1. Nama branch yang dikumpulkan TA-pre-UTS. Kumpul link github bersama video demo aplikasi.",
    "deadline":"2021-09-28T15:05:28.062Z"
  }
]
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
{
  "id":"61532fc5d2fde1de4c775156",
  "title":"Mengembangkan REST API",
  "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
  "deadline":"2021-09-26T15:54:41.785Z"
}
```

## Update an assignment
### Request
**Endpoint:** `PUT /api/assignments/:id`

**Route parameters:**
* `id`: The ID of the assignment you want to update.

**Body:** The new contents of the assignment.
```
{
  "title":"Mengembangkan REST API",
  "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
  "deadline":"2021-09-26T15:54:41.785Z"
}
```

### Successful Response
**Status code:** `200 OK`

**Body:** The updated assignment.
```
{
  "id":"61532fc5d2fde1de4c775156",
  "title":"Mengembangkan REST API",
  "details":"Dengan kelompok yang telah disusun sebelumnya, buat 2 fungsi CRUD. Buat repositori github dengan pola nama repositori paw-kelompok-1. Nama branch yang dikumpulkan bernama tugas-2.",
  "deadline":"2021-09-26T15:54:41.785Z"
}
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
{
  "id":"615333c6d2fde1de4c775179",
  "title":"Membuat aplikasi android sederhana",
  "details":"Dengan kelompok yang sudah ditentukan, buat aplikasi android dengan 3 screen dan 3 navigasi. Ikuti github workflow. Nama repo dengan format papb-team1. Nama branch yang dikumpulkan TA-pre-UTS. Kumpul link github bersama video demo aplikasi.",
  "deadline":"2021-09-28T15:05:28.062Z"
}
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
