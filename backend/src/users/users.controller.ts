import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    findAll() {
        return [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    }

    @Post()
    create(@Body() createUserDto: any) {
        return { message: 'User created', data: createUserDto };
    }
}
