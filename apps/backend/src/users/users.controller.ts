import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UserDTO } from '@tanina/types/users/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: UserDTO): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.getUserById(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserDTO
  ): Promise<User> {
    try {
      return await this.usersService.updateUser(Number(id), updateUserDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.deleteUser(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}