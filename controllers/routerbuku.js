const express = require('express')
const router = express.Router()
const Buku = require('../models/buku')
const auth = require('../utils/basicAuth')
const user = require('../models/user')

router.get('/',(req,res)=>{
    Buku.find((err,data)=>{
        if(err) throw err;
        // res.send('test')
        res.render('homeadmin',{data:data})
    }).catch(err =>{
        res.render('error',{data:'Tidak bisa menampilkan data'})
    })
})
router.get('/user',(req,res)=>{
    user.find((err,data)=>{
        if(err) throw err;
        // res.send('test')
        res.render('tabeluser',{data:data})
    }).catch(err =>{
        res.render('error',{data:'Tidak bisa menampilkan data'})
    })
})

router.get('/edituser/:id', (req, res, next) => {
    console.log(req.params.id);
    user.findOneAndUpdate({_id: req.params.id},req.body, { new: true }, (err, data)=>{
        console.log(data);
        res.render('edituser', {data:data});
    })
});

router.post('/edituser/:id', (req, res, next) => {
    user.findByIdAndUpdate({_id: req.params.id},req.body, (err)=>{
        if (err) {
            console.log(err);
            res.render('error',{data:'Tidak bisa edit data'})
        } else {
            res.redirect('/admin/user')
        }
    })
});

router.get('/add',(req,res)=>{
    res.render('tambah')
})

router.post('/add',(req,res)=>{
    const{nama,author,penerbit,tahun_terbit,harga,stok} = req.body;
    // console.log(nama,author,penerbit,tahun_terbit,jumlah_halaman);

    const buku = new Buku({nama,author,penerbit,tahun_terbit,harga,stok})

    buku.save(err=>{
        if(err){
            res.render('error',{data:'Tidak bisa tambah data'})
        }else{
            res.redirect('/admin/')
        }
    })
})

router.get('/edit/:id', (req, res, next) => {
    console.log(req.params.id);
    Buku.findOneAndUpdate({_id: req.params.id},req.body, { new: true }, (err, data)=>{
        console.log(data);
        res.render('edit', {data:data});
    })
});

router.post('/edit/:id', (req, res, next) => {
    Buku.findByIdAndUpdate({_id: req.params.id},req.body, (err)=>{
        if (err) {
            console.log(err);
            res.render('error',{data:'Tidak bisa edit data'})
        } else {
            res.redirect('/admin/')
        }
    })
});

router.get('/delete/:id',(req, res)=>{
    Buku.findByIdAndDelete({_id:req.params.id}, err=>{
        if(err){
            console.log(err);
            res.render('error',{data:'Tidak bisa hapus data'})
        }else{
            res.redirect('/admin/')
        }
    });
})

module.exports = router;