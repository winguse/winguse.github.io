---
title: "小试遗传算法"
date: 2012-06-22 03:08:12 +0000
---

有些日子了，人工智能的老师讲了遗传算法，用老师的话说，就是有策略地瞎蒙。

老师给我们留了个简单的作业，就是把书本的例子实现了。

我们用的教材是，清华大学出版的《人工智能及其应用》第四版，蔡自兴、徐光祐著。

做的例子是，书本 166 页的遗传算法求解举例，求：f(x)=x*sin(10*PI\*x)+1.0 在[-1,2]区间上面的最大值。

做图可以看 [这里](https://www.google.com/search?hl=zh-CN&newwindow=1&q=x*sin%28PI*10*x%29%2B1.0&oq=x*sin%28PI*10*x%29%2B1.0&aq=f&aqi=&aql=&gs_l=serp.3...2994703.2994703.0.2995923.1.1.0.0.0.0.212.212.2-1.1.0...0.0.EHfl8QwB-0g) ，Google 的做图，前提是，你用的是现代浏览器。

我写的代码如下，注释写了些了，应该挺好看懂的了。

```c++
#include <cstdio>
#include <cmath>
#include <cstdlib>//RAND_MAX rand()
#include <ctime>
 
//程序常量参数
const int
    maxGen=1000,//最大代数
    M=100,//种群限制
    bitLen=22,//二进制位宽
    mask=(1<<bitLen)-1,//二进制掩码，把多余的部分砍掉的
    genThreshold=10;//跳出循环的检查，如果这个数值制定的最近代都没什么改变，退出
const double
    pC=0.8,//交叉概率
    pM=0.1,//变异概率
    PI=acos(-1.0),//圆周率
    bestFitnessEsp=0.000001,//没什么变化的界定
    totalFitnessEsp=bestFitnessEsp*M;//同上，扩展到总体样本和
//变量
int currentI,gen;//当前的个体I，和现在第几代。
unsigned int oldPopulation[M],population[M],bestGen[maxGen];//新旧的两代，最优的基因
double possibility[M],fitness[M],bestFitness[maxGen],totalFitness[maxGen];//赌轮概率值，适应值，某代最优适应值，某代适应值之和
 
void printBit(unsigned int x){//二进制打印
    for(int i=31;i>=0;i--){
        if(1<<i&x)
            putchar('1');
        else
            putchar('0');
    }
}
 
double abs(double x){
    if(x<0)return -x;
    return x;
}
 
double f(double x){//函数，同时也是适应函数
    return x*sin(PI*10*x)+1.0;
}
 
double convert(unsigned int x){//二进制转换
    return double(x)/mask*3.0-1.0;
}
 
void populationInit(){//种群初始化
    for(int i=0;i<M;i++){
        population[i]=rand();//RAND_MAX = 32767，15个1，所以
        population[i]<<=15;//右移
        population[i]|=rand();//再加入15位
        population[i]&=mask;//去掉多余
    //  printBit(population[i]);
    }
}
 
bool canStop(){
    if(gen<genThreshold)//达到最大进化代数
        return false;
    if(maxGen<=gen)
        return true;
    bool ret=true;
    int lgen=gen-1;
    for(int i=gen-genThreshold;i<lgen;i++){//最优没啥变化
        ret=ret&&abs(bestFitness[lgen]-bestFitness[i])<bestFitnessEsp;
    }
    if(ret){
        puts("最优没啥变化，算法终止。");
        return true;
    }
    ret=true;
    for(int i=gen-genThreshold;i<lgen;i++){//总值没啥变化（平均）
        ret=ret&&abs(totalFitness[lgen]-totalFitness[i])<totalFitnessEsp;
    }
    if(ret){
        puts("总值没啥变化（平均），算法终止。");
    }
    return ret;
}
 
void countFitness(){
    totalFitness[gen]=0;
    bestFitness[gen]=0;
    for(int i=0;i<M;i++){
        oldPopulation[i]=population[i];
        fitness[i]=f(convert(population[i]));//适应值
        totalFitness[gen]+=fitness[i];//统计所有的适应值之和，两个用途，一个决定退出循环，因为适应值没啥变化，一个是计算概率，所以不去除个平均值出来了
        possibility[i]=totalFitness[gen];//概率范围，对于第i个，它的概率就是 possibility[i]-possibility[i-1]，赌轮的范围就是： possibility[i-1] ～ possibility[i]
        if(bestFitness[gen]<fitness[i]){//保存最优
            bestFitness[gen]=fitness[i];
            bestGen[gen]=population[i];
        }
    }
}
 
void copy(int from){//复制
    population[currentI]=oldPopulation[from];
    currentI++;
}
 
void cross(int a,int b){//交叉，书本介绍的价差只有一个交叉点，是不是太弱？不过简单，我喜欢。
    int pos=rand()%(bitLen-1)+1  ;
    unsigned int mask_1=(1<<pos)-1;
    unsigned int mask_0=~mask_1;
    population[currentI++]=(oldPopulation[a]&mask_1)|(oldPopulation[b]&mask_0);
    population[currentI++]=(oldPopulation[b]&mask_1)|(oldPopulation[a]&mask_0);
/*  printBit(mask_1);puts("");
    printBit(oldPopulation[a]);puts("");
    printBit(population[currentI-1]);puts("");
    printBit(oldPopulation[b]);puts("");
    printBit(population[currentI-2]);puts("");
    getchar();*/
}
 
void heteromorphosis(int from){//变异
    int pos=rand()%(bitLen-1);
    population[currentI++]=oldPopulation[from]^(1<<pos);
/*  printBit(1<<pos);puts("");
    printBit(oldPopulation[from]);puts("");
    printBit(population[currentI-1]);puts("");
    getchar();*/
}
 
int select(){//赌轮选择一个个体
    double p=totalFitness[gen]*rand()/RAND_MAX;
    int l=0,r=M-1,m;
    while(l<r){
        m=(l+r)>>1;
        if(possibility[m]<p){
            l=m+1;
        }else{
            r=m;
        }
    }
    if(!(p<possibility[m]&&p>possibility[m-1])){
        m=r;
    }
    /*//这部分用来检查二分的正确性的。
    if(m>=1){
        if(!(p<possibility[m]&&p>possibility[m-1])){
            printf("选择函数出错！#1 %f-%f-%f %f %dn",possibility[m-1],possibility[m],possibility[m+1],p,m);
            getchar();
        }
    }else{
        if(!(p<possibility[m])){
            printf("选择函数出错！#2 %f %fn",possibility[m],p);
            getchar();
        }
    }*/
    return m;
}
 
void inherit(){
    double p;
    currentI=0;
    while(currentI<M){
        p=double(rand())/RAND_MAX;//随机决定这次进行的操作
        if(p<pC){//0～pC，进行交叉
            cross(select(),select());
        }else if(p<pC+pM){//pC～pM 变异
            heteromorphosis(select());
        }else{//复制
            copy(select());
        }
    //  printBit(population[currentI-1]);puts("");
    }
}
 
int main(){
    srand((unsigned)time(NULL));//用时间初始化随机函数
    while(true){
        gen=0;
        populationInit();
        while(!canStop()){
            countFitness();
            printf("代数：%3d 基因：",gen);
            printBit(bestGen[gen]);
            printf(" f(%f) = %fn",convert(bestGen[gen]),bestFitness[gen]);
            inherit();
            gen++;
        }
        puts("nn计算完成，按回车再算一遍。");
        getchar();
        puts("nn");
    }
    return 0;
}
```

不过，测试的时候，发现这个算法的正确性是不保证的。

如果种群样本按照书本采取 50 个的时候，有比较大的概率得到的是 1.65 左右的这个解。如下图，我作图后发现，是一个较优解而已。代码里面，我把种群数量设置为 1000 了，基本都能得到解。不过让我想起了数值分析里面的二分法，效率比起这个算法高多了。
