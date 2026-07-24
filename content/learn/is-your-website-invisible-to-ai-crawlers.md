---
title: "Is your website invisible to AI crawlers?"
description: "Many websites block AI crawlers without knowing it. Firewalls and CDN bot protection silently serve challenge pages to GPTBot and PerplexityBot."
date: "2026-07-21"
author: "Abhi Jinka"
---

Many business websites are invisible to AI engines and their owners have no idea. Firewalls and CDN bot-protection settings silently serve challenge pages or errors to crawlers like GPTBot, ClaudeBot, and PerplexityBot. If those crawlers can't read your site, the engines answering your customers' questions are working from everyone's content but yours.

## How does a website end up blocking AI crawlers by accident?

Bot protection gets switched on for good reasons like scrapers and attack traffic, and AI crawlers get caught in the same net. Since July 2025 it can also be the default: Cloudflare, which sits in front of roughly 20% of web traffic, now blocks AI crawlers on newly added domains unless the owner explicitly allows them, and over a million sites had opted into blocking before that. Other common culprits: "bot fight" or attack-challenge modes, aggressive firewall rules, and robots.txt files that disallow everything. Nobody notices, because the site looks perfectly normal in a human browser.

## How can I check if AI bots can read my site?

Fetch your pages the way the bots do. Request them with the user agents of GPTBot, ClaudeBot, and PerplexityBot and look at what comes back. Real content with a 200 status means you're readable. A challenge page, CAPTCHA, 403, or empty shell means you're blocked. Check your robots.txt actually allows these crawlers by name while you're at it.

## Does JavaScript-heavy rendering cause the same problem?

It's a second, separate way to be invisible, and the evidence here is unusually clear. Vercel and MERJ analyzed 500 million GPTBot fetches and found zero instances of JavaScript execution; the crawler downloads script files but never runs them, and the same goes for Claude's and Perplexity's crawlers. So if your content only appears after scripts run, those crawlers see an empty page even when nothing is blocking them. Quick test: turn off JavaScript in your browser and reload your site. Whatever disappears is what the crawlers never saw.

## Should I just allow every bot then?

Allow the crawlers of the engines you want naming you. For most businesses that means OpenAI, Anthropic, Google, and Perplexity, while keeping protections against genuinely abusive traffic. It's a scalpel decision, not a switch, and the first step is knowing your current status instead of assuming it.
