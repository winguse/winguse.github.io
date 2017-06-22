---
layout: post
title: "HDU 4441 Queue Sequence （2012亚洲区天津站K题）"
date: 2012-11-01 09:21:52 +0000
---

这个题目是我在现场看的第一个题目，一看就知道是平衡树，可是当时就没写过，因为本水鸟实在是菜中之菜加上各种状态差，水题都没写完，比赛就结束了，于是天津站挂了个铁牌。

题意就是维护一个队列的操作序列，正数表示队列插入，负数表示队列弹出。维护队列序列的操作如下：

1. 插入，插入一个入队和出队操作，元素是这个序列里面最小没出现过的正整数，入队位置为给定的p，出队位置在保证合法的情况下尽可能靠右。元素是什么显然用个线段树搞维护——我真心不想写线段树，但是没想到别的好办法。整个序列我是用SBT（见神牛陈启峰论文，话说我不会写splay，但是看SBT也就是今天才搞明白）维护的，元素在这个平衡树里面是按照位置关键字放的，也就是说，左儿子的位置<父亲的位置<右儿子的位置，并写了个反向指针。这样子可以很容易维护出当前节点左边正数的个数、负数的个数、所有数的和。
2. 删除元素i，就是把i和-i都干掉。我用了一个索引表，能够快速找到i和-i在平衡树里面的节点（因为i只在1～100000之间，如果不然的话，在来个平衡树做做索引吧，当然，这个就别手写了，用STL的map吧）。找到该节点后，回溯找到位置，调用删除函数即可。
3. 求i～-i的和，开区间，显然，用上面的办法从索引表中找到两个节点，统计一下sum相减一下即可。

我不会告诉你，这个题写了我整整一天，而且，被卡的地方居然是没用long long不能1A……整整6k的代码啊……现场估计本菜鸟我写不出来的。

```c++
#include <cstdio>
#include <algorithm>
#include <queue>
using namespace std;
typedef __int64 ll;
const int maxn = 101000;
int n;
namespace SBT {
struct Node {
    int key, s, p, n;
    ll sum;
    Node *left, *right, *parent;
    Node(int a): s(1), left(NULL), right(NULL), parent(NULL), key(a) , sum(a) {
        if(key > 0)p = 1, n = 0;
        else p = 0, n = 1;
    }
};
Node *posNode[maxn], *negNode[maxn];
inline int s(Node *t) {
    return t == NULL ? 0 : t->s;
}
inline int p(Node *t) {
    return t == NULL ? 0 : t->p;
}
inline int n(Node *t) {
    return t == NULL ? 0 : t->n;
}
inline ll sum(Node *t) {
    return t == NULL ? 0 : t->sum;
}
void update(Node *t) {
    if(!t)return;
    t->s = s(t->left) + s(t->right) + 1;
    t->p = p(t->left) + p(t->right);
    t->n = n(t->left) + n(t->right);
    if(t->key > 0) t->p++;
    else t->n++;
    t->sum = sum(t->left) + sum(t->right) + t->key;
};
void rr(Node *&t) {
    Node *k = t->left;
    t->left = k->right;
    if(k->right)k->right->parent = t;
    k->right = t;
    k->parent = t->parent;
    t->parent = k;
    update(t);
    update(k);
    t = k;
}
void lr(Node *&t) {
    Node *k = t->right;
    t->right = k->left;
    if(k->left)k->left->parent = t;
    k->left = t;
    k->parent = t->parent;
    t->parent = k;
    update(t);
    update(k);
    t = k;
}
void insert(Node *&t, Node *k, int pos, Node *parent = NULL) {
    if(t == NULL) {
        t = k;
        k->parent = parent;
    } else if(pos <= s(t->left)) {
        insert(t->left, k, pos, t);
        if(s(t->left->left) > s(t->right))
            rr(t);
    } else {
        insert(t->right, k, pos - s(t->left) - 1, t);
        if(s(t->right->right) > s(t->left))
            lr(t);
    }
    update(t);
}
Node findmin(Node *t) {
    while(t->left != NULL)t = t->left;
    return *t;
}
void remove(Node *&t, int pos) {
    if(t == NULL)return;
    int leftSize = s(t->left);
    Node *k = NULL;
    if(pos == leftSize) {
        if(t->right == NULL) {
            k = t->left;
            if(k)k->parent = t->parent;
            delete t;
            t = k;
        } else {
            Node tmp = findmin(t->right);
            remove(t->right, 0);
            tmp.left = t->left;
            tmp.right = t->right;
            tmp.parent = t->parent;
            *t = tmp;
            if(tmp.key > 0)
                posNode[tmp.key] = t;
            else
                negNode[-tmp.key] = t;
        }
    } else if(pos < leftSize) {
        remove(t->left, pos);
    } else {
        remove(t->right, pos - leftSize - 1);
    }
    update(t);
}
void midOrder(Node *t) {
    if(t == NULL)return;
    midOrder(t->left);
    printf("%d ", t->key);
    static queue<int> que;
    if(t->key>0){
        que.push(t->key);
    }else{
        if(que.front()!=-t->key){
            while(true)
                puts("Error que");
        }
        que.pop();
    }
    midOrder(t->right);
}
void del(Node *&t) {
    if(t == NULL)return;
    del(t->left);
    del(t->right);
    delete t;
    t=NULL;
}
void count(Node *k, int &negCount, int &posCount, int &allCount,ll &allSum) {
    if(!k)return;
    negCount = n(k->left);
    posCount = p(k->left);
    allCount = s(k->left);
    allSum = sum(k->left);
    while(k->parent != NULL) {
        if(k->parent->right == k) {
            posCount += p(k->parent) - p(k);
            negCount += n(k->parent) - n(k);
            allCount += s(k->parent) - s(k);
            allSum += sum(k->parent) - sum(k);
        }
        k = k->parent;
    }
}
};

namespace ST {
int s[maxn<<2];
void update(int val, int l, int r, int root) {
    if(l == r) {
        if(s[root]) { //insert
            s[root] = 0;
        } else { //delete
            s[root] = l;
        }
        return;
    }
    int m = (l + r) >> 1;
    if(val <= m)
        update(val, l, m, root << 1);
    else
        update(val, m + 1, r, root << 1 | 1);
    if(s[root<<1])
        s[root] = s[root<<1];
    else
        s[root] = s[root<<1|1];
}
int get() {
    int ret = s[1];
    update(ret, 1, n, 1);
    return ret;
}
void del(int x) {
    update(x, 1, n, 1);
}
void init(int l, int r, int root) {
    if(l == r) {
        s[root] = l; //not exist
        return;
    }
    int m = (l + r) >> 1;
    init(l, m, root << 1);
    init(m + 1, r, root << 1 | 1);
    s[root] = s[root<<1];
}
void init() {
    init(1, n, 1);
}
}

int main() {
    int i, j, x;
    int allCount, posCount, negCount, pos, nc,cs=1;
    ll ans,sum;
    SBT::Node *head = NULL, *k;
//  while(~scanf("%d%d", &x, &i)) {
//      if(x >= 0) {
//          SBT::Node *k = new SBT::Node(i);
//          SBT::insert(head, k, x);
//      } else {
//          SBT::remove(head, -x);
//      }
//      SBT::midOrder(head);
//      puts("");
//  }
    char op[100];
    while(~scanf("%d", &n)) {
        printf("Case #%d:\n",cs++);
        ST::init();
        SBT::del(head);
        for(int ii = 0; ii < n; ii++) {
            scanf("%s%d", op, &x);
            switch(op[0]) {
            case 'q':
                k = SBT::posNode[x];
                SBT::count(k, negCount, posCount, allCount, sum);
                k = SBT::negNode[x];
                SBT::count(k, negCount, posCount, allCount, ans);
                ans-=sum+x;
                printf("%I64d\n",ans);
                break;
            case 'i':
                i = ST::get();
                k = new SBT::Node(i);
                SBT::posNode[i] = k;
                SBT::insert(head, k, x);
//              printf("inserted positive : ");SBT::midOrder(head);puts("");puts("count:");
                SBT::count(k, negCount, posCount, allCount, sum);
//              printf("n = %d, p = %d, a = %d\n", negCount, posCount, allCount);
                k = head;
                nc = posCount;
                pos = 0;
                while(k != NULL) {
                    int negLeft = SBT::n(k->left);
                    if(nc < negLeft) {
                        k = k->left;
                    } else {
                        nc -= SBT::n(k) - SBT::n(k->right);
                        pos += SBT::s(k) - SBT::s(k->right);
                        if(nc < 0) {
                            pos--;
                            break;
                        }
                        k = k->right;
                    }
                }
//              printf("nc = %d, pos = %d\n", nc, pos);
                k = new SBT::Node(-i);
                SBT::negNode[i] = k;
                SBT::insert(head, k, pos);
//              printf("inserted negative : ");SBT::midOrder(head);puts("");
                break;
            case 'r':
                ST::del(x);
                k = SBT::posNode[x];
                SBT::count(k, negCount, posCount, allCount, sum);
//              printf("remove positive %d at %d : ", k->key, allCount);
                SBT::remove(head, allCount);
//              SBT::midOrder(head);puts("");
                k = SBT::negNode[x];
                SBT::count(k, negCount, posCount, allCount, sum);
//              printf("remove negative %d at %d : ", k->key, allCount);
                SBT::remove(head, allCount);
//              SBT::midOrder(head);puts("");
                break;
            }
        }
    }
    return 0;
}
```
