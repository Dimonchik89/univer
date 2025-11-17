import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFullTextSearch1763016779739 implements MigrationInterface {
	name = 'AddUserFullTextSearch1763016779739';

    public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			ALTER TABLE "user" ADD COLUMN "search_vector" tsvector;
		`)

		await queryRunner.query(`
			CREATE INDEX "user_search_idx" ON "user" USING GIN ("search_vector");
		`)

		await queryRunner.query(`
			CREATE OR REPLACE FUNCTION user_tsvector_trigger() RETURNS trigger AS $$ BEGIN
				NEW.search_vector :=
					setweight(
						to_tsvector('english',
							coalesce(new.email,'') || ' ' ||
							coalesce(new."firstName",'') || ' ' ||
							coalesce(new."lastName",'')
						), 'A'
					)
					||
					setweight(
						to_tsvector('russian',
							coalesce(new.email,'') || ' ' ||
							coalesce(new."firstName",'') || ' ' ||
							coalesce(new."lastName",'')
						), 'B'
					);
			RETURN NEW;
			END;
			$$ LANGUAGE plpgsql;
		`);

		await queryRunner.query(`
			CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
			ON "user" FOR EACH ROW EXECUTE FUNCTION user_tsvector_trigger();
		`);

		await queryRunner.query(`
			UPDATE "user" SET "search_vector" =
				setweight(
					to_tsvector('english',
						coalesce(email, '') || ' ' ||
						coalesce("firstName", '') || ' ' ||
						coalesce("lastName", '')
					), 'A'
        		)
				||
				setweight(
					to_tsvector('russian',
						coalesce(email, '') || ' ' ||
						coalesce("firstName", '') || ' ' ||
						coalesce("lastName", '')
					), 'B'
				)
		`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TRIGGER IF EXISTS tsvectorupdate ON "user";`);
		await queryRunner.query(`DROP FUNCTION IF EXISTS user_tsvector_trigger;`);
		await queryRunner.query(`DROP INDEX IF EXISTS "user_search_idx";`);
		await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "search_vector";`);
    }
}
