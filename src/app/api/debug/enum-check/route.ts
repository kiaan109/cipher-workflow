import prisma from "@/lib/db";

export async function GET() {
  const rows = await prisma.$queryRawUnsafe<{ enumlabel: string }[]>(
    `SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'NodeType') ORDER BY enumsortorder;`,
  );
  const migrations = await prisma.$queryRawUnsafe<{ migration_name: string; finished_at: Date | null }[]>(
    `SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at DESC LIMIT 5;`,
  );
  return Response.json({ enumValues: rows.map((r) => r.enumlabel), recentMigrations: migrations });
}
