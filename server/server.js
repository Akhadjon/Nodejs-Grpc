const PROTO_PATH = "./protos/customers.proto";
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");

const customerStorage = require("../storage/Customer")

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

var customersProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const customers = [
	{
		id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
		name: "John Bolton",
		age: 23,
		address: "Address 1"
	},
	{
		id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
		name: "Mary Anne",
		age: 45,
		address: "Address 2"
	}
];


mongoDBUrl = "mongodb://localhost:27017/customer";

mongoose.connect(
	mongoDBUrl,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	(err) => {
		if (err) {
		logger.error(
			"There is an error in connecting db (" +
			mongoDBUrl +
			"): " +
			err.message
		);
		}
	}
	);
	mongoose.connection.once("open", function () {
		console.log("connected")
	});

server.addService(customersProto.CustomerService.service, {
	GetAll: (call, callback) => {
		customerStorage.find(call.request).then((result)=>{
			callback(null, {customers:result});
		}).catch((error)=>{
			console.log(error);
			callback({
				code: grpc.status.NOT_FOUND,
				message: error.message
			});
		})
		
	},

	Get: (call, callback) => {
	
		customerStorage.get(call.request).then((result)=>{
			callback(null, result)
		}).catch((error)=>{
			console.log(error)
			callback({
				code: grpc.status.NOT_FOUND,
				message: error.message
			});
		})
	},

	Insert: (call, callback) => {
		customerStorage.insert(call.request).then((result)=>{
			callback(null, result);
		}).catch((error)=>{
			console.log(error);
			callback({
				code: grpc.status.NOT_FOUND,
				message: error.message
			});
		})
	},

	Update: (call, callback) => {
		customerStorage.update(call.request).then((result)=>{
			callback(null, result);
		}).catch((error)=>{
			console.log(error);
			callback({
				code: grpc.status.NOT_FOUND,
				message: error.message
			});
		})
	},

	Remove: (call, callback) => {
		customerStorage.remove(call.request.id).then((result)=>{
           callback(null, result)
		}).catch((error)=>{
			console.log(error);
			callback({
				code: grpc.status.NOT_FOUND,
				message: error.message
			});
		})
	}

});


server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();
