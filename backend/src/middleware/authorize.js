const authorize=(...roles)=>{

return(req,res,next)=>{

if(!roles.includes(req.user.role)){

res.status(403);

throw new Error("Unauthorized");

}

next();

};

};

module.exports=authorize;