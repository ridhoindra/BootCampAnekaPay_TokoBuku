const mongoose = require("mongoose");

const transaksiSchema = mongoose.Schema({
    id_user: { type: String },
    id_barang: { type: String },
    namaBarang: { type: String },
    jumlah: {type: Number},
    harga: {type: Number},
    tgl_transaksi: { type: Date }
  });

module.exports = mongoose.model('transaksi',transaksiSchema)