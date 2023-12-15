import { Column, Entity, Index } from "typeorm";

@Index(
  "products_ec2_instances_index",
  ["productFamily", "region", "service"],
  {}
)
@Index("products_pkey", ["productHash"], { unique: true })
@Index("products_service_region_index", ["region", "service"], {})
@Entity("products", { schema: "public" })
export class Products {
  @Column("text", { primary: true, name: "productHash" })
  productHash: string;

  @Column("text", { name: "sku" })
  sku: string;

  @Column("text", { name: "vendorName" })
  vendorName: string;

  @Column("text", { name: "region", nullable: true })
  region: string | null;

  @Column("text", { name: "service" })
  service: string;

  @Column("text", { name: "productFamily", default: () => "''" })
  productFamily: string;

  @Column("jsonb", { name: "attributes" })
  attributes: object;

  @Column("jsonb", { name: "prices" })
  prices: object;
}
