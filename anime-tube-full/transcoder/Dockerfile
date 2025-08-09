FROM jrottenberg/ffmpeg:5-alpine
WORKDIR /work
COPY transcode.sh /work/transcode.sh
RUN chmod +x /work/transcode.sh
ENTRYPOINT ["/work/transcode.sh"]
