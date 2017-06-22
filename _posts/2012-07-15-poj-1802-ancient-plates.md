---
layout: post
title: "POJ 1802 Ancient Plates"
date: 2012-07-15 14:32:23 +0000
---

今天写了这个模拟题，目的仅仅是为了练练C++模板类和继承。题目就是对行、单词、字母的旋转、调换操作。

写的时候，一直超时，自己测试的时候，发现编译优化都开了，代码的效率提升了3倍多（时间1.4s变成0.3s），于是知道自己有好多地方常数写得太大了，当然，有可能是我自己继承的是STL双向队列那个容器效率比较低。

输入注意有空行。而且调换操作的输入不好控制。

其他唯一值得一提的，就是最后让我ac的那个优化，将所有的旋转操作都延迟，当每次调换的时候，计算出旋转后相对位置来调换。

```c++
#include <cstdio>
#include <cstring>
#include <deque>
using namespace std;

template <class T>
class AncientPlates:public deque<T>{
public:
    int count;
    AncientPlates(){count=0;}
    void shift(int k){
        if(this->size()<=1)return;
        count+=k;
    }
    void shift(){
        if(count==0)return;
        if(count<0){
            count=this->size()-((-count)%this->size());
        }
        count%=this->size();//count=0;return;
        for(int i=0;i<count;i++){
            this->push_back(this->front());
            this->pop_front();
        }
        count=0;
    }
    void perm(int from,int to){
        from--,to--;
        if(from<0||from>=this->size())return;
        if(to<0||to>=this->size())return;
    //  shift();

        if(count<0){
            count=this->size()-((-count)%this->size());
        }
        from=(count+from)%this->size();
        to=(count+to)%this->size();

        swap((*this)[from],(*this)[to]);
    }
};

typedef AncientPlates< char > Word;
typedef AncientPlates< Word > Line;
typedef AncientPlates< Line > Article;

Word word;
Word::iterator wi;
Line line;
Line::iterator li;
Article article;
Article::iterator ai;

void print(){
    article.shift();
    for(ai=article.begin();ai!=article.end();ai++){
        ai->shift();
        for(li=ai->begin();li!=ai->end();){
            li->shift();
            for(wi=li->begin();wi!=li->end();wi++){
                putchar(*wi);
            }
            li++;
            if(li==ai->end())break;
            putchar(' ');
        }
        putchar('n');
    }
    putchar('n');
}

int main(){
//  freopen("in.txt","r",stdin);freopen("o3","w",stdout);
    int i,j,ts,cs,l,o,from,to,count,pos;
    char t[2000],s[2000];
    scanf("%d",&ts);
    for(cs=1;cs<=ts;cs++){
        scanf("%d",&l);getchar();
        article.clear();
        for(i=0;i<l;i++){
            gets(t);
            line.clear();
            pos=0;
            while(true){
                if(t[pos]=='')break;
                word.clear();
                for(;t[pos]!=' '&&t[pos]!='';pos++)
                    word.push_back(t[pos]);
                line.push_back(word);
                if(t[pos]=='')break;
                pos++;
            }
            article.push_back(line);
        }
        scanf("%d",&o);
        for(i=0;i<o;i++){
            scanf("%s%s",t,s);
            if(t[0]=='S'){
                scanf("%d",&count);
                if(s[0]=='L'){
                    article.shift(count);
                }else if(s[0]=='W'){
                    for(ai=article.begin();ai!=article.end();ai++){
                        ai->shift(count);
                    }
                }else{
                    for(ai=article.begin();ai!=article.end();ai++){
                        for(li=ai->begin();li!=ai->end();li++){
                            li->shift(count);
                        }
                    }
                }
            }else{
                gets(t);
                pos=0;
                while(true){
                    if(t[pos]=='')break;
                    if(t[pos]==' ')pos++;
                    if(!sscanf(t+pos,"%d,%d",&from,&to))break;
                    while(t[pos]!=''&&t[pos]!=' ')pos++;
                    if(s[0]=='L'){
                        article.perm(from,to);
                    }else if(s[0]=='W'){
                        for(ai=article.begin();ai!=article.end();ai++){
                            ai->perm(from,to);
                        }
                    }else{
                        for(ai=article.begin();ai!=article.end();ai++){
                            for(li=ai->begin();li!=ai->end();li++){
                                li->perm(from,to);
                            }
                        }
                    }
                }
            }
        }
        printf("Scenario #%d:n",cs);
        print();
    }
    return 0;
}
```

如果不按照命名规则来写的话，用模板类来写，这个代码是可以控制在2k一下的，不过，嘻嘻，就是没有，我这个代码也是POJ上最短的。但是，时间效率太低。
