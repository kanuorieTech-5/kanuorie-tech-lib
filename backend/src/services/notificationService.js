exports.sendNotification = async({

recipient,

title,

message,

type,

actionUrl,

})=>{

return await Notification.create({

recipient,

title,

message,

type,

actionUrl,

});

};