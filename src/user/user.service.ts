import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ){}

    async findAll(filter: { role?: string; sortBy?: string; order?: 'ASC' | 'DESC' }) {
        const { role, sortBy = 'created_at', order = 'ASC' } = filter;

        const where = role ? { role } : {};

        return this.userRepo.find({
            where,
            order: {
            [sortBy]: order.toUpperCase(), 
            },
        });
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

    async findInactiveUsers(): Promise<User[]> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        return this.userRepo.find({
            where: [
            { last_login: LessThan(cutoffDate) },
            ],
            order: { last_login: 'ASC' },
        });
    }

}