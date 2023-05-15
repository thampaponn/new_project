const express = require("express");
const pool = require("../config");
const path = require("path")

const router = express.Router();

// Require multer for file upload
const multer = require('multer')
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// Get comment
router.get('/:blogId/comments', async function (req, res, next) {
    const [rows, fields] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.blogId]
    )
    res.json(
        rows
    )

});

// Create new comment
router.post('/blogs/:id', upload.single('comment_image'), async function (req, res, next) {
    const comment = req.body
    const blog_id = req.params.id

    console.log(req.params.id);
    try {

        const file = req.file;
        console.log(file);

        const [rows, fields] = await pool.query(
            'INSERT INTO comments(comment, blog_id) VALUES (?, ?)',
            [comment.comment, blog_id]
        )
        const [rows2, fields2] = await pool.query('INSERT INTO images(blog_id, comment_id, file_path, upload_date) VALUES(?, ?, ?, CURRENT_TIMESTAMP);',
            [req.params.id, rows.insertId, file.path.substr(6)]
        )

        res.redirect(`/blogs/${req.params.id}`)
    } catch (err) {
        console.log(err)
        return next(err);
    }
});

// Update comment
router.put('/comments/:commentId', function (req, res, next) {
    return
});

// Delete comment
router.delete('/comments/:commentId', function (req, res, next) {
    return
});

// Delete comment
router.put('/comments/addlike/:commentId', function (req, res, next) {
    return
});


exports.router = router