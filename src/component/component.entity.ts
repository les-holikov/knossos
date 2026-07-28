import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm/browser';
import { ProductComponent } from '../product/product-component.entity';

@Entity()
export class Component {
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

  @OneToMany(() => ProductComponent, (pc) => pc.component)
  productComponents!: ProductComponent[];
}
