#!/usr/bin/env node
/**
 * ============================================================
 * RSSフィード生成スクリプト
 * ============================================================
 * assets/data/reports.json と assets/data/events.json を読み込み、
 * ルート直下に feed.xml (RSS 2.0) を生成する。
 *
 * 実行方法:
 *   node scripts/generate-feed.js
 *
 * 通常は .github/workflows/feed.yml が、reports.json / events.json
 * の変更をトリガーに自動実行する。手動で試したいときだけ直接叩けばよい。
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

// EDIT: 実際の公開URLに合わせる
const SITE_URL = 'https://gdgoc-kit.github.io/';

const ROOT = path.join(__dirname, '..');
const REPORTS_PATH = path.join(ROOT, 'assets', 'data', 'reports.json');
const EVENTS_PATH = path.join(ROOT, 'assets', 'data', 'events.json');
const OUTPUT_PATH = path.join(ROOT, 'feed.xml');

function toJSTRFC822(date) {
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d   = String(jst.getUTCDate()).padStart(2, '0');
  const hh  = String(jst.getUTCHours()).padStart(2, '0');
  const mm  = String(jst.getUTCMinutes()).padStart(2, '0');
  const ss  = String(jst.getUTCSeconds()).padStart(2, '0');
  return `${days[jst.getUTCDay()]}, ${d} ${months[jst.getUTCMonth()]} ${jst.getUTCFullYear()} ${hh}:${mm}:${ss} +0900`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn(`[generate-feed] ${filePath} を読み込めませんでした:`, err.message);
    return [];
  }
}

const reports = readJson(REPORTS_PATH);
const events = readJson(EVENTS_PATH);

const items = [];

// レポートはすべてフィードに含める
reports.forEach((report) => {
  if (!report || !report.href || !report.date) return;
  items.push({
    title: report.title || '(無題のレポート)',
    link: `${SITE_URL}/report/${report.href}`,
    description: report.excerpt || '',
    date: new Date(`${report.date}T09:00:00+09:00`),
    category: 'レポート',
  });
});

// イベントは「終了していないもの」だけを予告としてフィードに含める
const now = new Date();
events.forEach((event) => {
  if (!event || !event.title || !event.start) return;
  const endTime = new Date(event.end || event.start);
  if (!isNaN(endTime.getTime()) && endTime < now) return; // 終了済みは除外

  items.push({
    title: event.title,
    link: event.href || `${SITE_URL}/event/index.html`,
    description: event.excerpt || '',
    date: new Date(event.start),
    category: 'イベント予告',
  });
});

// 新しい順
items.sort((a, b) => b.date - a.date);

const rssItems = items
  .map((item) => {
    const safeDate = toJSTRFC822(isNaN(item.date.getTime()) ? new Date() : item.date);
    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${safeDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`;
  })
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/Atom">
  <channel>
    <title>GDGoC KIT</title>
    <link>${SITE_URL}/</link>
    <description>GDGoC KIT のイベントレポート・イベント情報</description>
    <language>ja</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

fs.writeFileSync(OUTPUT_PATH, rss, 'utf8');
console.log(`[generate-feed] feed.xml を生成しました（${items.length}件）`);