const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const todos = require('./todos_db.json');

class TodoAppHandler {
  getAll(_, callback) {
    return callback(null, todos);
  }

  getTodo(call, callback) {
    const result = todos.todos.filter(({ id }) => id === call.request.id);
    return callback(null, result[0]);
  }
}
const PATH = '0.0.0.0:8080';

const createServer = function (bindPath, handler) {
  loader.load('todo.proto', { includeDirs: ['./src'] })
    .then((packageDefinition) => {
      const package = grpc.loadPackageDefinition(packageDefinition);
      const service = package.todo_app_package.TodoApp.service;
      const server = new grpc.Server();
      server.addService(service, handler);
      server.bind(bindPath, grpc.ServerCredentials.createInsecure());
      server.start();
      console.log('Server running on 8080');
    });
}

createServer(PATH, new TodoAppHandler);