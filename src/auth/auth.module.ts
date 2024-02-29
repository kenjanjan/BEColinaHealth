import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { IdService } from 'services/uuid/id.service';
import { JwtModule } from '@nestjs/jwt';
import { Role } from 'src/role/entities/role.entity';
import { UserAccessLevel } from 'src/user_access_level/entities/user_access_level.entity';
{
}
@Module({
  imports: [
    JwtModule.register({
      secret: 'jairosoftPOGI', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Optional: Set expiration time for tokens
    }),
    TypeOrmModule.forFeature([Users, Role, UserAccessLevel]),
  ],
  providers: [AuthService, UsersService, IdService],
  controllers: [AuthController],
})
export class AuthModule {}