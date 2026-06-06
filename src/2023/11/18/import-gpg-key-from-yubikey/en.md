---
title: "Importing a GPG Public Key from YubiKey"
date: 2023-11-18 20:30:00 +0000
---

This post mainly references [this blog post](https://www.nicksherlock.com/2021/08/recovering-lost-gpg-public-keys-from-your-yubikey/) and [this guide](https://github.com/drduh/YubiKey-Guide/tree/master). Here is a short summary.

```shell
# reset all gpg data
rm -r ~/.gnupg

# list key on YubiKey
gpg --card-status --with-keygrip

# get the date time of the key above and generate pub key with the date above
gpg --faked-system-time '20231112T191616!' --full-generate-key

# import the subkeys, use `addkey` in the prompt
gpg --faked-system-time '20231112T191616!' --edit-key A83F5C04715B2C25DB2FBEA7DBBF1C31DD587CC6

# export key
gpg --armor --export A83F5C04715B2C25DB2FBEA7DBBF1C31DD587CC6

# import key
gpg --import keys/*

# trust key, use the trust command in the prompt
gpg --edit-key A83F5C04715B2C25DB2FBEA7DBBF1C31DD587CC6

# admin the yubikey
gpg --card-edit

# encrypt
gpg --encrypt \
  --recipient BE387B4AEF2E85A025C0EAF8A603F43145D6FC6D \
  --recipient A83F5C04715B2C25DB2FBEA7DBBF1C31DD587CC6 \
  --output output.gpg \
  input_file.txt

# list the encrypted file
gpg --pinentry-mode cancel --list-packets file.gpg
```
