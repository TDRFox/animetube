#!/bin/sh
INPUT="$1"
OUTDIR="$2"
mkdir -p "$OUTDIR"
ffmpeg -y -i "$INPUT" \
  -preset veryfast -g 48 -sc_threshold 0 \
  -map v:0 -map a:0 -c:v:0 libx264 -b:v:0 2500k -maxrate:v:0 2675k -bufsize:v:0 3750k -vf "scale=w=1280:h=720:force_original_aspect_ratio=decrease" \
  -map v:0 -map a:0 -c:v:1 libx264 -b:v:1 1200k -maxrate:v:1 1260k -bufsize:v:1 1800k -vf "scale=w=854:h=480:force_original_aspect_ratio=decrease" \
  -map v:0 -map a:0 -c:v:2 libx264 -b:v:2 600k -maxrate:v:2 660k -bufsize:v:2 900k -vf "scale=w=640:h=360:force_original_aspect_ratio=decrease" \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "$OUTDIR/segment_%v_%03d.ts" \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  "$OUTDIR/stream_%v.m3u8"
ffmpeg -y -i "$INPUT" -ss 00:00:05 -vframes 1 "$OUTDIR/thumbnail.jpg"
