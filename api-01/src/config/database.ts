import { ConfigModule, ConfigService } from '@nestjs/config';

export default {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: configService.get('DB_CONNECTION'),
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT')),
      database: configService.get('DB_NAME'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    };
  },
};
