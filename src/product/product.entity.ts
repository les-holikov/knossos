import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductComponent } from './product-component.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  warehouseCode!: string;

  @Column()
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => ProductComponent, (pc) => pc.product)
  productComponents!: ProductComponent[];
}
