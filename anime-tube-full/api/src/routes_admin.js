const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware_auth');
const { v4: uuidv4 } = require('uuid');
const S3 = require('../lib/s3');

// Presign a PUT URL for S3-compatible storage (MinIO/R2)
router.post('/presign', requireAdmin, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if(!filename) return res.status(400).json({ ok:false, error:'filename required' });
    const key = `raw/${uuidv4()}-${filename}`;
    const params = { Key: key, ContentType: contentType || 'application/octet-stream', Expires: 60*10 };
    // Using AWS SDK v2 getSignedUrl
    const url = S3.getSignedUrl('putObject', { Key: params.Key, ContentType: params.ContentType, Expires: params.Expires });
    // Note: getSignedUrl returns a URL string synchronously in AWS SDK v2
    res.json({ ok:true, key, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Admin action: approve/reject
router.post('/action', requireAdmin, async (req, res) => {
  try {
    const { videoId, action, reason } = req.body;
    if(!videoId || !action) return res.status(400).json({ ok:false, error:'videoId and action required' });
    // TODO: perform DB update, move files, notify uploader, etc.
    console.log('Admin action', req.user?.sub, action, videoId, reason);
    // For demo: save a small log file to S3
    const logKey = `admin_logs/${videoId}-${Date.now()}.txt`;
    const body = `admin:${req.user?.sub}\naction:${action}\nreason:${reason || ''}\ndate:${new Date().toISOString()}`;
    await S3.putObject({ Key: logKey, Body: body, ContentType: 'text/plain' });
    res.json({ ok:true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Generate DMCA report (simple text) and return a signed URL to download
router.post('/dmca', requireAdmin, async (req, res) => {
  try {
    const { videoId, complainant, contact, reason } = req.body;
    if(!videoId || !complainant || !contact) return res.status(400).json({ ok:false, error:'videoId, complainant and contact required' });
    const id = uuidv4();
    const content = [
      `DMCA Takedown Notice - ${new Date().toISOString()}`,
      `Video ID: ${videoId}`,
      `Complainant: ${complainant}`,
      `Contact: ${contact}`,
      `Reason: ${reason || ''}`,
      '',
      'I declare under penalty of perjury that the information in this notification is accurate and that I am the owner of an exclusive right that is allegedly infringed.',
      '',
      'Signature: __________________'
    ].join('\n');
    const key = `dmca/${id}.txt`;
    await S3.putObject({ Key: key, Body: content, ContentType: 'text/plain' });
    // Generate signed URL (short-lived)
    const url = S3.getSignedUrl('getObject', { Key: key, Expires: 60*60 });
    res.json({ ok:true, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

module.exports = router;
