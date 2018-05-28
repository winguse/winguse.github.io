---
layout: post
title: "Tubi TV IPv6"
date: 2018-05-28 18:50:00 +0800
---

> 今天终于把倒腾了一个月的 PR 给 merge 了，真是酸爽…

## 背景

[我司](https://tubitv.com)主站因为要适配一些客户端，厂商要求我们支持 IPv6。我司目前基础设施都是基于代码的（Code As Infrastructure），目前使用的套件是 [Terraform](https://www.terraform.io) 。所以，我就开始了我的折腾之旅…

## Terraform 的改动

其实这个很简单：

- 在 VPC 的配置中，加入 `assign_generated_ipv6_cidr_block  =  true` 

- 在需要增加 IPv6 的子网中加上 `assign_ipv6_address_on_creation  =  true` 和 `ipv6_cidr_block  =  "${cidrsubnet(aws_vpc.YOUR_VPC.ipv6_cidr_block, 8, count.index + 1)}"`

  AWS 会自动分配一个 `/56` 的 IPv6 地址，所以直接再掩码 8 位就可以得到一个 `/64` 的地址

- 然后，增加一个 IPv6 的路由：

  ```json
  resource "aws_route" "public_ipv6" {
    route_table_id              = "${aws_route_table.YOUR_SUBNET.id}"
    destination_ipv6_cidr_block = "::/0"
    gateway_id                  = "${aws_internet_gateway.YOUR_GATEWAY.id}"
  }
  ```

- Portal 上手工添加 IPv6 地址。
  因为 IPv6 只是在创建机器的时候分配的，对于现有机器，就需要手工分配。此处手工创建不会对 Terraform 的 state 有影响。
  - 选择一个要添加地址的实例，点击右键：`Networking` / `Manage IP Addresses`
  - 在弹出的对话框中，下方的 `IPv6 Addresses` 点 `Assign new IP` ，确定即可

- 添加 Route 53 Health Check 以及 Route 53 的 AAAA 记录

  ```json
  resource "aws_route53_health_check" "health_check_ipv6" {
    count             = "${NGINX_EC2.instance_count}"
    ip_address        = "${element(NGINX_EC2.ipv6_addresses, count.index)}"
    port              = 1324
    type              = "HTTP_STR_MATCH"
    resource_path     = "/health"
    failure_threshold = "3"
    request_interval  = "30"
    search_string     = "healthy"
  }
  
  resource "aws_route53_record" "lb_pub_aaaa_record" {
    count           = "${NGINX_EC2.instance_count}"
    name            = "lb"
    type            = "AAAA"
    zone_id         = "${ZONE_ID}"
    set_identifier  = "lb-${format("%02d", count.index+1)}"
    ttl             = "300"
    health_check_id = "${element(aws_route53_health_check.health_check_ipv6.*.id, count.index)}"
    records         = ["${element(NGINX_EC2.ipv6_addresses, count.index)}"]
  
    weighted_routing_policy {
      weight = 10
    }
  }
  ```

- 最后，当然就是修改 security group 啦，此处不表。不过此处是个坑，添加 IPv6 的安全组的时候，Terraform 将会删掉原有的重建一个新的，导致了迁移过程中我们有大概 30 秒的 Downtime ，不过这个我们在线上环境才发现的，可以通过新建一个独立的安全组规避这个问题。

## Nginx 的改动

Nginx 默认没有监听 IPv6 网络的流量，所以要在所有的 listen 里面都加上 `[::]:`，也就是，写成这样：`listen [::]:80;`。我们可以用这个命令搞定：`sed -i 's/\(listen\s\+\)\([0-9]\+.*\)/\1\2 \1[::]:\2/g' *`。

## 系统设置

目前我们还跑着 Ubuntu 16.04 LTS，有以上的操作后，新启用的机器是不用修改的了，但是现有机器还是要一点配置：

- 新建一个文件 `/etc/network/interfaces.d/60-default-with-ipv6.cfg`:
  ```
  iface eth0 inet6 dhcp
  ```
  使系统可以自动获得 IPv6 地址。

- 重启一些网卡：`sudo ifdown eth0 ; sudo ifup eth0` ，此处有若干秒 Downtime ，当然可以采取 DNS 迁移流量的方式解决。

- 新建一个文件 `/etc/apt/apt.conf.d/99force-ipv4`:
  ```
  Acqire::ForceIPv4 "true";
  ```
  这样可以让 apt 只走 IPv4 。因为我们在 staging 发现的一个问题，security.ubuntu.com 虽然给了 IPv6 地址，但是 AWS 的网络目前并不能连接成功（部分其他运营商也有类似的问题）

## 测试

查看 DNS 是否正确解析：

```
dig AAAA tubitv.com @8.8.8.8
```

测试 IPv6 网络是否正常连接（确保本地有 IPv6）：

```
curl -6 https://tubitv.com
```

我们在 staging 环境上了一个月以发现有没有潜在的其他问题，目前看状态还好；生产环境持续观察中。