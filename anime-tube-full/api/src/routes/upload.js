const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { v4: uuidv4 } = require('uuid');
const S3 = require('../lib/s3');
// very small Queue stub (in prod use BullMQ & Redis)
const Queue = { add: async ()=> true };

router.post('/', upload.single('video'), async (req, res) => {
  try {
    // In real usage validate auth (JWT), file size/types etc.
    if(!req.file) return res.status(400).json({ ok:false, error: 'no file' });
    const id = uuidv4();
    const key = `raw/${id}.mp4`;
    await S3.putObject({ Key: key, Body: req.file.buffer, ContentType: req.file.mimetype });
    // here you'd save metadata in DB
    await Queue.add('transcode', { videoId: id, key });
    res.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
