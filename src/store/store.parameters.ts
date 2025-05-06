import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const validOrderByFields = [
  'storeName',
  'address',
  'distance',
  'status',
  'statusN2',
  'statusN3',
  'statusN4',
];

const validOrderDirection = ['asc', 'desc'];

export class StoreParameters {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 30;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pageSize: number = 0;

  @IsOptional()
  @Type(() => Number)
  userLat: number;

  @IsOptional()
  @Type(() => Number)
  userLong: number;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return '';
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsIn(validOrderByFields.concat(validOrderDirection), { each: true })
  sort: string[] = [];

  @IsOptional()
  @IsString()
  statusN3: string;

  @IsOptional()
  @IsString()
  address: string;
}
