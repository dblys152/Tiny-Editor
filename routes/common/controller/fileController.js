const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mime = require('mime-types');

router.post('/edit-img', async (req, res, next) => {
    const fileSrc = 'C:/dev/web_files/';
    try {
        if(!req.files || Object.keys(req.files).length === 0) {
            return next({status: 400, message: "No file uploaded"});
        }
        
        let file = req.files.user_file, 
            ext = path.extname(file.name),
            fileNm = path.join('tinyImg' + crypto.randomBytes(16).toString('hex') + ext),
            pathNm = fileSrc + fileNm;
        
        if(file == null) {
            return next({status: 400, message: "user_file이 없습니다."});
        }
        if(file.mimetype != 'image/jpeg' && file.mimetype != 'image/png' && file.mimetype != 'image/gif') {
            return next({status: 400, message: ".jpeg, .png, .gif 파일만 업로드 가능합니다."});
        }

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        file.mv(pathNm, async (err) => {
            if(err) return next({status: 500, message: err});

            //check file exists
            if(fs.existsSync(pathNm)) {
                res.status(200).json({"location": '/edit-img/' + fileNm});
            } else {
                return next({status: 500, message: "file uploaded fail"});
            }
        });
    } catch(err) {
        next(err);
    }
});

/* 에디터 이미지 출력 */
router.get('/edit-img/:fileNm', async (req, res, next) => {
    const fileSrc = process.env.FILE_PATH;
    try {
        let fileNm = req.params.fileNm;
        if(fileNm != null){
            var src = path.join(fileSrc, fileNm);
            fs.readFile(src, (error, data) => {
                res.writeHead(200,{'Content-type': mime.lookup(src)});
                res.end(data);
            });
        } else{
            return next({status: 404, message: "출력할 이미지가 없습니다."});
        }
    } catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;