import { Product } from '../product/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Component } from '../component/component.entity';

@Entity()
export class ProductComponent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product, (product) => product.productComponents)
  product!: Product;

  @ManyToOne(() => Component, (component) => component.productComponents)
  component!: Component;

  @Column()
  quantity!: number;
}
