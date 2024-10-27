import multer from "multer";
import Path from "path";


const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg", ".svg", ".webp"];
    if (!acceptableExt.includes(Path.extname(file.originalname))) {

    }
    const fileSize = parseInt(req.headers["content-length"]);
    // if (fileSize > 1048576) {
    //     return res.status(401).json({ success: false, message: "File Size Big" });
    // }

    callback(null, true);
};

let upload = multer({
    fileFilter: fileFilter,
    fileSize: 1048576,
});

const singleAvatar = upload.single("profileImg");

export { singleAvatar }