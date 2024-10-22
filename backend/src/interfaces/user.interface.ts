import { ObjectId } from "typeorm";

export interface UserResponse { 
    _id: ObjectId; 
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string
}
