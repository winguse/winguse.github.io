---
title: "Translated English Version"
date: 2012-06-22 03:08:12 +0000
---

translated text，translated text，translated text，translated text。

translated text，translated text。

translated text，translated text《translated text》translated text，translated text、translated text。

translated text，translated text 166 translated text，translated text：f(x)=x*sin(10*PI\*x)+1.0 translated text[-1,2]translated text。

translated text [translated text](https://www.google.com/search?hl=zh-CN&newwindow=1&q=x*sin%28PI*10*x%29%2B1.0&oq=x*sin%28PI*10*x%29%2B1.0&aq=f&aqi=&aql=&gs_l=serp.3...2994703.2994703.0.2995923.1.1.0.0.0.0.212.212.2-1.1.0...0.0.EHfl8QwB-0g) ，Google translated text，translated text，translated text。

translated text，translated text，translated text。

```c++
#include <cstdio>
#include <cmath>
#include <cstdlib>//RAND_MAX rand()
#include <ctime>
 
//translated text
const int
    maxGen=1000,//translated text
    M=100,//translated text
    bitLen=22,//translated text
    mask=(1<<bitLen)-1,//translated text，translated text
    genThreshold=10;//translated text，translated text，translated text
const double
    pC=0.8,//translated text
    pM=0.1,//translated text
    PI=acos(-1.0),//translated text
    bestFitnessEsp=0.000001,//translated text
    totalFitnessEsp=bestFitnessEsp*M;//translated text，translated text
//translated text
int currentI,gen;//translated textI，translated text。
unsigned int oldPopulation[M],population[M],bestGen[maxGen];//translated text，translated text
double possibility[M],fitness[M],bestFitness[maxGen],totalFitness[maxGen];//translated text，translated text，translated text，translated text
 
void printBit(unsigned int x){//translated text
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
 
double f(double x){//translated text，translated text
    return x*sin(PI*10*x)+1.0;
}
 
double convert(unsigned int x){//translated text
    return double(x)/mask*3.0-1.0;
}
 
void populationInit(){//translated text
    for(int i=0;i<M;i++){
        population[i]=rand();//RAND_MAX = 32767，15translated text1，translated text
        population[i]<<=15;//translated text
        population[i]|=rand();//translated text15translated text
        population[i]&=mask;//translated text
    //  printBit(population[i]);
    }
}
 
bool canStop(){
    if(gen<genThreshold)//translated text
        return false;
    if(maxGen<=gen)
        return true;
    bool ret=true;
    int lgen=gen-1;
    for(int i=gen-genThreshold;i<lgen;i++){//translated text
        ret=ret&&abs(bestFitness[lgen]-bestFitness[i])<bestFitnessEsp;
    }
    if(ret){
        puts("translated text，translated text。");
        return true;
    }
    ret=true;
    for(int i=gen-genThreshold;i<lgen;i++){//translated text（translated text）
        ret=ret&&abs(totalFitness[lgen]-totalFitness[i])<totalFitnessEsp;
    }
    if(ret){
        puts("translated text（translated text），translated text。");
    }
    return ret;
}
 
void countFitness(){
    totalFitness[gen]=0;
    bestFitness[gen]=0;
    for(int i=0;i<M;i++){
        oldPopulation[i]=population[i];
        fitness[i]=f(convert(population[i]));//translated text
        totalFitness[gen]+=fitness[i];//translated text，translated text，translated text，translated text，translated text，translated text
        possibility[i]=totalFitness[gen];//translated text，translated textitranslated text，translated text possibility[i]-possibility[i-1]，translated text： possibility[i-1] ～ possibility[i]
        if(bestFitness[gen]<fitness[i]){//translated text
            bestFitness[gen]=fitness[i];
            bestGen[gen]=population[i];
        }
    }
}
 
void copy(int from){//translated text
    population[currentI]=oldPopulation[from];
    currentI++;
}
 
void cross(int a,int b){//translated text，translated text，translated text？translated text，translated text。
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
 
void heteromorphosis(int from){//translated text
    int pos=rand()%(bitLen-1);
    population[currentI++]=oldPopulation[from]^(1<<pos);
/*  printBit(1<<pos);puts("");
    printBit(oldPopulation[from]);puts("");
    printBit(population[currentI-1]);puts("");
    getchar();*/
}
 
int select(){//translated text
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
    /*//translated text。
    if(m>=1){
        if(!(p<possibility[m]&&p>possibility[m-1])){
            printf("translated text！#1 %f-%f-%f %f %dn",possibility[m-1],possibility[m],possibility[m+1],p,m);
            getchar();
        }
    }else{
        if(!(p<possibility[m])){
            printf("translated text！#2 %f %fn",possibility[m],p);
            getchar();
        }
    }*/
    return m;
}
 
void inherit(){
    double p;
    currentI=0;
    while(currentI<M){
        p=double(rand())/RAND_MAX;//translated text
        if(p<pC){//0～pC，translated text
            cross(select(),select());
        }else if(p<pC+pM){//pC～pM translated text
            heteromorphosis(select());
        }else{//translated text
            copy(select());
        }
    //  printBit(population[currentI-1]);puts("");
    }
}
 
int main(){
    srand((unsigned)time(NULL));//translated text
    while(true){
        gen=0;
        populationInit();
        while(!canStop()){
            countFitness();
            printf("translated text：%3d translated text：",gen);
            printBit(bestGen[gen]);
            printf(" f(%f) = %fn",convert(bestGen[gen]),bestFitness[gen]);
            inherit();
            gen++;
        }
        puts("nntranslated text，translated text。");
        getchar();
        puts("nn");
    }
    return 0;
}
```

translated text，translated text，translated text。

translated text 50 translated text，translated text 1.65 translated text。translated text，translated text，translated text。translated text，translated text 1000 translated text，translated text。translated text，translated text。
