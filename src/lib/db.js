import {Pool} from "pg";

export const connectDb = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
