---
layout: post
title:  "云蒙山的延时摄影"
date:   2017-05-14 23:00:00 +0800
---

在这个我大天朝开会关停工厂，连老天爷都给面子把沙尘暴错开的日子，一带一路蓝遍北京的好日子，自然不容辜负要出来玩咯。所以，我今天去了爬云蒙山。

几个延时摄影的片子可好看了，但是回家用电脑看的时候，发现了好多小虫子偶尔出现在画面中，作为一个程序员，这种事情肯定是忍无可忍啊：所以，必须处理掉。不过 `iMovie` 不能删除一个单独帧，程序员嘛，自己动手，丰衣足食，再说，我好歹也是小 [Tubi.tv](https://tubi.tv) 的程序员啊，不懂点 `ffmpeg` 怎么可以？！

首先，把视频导出成一帧帧的图片：

```bash
$ mkdir 99
$ ffmpeg -i IMG_0099.MOV 99/%5d.bmp
```

这里，我将图片导出成为 `bmp` 文件，首先速度快，再有呢，无损，缺点就是体积比较大，不过我硬盘大啊，嘿嘿。目前 `iPhone` 的延时摄影只能 `1080p` ，我也是今天才发现的，特别心疼我之前的都没用 `4k` 这个以后必须改。

然后，就是人肉删掉那些带虫子的帧，随便搞一个图片预览工具，然后快速切换就很容易发现它们。此处应该有自动化的算法，不过我不才，也没去找，突然变化的小黑点应该是容易的。

然后，合成新的视频：

先看看原来的编码情况：

```bash
$ ffprobe IMG_0099.MOV 
ffprobe version 3.1.4 Copyright (c) 2007-2016 the FFmpeg developers
  built with Apple LLVM version 8.0.0 (clang-800.0.38)
  configuration: --prefix=/usr/local/Cellar/ffmpeg/3.1.4 --enable-shared --enable-pthreads --enable-gpl --enable-version3 --enable-hardcoded-tables --enable-avresample --cc=clang --host-cflags= --host-ldflags= --enable-opencl --enable-libx264 --enable-libmp3lame --enable-libxvid --enable-libfaac --enable-libfdk-aac --disable-lzma --enable-nonfree --enable-vda
  libavutil      55. 28.100 / 55. 28.100
  libavcodec     57. 48.101 / 57. 48.101
  libavformat    57. 41.100 / 57. 41.100
  libavdevice    57.  0.101 / 57.  0.101
  libavfilter     6. 47.100 /  6. 47.100
  libavresample   3.  0.  0 /  3.  0.  0
  libswscale      4.  1.100 /  4.  1.100
  libswresample   2.  1.100 /  2.  1.100
  libpostproc    54.  0.100 / 54.  0.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'IMG_0099.MOV':
  Metadata:
    major_brand     : qt  
    minor_version   : 0
    compatible_brands: qt  
    creation_time   : 2017-05-14 04:48:52
    com.apple.quicktime.location.ISO6709: +40.5591+116.6984+1070.833/
    com.apple.quicktime.make: Apple
    com.apple.quicktime.model: iPhone 7 Plus
    com.apple.quicktime.software: 10.3.1
    com.apple.quicktime.creationdate: 2017-05-14T12:22:51+0800
  Duration: 00:00:26.00, start: 0.000000, bitrate: 18987 kb/s
    Stream #0:0(und): Video: h264 (High) (avc1 / 0x31637661), yuvj420p(pc), 1920x1080, 18983 kb/s, 30 fps, 30 tbr, 600 tbn, 1200 tbc (default)
    Metadata:
      creation_time   : 2017-05-14 04:48:52
      handler_name    : Core Media Data Handler
      encoder         : H.264
```

可以看到，这个视频编码是 `yuvj420p`， 帧率 `30 fps`，编码率大概 `18983 kb/s`。所以，我执行这个命令：

```bash
$ ffmpeg -framerate 30 -pattern_type glob -i '99/*.bmp' -pix_fmt yuvj420p  -b:v 20000k -y IMG_0099_no-bug.mp4
ffmpeg version 3.1.4 Copyright (c) 2000-2016 the FFmpeg developers
  built with Apple LLVM version 8.0.0 (clang-800.0.38)
  configuration: --prefix=/usr/local/Cellar/ffmpeg/3.1.4 --enable-shared --enable-pthreads --enable-gpl --enable-version3 --enable-hardcoded-tables --enable-avresample --cc=clang --host-cflags= --host-ldflags= --enable-opencl --enable-libx264 --enable-libmp3lame --enable-libxvid --enable-libfaac --enable-libfdk-aac --disable-lzma --enable-nonfree --enable-vda
  libavutil      55. 28.100 / 55. 28.100
  libavcodec     57. 48.101 / 57. 48.101
  libavformat    57. 41.100 / 57. 41.100
  libavdevice    57.  0.101 / 57.  0.101
  libavfilter     6. 47.100 /  6. 47.100
  libavresample   3.  0.  0 /  3.  0.  0
  libswscale      4.  1.100 /  4.  1.100
  libswresample   2.  1.100 /  2.  1.100
  libpostproc    54.  0.100 / 54.  0.100
Input #0, image2, from '99/*.bmp':
  Duration: 00:00:25.63, start: 0.000000, bitrate: N/A
    Stream #0:0: Video: bmp, bgr24, 1920x1080, 30 tbr, 30 tbn, 30 tbc
[swscaler @ 0x7f9e3600aa00] deprecated pixel format used, make sure you did set range correctly
[libx264 @ 0x7f9e36001800] using cpu capabilities: MMX2 SSE2Fast SSSE3 SSE4.2 AVX FMA3 AVX2 LZCNT BMI2
[libx264 @ 0x7f9e36001800] profile High, level 4.1
[libx264 @ 0x7f9e36001800] 264 - core 148 r2699 a5e06b9 - H.264/MPEG-4 AVC codec - Copyleft 2003-2016 - http://www.videolan.org/x264.html - options: cabac=1 ref=3 deblock=1:0:0 analyse=0x3:0x113 me=hex subme=7 psy=1 psy_rd=1.00:0.00 mixed_ref=1 me_range=16 chroma_me=1 trellis=1 8x8dct=1 cqm=0 deadzone=21,11 fast_pskip=1 chroma_qp_offset=-2 threads=12 lookahead_threads=2 sliced_threads=0 nr=0 decimate=1 interlaced=0 bluray_compat=0 constrained_intra=0 bframes=3 b_pyramid=2 b_adapt=1 b_bias=0 direct=1 weightb=1 open_gop=0 weightp=2 keyint=250 keyint_min=25 scenecut=40 intra_refresh=0 rc_lookahead=40 rc=abr mbtree=1 bitrate=20000 ratetol=1.0 qcomp=0.60 qpmin=0 qpmax=69 qpstep=4 ip_ratio=1.40 aq=1:1.00
[mp4 @ 0x7f9e36000600] Using AVStream.codec to pass codec parameters to muxers is deprecated, use AVStream.codecpar instead.
Output #0, mp4, to 'IMG_0099_no-bug.mp4':
  Metadata:
    encoder         : Lavf57.41.100
    Stream #0:0: Video: h264 (libx264) ([33][0][0][0] / 0x0021), yuvj420p(pc), 1920x1080, q=-1--1, 20000 kb/s, 30 fps, 15360 tbn, 30 tbc
    Metadata:
      encoder         : Lavc57.48.101 libx264
    Side data:
      cpb: bitrate max/min/avg: 0/0/20000000 buffer size: 0 vbv_delay: -1
Stream mapping:
  Stream #0:0 -> #0:0 (bmp (native) -> h264 (libx264))
Press [q] to stop, [?] for help
frame=  769 fps= 19 q=-1.0 Lsize=   62865kB time=00:00:25.53 bitrate=20169.2kbits/s speed=0.628x     
video:62854kB audio:0kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 0.016767%
[libx264 @ 0x7f9e36001800] frame I:4     Avg QP:14.13  size:428372
[libx264 @ 0x7f9e36001800] frame P:200   Avg QP:18.82  size:179926
[libx264 @ 0x7f9e36001800] frame B:565   Avg QP:22.17  size: 47191
[libx264 @ 0x7f9e36001800] consecutive B-frames:  0.7%  3.9%  0.8% 94.7%
[libx264 @ 0x7f9e36001800] mb I  I16..4:  8.7% 42.6% 48.7%
[libx264 @ 0x7f9e36001800] mb P  I16..4:  4.9% 10.6%  5.3%  P16..4: 30.7% 30.3% 16.8%  0.0%  0.0%    skip: 1.5%
[libx264 @ 0x7f9e36001800] mb B  I16..4:  1.0%  1.4%  0.4%  B16..8: 43.5% 14.1%  3.8%  direct:13.1%  skip:22.6%  L0:37.3% L1:35.1% BI:27.6%
[libx264 @ 0x7f9e36001800] final ratefactor: 17.62
[libx264 @ 0x7f9e36001800] 8x8 transform intra:50.2% inter:51.6%
[libx264 @ 0x7f9e36001800] coded y,uvDC,uvAC intra: 48.7% 60.0% 21.5% inter: 42.6% 23.7% 1.0%
[libx264 @ 0x7f9e36001800] i16 v,h,dc,p: 15% 43% 16% 25%
[libx264 @ 0x7f9e36001800] i8 v,h,dc,ddl,ddr,vr,hd,vl,hu: 11% 25% 37%  3%  5%  3%  8%  2%  6%
[libx264 @ 0x7f9e36001800] i4 v,h,dc,ddl,ddr,vr,hd,vl,hu: 14% 22% 17%  6% 10%  6% 12%  5%  9%
[libx264 @ 0x7f9e36001800] i8c dc,h,v,p: 50% 30% 15%  5%
[libx264 @ 0x7f9e36001800] Weighted P-Frames: Y:4.5% UV:1.5%
[libx264 @ 0x7f9e36001800] ref P L0: 54.9% 19.5% 18.9%  6.5%  0.2%
[libx264 @ 0x7f9e36001800] ref B L0: 93.0%  5.7%  1.3%
[libx264 @ 0x7f9e36001800] ref B L1: 97.5%  2.5%
[libx264 @ 0x7f9e36001800] kb/s:20086.96
```

看一下还有没有其他 `Bug` ，没有就基本完工了。不过鉴于拍摄的时候有风，吹得手机在抖，再回去 `iMovie` 里面处理一下后期防抖。







