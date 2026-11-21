// Where each planted difference lives, in panel coordinates (the same spot
// on both pictures — click either panel). `r` is the click tolerance, and
// `hint` is the clue a hint reveals. Coordinates match the painters in
// scenes.js exactly: a marker drawn here lands on the changed element.
export const DIFFERENCES = {
  market: [
    { id: 'm1', x: 82, y: 66, r: 16, hint: 'Lihat bulannya baik-baik.' },
    { id: 'm2', x: 372, y: 146, r: 22, hint: 'Ada lampion yang hilang di tengah.' },
    { id: 'm3', x: 280, y: 201, r: 26, hint: 'Tenda lapak tengah beda warna.' },
    { id: 'm4', x: 395, y: 322, r: 28, hint: 'Ada yang tidur di atas peti.' },
    { id: 'm5', x: 450, y: 218, r: 18, hint: 'Balonnya ada yang ganti warna.' },
    { id: 'm6', x: 95, y: 248, r: 24, hint: 'Baca tulisan di lapak sate.' },
    { id: 'm7', x: 492, y: 52, r: 16, hint: 'Bintang paling terang hilang satu.' },
  ],
  garden: [
    { id: 'g1', x: 252, y: 324, r: 16, hint: 'Satu tulip warnanya beda.' },
    { id: 'g2', x: 275, y: 296, r: 20, hint: 'Kupu-kupu di atas tulip hilang.' },
    { id: 'g3', x: 175, y: 104, r: 20, hint: 'Ada burung nangkring di pohon.' },
    { id: 'g4', x: 310, y: 205, r: 24, hint: 'Air mancur berhenti memancar.' },
    { id: 'g5', x: 475, y: 291, r: 20, hint: 'Bangku taman kehilangan satu papan.' },
    { id: 'g6', x: 148, y: 138, r: 16, hint: 'Ada apel merah di pohon.' },
    { id: 'g7', x: 106, y: 366, r: 22, hint: 'Satu batu pijakan hilang dari jalan.' },
    { id: 'g8', x: 440, y: 200, r: 18, hint: 'Kunang-kunang berkurang satu.' },
  ],
  warung: [
    { id: 'w1', x: 272, y: 227, r: 20, hint: 'Uap kopinya hilang.' },
    { id: 'w2', x: 211, y: 207, r: 20, hint: 'Ceret kehilangan moncongnya.' },
    { id: 'w3', x: 450, y: 164, r: 20, hint: 'Harga kopi di papan menu berubah.' },
    { id: 'w4', x: 497, y: 212, r: 24, hint: 'Ada ayam jago nangkring di pagar.' },
    { id: 'w5', x: 105, y: 252, r: 24, hint: 'Toples kerupuk raib dari meja.' },
    { id: 'w6', x: 310, y: 76, r: 20, hint: 'Lampu gantung berubah warna.' },
    { id: 'w7', x: 422, y: 311, r: 24, hint: 'Satu dingklik hilang.' },
    { id: 'w8', x: 230, y: 328, r: 30, hint: 'Ada kucing tidur di bawah meja.' },
    { id: 'w9', x: 200, y: 104, r: 26, hint: 'Jam dinding menunjukkan waktu lain.' },
  ],
};

// The ids a level plants on its right panel, in play order.
export function levelDifferences(scene) {
  return DIFFERENCES[scene];
}
