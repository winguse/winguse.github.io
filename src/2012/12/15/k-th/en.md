---
title: "The k-th Number Topic"
date: 2012-12-15 15:38:10 +0000
---

## Problem description

Given many numbers, find the k-th smallest number.

The topic of the k-th number originally came to mind because of a Microsoft interview problem. My main hope was to help first-year students really understand quicksort by implementing some of it by hand. But [STL's quicksort is simply too fast](http://www.cnblogs.com/imAkaka/articles/2407877.html), making it hard to beat, so using this as today's exercise for the 2012 class was too much trouble. Besides, squeezing constants is really a bit mean and annoying.

## Various approaches

## Standard solution

The correct approach is to discard the parts unrelated to the k-th element during quicksort. Solving it this way basically gives a linear algorithm, with expected complexity around `O(2n)`.

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
## STL solution

I only learned this later. It is a bit slower than the standard solution. By inspection it should basically be the same algorithm as the standard solution.

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

Radix sort is the fastest sorting algorithm, but the constant factor in the version I wrote myself was relatively large. The implementation here was written by moreD. It uses counting sort, so the constant factor is smaller. It is still a bit slower than the previous approach.

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

This one was written by Vici. The idea is similar to radix sort: it uses 2000 buckets to hold partial data. This kind of processing is very useful when the data range is fixed. Of course, radix sort is like this too.

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
## About the data

If `k` is very small, or very large, then the most naive complexity for this problem can be `O(k*n)` or `O((n-k)*n)`; if you think of something similar to a heap, it can even be `O(lg(k)*n)`.

So, in order to make it hard for everyone, my test data puts `k` around 1000 when `n` is 10 million...

Considering that duplicate-checking algorithms might have an advantage, I also performed deduplication on the data... though it is not very sophisticated.

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