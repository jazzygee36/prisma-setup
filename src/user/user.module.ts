import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [UserService, DatabaseService],
  imports: [DatabaseModule],
  // controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
