---
title: "Setting Up a Podman Machine Bridge Network on macOS: A Step-by-Step Guide"
date: 2024-10-16 19:30:00 -0700
---

> 本文中文在后面

Running containers on macOS using Podman involves setting up a Linux virtual machine (VM) to handle the containers. However, when using a Docker Compose configuration with a `bridge` network, you may encounter challenges accessing the containers directly from macOS. This blog will guide you through how to set up a bridge network between your Podman VM and macOS using WireGuard, enabling direct access to your containers.

## Problem Overview

Let’s say you have a Docker Compose configuration like the one below, which defines a Redis leader and replica on a custom network:

```yaml
services:
  redis-leader:
    image: redis:6.2.6-alpine
    networks:
      my-net:
        ipv4_address: 10.2.2.100

  redis-replica:
    image: redis:6.2.6-alpine
    command: redis-server --replicaof redis-leader 6379
    depends_on:
      - redis-leader
    networks:
      my-net:
        ipv4_address: 10.2.2.101

networks:
  my-net:
    driver: bridge
    ipam:
      config:
      - subnet: 10.2.2.0/24
```

In this setup, you won’t be able to directly access the Redis containers from macOS because the bridge network only connects the containers inside the Podman VM, isolating them from the macOS host.

### Solution: Use WireGuard to Bridge Networks

To solve this problem, we will set up a WireGuard connection between the Podman VM and macOS. This setup allows macOS to communicate with containers running on the VM.

## Step 1: Install WireGuard on macOS

Start by installing the WireGuard tools on your macOS system using Homebrew:

```bash
brew install wireguard-tools
```

## Step 2: Generate Keys for WireGuard

Next, you need to generate two pairs of public and private keys—one for the Podman VM and one for macOS. Run the following command twice to generate the keys:

```bash
wg genkey | tee /dev/stderr | wg pubkey
```

The first line of the output will be the private key, and the second line will be the public key. Make sure to run this command twice to generate two sets of keys.

## Step 3: Configure WireGuard on macOS

After generating the keys, configure WireGuard on macOS. First, create the necessary directory:

```bash
sudo mkdir -p /opt/homebrew/etc/wireguard/
```

Then, create the configuration file `/opt/homebrew/etc/wireguard/wg0.conf`:

```bash
cat <<EOF > /opt/homebrew/etc/wireguard/wg0.conf
[Interface]
PrivateKey = <private key A> # private key for macOS
Address = 10.0.0.2/24 # WireGuard IP for macOS
ListenPort = 51820 # listening port for WireGuard
PostUp = ifconfig lo0 inet 100.64.64.64/30 100.64.64.64 alias
PostDown = ifconfig lo0 inet 100.64.64.64/30 100.64.64.64 delete

[Peer]
PublicKey = <public key B> # public key for Podman VM
AllowedIPs = 10.2.0.0/16, 10.0.0.1/32 # range of the bridge network
PersistentKeepalive = 25
EOF
```

The `AllowedIPs` field should match your Docker bridge network range. Start WireGuard on macOS using the following command:

```bash
sudo wg-quick up wg0
```

Check the status of WireGuard by running:

```bash
sudo wg
```

Keep in mind that after a reboot, you’ll need to run `sudo wg-quick up wg0` again to restart WireGuard.

## Step 4: Set Up WireGuard on the Podman VM

Next, log in to the Podman VM via SSH:

```bash
podman machine ssh
```

Create a WireGuard configuration file `/etc/wireguard/wg0.conf`:

```bash
cat << EOF > /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <private key B> # private key for the Podman VM
Address = 10.0.0.1/24 # WireGuard IP for Podman VM
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -i %i -j ACCEPT

[Peer]
PublicKey = <public key A> # public key for macOS
AllowedIPs = 10.0.0.2/32 # WireGuard IP for macOS
Endpoint = 100.64.64.64:51820
PersistentKeepalive = 25
EOF
```

Start WireGuard on the Podman VM with:

```bash
wg-quick up wg0
```

To ensure that WireGuard starts automatically whenever the Podman machine starts, enable it with:

```bash
systemctl enable wg-quick@wg0
```

## Step 5: Access the Containers from macOS

Once WireGuard is running on both macOS and the Podman VM, you should be able to access the containers directly from macOS. For example, to ping the Redis replica:

```bash
ping 10.2.2.101
```

You should receive a response like:

```bash
PING 10.2.2.101 (10.2.2.101): 56 data bytes
64 bytes from 10.2.2.101: icmp_seq=0 ttl=63 time=5.992 ms
```

## Conclusion

By configuring a WireGuard connection between your Podman VM and macOS, you can successfully bridge the network and access containers directly from your macOS host. This setup is particularly useful when working with isolated containers in a `bridge` network on macOS using Podman.

---

# 在macOS上设置Podman虚拟机桥接网络：逐步指南

在macOS上使用Podman运行容器时，涉及设置一个Linux虚拟机（VM）来处理容器。然而，当你使用一个`bridge`网络的Docker Compose配置时，可能会遇到无法直接从macOS访问容器的问题。本篇博客将指导您如何通过使用WireGuard在Podman虚拟机和macOS之间设置桥接网络，从而实现对容器的直接访问。

## 问题概述

假设您有如下的Docker Compose配置，它在自定义网络上定义了一个Redis主节点和副本：

```yaml
services:
  redis-leader:
    image: redis:6.2.6-alpine
    networks:
      my-net:
        ipv4_address: 10.2.2.100

  redis-replica:
    image: redis:6.2.6-alpine
    command: redis-server --replicaof redis-leader 6379
    depends_on:
      - redis-leader
    networks:
      my-net:
        ipv4_address: 10.2.2.101

networks:
  my-net:
    driver: bridge
    ipam:
      config:
      - subnet: 10.2.2.0/24
```

在这个设置中，您将无法直接从macOS访问Redis容器，因为桥接网络仅连接Podman虚拟机内部的容器，使它们与macOS主机隔离。

### 解决方案：使用WireGuard桥接网络

为了解决这个问题，我们将设置一个WireGuard连接，使Podman虚拟机和macOS之间的通信变得可能。这一设置允许macOS与运行在虚拟机中的容器进行通信。

## 第一步：在macOS上安装WireGuard

首先，使用Homebrew在macOS上安装WireGuard工具：

```bash
brew install wireguard-tools
```

## 第二步：为WireGuard生成密钥

接下来，您需要为Podman虚拟机和macOS分别生成两对公钥和私钥。运行以下命令两次以生成密钥：

```bash
wg genkey | tee /dev/stderr | wg pubkey
```

输出的第一行是私钥，第二行是公钥。请确保运行两次命令以生成两组密钥。

## 第三步：在macOS上配置WireGuard

生成密钥后，在macOS上配置WireGuard。首先，创建所需的目录：

```bash
sudo mkdir -p /opt/homebrew/etc/wireguard/
```

然后，创建配置文件 `/opt/homebrew/etc/wireguard/wg0.conf`：

```bash
cat <<EOF > /opt/homebrew/etc/wireguard/wg0.conf
[Interface]
PrivateKey = <private key A> # macOS的私钥
Address = 10.0.0.2/24 # macOS的WireGuard IP
ListenPort = 51820 # WireGuard监听端口
PostUp = ifconfig lo0 inet 100.64.64.64/30 100.64.64.64 alias
PostDown = ifconfig lo0 inet 100.64.64.64/30 100.64.64.64 delete

[Peer]
PublicKey = <public key B> # Podman虚拟机的公钥
AllowedIPs = 10.2.0.0/16, 10.0.0.1/32 # 桥接网络的范围
PersistentKeepalive = 25
EOF
```

`AllowedIPs`字段应与您的Docker桥接网络范围匹配。使用以下命令启动macOS上的WireGuard：

```bash
sudo wg-quick up wg0
```

通过运行以下命令检查WireGuard的状态：

```bash
sudo wg
```

请注意，重启后您需要再次运行`sudo wg-quick up wg0`来重新启动WireGuard。

## 第四步：在Podman虚拟机上设置WireGuard

接下来，通过SSH登录到Podman虚拟机：

```bash
podman machine ssh
```

创建WireGuard配置文件 `/etc/wireguard/wg0.conf`：

```bash
cat << EOF > /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <private key B> # Podman虚拟机的私钥
Address = 10.0.0.1/24 # Podman虚拟机的WireGuard IP
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -i %i -j ACCEPT

[Peer]
PublicKey = <public key A> # macOS的公钥
AllowedIPs = 10.0.0.2/32 # macOS的WireGuard IP
Endpoint = 100.64.64.64:51820
PersistentKeepalive = 25
EOF
```

在Podman虚拟机上启动WireGuard：

```bash
wg-quick up wg0
```

为了确保每次Podman虚拟机启动时WireGuard也自动启动，运行以下命令启用它：

```bash
systemctl enable wg-quick@wg0
```

## 第五步：从macOS访问容器

一旦macOS和Podman虚拟机上的WireGuard都运行起来，您就可以从macOS直接访问容器了。例如，要ping Redis副本：

```bash
ping 10.2.2.101
```

您应该收到如下响应：

```bash
PING 10.2.2.101 (10.2.2.101): 56 data bytes
64 bytes from 10.2.2.101: icmp_seq=0 ttl=63 time=5.992 ms
```

## 结论

通过在Podman虚拟机和macOS之间配置WireGuard连接，您可以成功地桥接网络并直接从macOS主机访问容器。这一设置在使用Podman在macOS上处理隔离的`bridge`网络中的容器时特别有用。

