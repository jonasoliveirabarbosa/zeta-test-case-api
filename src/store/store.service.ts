import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { StoreParameters } from './store.parameters';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  findAll(parameters: StoreParameters): Promise<Store[]> {
    const { limit, page, orderBy, orderDirection } = parameters;
    const skip = (page - 1) * limit;

    return this.storeRepository.find({
      skip,
      take: limit,
      order: {
        [orderBy]: orderDirection,
      },
    });
  }

  findOne(id: string): Promise<Store | null> {
    return this.storeRepository.findOneBy({ id });
  }
}
