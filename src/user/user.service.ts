import { Injectable, NotFoundException } from "@nestjs/common";
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

    async update(id: number, data: Partial<User>): Promise<User> {
        await this.userRepo.update(id, data);

        return this.userRepo.findOneOrFail({ where: { id } });

    }

    async delete(id: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        await this.userRepo.delete(id);
        return user;
    }

    async findById(id:number): Promise<User>{
        const user = await this.userRepo.findOne({where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user        
    }

}