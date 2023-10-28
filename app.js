const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let db = null;
const dbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Running");
    });
  } catch (e) {
    console.log(`Error is : ${e.message}`);
    process.exit(1);
  }
};
dbServer();
//QUERY-1
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const query = `SELECT * FROM todo
    WHERE status = '${status}'`;
  const answer1 = await db.all(query);
  response.send(answer1);
});
//QUERY-2
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const query = `SELECT * FROM todo
    WHERE priority LIKE '${priority}'`;
  const answer2 = await db.all(query);
  response.send(answer2);
});
//API-4
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const query = `UPDATE todo
    SET status = '${status}'
    WHERE id = ${todoId}`;
  const answer = await db.run(query);
  response.send("Status Updated");
});
//UPDATING THE PRIORITY
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.body;
  const query = `UPDATE todo
    SET 
    priority = '${priority}'
    WHERE id = ${todoId}`;
  const answer = await db.run(query);
  response.send("Priority Updated");
});

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const query = `UPDATE todo
    SET todo = '${todo}'
    WHERE id = ${todoId}`;
  const answer = await db.run(query);
  response.send("Todo Updated");
});
app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `SELECT * FROM todo
    WHERE id = '${todoId}'`;
  const answer2 = await db.get(query);
  response.send(answer2);
});
app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const query = `DELETE FROM todo
    WHERE id = ${todoId}`;
  const answer2 = await db.run(query);
  response.send("Todo Deleted");
});
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `INSERT INTO todo
  (id, todo, priority, status)
    VALUES('${id}', '${todo}', '${priority}', '${status}')`;
  const a = await db.run(query);
  response.send("Todo Successfully Added");
});
app.get("/todos/", async (request, response) => {
  const { status, priority } = request.query;
  const query = `SELECT * FROM todo
    WHERE status LIKE '${status}' AND 
    priority LIKE '${priority}' `;
  const ans = await db.all(query);
  response.send(ans);
});
module.exports = app;
