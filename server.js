const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("todo.proto");
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoProto = grpcObject.todoPackage;

const server = new grpc.Server();
let todos = [];

server.addService(todoProto.TodoApp.service, {
  addTodo: (call, callback) => {
    const todo = call.request;
    if (todos.find((t) => t.id === todo.id)) {
      return callback(new Error("Todo with this ID already exists"));
    }
    todos.push(todo);
    callback(null, todo);
  },
  updateTodo: (call, callback) => {
    const todoId = call.request.id;
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) {
      return callback(new Error("Todo not found"));
    }
    todo.task = call.request.task;
    callback(null, todo);
  },
  deleteTodo: (call, callback) => {
    const todoId = call.request.id;
    const initialLength = todos.length;
    todos = todos.filter((todo) => todo.id !== todoId);
    if (todos.length === initialLength) {
      return callback(new Error("Todo not found"));
    }
    callback(null, { msg: "Todo Deleted" });
  },
  listTodo: (call, callback) => {
    callback(null, { task: todos });
  },
  listTodoStream: (call) => {
    todos.forEach((todo) => {
      call.write(todo);
    });
    call.end();
  },
});

server.bindAsync(
  "localhost:5000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server is running on localhost:5000");
  }
);
