import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity'; // Exemplo

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),  // usa a URL completa
        ssl: { rejectUnauthorized: false }, // necessário para NeonDB
        autoLoadEntities: true,
        synchronize: false, // NÃO usar em produção, só dev
        migrations: ['dist/migrations/*.js'],  // pasta compilada das migrations
        migrationsRun: true,  // roda as migrations automaticamente no start
      }),
    }),
    TypeOrmModule.forFeature([User]), // seus entities
  ],
})
export class AppModule {}
