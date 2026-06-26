import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const pool = postgres(connectionString)

export default pool;