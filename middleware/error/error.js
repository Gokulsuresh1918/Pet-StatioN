module.exports=((req, res,next) => { 
    res.status(404).render('User/errorpage');
});
