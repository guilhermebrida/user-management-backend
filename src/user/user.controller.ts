import { Controller, Get, Post, Put, Body, UseGuards, Param, ParseIntPipe, Delete, ForbiddenException, Req, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiOperation, ApiBearerAuth, ApiTags, ApiQuery } from "@nestjs/swagger";
import { Roles } from "../auth/roles.decorator";
import { UpdateProfileDto } from "./dto/profile-update.dto";

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
    
    @Get()
    @Roles('admin')
    @ApiQuery({ name: 'role', required: false })
    @ApiQuery({ name: 'sortBy', enum: ['name', 'created_at'], required: false })
    @ApiQuery({ name: 'order', enum: ['asc', 'desc'], required: false })
    async findAll(
        @Query('role') role?: string,
        @Query('sortBy') sortBy?: string,
        @Query('order') order?: 'asc' | 'desc',
    ) {
        return this.userService.findAll({
        role,
        sortBy,
        order: order?.toUpperCase() as 'ASC' | 'DESC',
        });
    }

    // @Post()
    // async create(@Body() data: Partial<User>): Promise<User> {
    //     return this.userService.create(data);
    // }

    @Put(':id')
    @ApiOperation({summary:'Update a user'})
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<User>, @Req() req,){
        const user = req.user;
        console.log(user)
        if (user.role === 'admin' || user.userId === id) {
            return this.userService.update(id, data);
        }
        
        throw new ForbiddenException('Access denied');
        
    }

    @Delete(':id')
    @Roles('admin')
    @ApiOperation({summary: 'Delete a user'})
    async delete(@Param('id', ParseIntPipe) id: number){
        return this.userService.delete(id)
    }



    @Roles('admin')
    @Get('inactive')
    @ApiTags('Users')
    @ApiBearerAuth()
    async getInactiveUsers() {
        return this.userService.findInactiveUsers();
    }



    @Put(':id/profile')
    @ApiOperation({ summary: 'Update user name and/or password' })
    async updateProfile(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProfileDto: UpdateProfileDto,
      @Req() req
    ) {
      const user = req.user;
      if (user.role !== 'admin' && user.userId !== id) {
        throw new ForbiddenException('Access denied');
      }
      return this.userService.updateProfile(id, updateProfileDto);
    }
}