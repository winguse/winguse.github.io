---
layout: post
title: "Bash script to backup data to Dropbox"
date: 2014-03-22 15:44:34 +0000
---

My blog is seldom updated now, for various reasons. The most likely thing I want to complain about is the busy work, but honestly speaking, just because I become a little lazy.

Backing up my data is to avoid tears down when losing them. Though my blog is seldom updated, but something like RSS reading never stop. I need to backup the articles I stared or marked, or some code I wrote on this server.

For uploading data to Dropbox, I am leveraging a existing project on Github: [Dropbox Uploader](https://github.com/andreafabrizi/Dropbox-Uploader), really awesome and easy to setup. Also express my thanks to Dropbox's API is so open that I can easily create a App access. (Comparing to some other domestic cloud services companies' annoying steps.)

I am here to share the code of backing up the data. As this is just a very simple script, may be you can consider as I just pasted here for my own note here:

```bash
#!/bin/bash
cd ${0%/*}
 
DATE=`date +%Y-%W`
TO_DELETE_DATE=`date --date="21 days ago" +%Y-%W`
user=root
userPWD=REPLACE_TO_YOUR_SECRET
encryptPWD=REPLACE_TO_YOUR_SECRET
www=/var/www
 
echo Date pattern: $DATE
 
echo Backup database...
mysqldump -u$user -p$userPWD \
--opt --default-character-set=utf8 --extended-insert=false \
--triggers -R --hex-blob --all-databases \
--events \
-x | gzip -c | openssl des3 -salt -k $encryptPWD > $DATE.db.des3
 
echo Backup $www
tar -czf - -C $www . | openssl des3 -salt -k $encryptPWD > $DATE.www.des3
 
echo Delete old backup
./dropbox_uploader.sh list | grep "$TO_DELETE_DATE" && echo Deleting $TO_DELETE_DATE && ./dropbox_uploader.sh $TO_DELETE_DATE
 
./dropbox_uploader.sh mkdir $DATE
echo Uploading database backup..
./dropbox_uploader.sh upload $DATE.db.des3 $DATE/$DATE.db.des3
rm $DATE.db.des3
 
echo Uploading www backup..
./dropbox_uploader.sh upload $DATE.www.des3 $DATE/$DATE.www.des3
rm $DATE.www.des3
 
echo DONE
```

For decrypt:

```bash
#!/bin/bash
DATE=2014-11
encryptPWD=REPLACE_TO_YOUR_SECRET
rm -R $DATE
mkdir $DATE
cd $DATE
openssl des3 -d -salt -k $encryptPWD -in ../$DATE.db.des3 | gzip -d -c > MYSQL_DUMP.sql
mkdir www
cd www
openssl des3 -d -salt -k $encryptPWD -in ../../$DATE.www.des3 | tar -xzf -
```

And for crontab:

```
0 18 * * 2 /YOUR_PATH_TO/backup.sh  2>&1 >> /YOUR_PATH_TO/backup.log
```

My script will only storage the recent three weeks' back, the old one will be deleted. You know, Dropbox only provides me 2 GB of storage, it really small for backup. And if you want to have a new Dropbox account, and having more space in the beginning of registration, please register by following this link: [https://db.tt/9thpxUsR](https://db.tt/9thpxUsR), both you and me can earn 500 MB. Though it's still too small, comparing to domestic companies' 2 TB in size. But on the other hand, comparing to upload data to domestic cloud services, maybe we can remove the code of encrypt when uploading to Dropbox.

Just for your ideas. :D
