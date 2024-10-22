import { Entity, Column, ObjectIdColumn, ObjectId } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: ObjectId
    
    @Column()
    email: string
    
    @Column()
    name: string

    @Column()
    password: string

    @Column()
    refreshToken: string

}