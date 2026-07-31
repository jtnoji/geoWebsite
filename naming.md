# Brand name shortlist, v3

Replaces v2. v1 was filtered by domain availability and produced feature labels.
v2 corrected for warmth and overcorrected into everyday phrases: Good Word, Ask
Around, Good Company are things people say, not things people own.

This round is the higher register. Words with roots, that carry weight, that a
competitor cannot arrive at by brainstorming for ten minutes. Domains are ignored
entirely, see the footnote for why.

---

## The recommendation: Renown

*Widely known and widely spoken of.*

This is the outcome you sell, stated at full elegance and nothing else. Not the
method, not the metric, not a description of the deliverable. A business hires you
because it wants to be named when someone asks, and the English word for that is
renown.

It threads every objection so far. It is not literal, because it names the result
rather than the service. It is not obscure, because everyone knows "renowned." It
is not simple, because nobody uses it casually and it carries four hundred years of
weight. And it says nothing about sampling, so it survives any change to how you
measure.

Josh on a call: "We're Renown. We measure whether AI knows your name, and then we
go earn it."

Tagline: **Renown. Whether the machines know your name.**

The tier structure reads well against it too: the free check tells you where your
renown stands, the audit measures it properly, and Ongoing GEO builds it. That last
one matters, since the retainer is the actual product.

Note: Renown Health is a hospital system in Nevada. Different class, different
industry, but have a lawyer confirm.

---

## The other five worth serious thought

### Prominence

*One of your own three grading criteria: presence, prominence, accuracy.*

Elegant, Latinate, precise. It means being conspicuous and important, which is
exactly the thing an AI answer either grants you or does not. There is a quiet
credibility in naming the company after the standard you grade against.

Three syllables is the only real cost. It is a slightly formal word, which suits a
startup buyer better than a plumber.

Tagline: **Prominence. Presence is not enough.**

### Corpus

*The body of text a model learned from.*

Reads two ways at once, and both are right. To the AI-literate buyer it is the
training corpus, the thing that determines whether a model has ever heard of you.
To everyone else it is Latin for body, which sounds like an institution that has
been around a while.

Short, distinctive, unbothered by trends. The risk is that it can feel clinical,
and one buyer in twenty will think of anatomy.

Tagline: **Corpus. Whether the model has ever heard of you.**

### Fama

*Latin: renown, reputation, and rumour. Also the goddess who carried word of your
name across the world.*

The root beneath "famous" and "defame," and the most beautiful word on this list.
Two syllables, FAH-mah, easy on a call once heard. It has the quality Renown has
but sounds less like an English dictionary entry and more like a house.

Worth knowing: Fama Technologies is an existing HR screening company. Adjacent
enough to check properly.

Tagline: **Fama. Word travels. We measure where.**

### Auspice

*From Roman augury, reading the signs to know what is coming. Survives in "under
the auspices of."*

Sophisticated and warm at once, and it frames you as the practice that reads the
signs on the client's behalf. It also carries a note of patronage and protection,
which is the right feeling for a retainer relationship.

Tagline: **Auspice. Reading the answers, properly.**

### Colophon

*The printer's mark at the end of a book, naming who made it.*

The most crafted name here. It is about attribution, about whose name appears on
the work, which is the entire product. It sounds like a small serious firm.

It is also the most obscure, and you flagged obscurity as a fault in v1. The
difference is that Colophon rewards the explanation, where Crestgauge merely
required one. Say it out loud before you decide whether that distinction holds.

Tagline: **Colophon. Whose name is on the answer.**

---

## The rest, by register

**Classical and precise**

Canon · Dictum · Nota · Laud · Verity · Probity · Vocative

**Probity** is your no-guarantees posture in a single elegant word. **Vocative** is
the grammatical case used to address someone by name, which is a genuinely clever
fit if you like a name that rewards attention. **Canon** is excellent in concept,
being in the canon means being one of the named, but Canon Inc. makes it
unworkable.

**Oracle and augury**

Pythia · Sibyl · Delphic · Augury · Auspex

The AI-as-oracle metaphor is exact and these are all distinctive. One warning:
**Pythia** is the name of EleutherAI's well-known open model suite, so in AI circles
it is taken in the way that matters most.

**Instruments of measure**

Gnomon · Alidade · Nonius · Astrolabe · Sextant

**Gnomon** is the shadow-caster on a sundial, from the Greek for "one that knows."
An instrument that measures by revealing. Thematically the best of these, and the
silent g is a real cost on a phone call. **Nonius** is the older name for the
vernier scale, distinctive and unclaimed in this category.

**Standing and esteem**

Repute · Regard · Esteem · Cachet · Standing · Purview

**Cachet** is elegant but you will spend the rest of your life spelling it.
**Repute** is Renown's quieter sibling and worth a look if Renown feels too warm.

---

## The domain footnote

I have now checked roughly 210 domains across three rounds. Three were free, and
all three were leftovers. Every name above is registered on .com and .ai, including
Colophon, Gnomon, Nonius and Vocative, which tells you the aftermarket has been
swept by speculators rather than that these names are in use.

That is why domains are not a filter anymore. Pick the name on merit. Then:

1. **Aftermarket purchase.** Most of these are parked, which means priced.
   Typically $1k to $25k for a word like Renown or Corpus, often far less for
   Colophon or Nonius. Name your top two or three and I will get real asking prices
   before you commit a dollar.
2. **A `geo` or `hq` suffix at $11 to unblock the build now.** `renowngeo.com` and
   similar. You can buy the bare .com later without renaming anything.
3. **A country TLD that reads as intentional.** Worth a look for the short Latin
   ones.

## Before you commit

- USPTO search in classes 35 and 42. None of the conflict notes above is a
  clearance search and I am not a lawyer.
- Say the top two out loud on three real calls this week. Renown and Fama will tell
  you quickly which register you actually want to work in.

## When the name lands

- `lib/site.ts`: `BRAND`, `DOMAIN`, `EMAIL`. `NAP.businessName` follows `BRAND`.
- Re-run `scripts/make-brand-assets.py` after `npm run build`, or every shared link
  keeps previewing as "[Brand]".
- `website-plan.md` §6: move "Brand name + domain" to Decided.
- SPF, DKIM and DMARC on the sending domain before the first teaser email.
- `npm run build && grep -r "\[Brand\]" out/` returns nothing.
