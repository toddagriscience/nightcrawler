// Copyright © Todd Agriscience, Inc. All rights reserved.

import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const baseUrl = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const paths = [
  '/',
  '/research',
  '/news',
  '/careers',
  '/careers/search',
  ...process.argv.slice(3),
];
const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
const groups: Array<{
  agents: string[];
  rules: Array<{ allow: boolean; path: string }>;
}> = [];
let group: (typeof groups)[number] | undefined;
for (const line of robots.split(/\r?\n/)) {
  const [directive, ...values] = line.replace(/#.*/, '').split(':');
  const value = values.join(':').trim();
  if (directive.trim().toLowerCase() === 'user-agent') {
    if (!group || group.rules.length) {
      group = { agents: [], rules: [] };
      groups.push(group);
    }
    group.agents.push(value.toLowerCase());
  } else if (
    group &&
    ['allow', 'disallow'].includes(directive.trim().toLowerCase()) &&
    value
  ) {
    group.rules.push({
      allow: directive.trim().toLowerCase() === 'allow',
      path: value,
    });
  }
}
let checked = 0;
for (const agent of ['Googlebot', 'bingbot', 'OAI-SearchBot']) {
  const exact = groups.filter((item) =>
    item.agents.some(
      (value) => value !== '*' && agent.toLowerCase().includes(value)
    )
  );
  const rules = (
    exact.length ? exact : groups.filter((item) => item.agents.includes('*'))
  ).flatMap((item) => item.rules);
  for (const path of paths) {
    const matches = rules
      .filter((rule) => {
        const regex = rule.path
          .split('*')
          .map((value) => value.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
          .join('.*');
        return new RegExp(`^${regex}`).test(path);
      })
      .sort(
        (a, b) =>
          b.path.length - a.path.length || Number(b.allow) - Number(a.allow)
      );
    assert.notEqual(
      matches[0]?.allow,
      false,
      `${agent} blocked by robots at ${path}`
    );
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: 'manual',
      headers: { 'user-agent': agent },
    });
    assert.equal(
      response.status,
      200,
      `${agent} ${path}: inaccessible edge response`
    );
    assert.notEqual(response.headers.get('cf-mitigated'), 'challenge');
    const dom = new JSDOM(await response.text());
    assert.ok(
      dom.window.document.querySelector('h1'),
      `${agent} ${path}: public content missing`
    );
    assert.ok(
      !/just a moment|access denied|verify you are human/i.test(
        dom.window.document.title
      ),
      `${agent} ${path}: challenge title`
    );
    dom.window.close();
    checked++;
  }
}
console.log(
  `Verified robots access and ${checked} public edge responses for Googlebot, Bingbot and OAI-SearchBot.`
);
