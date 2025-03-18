import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

export const TestDB = async () => {
    const db = drizzle({
        connection: {
            url: ':memory:'
        }
    });

    await db.run('PRAGMA foreign_keys=off');
    await migrate(db, {
        migrationsFolder: 'drizzle'
    });
    await db.run('PRAGMA foreign_keys=on');

    return db;
};
