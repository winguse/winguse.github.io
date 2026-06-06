---
title: "Some Thoughts"
date: 2012-02-09 12:02:45 +0000
---

1. Energy:

In fact, almost all the energy we use ultimately comes from the sun. I think it can be divided into the following categories:

1) Fossil energy. For example coal, oil, natural gas, and so on. This category is actually an accumulation of past solar energy on Earth. Once we use it, we are effectively reducing that accumulation. Simply put, our current large-scale use of this kind of energy is destroying the balance of energy supply—their replenishment and our consumption are seriously out of balance. When these resources are exhausted, our civilization may face many challenges, yet ironically we depend on them so much.

2) Radioactive energy. In the narrow sense, this refers to nuclear energy, including fission and fusion, which we still cannot use; in the broad sense, it also includes geothermal energy. Generally speaking, I think this kind of energy is still something we can rely on. But for fission in particular, waste disposal has never been a problem with a good solution. From the perspective of human civilization over the very long term, waste can only really be considered safe if it is thrown out of the Earth.

3) Direct solar energy. In the narrow sense, this can mean photovoltaic cells and solar water heaters; in the broad sense, it includes hydropower, wind power, burning firewood (plant photosynthesis), and so on. I think this is the kind of energy we can truly rely on. If we look at Earth as an isolated system, the sun is almost our only energy source (though there are others). Fossil energy is just an accumulation from the past; only these sources are our real present wealth. In our current civilization, the energy we use is basically more than our income can support. So I think we should pay more attention to this kind of direct energy system.

—This also reminds me of something: the major I originally chose was materials science, because I wanted to work on photovoltaic cells. Unfortunately, I am now studying computer science education.

4) Other energy sources. For example, tidal energy comes from extraterrestrial gravity. A timid thought: according to conservation of energy, if we do this, would it slow down the Moon's orbit? Or, if the Moon stopped, how long would that amount of energy be enough for us tiny humans to use?

2. About abstraction.

Lately I have written a lot of programs, and I have been thinking more as well. I have really felt a lot, through my own coding process, about the layering of software development.

Roughly speaking, the layers as I understand them are: the persistence layer, the abstraction layer, the business logic layer, and the presentation layer. Usually the middle two can be grouped together and called the abstraction layer.

My understanding of abstraction is to hide the things the upper layer does not need to care about, so that operations at the upper layer become simpler. For example, a database driver is an abstraction of the persistence layer. What everyone uses most is SQL. If your program is built on such a foundation, then when the underlying database is changed, your program will almost need no modifications at all.

Another example: front-end developers only need to care about what the interface looks like, and can ignore back-end data processing completely. Then if the back end refactors its code to improve performance, the front end will not be dragged into it.

But these days I have also suffered a bit. For example, because I lack experience, the designs of the small programs I made were not very forward-looking—or rather, they had design flaws. For instance, I made an abstraction over a database table, and now I want to modify some fields, but I have to refactor everything.

What this taught me is that abstraction design is something very delicate and demanding; it really requires solid fundamentals.

To put it simply: keep working hard.
