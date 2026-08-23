import { urlPostgres, keBuffer } from "./postgres";

async function run() {
  const { Pool } = await import("pg");
  const url = urlPostgres();
  if (!url) {
    console.log("No POSTGRES_URL");
    return;
  }
  const pool = new Pool({
    connectionString: url,
    ssl: url.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
  });

  try {
    const res = await pool.query("SELECT kunci, isi FROM penyimpanan_aplikasi WHERE kunci = 'konfigurasi/_status.json'");
    console.log("Rows:", res.rows.length);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      console.log("Isi type:", typeof row.isi);
      console.log("Is Buffer?", Buffer.isBuffer(row.isi));
      
      const buf = keBuffer(row.isi);
      if (buf) {
        console.log("Buffer length:", buf.length);
        const teks = buf.toString("utf8");
        console.log("Teks content:", teks);
        try {
          JSON.parse(teks);
          console.log("JSON parse SUCCESS");
        } catch (e) {
          console.log("JSON parse FAILED:", e);
        }
      } else {
        console.log("keBuffer returned null for:", row.isi);
      }
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await pool.end();
  }
}

run().catch(console.error);
