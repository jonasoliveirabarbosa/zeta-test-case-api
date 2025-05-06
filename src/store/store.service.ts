import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { StoreParameters } from './store.parameters';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(
    parameters: StoreParameters,
  ): Promise<{ data: Store[]; total: number }> {
    const { limit, page, sort, address, statusN3, userLat, userLong } =
      parameters;

    const sortObject = this.transformSortArrayToObject(sort);
    console.log(
      'Sort Object:',
      this.transformToQueryBuilderOrderBy(sortObject),
    );
    const skip = page * limit;

    await this.ensureDistanceFunctionExists();

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .addSelect(
        `pg_temp.calculate_distance(lat, lng, :userLat, :userLon, 'K')`,
        'distance',
      )
      .skip(skip)
      .take(limit)
      .orderBy(this.transformToQueryBuilderOrderBy(sortObject))
      .setParameters({
        userLat: userLat ?? null,
        userLon: userLong ?? null,
      });

    if (address) {
      queryBuilder.andWhere('store.endereco ILIKE :address', {
        address: `%${address}%`,
      });
    }

    if (statusN3) {
      queryBuilder.andWhere('store.categoria_n3 ILIKE :status', {
        status: `%${statusN3}%`,
      });
    }

    const [rawAndEntities, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount(),
    ]);

    return {
      data: this.formatResponse(rawAndEntities),
      total,
    };
  }

  private transformSortArrayToObject(sort: string[]): Record<string, string> {
    return sort.reduce((acc, value, index, array) => {
      if (index % 2 === 0) {
        acc[value] = array[index + 1] || 'asc';
      }
      return acc;
    }, {});
  }

  private formatResponse(result: { raw: any[]; entities: Store[] }): Store[] {
    const distances = result.raw.map((row: { distance: string }) => ({
      distance: parseFloat(row.distance ?? null),
    }));

    return result.entities.map((entity, index) => ({
      ...entity,
      distance: distances[index].distance,
    }));
  }

  private async ensureDistanceFunctionExists(): Promise<void> {
    await this.storeRepository.query(
      `CREATE OR REPLACE FUNCTION pg_temp.calculate_distance(
        lat1 float, lon1 float, lat2 float, lon2 float, units varchar
      ) RETURNS float AS $$
      DECLARE
        dist float = 0;
        radlat1 float;
        radlat2 float;
        theta float;
        radtheta float;
      BEGIN
        IF lat1 = 'NaN' OR lon1 = 'NaN' OR lat2 = 'NaN' OR lon2 = 'NaN' THEN
          RETURN NULL;
        END IF;
        IF lat1 = lat2 AND lon1 = lon2 THEN
          RETURN dist;
        ELSE
          radlat1 = pi() * lat1 / 180;
          radlat2 = pi() * lat2 / 180;
          theta = lon1 - lon2;
          radtheta = pi() * theta / 180;
          dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

          IF dist > 1 THEN dist = 1; END IF;

          dist = acos(dist);
          dist = dist * 180 / pi();
          dist = dist * 60 * 1.1515;

          IF units = 'K' THEN dist = dist * 1.609344; END IF;
          IF units = 'N' THEN dist = dist * 0.8684; END IF;

          RETURN dist;
        END IF;
      END;
      $$ LANGUAGE plpgsql;`,
    );
  }

  private transformToQueryBuilderOrderBy(
    sortObject: Record<string, string>,
  ): Record<string, 'ASC' | 'DESC'> {
    const columnMap = Object.fromEntries(
      this.storeRepository.metadata.ownColumns.map((column) => [
        column.propertyName,
        column.databaseName,
      ]),
    );

    columnMap['distance'] = 'distance';

    return Object.entries(sortObject).reduce(
      (orderBy, [key, value]) => {
        const columnName = columnMap[key];
        if (columnName) {
          orderBy[columnName] = value.toUpperCase() as 'ASC' | 'DESC';
        }
        return orderBy;
      },
      {} as Record<string, 'ASC' | 'DESC'>,
    );
  }

  async findOne(id: string): Promise<Store | null> {
    return this.storeRepository.findOne({ where: { id } });
  }

  async getStatus(): Promise<string[]> {
    const statuses = await this.storeRepository
      .createQueryBuilder('store')
      .select('DISTINCT store.categoria_n3', 'categoria_n3')
      .getRawMany();

    return statuses
      .map(
        (row: { categoria_n3: string | null }) =>
          row.categoria_n3?.trim() || '',
      )
      .filter((value) => value);
  }
}
