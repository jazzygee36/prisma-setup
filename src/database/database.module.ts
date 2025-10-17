import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PrismaClient } from 'generated/prisma';

@Module({
  providers: [DatabaseService],
})
export class DatabaseModule extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log('Database connected');
  }
}
