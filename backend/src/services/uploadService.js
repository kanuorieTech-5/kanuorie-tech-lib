exports.uploadImage = async(file)=>{

const result = await cloudinary.uploader.upload(

file,

{

folder:"kanuorietech",

}

);

return result;

};