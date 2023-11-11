const adminSession = (req,res,next)=>{

    if(req.session.adminID){
    next()
    }else{
        res.redirect('/admin/admin')
    }
}

module.exports= {
    adminSession
}