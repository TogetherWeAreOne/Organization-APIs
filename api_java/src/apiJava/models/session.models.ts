import {ISession} from "connect-typeorm";
import {Column, Entity, Index, PrimaryColumn} from "typeorm";
import "reflect-metadata";


@Entity({database : "organization_java"})
export class Session implements ISession {
    @Index()
    @Column("bigint")
    public expiredAt = Date.now();

    @PrimaryColumn("varchar", {length: 255})
    public id = "";

    @Column("text")
    public json = "";
}
