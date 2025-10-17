import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

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

      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
