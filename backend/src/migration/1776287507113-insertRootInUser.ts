import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRootInUser1776287507113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO public."user"(
                name, email, cpf, type_user, phone, password)
                VALUES ('root', 'root@root.com', '12345678901', 2, '31925325252', '$2b$10$NLpHDF5c6qCpGRYTSX2DSeeGhU9D69nZZbomVu4Yy19brV1a9b0jO');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
                WHERE email like 'root@root.com';
        `);
  }
}
