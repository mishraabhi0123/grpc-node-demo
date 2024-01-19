const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const recipesPackageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/recipes.proto"));
const processPackageDefinition = protoLoader.loadSync(path.join(__dirname, "../protos/processing.proto"));

const recipesProto = grpc.loadPackageDefinition(recipesPackageDefinition);
const processProto = grpc.loadPackageDefinition(processPackageDefinition);

const recipesStub = new recipesProto.Recipes("0.0.0.0:50051", grpc.credentials.createInsecure());
const processStub = new processProto.Processing("0.0.0.0:50052", grpc.credentials.createInsecure());

let productId = 1000;
let orderId = 1;

console.log(`Searching a recipe for the product: ${productId}`);

recipesStub.find({ id: productId }, (err, recipe) => {
    console.log("Found a recipe: ");
    console.log(recipe);
    console.log("Processing...");

    const call = processStub.process({ orderId, recipeId: recipe.id });
    call.on("data", (statusUpdate) => {
        console.log("Order Status: ", statusUpdate);
    })

    call.on("end", () => {
        console.log("Processing done.");
    })
})