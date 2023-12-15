import { Column, Entity, Index } from "typeorm";

@Index("installs_pkey", ["installId"], { unique: true })
@Entity("installs", { schema: "public" })
export class Installs {
  @Column("uuid", { primary: true, name: "install_id" })
  installId: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;
}
