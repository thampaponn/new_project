const express = require('express');
const app = express();
const Joi = require('joi')
const pool = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

router = express.Router();
/** 
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
*/

const schema = Joi.object({
    title: Joi.string().required().error(new Error('ต้องกรอก title')),
    description: Joi.string().required().error(new Error('ต้องกรอก description')),
    due_date: Joi.date().iso().optional()
});

router.post('/todo', async (req, res) => {
    console.log(req.body)
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    const { title, description, due_date } = req.body;

    try {
        const [order] = await conn.query('SELECT MAX(`order`)+ 1 FROM todo');
        console.log(order[0]['MAX(`order`)+ 1']);
        const [InsertItem] = await conn.query('INSERT INTO todo (title, description, due_date, `order`) VALUES (?,?,?,?)',
            [title, description, due_date === null ? 'CURRENT_TIMESTAMP' : due_date, order[0]['MAX(`order`)+ 1']]
        )

        res.status(201).json({
            "message": "สร้าง ToDo 'อ่านหนังสือสอบ Web Pro' สำเร็จ",
            "todo": {
                "id": InsertItem.insertId,
                "title": title,
                "description": description,
                "due_date": due_date,
                "order": order[0]['MAX(`order`)+ 1']
            }
        })

    } catch (error) {
        res.status(400)
        conn.rollback()
    } finally {
        conn.release()
    }
})

router.get('/todo', async (req, res) => {
    const { start_date, end_date } = req.query;

    if (Object.keys(req.query).length === 0) {
        const [data] = await pool.query(`SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date  FROM todo WHERE due_date`)
        return res.json(data)

    } else {
        const [data] = await pool.query(`SELECT *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date  FROM todo WHERE due_date BETWEEN ? AND ?`, [start_date, end_date])
        return res.json(data)
    }
})

router.delete('/todo/:id', async (req, res, next) => {
    const [data1] = await pool.query('select * from todo where id = ?', [req.params.id])

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const [del] = await pool.query('delete from todo where id = ?', [req.params.id])
        res.status(200).send({
            "message": `ลบ ToDo '${data1[0].title}' สำเร็จ`,
        })
        conn.commit()
    } catch (err) {
        res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })
        conn.rollback()
    } finally {
        conn.release()
    }
})

app.use(router);
module.exports = app;
