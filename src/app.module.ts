import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module'; 
import {AuthModule} from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),  
        ssl: { rejectUnauthorized: false }, 
        autoLoadEntities: true,
        synchronize: false, 
        migrations: ['dist/migrations/*.js'],  
        migrationsRun: true, 
      }),
    }),
    UserModule,
    AuthModule
  ],
})
export class AppModule {}
