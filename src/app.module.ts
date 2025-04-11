import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
