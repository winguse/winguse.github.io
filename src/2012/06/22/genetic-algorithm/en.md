---
title: "A Small Experiment with Genetic Algorithms"
date: 2012-06-22 03:08:12 +0000
---

Some days ago, our Artificial Intelligence teacher talked about genetic algorithms. In the teacher's words, it is "guessing blindly, but strategically."

The teacher gave us a simple assignment: implement the example from the textbook.

The textbook we used was the 4th edition of *Artificial Intelligence and Its Applications*, published by Tsinghua University Press, written by Cai Zixing and Xu Guangyou.

The example we implemented was the one on page 166 of the book: use a genetic algorithm to find the maximum of `f(x)=x*sin(10*PI*x)+1.0` over the interval `[-1,2]`.

You can see its graph [here](https://www.google.com/search?hl=zh-CN&newwindow=1&q=x*sin%28PI*10*x%29%2B1.0&oq=x*sin%28PI*10*x%29%2B1.0&aq=f&aqi=&aql=&gs_l=serp.3...2994703.2994703.0.2995923.1.1.0.0.0.0.212.212.2-1.1.0...0.0.EHfl8QwB-0g) using Google's graphing feature, provided you are using a modern browser.

The code I wrote is as follows. I added quite a few comments, so it should be fairly easy to understand.

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
However, during testing I found that the correctness of this algorithm is not guaranteed.

If the population size is set to 50 as in the textbook, there is a fairly high probability that the algorithm finds a solution around 1.65. After plotting it, I found that this is only a local optimum. In the code, I set the population size to 1000, and it can basically find the solution every time. But it reminded me of the bisection method from numerical analysis—its efficiency is much higher than this algorithm.
