const grpc = require('grpc');
const loader = require('@grpc/proto-loader');

const bindPath = '0.0.0.0:8080';

loader.load('todo.proto', { includeDirs: ['./src'] })
  .then((packageDefinition) => {
    const package = grpc.loadPackageDefinition(packageDefinition);
    const Client = package.todo_app_package.TodoApp;
    const client = new Client(bindPath, grpc.credentials.createInsecure());

    client.getAll({}, function (err, res) {
      if (err) {
        return console.log(err);
      }
      console.log('todos: ');
      return console.log(res);
    });

    client.getTodo({ id: 1 }, function (err, res) {
      if (err) {
        return console.log(err);
      }
      return console.log(res);
    });

    client.getTodo({ id: 3 }, function (err, res) {
      if (err) {
        return console.log(err);
      }
      return console.log(res);
    });

    const call = client.getAllFromStream();

    call.on('data', function (todo) {
      console.log(todo);
    });

    call.on('end', function () {
      console.log('Stream ends');
    });
    call.on('error', function (e) {
      console.log('Stream errored');
    });

  });
