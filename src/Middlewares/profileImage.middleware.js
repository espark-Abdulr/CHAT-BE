import multer from "multer";
import Path from "path";


const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
    if (!acceptableExt.includes(Path.extname(file.originalname))) {

    }
    const fileSize = parseInt(req.headers["content-length"]);
    

    callback(null, true);
};

let upload = multer({
    fileFilter: fileFilter,
    fileSize: 1048576,
});

const singleAvatar = upload.single("profileImg");

export { singleAvatar }