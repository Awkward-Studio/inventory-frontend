import { Client, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite API Endpoint
  .setProject("67cec87700061ceef4ed"); // Appwrite Project ID

const storage = new Storage(client);

export default storage;