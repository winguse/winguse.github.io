---
title: "第k数专题"
date: 2012-12-15 15:38:10 +0000
---

## 问题描述

给定很多个数，找出由小到大的第 k 个数。

第 k 数，本来是因为一道微软的面试题而想到的，主要希望大一的同学好好理解快排，自己手动实现一些而准备的。不过[STL 的快排写得实在是太快](http://www.cnblogs.com/imAkaka/articles/2407877.html)了，太难卡住了，所以此题作为今天 12 级的练习题，太费劲了。而且，卡常数什么的，实在不厚道也很恶心。

## 各种姿势的解法

## 标程

正确的做法是，在快排的时候，每隔次都把和第 k 无关的扔掉，这样子求，基本上能够获得一个线性的做法，期望复杂度大概 O(2n)这样子。

```c++
#include <algorithm>
#include <cstdio>
#include <functional>
#include <cctype>
using namespace std;
  
const int maxn = 2000010;
int n, k;
int data[maxn], ans;
  
template<class T>
void w_qsort(T arr[], int l, int h) {
    if(l > h)return;
    if(l > k || h < k)return;
    int ll = l, hh = h;
    if(h != l)
        swap(arr[l], arr[rand()%(h-l)+l]);
    T key = arr[ll];
    while(ll < hh) {
        while(ll < hh && arr[hh] > key)hh--;
        if(ll < hh)arr[ll++] = arr[hh];
        while(ll < hh && arr[ll] < key)ll++;
        if(ll < hh)arr[hh--] = arr[ll];
    }
    arr[ll] = key;
    if(ll == k) {
        ans = key;
        return;
    }
    w_qsort(arr, l, ll - 1);
    w_qsort(arr, ll + 1, h);
}
  
inline int getint() {
    int ret = 0;
    char tmp;
    while(!isdigit(tmp = getchar()));
    do {
        ret = (ret << 3) + (ret << 1) + tmp - '0';
    } while(isdigit(tmp = getchar()));
    return ret;
}
  
int main() {
    int i;
    while(~scanf("%d%d", &n, &k)) {
        k--;
        for(i = 0; i < n; i++)
            data[i]=getint();
        w_qsort(data, 0, n - 1);
        printf("%d\n", ans);
    }
    return 0;
}
```

## STL 做法

表示我也是后面才知道的，比标程稍微慢些。目测应该跟标程一个算法。

```c++
#include <algorithm>
#include <cstdio>
#include <functional>
#include <cctype>
using namespace std;
  
const int maxn = 2000010;
int n, k;
int data[maxn], ans;
  
inline int getint() {
    int ret = 0;
    char tmp;
    while(!isdigit(tmp = getchar()));
    do {
        ret = (ret << 3) + (ret << 1) + tmp - '0';
    } while(isdigit(tmp = getchar()));
    return ret;
}
  
int main() {
    int i;
    while(~scanf("%d%d", &n, &k)) {
        k--;
        for(i = 0; i < n; i++)
            data[i]=getint();
        nth_element(data,data+k,data+n);
        printf("%d\n", data[k]);
    }
    return 0;
}
```

## 基数排序

基数排序是最快的排序算法，不过我自己写的那个常数比较大，这里面的实现是请 moreD 写的。用计数法写，常数较小。比前面的稍慢了些。

```c++
#include <cstdio>
#include <cstring>
#include <cctype>
  
const int maxn = 20000010, base = (1 << 16) - 1;
int n, k , a[maxn], count[base + 1], temp[maxn];
  
void sort(int shift) {
    memset(count, 0, sizeof(count));
    for(int i = 0; i < n; i++) count[(a[i] >> shift) & base]++;
    for(int i = 1; i <= base; i++) count[i] += count[i - 1];
    for(int i = n - 1; i >= 0; i--) temp[--count[(a[i] >> shift) & base]] = a[i];
    memcpy(a, temp, sizeof(a));
}
  
inline int getint() {
    int ret = 0;
    char tmp;
    while(!isdigit(tmp = getchar()));
    do {
        ret = (ret << 3) + (ret << 1) + tmp - '0';
    } while(isdigit(tmp = getchar()));
    return ret;
}
  
int main() {
    int i;
    while(~scanf("%d%d", &n, &k)) {
        k--;
        for(i = 0; i < n; i++)
            a[i] = getint();
        sort(0);
        sort(16);
        printf("%d\n", a[k]);
    }
    return 0;
}
```

## 类基数排序

这个是 Vici 写的，思想跟基数排序差不多，用了 2000 个桶来装部分数据，这种处理方式对于数据范围固定的很有用。当然，基数排序也是这样子的。

```c++
#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <string>
#include <vector>
#include <queue>
#include <set>
#include <map>
#include <ctime>
  
#define inf 0x3f3f3f3f
#define Inf 0x3FFFFFFFFFFFFFFFLL
  
using namespace std;
inline int getint(){
    int ret=0;
    char tmp;
    while(!isdigit(tmp=getchar()));
    do{
        ret=(ret<<3)+(ret<<1)+tmp-'0';
    }while(isdigit(tmp=getchar()));
    return ret;
}
vector<int> v[2200];
int main() {
    int n, k;
    int a;
    while (~scanf("%d%d", &n, &k)) {
        for (int i = 0; i < 2200; ++i) v[i].clear();
        for (int i = 0; i < n; ++i) {
            a = getint();
            v[a / 1000000].push_back(a);
        }
        --k;
        int sz;
        for (int i = 0; i < 2200; ++i) {
            sz = v[i].size();
            if (k < sz) {
                sort(v[i].begin(), v[i].end());
                printf("%d\n", v[i][k]);
                break;
            }
            else k -= sz;
        }
    }
    return 0;
}
```

## 关于数据

如果说，k 特别小，或者 k 特别大，那么本题的复杂度最最朴素的想法可以是 O(k*n)或者 O((n-k)*n)；如果你想到了堆的类似物，还可以是 O(lg(k)\*n)。

所以，为了卡住大家，我数据 k 是 1kw 的 1000 附近……

考虑可能的查重算法优势，所以我做了去重处理……虽然不是很高级。

```c++
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <set>
using namespace std;
#define maxn 20000000
  
inline void swap(int *a,int *b){
    int t=*a;
    *a=*b;
    *b=t;
}
  
set<int> ex;
int n,arr[maxn];
  
int main(){
    srand(time(NULL));
//  printf("%d\n",RAND_MAX);getchar();getchar();
    int i,k,ii,x;
    for(ii=0;ii<20;ii++){
        n=maxn;
        k=(n>>1)+rand()%(n/1000);
        printf("%d %d\n",n,k);
        ex.clear();
        for(i=0;i<n;i++){
            do{
                x=rand();
            }while(ex.find(x)!=ex.end());
            arr[i]=x;
            ex.insert(x);
        }
        for(i=0;i<n;i++){
            swap(&arr[i],&arr[i+rand()%(n-i)]);
        }
        for(i=0;i<n;i++){
            printf(" %d",arr[i]);
        }
        puts("");
    }
    return 0;
}
```
