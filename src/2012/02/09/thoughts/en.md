---
title: "Some Reflections"
date: 2012-02-09 12:02:45 +0000
---

1. Energy:

Almost all the energy we use ultimately comes from the Sun. I think we can roughly split it into these categories:

1) Fossil energy: coal, oil, natural gas, and so on. This is accumulated solar energy from Earth's past. When we consume it, we reduce that reserve. In simple terms, our current large-scale use of fossil fuels breaks the supply-consumption balance—replenishment and consumption are severely mismatched. Once these resources are depleted, civilization may face major challenges, yet we currently depend on them.

2) Radioactive energy: in a narrow sense, nuclear energy (fission and still-not-practical fusion); in a broader sense, geothermal can be included too. I think this category is somewhat dependable, but for fission, waste treatment has never been a cleanly solved problem. From a long-term civilization perspective, waste is only truly safe if removed from Earth.

3) Direct solar energy: narrowly, photovoltaics and solar water heaters; broadly, hydro, wind, burning biomass (photosynthesis), and so on. I think this is the energy class we can truly rely on. If we view Earth as an isolated system, the Sun is our near-primary external energy source. Fossil fuels are past savings; direct solar-derived flows are current income. Our present civilization feels like spending beyond income, so we should value these direct energy systems more.

—This also reminds me: I originally chose a materials major because I wanted to work on photovoltaic cells, but ended up in computer science teacher training.
4) Other energy sources: for example, tidal energy from extraterrestrial gravity. A naive thought: according to conservation of energy, would extracting tidal energy slow the Moon's orbital cycle? If the Moon eventually stopped (hypothetically), how long would that energy support humanity?

2. About abstraction.

I have been writing a lot of code lately, and thinking a lot as well. During development, I gained many practical insights about layering.

Roughly, I see these layers: persistence, abstraction, business logic, and presentation. Usually the middle two can be grouped as an abstraction layer.

To me, abstraction means hiding details that upper layers do not need to care about, making upper-layer operations simpler. For example, a database driver abstracts the persistence layer. The most common interface is SQL. If your program is built on that abstraction, switching the underlying database often requires little to no change.

Another example: frontend developers can focus on UI while ignoring backend data processing details. Then backend refactors for performance should not drag frontend into changes.

But I have also suffered from poor abstraction recently. For example, due to limited experience, some small programs I designed lacked foresight, or had design flaws. I once built an abstraction over database tables, and later when I needed to change fields, I had to refactor everything.

My takeaway: abstraction design is subtle and demanding; it requires strong fundamentals.

In short: keep improving.
