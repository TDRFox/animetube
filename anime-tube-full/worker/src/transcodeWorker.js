// Minimal worker skeleton (for development)
const { Worker } = require('bullmq');
const { exec } = require('child_process');
const connection = { host: process.env.REDIS_HOST || 'redis', port: 6379 };
const worker = new Worker('transcode', async job => {
  const { videoId } = job.data;
  console.log('Received job for', videoId);
  // In real setup: download from S3, call ffmpeg (container or local), upload outputs, update DB.
  // Here we just simulate a delay.
  await new Promise(r => setTimeout(r, 2000));
  console.log('Job done', videoId);
  return { ok:true };
}, { connection });
console.log('Transcode worker started');
