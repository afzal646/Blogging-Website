const multer = require('multer')
const uuid = require('uuid')

const storage = multer.diskStorage({
    destination: function (req, file, destFunc) {
        destFunc(null, 'D:/Node/copy/BlogSiteMEHN/public/uploads')
    },
    filename: function (req, file, fileFunc) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // fileFunc(null, file.fieldname + '-' + uniqueSuffix)        
        fileFunc(null, uuid.v4() + "-" + file.originalname);
    }
})

function typeallowed(req,file,typecallback){
    console.log("typeallowed func")
    const type = file.mimetype;
    console.log(type);
    if(type==="image/jpeg" || type==="image/jpg" || type==="image/gif" || type==="image/png"){
        typecallback(null , true)
    }else
    {
        typecallback("only image format is allowed")
    }
}

const uploadfilenow = multer({ storage: storage , filefilter:typeallowed}).single("txtimg")

module.exports = uploadfilenow