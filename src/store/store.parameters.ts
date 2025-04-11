/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

const validOrderByFields = [
  'storeName',
  'address',
  'status',
  'statusN2',
  'statusN3',
  'statusN4',
];

const validOrderDirection = ['ASC', 'DESC'];

export class StoreParameters {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 20; // Default limit

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1; // Default page

  @IsOptional()
  @IsString()
  @IsIn(validOrderByFields)
  orderBy: string = 'storeName'; // Default orderBy field

  @IsOptional()
  @IsString()
  @IsIn(validOrderDirection)
  orderDirection: string = 'ASC'; // Default order Direction field
}
