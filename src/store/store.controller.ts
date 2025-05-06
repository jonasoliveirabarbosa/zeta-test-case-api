import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './store.entity';
import { StoreParameters } from './store.parameters';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: StoreParameters })
  @Get('')
  findAll(
    @Query() params: StoreParameters,
  ): Promise<{ data: Store[]; total: number }> {
    console.log('Fetching stores with params:', params);
    return this.storeService.findAll(params);
  }

  @Get('/list-status')
  getStatus(): Promise<string[]> {
    return this.storeService.getStatus();
  }
}
