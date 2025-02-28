import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, AccountType, CurrencyType, AccountStatus, BalanceType } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async generateUniqueAccountNumber(): Promise<string> {
    let accountNumber: string;
    let exists = true;
    
    while (exists) {
      accountNumber = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
      exists = !!(await this.prisma.account.findUnique({ 
        where: { accountNumber } 
      }));
    }
    
    return accountNumber;
  }

  private async findUserOrThrow(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Create the user
        const user = await prisma.user.create({
          data: {
            ...createUserDto,
            password: hashedPassword,
          },
        });

        // Generate unique account number
        const accountNumber = await this.generateUniqueAccountNumber();

        // Create associated account
        const account = await prisma.account.create({
          data: {
            userId: user.id,
            accountType: AccountType.PERSONAL,
            accountNumber,
            currency: CurrencyType.USD,
            status: AccountStatus.ACTIVE,
            balance: {
              create: {
                type: BalanceType.ACCOUNT_BALANCE,
                available: 0,
                pending: 0,
                reserved: 0,
                currency: CurrencyType.USD
              }
            }
          },
        });

        // Create associated wallet
        await prisma.wallet.create({
          data: {
            userId: user.id,
            accountId: account.id,
            balance: {
              create: {
                type: BalanceType.WALLET_BALANCE,
                available: 0,
                pending: 0,
                reserved: 0,
                currency: CurrencyType.USD
              }
            },
            currency: CurrencyType.USD,
            isActive: true,
          },
        });

        return user;
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new InternalServerErrorException('Failed to create user account');
    }
  }

  async getUserById(id: number): Promise<User> {
    return this.findUserOrThrow(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findUserOrThrow(id);

    const data = { ...updateUserDto };
    
    if (data.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { 
          email: data.email,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('Update failed:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<User> {
    await this.findUserOrThrow(id);
    
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error('Delete failed:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}