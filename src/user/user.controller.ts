import { Controller, Get, Post, Put, Body, UseGuards, Param, ParseIntPipe, Delete, ForbiddenException, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiOperation, ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/auth/roles.decorator";

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const user = req.user;
        if (user.role !== 'admin' && user.userId !== id) {
        throw new ForbiddenException('Access denied');
        }

        return this.userService.findById(id);
  }
    
    @Roles('admin')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'List all users (protected)' })
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // @Post()
    // async create(@Body() data: Partial<User>): Promise<User> {
    //     return this.userService.create(data);
    // }

    @Put(':id')
    @ApiOperation({summary:'Update a user'})
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<User>, @Req() req,){
        const user = req.user;
        if (user.userId !== id) {
            throw new ForbiddenException('Access denied');
        }

        return this.userService.update(id, data);
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({summary: 'Delete a user'})
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.userService.delete(id)
    }
}