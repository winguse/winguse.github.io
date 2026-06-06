---
title: "Reflection-based Dependency Injection in Scala"
date: 2017-08-31 15:31:00 +0800
---

Reflection-based dependency injection (DI, Dependency Injection), also called inversion of control (IoC, Inverse of Control), is almost a must-have in advanced software design. In short, it helps you implement modules without obsessing over where dependencies come from or how lifecycles are managed. It is also a way to hide complexity and keep components loosely coupled.

My earliest exposure to reflection DI was [Spring](https://projects.spring.io/spring-framework/), back in the `SSH` (`Spring`, `Structs`, `Hibernate`) era. While working at Microsoft, one of our team projects also used [Spring .NET](http://springframework.net).

With frameworks like `Spring`, the workflow is usually defining types, configuring lifecycles, and declaring where dependencies are injected. Early configuration was mostly XML. After Java introduced annotations, Spring added annotation-based support. At that time there were basically two camps:

- One camp insisted on `xml`: their argument was that runtime behavior could be changed without touching code, which is a key configuration feature; annotations require recompilation.
- The other camp preferred annotations: compiler checks can catch certain type issues and improve safety; with `xml`, one typo can ruin your day.

As people say, there is no silver bullet in software engineering, so choice is contextual. But honestly, both approaches still depend on runtime dynamic container management. That often leads to annoying realities:

- Even with annotation-based configuration, some issues are only visible after running the app.
- Heavy reflection can still raise performance concerns (usually not huge, but present).
- Learning cost is high—configuration is complex, and many engineers do not even clearly understand what DI is. (In one Microsoft project transferred to our team, I was surprised that several colleagues had never learned this concept.)

I once wondered whether there was a better way. From a higher abstraction level, all configuration is expected by engineers at design time; it should not vary arbitrarily per run. In other words, behavior is mostly predetermined before runtime—so why not push all of this to compile time?

I had this idea, but I had not fully figured out how compilers should handle it. Recently while learning Scala, [Ma](https://github.com/assiotis) suggested using the `Cake Pattern` to solve part of the dependency problem. I skimmed related articles and initially felt the pattern had limits, so I ignored it. Later, while coding and considering DI again, I reviewed several frameworks and found the same old trade-offs, so I dropped frameworks and used a factory pattern myself for part of the problem.

When I first saw Scala's `Cake Pattern`, I felt these issues were not clearly resolved:

- Nested composition: `A` contains an instance of `B`, `B` contains an instance of `C`, and you want to inject dependencies into members of `C`.
- It was not immediately obvious how to express "create a new instance each time" injection style.

Of course, this mostly proved that I was too inexperienced. A few days ago during code review, I read [this article](http://jonasboner.com/real-world-scala-dependency-injection-di/) and was genuinely impressed by patterns like `trait ***Component`.

That article also covered other points. Since it did not explicitly show multi-level nesting implementation details, I want to post a code example.

Here I model a building containing two offices: an engineer office and a sales office. They share one printer. When first constructing these offices, we do not care what concrete printer it is—Canon or HP, for example.

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

The key trick above is putting original type definitions into separate `trait ***Component` blocks. These components complete layers of delayed dependency wiring in the `Cake Pattern`—you only care about unresolved concrete implementations at final instantiation.

Note that even types themselves are placed inside the "cake." Another way to see it: classes are packaged inside an injection container. In the final step, previously separated components are composed together, and missing concrete types are configured in one place—similar to the configuration part in frameworks like Spring.

The magic is that you can keep writing code while postponing concrete instances. At the end, one `Cake Pattern` composition connects everything into one class space. Outer components feel somewhat like namespaces.

Finally I created `BuildingTrait` to stitch dependencies together. This is also the ugliest part: for large programs, a giant `with` chain can be scary. But injection frameworks have the same scaling pain—the more things in the container, the more configuration complexity. A major benefit here is testing: when you extract a class for tests, the compiler tells you if a dependency is missing or a concrete instance was not configured.

For lifecycle management, I used `def printer: Printer`. If you want a singleton, you can use `val printer: Printer` instead. I wrote it this way to show that in `object BeijingBuilding` you can easily manage eager singleton, lazy singleton, per-request new instances, and complex constructors. With frameworks like Spring, constructor parameters can become a configuration nightmare.

That's all for now. I am still learning.
