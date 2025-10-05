# 🚀 Elevator System API

An intelligent **Elevator Simulation API** built with **Node.js**, **Express**, and **Sequelize**, designed to handle elevator requests, track elevator statuses, and log system events efficiently.

---

## 🧩 Features

- Handle **external** and **internal** elevator calls
- Retrieve **real-time elevator statuses**
- Simulate **asynchronous elevator movement**
- Log all elevator actions and SQL queries
- Use **express-validator** for request validation
- Fully tested with **Mocha**, **Chai**, and **Sinon**

---

## ⚙️ Tech Stack

- **Node.js 20+** – JavaScript runtime
- **Express.js** – REST API framework
- **Sequelize ORM** – Database layer
- **MYSQL** – Database
- **Mocha + Chai + Sinon** – Testing
- **dotenv** – Environment configuration
- **morgan + winston** – Logging utilities


---

## ⚙️ Installation

### 1️⃣ Prerequisites

- [Node.js 20 or above](https://nodejs.org/en/download)
- npm (comes with Node.js)
- MYSQL installed 

### 2️⃣ Clone the repository

```bash
git clone https://github.com/Vinny-vinny/elevator-system.git
cd elevator-system

 3️⃣ Install dependencies
npm install

 4️⃣ Create a .env file
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=elevator_db
DB_USER=root
DB_PASSWORD=
PORT=9000

5️⃣ Run database migrations
npx sequelize-cli db:migrate

🚀 Running the Application
npm run dev

🧪 Running Tests
npm test

📡 API Endpoints
🏢 External Call Request

POST /api/elevator/call

Body:
{
  "requestedFloor": 3,
  "direction": "UP"
}

Response:
{
    "success": true,
    "message": "External Call Request Successfully Processed.",
    "status": {
        "message": "Elevator 2 is moving to floor 3.",
        "status": {
            "id": 2,
            "floor": 3,
            "direction": "up",
            "doorState": "closed",
            "isMoving": true,
            "queue": [3]
        }
    }
}

🕹️ Internal Elevator Call

POST /api/elevator/call

Body:
{
  "elevatorId": 1,
  "requestedFloor": 7,
  "internal": true
  "direction": "UP"
}

Response:
{
    "success": true,
    "message": "Internal Call Request Successfully Processed.",
    "status": {
        "message": "Elevator 1 has arrived at floor 7. Please exit.",
        "status": {
            "id": 1,
            "floor": 7,
            "direction": "idle",
            "doorState": "closed",
            "isMoving": false,
            "queue": []
        }
    }
}

📊 Get Elevator Status

GET /api/elevator/status

Response:
[
    {
        "id": 1,
        "floor": 3,
        "direction": "idle",
        "doorState": "closed",
        "isMoving": false,
        "queue": []
    },
    {
        "id": 2,
        "floor": 7,
        "direction": "idle",
        "doorState": "closed",
        "isMoving": false,
        "queue": []
    }
]

