const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("todo.proto");
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoProto = grpcObject.todoPackage;

const client = new todoProto.TodoApp(
  "localhost:5000",
  grpc.credentials.createInsecure()
);

// Add a Todo
const tasks = [
    { id: 1, task: "Do Laundry" },
    { id: 2, task: "Buy Groceries" },
    { id: 3, task: "Complete Assignment" },
    { id: 4, task: "Prepare Presentation" },
    { id: 5, task: "Call Mom" },
  ];

tasks.forEach((task) => {
    client.addTodo(task, (err, response) => {
        if (err) {
          console.error("Error adding Todo:", err.message);
        } else {
          console.log("Added Todo:", response);
        }})
})

    // Update the Todo
    client.updateTodo({ id: 1, task: "Do Newthing" }, (err, response) => {
      if (err) {
        console.error("Error updating Todo:", err.message);
      } else {
        console.log("Updated Todo:", response);

        // Delete the Todo
        client.deleteTodo({ id: 1 }, (err, response) => {
          if (err) {
            console.error("Error deleting Todo:", err.message);
          } else {
            console.log("Deleted Todo:", response);

            // List Todos
            client.listTodo({}, (err, response) => {
              if (err) {
                console.error("Error listing Todos:", err.message);
              } else {
                console.log("List of Todos:", response);

                // Stream Todos
                const call = client.listTodoStream({});
                call.on("data", (todo) => {
                  console.log("Streamed Todo:", todo);
                });
                call.on("end", () => {
                  console.log("Stream ended.");
                });
              }
            });
          }
        });
      }
    });


