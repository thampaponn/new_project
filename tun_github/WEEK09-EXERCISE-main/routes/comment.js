const express = require("express");
const { connect } = require("react-redux");
const pool = require("../config");

const router = express.Router();

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
router.post('/:blogId/comments', async function (req, res, next) {
    const { comment, like } = req.body
    const blog_id = req.params.blogId
    const [rows, fields] = await pool.query(
        'INSERT INTO comments(comment, `like`, blog_id) VALUES (?, ?, ?)',
        [comment, like, blog_id]
    )
    const [comments, column] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.blogId]
    )
    console.log(rows)
    res.json({
        message: `Comment ID ${rows.insertId} is updated.`,
        comment: {
            comment: comments[0].comment,
            like: comments[0].like,
            comment_date: comments[0].comment_date,
            comment_by_id: comments[0].comment_by_id,
            blog_id: comments[0].blog_id
        }

    })
});

// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
    const comment = req.body
    console.log(comment.like)
    const [rows, fields] = await pool.query(
        'UPDATE comments SET comment = ?, `like` = ? WHERE id = ?',
        [comment.comment, comment.like, req.params.commentId]
    )
    const [comments, column] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    console.log(rows)
    res.json({
        message: `Comment ID ${req.params.commentId} is updated.`,
        comment: {
            comment: comments[0].comment,
            like: comments[0].like,
            comment_date: comments[0].comment_date,
            comment_by_id: comments[0].comment_by_id,
            blog_id: comments[0].blog_id
        }

    })
});

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
    console.log(req.params)
    const [rows, fields] = await pool.query(
        'DELETE FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    const [comments, column] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    res.json({
        message: `Comment ID ${req.params.commentId} is deleted.`,
    })
});

// Delete comment
router.put('/comments/addlike/:commentId', async function (req, res, next) {
    const [like, col] = await pool.query(
        'SELECT `like` FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    let yee = ++like[0].like
    console.log(like[0].like)
    const [rows, fields] = await pool.query(
        'UPDATE comments SET `like` = ? WHERE id = ?',
        [yee, req.params.commentId]
    )
    console.log(yee)
    const [comments, column] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    res.json({
        blogId: comments[0].blog_id,
        commentId: comments[0].id,
        likeNum: comments[0].like
    })
});
//Dislike
router.put('/comments/dislike/:commentId', async function (req, res, next) {
    const [like, col] = await pool.query(
        'SELECT `like` FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    let yee = --like[0].like
    console.log(like[0].like)
    const [rows, fields] = await pool.query(
        'UPDATE comments SET `like` = ? WHERE id = ?',
        [yee, req.params.commentId]
    )
    console.log(yee)
    const [comments, column] = await pool.query(
        'SELECT * FROM comments WHERE id = ?',
        [req.params.commentId]
    )
    res.json({
        blogId: comments[0].blog_id,
        commentId: comments[0].id,
        likeNum: comments[0].like
    })
});


exports.router = router