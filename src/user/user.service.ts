import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ){}

    findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.userRepo.create(data);

        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        return this.userRepo.save(user);
    }
}