import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1769433128132 implements MigrationInterface {
    name = 'InitialSchema1769433128132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "push_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "endpoint" character varying NOT NULL, "p256dh" character varying NOT NULL, "auth" character varying NOT NULL, "expirationTime" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_07fc861c0d2c38c1b830fb9cb5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "academic_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d3d3086aded9cae910678d8b47e" UNIQUE ("name"), CONSTRAINT "UQ_1958c69ae82514d666c8e9c540d" UNIQUE ("slug"), CONSTRAINT "PK_640abe36515fdf25f668195cf9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reminderTime" TIMESTAMP WITH TIME ZONE NOT NULL, "isSent" boolean NOT NULL DEFAULT false, "userId" uuid, "eventId" uuid, CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6812abef4715a7deaf87c5f390" ON "reminder" ("userId", "eventId") `);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "message" text, "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "location" character varying(255), "registrationLink" character varying(2048), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "UQ_35c9b140caaf6da09cfabb0d675" UNIQUE ("slug"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "complaint_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "slug" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_f8a4338ed3ae9205739e00b4b27" UNIQUE ("name"), CONSTRAINT "UQ_fa3c21b09098abffc80b7a3772b" UNIQUE ("slug"), CONSTRAINT "REL_feb0faf231c9f99bfac3d1e8dd" UNIQUE ("userId"), CONSTRAINT "PK_8065f3829facdcba2e1c8df42c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "firstName" character varying(100), "lastName" character varying(100), "passwordHash" character varying(255) NOT NULL, "hashedRefreshToken" character varying(255), "avatarUrl" character varying(2048), "publicKey" character varying(2048), "resetPasswordToken" character varying(255), "resetPasswordExpires" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "academicGroupId" uuid, CONSTRAINT "REL_b5f1d4509878dbfd4f3dcd23e3" UNIQUE ("academicGroupId"), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "encryptedText" text NOT NULL, "iv" text NOT NULL, "encryptedKeys" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, "senderId" uuid, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lastReadAt" TIMESTAMP, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "chatId" uuid, "userId" uuid, CONSTRAINT "UQ_d37a7c4be404903dd6fd46f696b" UNIQUE ("chatId", "userId"), CONSTRAINT "PK_aea646f59c92c47af5804ce73a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_roles_role" ("eventId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_afc0b76deed839c5d66827df4b3" PRIMARY KEY ("eventId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22c364e134f8836fa873120823" ON "event_roles_role" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_62e57ae50772db7849a3b3871b" ON "event_roles_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "event_academic_groups_academic_group" ("eventId" uuid NOT NULL, "academicGroupId" uuid NOT NULL, CONSTRAINT "PK_9b78b6481a040a121f81f1c12c2" PRIMARY KEY ("eventId", "academicGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6543a745be0323a43c707a3ed9" ON "event_academic_groups_academic_group" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e82d8734ab4380ce41af0680e" ON "event_academic_groups_academic_group" ("academicGroupId") `);
        await queryRunner.query(`CREATE TABLE "user_role" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab40a6f0cd7d3ebfcce082131f" ON "user_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dba55ed826ef26b5b22bd39409" ON "user_role" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "user_academic_group" ("userId" uuid NOT NULL, "academicGroupId" uuid NOT NULL, CONSTRAINT "PK_44d58f23604603366b93760d4cd" PRIMARY KEY ("userId", "academicGroupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b8a202662d283395c0ccc52e18" ON "user_academic_group" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e1bd8958f7f040d264f962dbe6" ON "user_academic_group" ("academicGroupId") `);
        await queryRunner.query(`ALTER TABLE "push_subscription" ADD CONSTRAINT "FK_8a227cbc3dc43c0d56117ea1563" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminder" ADD CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reminder" ADD CONSTRAINT "FK_dad53675d0c3b05d9ee6fe44b1d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_8b8d0bcec9e64a01301144537c5" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaint_role" ADD CONSTRAINT "FK_feb0faf231c9f99bfac3d1e8dda" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_b5f1d4509878dbfd4f3dcd23e3e" FOREIGN KEY ("academicGroupId") REFERENCES "academic_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_e82334881c89c2aef308789c8be" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_e98bf961346b1b32adf306136c6" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_members" ADD CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_roles_role" ADD CONSTRAINT "FK_22c364e134f8836fa873120823c" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_roles_role" ADD CONSTRAINT "FK_62e57ae50772db7849a3b3871b3" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_academic_groups_academic_group" ADD CONSTRAINT "FK_6543a745be0323a43c707a3ed98" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_academic_groups_academic_group" ADD CONSTRAINT "FK_0e82d8734ab4380ce41af0680ec" FOREIGN KEY ("academicGroupId") REFERENCES "academic_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_academic_group" ADD CONSTRAINT "FK_b8a202662d283395c0ccc52e18f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_academic_group" ADD CONSTRAINT "FK_e1bd8958f7f040d264f962dbe6d" FOREIGN KEY ("academicGroupId") REFERENCES "academic_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_academic_group" DROP CONSTRAINT "FK_e1bd8958f7f040d264f962dbe6d"`);
        await queryRunner.query(`ALTER TABLE "user_academic_group" DROP CONSTRAINT "FK_b8a202662d283395c0ccc52e18f"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`);
        await queryRunner.query(`ALTER TABLE "event_academic_groups_academic_group" DROP CONSTRAINT "FK_0e82d8734ab4380ce41af0680ec"`);
        await queryRunner.query(`ALTER TABLE "event_academic_groups_academic_group" DROP CONSTRAINT "FK_6543a745be0323a43c707a3ed98"`);
        await queryRunner.query(`ALTER TABLE "event_roles_role" DROP CONSTRAINT "FK_62e57ae50772db7849a3b3871b3"`);
        await queryRunner.query(`ALTER TABLE "event_roles_role" DROP CONSTRAINT "FK_22c364e134f8836fa873120823c"`);
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_23c13a72d263e5f355aef4e2a0d"`);
        await queryRunner.query(`ALTER TABLE "chat_members" DROP CONSTRAINT "FK_e98bf961346b1b32adf306136c6"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_e82334881c89c2aef308789c8be"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_b5f1d4509878dbfd4f3dcd23e3e"`);
        await queryRunner.query(`ALTER TABLE "complaint_role" DROP CONSTRAINT "FK_feb0faf231c9f99bfac3d1e8dda"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_8b8d0bcec9e64a01301144537c5"`);
        await queryRunner.query(`ALTER TABLE "reminder" DROP CONSTRAINT "FK_dad53675d0c3b05d9ee6fe44b1d"`);
        await queryRunner.query(`ALTER TABLE "reminder" DROP CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4"`);
        await queryRunner.query(`ALTER TABLE "push_subscription" DROP CONSTRAINT "FK_8a227cbc3dc43c0d56117ea1563"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1bd8958f7f040d264f962dbe6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8a202662d283395c0ccc52e18"`);
        await queryRunner.query(`DROP TABLE "user_academic_group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dba55ed826ef26b5b22bd39409"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab40a6f0cd7d3ebfcce082131f"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e82d8734ab4380ce41af0680e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6543a745be0323a43c707a3ed9"`);
        await queryRunner.query(`DROP TABLE "event_academic_groups_academic_group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_62e57ae50772db7849a3b3871b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22c364e134f8836fa873120823"`);
        await queryRunner.query(`DROP TABLE "event_roles_role"`);
        await queryRunner.query(`DROP TABLE "chat_members"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "complaint_role"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6812abef4715a7deaf87c5f390"`);
        await queryRunner.query(`DROP TABLE "reminder"`);
        await queryRunner.query(`DROP TABLE "academic_group"`);
        await queryRunner.query(`DROP TABLE "push_subscription"`);
    }

}
