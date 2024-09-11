import * as mongodb from "mongodb";

export interface News {
    title: string;
    description: string;
    date: Date;
    content: string;
    author: string;
    archiveDate: Date;
    _id?: mongodb.ObjectId;
}