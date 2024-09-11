import * as mongodb from "mongodb";
import { News } from "./new";

export const collections: {
    news?: mongodb.Collection<News>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("clusterPrueba");
    await applySchemaValidation(db);

    const newsCollection = db.collection<News>("news");
    collections.news = newsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our News model, even if added elsewhere.

async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "description", "date", "content", "author", "archiveDate"],
            additionalProperties: false,
            properties: {
                _id: {},
                title: {
                    bsonType: "string",
                    description: "'title' is required and must be a string",
                },
                description: {
                    bsonType: "string",
                    description: "'description' is required and must be a string",
                },
                date: {
                    bsonType: "date",
                    description: "'date' is required and must be a valid date",
                },
                content: {
                    bsonType: "string",
                    description: "'content' is required and must be a string",
                },
                author: {
                    bsonType: "string",
                    description: "'author' is required and must be a string",
                },
                archiveDate: {
                    bsonType: "date",
                    description: "'archiveDate' is required and must be a valid date",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "news",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("news", {validator: jsonSchema});
        }
    });
}