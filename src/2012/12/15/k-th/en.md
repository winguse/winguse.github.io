---
title: "The k-th Number Topic"
date: 2012-12-15 15:38:10 +0000
---

## Problem description

Given many numbers, find the k-th smallest one.

I originally prepared this k-th-number problem because of a Microsoft interview question, mainly hoping first-year students would better understand quicksort by implementing it manually. But [STL sorting is extremely fast](http://www.cnblogs.com/imAkaka/articles/2407877.html), making it hard to \"stress\" with data, so this exercise turned out too painful for today's class of 2012 students. Optimizing by constant-factor tricks is also not very elegant.

## Different approaches

## Reference solution

The correct approach is to discard the side unrelated to `k` at each quicksort partition step. This gives an essentially linear expected solution, roughly `O(2n)` in expectation.

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

## STL approach

I only learned this approach later. It is slightly slower than the reference solution, but visually it should be the same underlying algorithm.

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

## Radix sort

Radix sort is usually the fastest sorting algorithm in this context. My own implementation had large constants; this version was written by moreD. It uses counting-style buckets with smaller constants, but is still a bit slower than the previous methods.

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

## Radix-like sorting

This one was written by Vici. The idea is similar to radix sort: use 2000 buckets for partial partitioning. This works well when value ranges are relatively fixed. Radix sort shares that property too.

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

## About test data

If `k` is very small or very large, a naive idea gives complexity `O(k*n)` or `O((n-k)*n)`. If you use a heap-like method, it can be `O(lg(k)*n)`.

So, to make it hard, I set `k` near `1000` around `10,000,000`…

Considering possible advantages from duplicate-handling algorithms, I also deduplicated the generated data... though not in a very advanced way.

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
