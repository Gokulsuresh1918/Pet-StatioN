const adminSession = (req,res,next)=>{

    if(req.session.adminID){
    next()
    }else{
        res.redirect('/admin/admin')
    }
}
const isLogOut = (res, req,next)=>{
    if(!req.session.adminID){
        res.redirect('/admin')
    }else{
        next()
    }
}

module.exports= {
    adminSession,
    isLogOut
}