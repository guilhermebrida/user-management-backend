import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post()
    async create(@Body() data: Partial<User>): Promise<User> {
        return this.userService.create(data);
    }
}