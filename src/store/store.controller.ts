import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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
  @Get()
  findAll(@Query() params: StoreParameters): Promise<Store[]> {
    return this.storeService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }
}
