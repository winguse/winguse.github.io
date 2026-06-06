---
title: "Clubhouse Experience"
date: 2021-02-06 20:00:00 +8000
---

Recently, because of [Elon Musk's tweet](https://twitter.com/elonmusk/status/1355983231988862978?s=20), this app became popular in my circles too, mainly Chinese Twitter and the tech scene. Of course, this Clubhouse is not the [ticketing system](https://clubhouse.io) my company uses. After getting invited by a colleague, I finally started using it.

## Product form

The app currently uses an invitation mechanism. After registering, a user initially gets two invites (later this was not true for everyone). It also shows invite credits in each profile, effectively exposing a global invitation tree where each tree traces back to original seed users.

Each Clubhouse user has an ID, name, avatar, profile bio, optional Twitter/Instagram links, and can follow or be followed.

Clubhouse's help docs are hosted on Notion.

After registration, users choose interests. Inside each interest there are clubs, and users can follow clubs. It seemed the Chinese community had not fully explored this part yet. I heard you need to host several rooms before creating a club.

Everyone can host a room: private, followers-only, or public. A room can have owners and moderators. Participants can raise hands, and hosts can control who is allowed to speak (everyone, followed users, or no one).

The home screen shows ongoing rooms based on recommendation, follow graph, and where your follows are currently present. There is also a calendar for upcoming events.

Notification management is fairly complete: new followers, published events, contacts joining, etc.

The product supports only voice—no text or images. So users cannot do parallel in-app text communication, though you can still leave a room and browse elsewhere.

Content is real-time and casual, so quality is not consistently high (at least for now). For me, people often speak too slowly; without playback speed controls, it can feel inefficient. Also, because there is little textual context, if you join midway, it takes a long bootstrap time to understand the topic. And since content is usually not recorded, long-term accumulation is hard. It feels more like a discussion/social tool. Brainstorming may be a strong use case.

Technically, it is impressive: audio quality is good, and reconnection during network switching is quick. It uses [Agora](https://www.agora.io/) technology; Agora's stock even surged within a day. So Clubhouse itself does not own the core audio tech stack.

## What problem did Clubhouse solve that others did not?

**A gap left by video-first products.** One thing it solves is that even in the 5G era, many scenarios still are not suitable for video (for example, many meetings do not need cameras). Voice-only interaction captures users who do not want video. Also, while listening, people can still walk, cook, drive, etc. This resembles old radio programs where callers could join live.

**A social network for real-time conversation.** Existing online audio/video products are often either point-to-point private meetings/teaching, or one-to-many livestreaming. The former are private and real-time; the latter are public and near-real-time with unavoidable latency. You can compare Clubhouse with game voice platforms like YY, but they target different audiences. YY penetrates gamer groups well, but less so for mainstream social users. Clubhouse was social-first from day one.

**Harder to pollute with low-quality information at scale.** Compared to text, speaking requires higher real-time human cost. Compared to video, participation cost is lower for ordinary users. So organized spam/astroturfing is harder.

## Special aspects of the Chinese-speaking community

For users in mainland China, there are entry barriers: you need iOS and an overseas Apple ID. Early adopters were therefore mostly tech people. Because of this, someone like me felt much closer to high-profile people.

On my first night, I listened to several circles: one focused on Chinese investors and product managers discussing how this product might operate in China and reach lower-tier cities. Regulation concerns were unavoidable; several product people were pessimistic because moderation would be difficult. Monetization was also discussed. Some investors were still observing and thought viral spread was too fast, so maybe it was worth cultivating first. Another room involved Flypig, an influencer who brings traffic everywhere; I even listened to a voluntary "shopping" session on "what 3,000 RMB can buy for happiness," where I bought the AutoSleep app and found it useful. Flypig said something funny: with invite codes, iOS requirement, and overseas accounts, many of his VC followers switched from Huawei to iPhone overnight. I also listened to a Hong Kong product-manager circle that focused more purely on product and less on regulation than mainland circles. The hottest Chinese rooms still felt political; for the first time in 30+ years, I saw thousands of people in social discussion rooms until 3 a.m.

Because of regulation concerns, domestic copycat efforts had already started. But while products can be copied, communities are harder to copy. That makes sense: some people came for borderless conversation, and if a heavily localized domestic clone appears, many may not return.

## So what is it useful for?

I do not know what final form this product will evolve into. In the end, content still rules, and it probably needs users who regularly share valuable content. But it can also create opportunities for social interaction among strangers—like passing by a coffee shop, chatting briefly, finding shared interests, or simply easing loneliness. It can also function as a kind of city forum.
