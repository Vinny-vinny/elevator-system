# 🚀 Elevator System API

An intelligent **Elevator Simulation API** built with **Node.js**, **Express**, and **Sequelize**, designed to handle elevator requests, track elevator statuses, and log system events efficiently.

---

## 🧩 Features

- 🏢 Handle **external** and **internal** elevator calls
- 📡 Retrieve **real-time elevator statuses**
- ⚙️ Simulate **asynchronous elevator movement**
- 🧾 Log all elevator actions and SQL queries
- ✅ Validate inputs using **express-validator**
- 🧪 Fully tested with **Mocha**, **Chai**, and **Sinon**

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Runtime | **Node.js 20+** |
| Framework | **Express.js** |
| ORM | **Sequelize** |
| Database | **MySQL** |
| Testing | **Mocha**, **Chai**, **Sinon** |
| Config | **dotenv** |
| Logging | **morgan**, **winston** |

---

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

Ensure you have:
- [Node.js 20+](https://nodejs.org/en/download)
- **npm** (comes with Node)
- **MySQL** installed and running

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/Vinny-vinny/elevator-system.git
cd elevator-system

```
### 3️⃣ Install Dependencies

```bash
npm install
```
4️⃣ Environment Configuration

Create a .env file in the project root:
```
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=elevator_db
DB_USER=root
DB_PASSWORD=
PORT=9000

```
5️⃣ Run Database Migrations
```
npx sequelize-cli db:migrate
```
🚀 Running the Application
```
npm run dev
```
🧪 Running Tests
```
npm test
```
📡 API Endpoints
🏢 External Call Request

POST /api/elevator/call
Request Body:
{
  "floor": 3,
  "direction": "up"
}   
```
Sample Response:
```
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
```
📍 Internal Call Request
POST /api/elevator/request
Request Body:
```
{
"elevatorId": 1,
"requestedFloor": 7,
"internal": true,
"direction": "UP"
}
```
Sample Response:
```
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
```
📊 Get Elevator Status
GET /api/elevator/status

Sample Response:
```
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
```
