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
const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}'
    AND priority = '${priority}';`;
      break;
    case hasPriorityProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND priority = '${priority}';`;
      break;
    case hasStatusProperty(request.query):
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%'
    AND status = '${status}';`;
      break;
    default:
      getTodosQuery = `
   SELECT
    *
   FROM
    todo 
   WHERE
    todo LIKE '%${search_q}%';`;
  }

  data = await db.all(getTodosQuery);
  response.send(data);
});
//API-2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `SELECT * FROM todo
    WHERE id = ${todoId}`;
  const ans = await db.get(query);
  response.send(ans);
});
//API-3
app.post("/todos", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const query = `INSERT INTO todo(id, todo, priority, status)
    VALUES('${id}' , '${todo}', '${priority}',
    '${status}')`;
  const a = await db.run(query);
  response.send("Todo Successfully Added");
});
//API-4
const toUpdateStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const toUpdatePriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
const toUpdateTodo = (requestQuery) => {
  return requestQuery.todo !== undefined;
};
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo } = request.body;
  switch (true) {
    case toUpdateStatus(request.body):
      const query = `UPDATE todo
          SET status = '${status}'
          WHERE id = ${todoId}`;
      await db.run(query);
      response.send("updated status");
      break;
    case toUpdatePriority(request.body):
      const query1 = `UPDATE todo
          SET priority = '${priority}'
          WHERE id = ${todoId}`;
      await db.run(query1);
      response.send("updated priority");
      break;
    case toUpdateTodo(request.body):
      const query2 = `UPDATE todo
          SET todo = '${todo}'
          WHERE id = ${todoId}`;
      await db.run(query2);
      response.send("updated todo");
      break;
  }
});
//API-5
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const query = `DELETE FROM todo
    WHERE id = ${todoId}`;
  const ans = await db.run(query);
  response.send("Todo Deleted");
});
module.exports = app;
