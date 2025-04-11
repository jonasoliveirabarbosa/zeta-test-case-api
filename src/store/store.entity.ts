import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_carteira' })
export class Store {
  @PrimaryGeneratedColumn({ name: 'id_pdv', type: 'int4' })
  id: string;

  @Column({ name: 'nome_estabelecimento', type: 'varchar', length: 255 })
  storeName: string;

  @Column({ name: 'endereco', type: 'varchar', length: 255 })
  address: string;

  @Column({ name: 'categoria', type: 'varchar', length: 100 })
  status: string;

  @Column({ name: 'categoria_n2', type: 'varchar', length: 100 })
  statusN2: string;

  @Column({ name: 'categoria_n3', type: 'varchar', length: 100 })
  statusN3: string;

  @Column({ name: 'categoria_n4', type: 'varchar', length: 100 })
  statusN4: string;

  @Column({ name: 'img_url', type: 'varchar', length: 500 })
  imgUrl: string;

  @Column({ type: 'float8' })
  lat: number;

  @Column({ type: 'float8' })
  lng: number;

  @Column({ name: 'em_andamento', type: 'bool' })
  onGoing: boolean;

  @Column({ name: 'concluido', type: 'bool' })
  ended: boolean;

  @Column({ type: 'jsonb' })
  tags: string;

  @Column({ name: 'cliente', type: 'bool' })
  hasClient: boolean;
}
