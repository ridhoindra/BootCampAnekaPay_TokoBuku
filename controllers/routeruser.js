const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Buku = require('../models/buku')
const Transaksi = require('../models/transaksi')
var auth = require('../utils/basicAuth')
const { get } = require('./routerbuku')
const { Router } = require('express')
// const e = require('express')
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client  = redis.createClient();

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/')
    }
    res.render('login')
})
router.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;

    User.findOne({
        email: email,
        password: password
    }, (err, user) => {
        if (err) {
            res.render('error', {
                err: 'Tidak bisa login'
            })
        }
        if (user.status === 'user') {
            req.session.iduser = user._id
            req.session.nama = user.nama
            req.session.email = user.email
            req.session.password = user.password
            req.session.logged_in = true
            // console.log(sess.email);
            res.redirect('/')
        } else {
            req.session.admin = true
            res.redirect('/admin/')
        }

    })
})


router.get('/daftar', (req, res) => {

    res.render('daftar')
})
router.post('/daftar', (req, res) => {
    const {
        nama,
        email,
        password
    } = req.body;
    const created_at = Date.now()
    const data = new User({
        nama,
        email,
        password,
        created_at
    })
    data.save(err => {
        if (err) {
            res.render('error', {
                data: 'Tidak bisa tambah data'
            })
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/profile', auth.check_login, (req, res) => {
    res.render('profile', {
        //   id:req.session.id,
        nama: req.session.nama,
        email: req.session.email,
        password: req.session.password
    })
})

router.get('/editprofile', auth.check_login, (req, res) => {
    res.render('editprofile', {
        id: req.session.iduser,
        nama: req.session.nama,
        email: req.session.email,
        password: req.session.password
    })
})

router.post('/editprofile/:id', auth.check_login, (req, res) => {
    console.log(req.params.id);
    User.findByIdAndUpdate({
        _id: req.params.id
    }, req.body, (err) => {
        if (err) {
            console.log(err);
            res.render('error', {
                err: 'Tidak bisa edit data'
            })
        } else {
            req.session.nama = req.body.nama
            req.session.email = req.body.email
            req.session.password = req.body.password
            res.redirect('/profile')
        }
    })
})

router.get('/', auth.check_login, (req, res) => {
    Buku.find((err, data) => {
        if (err) throw err;
        // console.log(data);
        res.render('home', {
            data: data,
            nama: req.session.nama
        })
    }).catch(err => {
        res.render('error', {
            data: 'Tidak bisa menampilkan data'
        })
    })
})

router.get('/tambahCart/:id', auth.check_login, (req, res) => {
    // console.log(req.params.id);
    Buku.findOneAndUpdate({
        _id: req.params.id
    }, req.body, {
        new: true
    }, (err, data) => {
        if (data.stok <= 0) {
            res.render('error', {
                err: 'Stok tidak ada'
            })
        }
        res.render('tambahCart', {
            data: data
        });
    })
})
router.post('/tambahCart/:id', (req, res) => {
    // const sess = req.session

    if (!req.session.cart) {
        req.session.cart = [];
    }
    var jumlah = req.body.beli;
    Buku.findById({
        _id: req.params.id
    }, req.body, (err, buku) => {
        if (err) {
            console.log(err);
            res.render('error', {
                err: 'Tidak bisa edit data'
            })
        } else {
            req.session.cart.push({
                id: buku._id,
                nama: buku.nama,
                harga: buku.harga,
                jumlah: jumlah
            })
            // req.session.id = buku._id
            // console.log(req.session.nama);
            res.redirect('/')
        }
    })
})

router.get('/tampilCart', auth.check_login, (req, res) => {
    var data = req.session.cart
    var tharga = 0
    var fharga = 0
    if (data) {
        for (let i = 0; i < data.length; i++) {
            var harga = data[i].harga;
            var jumlah = data[i].jumlah
            tharga = harga * jumlah
            // arrharga.push(tharga)
            fharga = fharga + tharga
            // console.log(arrharga);
            // console.log(fharga);
        }
        res.render('keranjang', {
            data: req.session.cart,
            fharga: fharga,
            // harga: arrharga  
        })
    } else {
        res.render('keranjang', {
            data: [{
                nama: "Kosong",
                harga: 0,
                jumlah: 0
            }],
            fharga: fharga,
        })
    }
})

router.get('/hapusCart/:id', auth.check_login, (req, res) => {
    if (!req.session.cart) {
        req.session.cart = []
    }
    var id = req.params.id
    var cart = req.session.cart.reduce((acc, c) => {
        if (c.id !== id) {
            acc.push(c)
        } else {
        }
        return acc;
    }, [])
    req.session.cart = cart
    res.redirect('/tampilCart')
})

router.get('/editCart/:id', auth.check_login, (req, res) => {
    var id = req.params.id
    var cart = req.session.cart
    var indexcart = cart.findIndex((acc => acc.id == id))
    res.render('editCart',{
        data: cart[indexcart]
    })
})

router.post('/editCart/:id', (req, res) => {
    if (!req.session.cart) {
        req.session.cart = []
    }
    var id = req.params.id
    var cart = req.session.cart

    var indexcart = cart.findIndex((array => array.id == id))
    console.log(cart[indexcart]);

    cart[indexcart].jumlah = req.body.jumlah

    res.redirect('/tampilCart')
})

router.post('/beli', auth.check_login, (req, res) => {
    // id_user: { type: String },
    // id_barang: { type: String },
    // namaBarang: { type: String },
    // jumlah: {type: Number},
    // harga: {type: Number},
    // tgl_transaksi: { type: Date }
    var data = req.session.cart
    const id_user = req.session.iduser
    const tgl_transaksi = Date.now()

    if (data) {
        for (let i = 0; i < data.length; i++) {
            var id_barang = data[i].id;
            var hargaBarang = data[i].harga;
            var jumlah = data[i].jumlah
            var namaBarang = data[i].nama
            var harga = hargaBarang * jumlah
            console.log(id_barang);

            const transaksi = new Transaksi({
                id_user,
                id_barang,
                namaBarang,
                jumlah,
                harga,
                tgl_transaksi
            })

            transaksi.save(err=>{
                if (err) {
                    res.render('error',{data:'Tidak bisa beli barang'})
                }else{
                    // Buku.findByIdAndUpdate({
                    //     _id: id_barang
                    // },{$inc:{
                    //     stok: -jumlah}
                    // },(err)=>{
                    //     if (err) {
                    //         res.render('error',{data:'Tidak bisa beli barang'})
                    //     }else{
                    //         req.session.cart = []
                    //         res.redirect('/')
                    //     }
                    // })
                }
            })

            Buku.findByIdAndUpdate({
                _id: id_barang
                // stok:{$gte: 0}
            },{$inc:{
                stok: -jumlah}
            },(err)=>{
                if (err) {
                    res.render('error',{err:'Tidak bisa beli barang'})
                }else{
                    req.session.cart = []
                }
            })
            req.session.cart = []
            res.redirect('/')
        }
    }else{
        res.render('error',{data:'Keranjang anda kosong'})
    }
})

router.get('/history',auth.check_login, (req, res) => {
    console.log(req.session.iduser);
    Transaksi.find({
        id_user: req.session.iduser
    }, (err, data) => {
        console.log(data);
        if (err) {
            console.log(err);
            res.render('error', {
                err: 'Tidak ada history'
            })
        } else {
            res.render('history',{
                data:data
            })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;