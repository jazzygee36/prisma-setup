import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LogineUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: any }> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashPassword },
      });

      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async loginUser(logineUserDto: LogineUserDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: logineUserDto.email },
    });
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(
      logineUserDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new ConflictException('Password does not match');
    }
    return { message: 'Login successful' };
  }

  async findOne(createUserDto: CreateUserDto): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
  }
}
