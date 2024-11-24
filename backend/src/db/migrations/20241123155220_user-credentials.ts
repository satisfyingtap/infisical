import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TableName.UserCredentials, (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("type").notNullable().checkIn(["login", "card", "note"]);
    table.string("name").notNullable();
    table.text("encryptedData").notNullable();
    table.uuid("userId").notNullable().references("id").inTable(TableName.Users);
    table.uuid("organizationId").notNullable().references("id").inTable(TableName.Organization);
    table.timestamp("createdAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Add indexes
    table.index("userId");
    table.index("organizationId");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableName.UserCredentials);
}
