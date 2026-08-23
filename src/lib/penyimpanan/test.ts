import {
  bacaPostgresTeks,
  tulisPostgresTeks,
  bacaPostgresTersimpan,
} from "./postgres";

async function run() {
  console.log("Menulis kunci tes...");
  await tulisPostgresTeks("tes_kunci", '{"halo":"dunia"}');
  console.log("Tersimpan.");

  console.log("Membaca teks...");
  const teks = await bacaPostgresTeks("tes_kunci");
  console.log("Teks dari database:", teks);

  console.log("Membaca tersimpan...");
  const buf = await bacaPostgresTersimpan("tes_kunci");
  console.log("Buffer dari database:", buf);
  if (buf) {
    console.log("Isi buffer:", buf.toString("utf8"));
  }
}

run().catch(console.error);
