import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const newRouter = express.Router();
newRouter.use(express.json());

//Get all news
newRouter.get("/", async (_req, res) => {
    try {
        const news = await collections?.news?.find({}).toArray();
        res.status(200).send(news);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

//Get a specific new by id
newRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const newNotice = await collections?.news?.findOne(query);

        if (newNotice) {
            res.status(200).send(newNotice);
        } else {
            res.status(404).send(`Failed to find a new: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find a new: ID ${req?.params?.id}`);
    }
});

//Create a new
newRouter.post("/", async (req, res) => {
    try {
        const newNotice = req.body;
        const result = await collections?.news?.insertOne(newNotice);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

//Update an existing new
newRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const newNotice = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.news?.updateOne(query, { $set: newNotice });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated a new: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a new: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a new: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

//Delete existing new
newRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.news?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed a new: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a new: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find a new: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});