import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, AccountType, CurrencyType, AccountStatus } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private generateAccountNumber(): string {
    // Generate a 10-digit account number
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
    return randomNum.toString();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.prisma.$transaction(async (prisma) => {
      // Create the user
      const user = await prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      // Generate unique account number
      const accountNumber = this.generateAccountNumber();

      // Create associated account
      const account = await prisma.account.create({
        data: {
          userId: user.id,
          accountType: AccountType.PERSONAL,
          accountNumber,
          currency: CurrencyType.USD,
          status: AccountStatus.ACTIVE,
          balance: 0,
        },
      });

      // Create associated wallet
      await prisma.wallet.create({
        data: {
          userId: user.id,
          accountId: account.id,
          balance: 0,
          currency: CurrencyType.USD,
          isActive: true,
        },
      });

      return user;
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const data = { ...updateUserDto };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.delete({ where: { id } });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}