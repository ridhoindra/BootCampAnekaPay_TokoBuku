// const express = require('express')

var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_in) {
            return res.redirect('/login');
        }

        next();
    },
    is_admin: function (req, res, next)
    {
        console.log(req.session.admin);
        if (!req.session.admin) {
            return res.redirect('/logout');
        }

        next();
    },
};

module.exports = Auth;