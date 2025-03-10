import { drizzle } from "drizzle-orm/libsql/node";

export const TestDB = () => {
    const db = drizzle({
        connection: {
            url: ":memory:"
        }
    });

    db.run(`PRAGMA foreign_keys=off`);
}
