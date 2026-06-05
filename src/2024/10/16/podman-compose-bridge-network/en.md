---
title: "Setting Up a Podman Machine Bridge Network on macOS: A Step-by-Step Guide"
date: 2024-10-16 19:30:00 -0700
---

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
