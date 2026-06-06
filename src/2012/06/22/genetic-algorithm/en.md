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
 
//program constants
const int
    maxGen=1000,//maximum number of generations
    M=100,//population size limit
    bitLen=22,//binary bit width
    mask=(1<<bitLen)-1,//binary mask, used to strip excess bits
    genThreshold=10;//loop termination check: exit if no improvement over this many recent generations
const double
    pC=0.8,//crossover probability
    pM=0.1,//mutation probability
    PI=acos(-1.0),//pi
    bestFitnessEsp=0.000001,//threshold for "no significant change"
    totalFitnessEsp=bestFitnessEsp*M;//same as above, extended to total population sum
//variables
int currentI,gen;//current individual index I, and current generation number
unsigned int oldPopulation[M],population[M],bestGen[maxGen];//old and new generation, best gene
double possibility[M],fitness[M],bestFitness[maxGen],totalFitness[maxGen];//roulette probability values, fitness values, best fitness per generation, total fitness per generation
 
void printBit(unsigned int x){//print in binary
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
 
double f(double x){//function, also serves as the fitness function
    return x*sin(PI*10*x)+1.0;
}
 
double convert(unsigned int x){//convert binary to real value
    return double(x)/mask*3.0-1.0;
}
 
void populationInit(){//initialize population
    for(int i=0;i<M;i++){
        population[i]=rand();//RAND_MAX = 32767, 15 ones, so
        population[i]<<=15;//shift left
        population[i]|=rand();//add another 15 bits
        population[i]&=mask;//remove excess bits
    //  printBit(population[i]);
    }
}
 
bool canStop(){
    if(gen<genThreshold)//reached maximum number of generations
        return false;
    if(maxGen<=gen)
        return true;
    bool ret=true;
    int lgen=gen-1;
    for(int i=gen-genThreshold;i<lgen;i++){//best fitness hasn't changed much
        ret=ret&&abs(bestFitness[lgen]-bestFitness[i])<bestFitnessEsp;
    }
    if(ret){
        puts("Best fitness unchanged, algorithm terminated.");
        return true;
    }
    ret=true;
    for(int i=gen-genThreshold;i<lgen;i++){//total fitness hasn't changed much (average)
        ret=ret&&abs(totalFitness[lgen]-totalFitness[i])<totalFitnessEsp;
    }
    if(ret){
        puts("Total fitness unchanged (average), algorithm terminated.");
    }
    return ret;
}
 
void countFitness(){
    totalFitness[gen]=0;
    bestFitness[gen]=0;
    for(int i=0;i<M;i++){
        oldPopulation[i]=population[i];
        fitness[i]=f(convert(population[i]));//fitness value
        totalFitness[gen]+=fitness[i];//accumulate total fitness; serves two purposes: deciding loop exit (fitness unchanged) and computing probabilities, so no average is subtracted
        possibility[i]=totalFitness[gen];//probability range: for individual i, probability is possibility[i]-possibility[i-1]; roulette range is possibility[i-1] ~ possibility[i]
        if(bestFitness[gen]<fitness[i]){//save the best
            bestFitness[gen]=fitness[i];
            bestGen[gen]=population[i];
        }
    }
}
 
void copy(int from){//copy
    population[currentI]=oldPopulation[from];
    currentI++;
}
 
void cross(int a,int b){//crossover: the textbook only uses a single crossover point — is it too weak? But simple, I like it.
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
 
void heteromorphosis(int from){//mutation
    int pos=rand()%(bitLen-1);
    population[currentI++]=oldPopulation[from]^(1<<pos);
/*  printBit(1<<pos);puts("");
    printBit(oldPopulation[from]);puts("");
    printBit(population[currentI-1]);puts("");
    getchar();*/
}
 
int select(){//roulette wheel selection of one individual
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
    /*//this section verifies the correctness of the binary search
    if(m>=1){
        if(!(p<possibility[m]&&p>possibility[m-1])){
            printf("Selection function error! #1 %f-%f-%f %f %dn",possibility[m-1],possibility[m],possibility[m+1],p,m);
            getchar();
        }
    }else{
        if(!(p<possibility[m])){
            printf("Selection function error! #2 %f %fn",possibility[m],p);
            getchar();
        }
    }*/
    return m;
}
 
void inherit(){
    double p;
    currentI=0;
    while(currentI<M){
        p=double(rand())/RAND_MAX;//randomly decide the operation for this step
        if(p<pC){//0~pC: crossover
            cross(select(),select());
        }else if(p<pC+pM){//pC~pM: mutation
            heteromorphosis(select());
        }else{//copy
            copy(select());
        }
    //  printBit(population[currentI-1]);puts("");
    }
}
 
int main(){
    srand((unsigned)time(NULL));//initialize random function with time
    while(true){
        gen=0;
        populationInit();
        while(!canStop()){
            countFitness();
            printf("Generation: %3d  Gene: ",gen);
            printBit(bestGen[gen]);
            printf(" f(%f) = %fn",convert(bestGen[gen]),bestFitness[gen]);
            inherit();
            gen++;
        }
        puts("\n\nCalculation complete, press Enter to compute again.");
        getchar();
        puts("\n\n");
    }
    return 0;
}
```
However, during testing I found that the correctness of this algorithm is not guaranteed.

If the population size is set to 50 as in the textbook, there is a fairly high probability that the algorithm finds a solution around 1.65. After plotting it, I found that this is only a local optimum. In the code, I set the population size to 1000, and it can basically find the solution every time. But it reminded me of the bisection method from numerical analysis—its efficiency is much higher than this algorithm.
