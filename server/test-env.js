// server/test-env.js
require("dotenv").config();

console.log("Testing environment variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
