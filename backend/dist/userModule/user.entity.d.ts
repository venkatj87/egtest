import { ObjectId } from "typeorm";
export declare class User {
    _id: ObjectId;
    email: string;
    name: string;
    password: string;
    refreshToken: string;
}
