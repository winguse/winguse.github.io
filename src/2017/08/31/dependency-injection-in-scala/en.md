---
title: "Reflection-based Dependency Injection in Scala"
date: 2017-08-31 15:31:00 +0800
---

Reflection-based dependency injection (DI, Dependency Injection), also known as Inversion of Control (IoC, Inverse of Control), is basically a hard requirement for advanced programming. Simply put, it lets you implement a module’s business logic without getting overly obsessed with where that module’s dependencies come from or how long they live. It is also a way to hide complexity and keep components loosely coupled.

The first reflection-based DI framework I encountered was [Spring](https://projects.spring.io/spring-framework/), back when the `SSH` (`Spring`, `Structs`, `Hibernate`) stack was everywhere. While working at Microsoft, a project in our team had also used [Spring .NET](http://springframework.net).

With frameworks like `Spring`, the workflow is basically to define types, configure the lifecycle of each type, and configure where injection should happen. Early on, configuration was usually done in `xml`. Later, when `Java` introduced annotation syntax, `Spring` added corresponding support as well. At that time, people were basically split into two camps:

- One camp insisted on using `xml`. Their main argument was that this made it very easy to change runtime behavior without changing a single line of code — after all, that is a key feature of configuration. If you use annotations, you have to compile again, which is troublesome.
- The other camp believed that configuring via annotations let the compiler help check certain type issues and was therefore safer; with `xml`, one typo could make your life miserable.

As the saying goes, there is no silver bullet in software engineering, so which one to choose depends on personal preference. But frankly speaking, no matter which of those two approaches you use, you still cannot escape dynamically managing all the configured instances in a container at runtime. So there are always some annoying things like these:

- Even when using annotations, there are still problems you cannot discover until you actually run the program.
- Since a lot of reflection is involved, there are always some performance concerns (even if they are not huge).
- The learning cost is really high — configuration is complex, and more importantly, many engineers do not even know what `DI` is. (When that Microsoft project was transferred to our group, what surprised me most was that my coworkers knew nothing about this concept.)

I once wondered whether there might be a better solution to the problems of reflection-based dependency injection. In fact, if you think about it at a higher level of abstraction, all configuration is something engineers already anticipate when they design and write code. It does not change from one run to another. In other words, before runtime, it is already predetermined how these things are supposed to work. So why not move all of it to compile time?

That said, while I had this idea, I had not figured out how a compiler should specifically handle such problems. Recently I have been learning and using `Scala`. [Mr. Ma](https://github.com/assiotis) once suggested that I use the `Cake Pattern` to solve part of the dependency problem. I glanced over some related articles, but felt the pattern was still quite limited, so I did not pay much attention to it. Later, as I kept writing code and wanted to use `DI`, I looked through various frameworks and found they were still more or less the same as what I described above. In the end I gave up using a framework and just built a factory pattern myself to solve part of the problem.

Because when I first saw the `Cake Pattern` in `Scala`, I felt it still did not handle these issues very well:

- In nested composition: `A` has a member that is an instance of `B`, `B` has a member that is an instance of `C`, and what you want to inject is a member of `C`.
- At first glance, I could not see the proper way to inject dependencies that should create a brand-new instance every time.

Of course, all of the above only proves that I was still too young, too simple. A few days ago, while doing code review, I read [this article](http://jonasboner.com/real-world-scala-dependency-injection-di/), and I was shocked inside — there is actually an operation like `trait ***Component`!

That article also discussed some other things. Even when talking about the `Cake Pattern` in `Scala`, it did not make the implementation for multi-layer nesting especially explicit, so here I want to paste a piece of code.

Here, I describe a building that contains two offices: an engineer office and a sales office. The two offices share one printer. When we first build each office, we do not care what kind of printer it is — maybe it is Canon or HP. The code is as follows:

```scala
trait Printer {
  def print(something: String): Unit
}

class CannonPrinter extends Printer {
  def print(something: String): Unit = {
    println(s"print $something")
  }
}

trait NeedPrinter {
  def printer: Printer
}

trait SaleOfficeComponent {
  this: NeedPrinter =>

  class SaleOffice {
    def printSaleReport: Unit = {
      printer.print("sale report")
    }
  }
}

trait EngineerOfficeComponent {
  this: NeedPrinter =>

  class EngineerOffice {
    def printDesignDocument: Unit = {
      printer.print("design document")
    }
  }
}

trait BuildingComponent {
  this: SaleOfficeComponent with EngineerOfficeComponent =>

  class Building {
    val saleOffice = new SaleOffice
    val engineerOffice = new EngineerOffice

    def doBuiness: Unit = {
      saleOffice.printSaleReport
      engineerOffice.printDesignDocument
    }
  }
}

trait BuildingTrait extends BuildingComponent with SaleOfficeComponent with EngineerOfficeComponent with NeedPrinter

object BeijingBuilding extends BuildingTrait {

  val printerInstance = new CannonPrinter

  override def printer: Printer = {
    printerInstance
  }

  val buiding = new Building
  buiding.doBuiness
}
```

Looking at the code above, the main trick is to put all the original type definitions into individual `trait ***Component`s. These `Component`s then complete one round after another of delayed dependency via the `Cake Pattern` — you only need to care about the still-undefined implementations when you instantiate everything at the very end.

Note that even the types themselves are placed inside the `Cake`. If you understand it another way, this is equivalent to packaging each class inside an injection container. In the final step, you can think of it as taking all those originally separated `Component`s and stitching them together, then uniformly configuring the missing undefined types — which is exactly the part that would normally be configured in an injection framework like `Spring`.

The magical part is that you can keep writing code while postponing the implementation of specific instances, and then the `Cake Pattern` connects all the spaces at once and merges them into a single class at the end. The outer `Component`s feel a bit like namespaces.

At the end I created a `BuildingTrait` that stitches together all the dependencies. In fact, this is also the ugliest part, because if your program is large, that chain of `with`s can become terrifying. But think about it: with an injection framework, it is the same principle. The more content the container has to manage, the more complicated the configuration becomes. The benefit now is that if you want to pull out one class for testing, the compiler will tell you whether you forgot to pull out some dependency, and which instance has not been configured properly.

As for lifecycle management of instances, here I used `def printer: Printer`. In fact, if it were a singleton, you could write it as `val printer: Printer`. I wrote it this way only to make it clear that in the final `object BeijingBuilding`, you can very easily implement different kinds of lifecycle management, whether eager singleton, lazy singleton, or creating a new instance every time. And yes, this also includes all kinds of complicated constructors — you know, with a framework like `Spring`, if the constructor has parameters, that is practically a disaster.

Alright, let us stop here for now. I am still learning too.
