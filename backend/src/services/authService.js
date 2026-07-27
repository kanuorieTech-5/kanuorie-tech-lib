exports.login = async(email,password)=>{

const user = await User.findOne({

email

});

if(!user){

throw new Error("Invalid credentials");

}

const valid = await bcrypt.compare(

password,

user.password

);

if(!valid){

throw new Error("Invalid credentials");

}

const token = generateToken(user._id);

return{

user,

token,

};

};