import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("stats_pkey", ["id"], { unique: true })
@Entity("stats", { schema: "public" })
export class Stats {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp without time zone", { name: "updated_at" })
  updatedAt: Date;

  @Column("timestamp without time zone", {
    name: "prices_last_successfully_updated_at",
    nullable: true,
  })
  pricesLastSuccessfullyUpdatedAt: Date | null;

  @Column("boolean", { name: "prices_last_update_successful", nullable: true })
  pricesLastUpdateSuccessful: boolean | null;

  @Column("bigint", { name: "total_runs", nullable: true, default: () => "0" })
  totalRuns: string | null;

  @Column("bigint", { name: "ci_runs", nullable: true, default: () => "0" })
  ciRuns: string | null;

  @Column("bigint", { name: "non_ci_runs", nullable: true, default: () => "0" })
  nonCiRuns: string | null;
}
