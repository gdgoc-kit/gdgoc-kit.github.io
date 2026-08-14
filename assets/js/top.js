/* ============================================================
   トップページ（index.html）専用スクリプト
   ============================================================
   最新のレポート（最大1件）と、直近の予定イベント（最大1件）を
   プレビュー表示する。カードのマークアップ・クラス名は
   report-list.css / event-list.css のスタイルをそのまま再利用している。
   ============================================================ */

(function () {
    var PREVIEW_COUNT = 1;

    // ---------- 最新レポート ----------
    var reportList = document.getElementById('top-report-list');
    var reportEmpty = document.getElementById('top-report-empty');

    fetch('assets/data/reports.json')
        .then(function (res) {
            if (!res.ok) throw new Error('reports.json の取得に失敗しました');
            return res.json();
        })
        .then(function (reports) {
            if (!Array.isArray(reports) || reports.length === 0) {
                reportEmpty.hidden = false;
                return;
            }
            reports.sort(function (a, b) {
                return String(b.date).localeCompare(String(a.date));
            });
            reports.slice(0, PREVIEW_COUNT).forEach(function (report) {
                var li = document.createElement('li');
                var card = document.createElement('div');
                card.className = 'report-card';

                var a = document.createElement('a');
                a.href = 'report/' + report.href;

                var dateSpan = document.createElement('span');
                dateSpan.className = 'date';
                dateSpan.textContent = String(report.date).replace(/-/g, '.');

                var h2 = document.createElement('h2');
                h2.textContent = report.title;

                var excerpt = document.createElement('p');
                excerpt.className = 'excerpt';
                excerpt.textContent = report.excerpt;

                var readMore = document.createElement('span');
                readMore.className = 'read-more';
                readMore.textContent = '続きを読む →';

                a.appendChild(dateSpan);
                a.appendChild(h2);
                a.appendChild(excerpt);
                a.appendChild(readMore);
                card.appendChild(a);
                li.appendChild(card);
                reportList.appendChild(li);
            });
        })
        .catch(function (err) {
            reportEmpty.hidden = false;
            reportEmpty.textContent = 'レポートの読み込みに失敗しました。';
            console.error(err);
        });

    // ---------- 予定しているイベント ----------
    var eventList = document.getElementById('top-event-list');
    var eventEmpty = document.getElementById('top-event-empty');

    function formatDateTime(iso) {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        return y + '.' + m + '.' + day + ' ' + hh + ':' + mm + '〜';
    }

    fetch('assets/data/events.json')
        .then(function (res) {
            if (!res.ok) throw new Error('events.json の取得に失敗しました');
            return res.json();
        })
        .then(function (events) {
            if (!Array.isArray(events)) events = [];
            var now = new Date();
            var upcoming = events.filter(function (event) {
                var endTime = new Date(event.end || event.start);
                return isNaN(endTime.getTime()) || endTime >= now;
            });

            if (upcoming.length === 0) {
                eventEmpty.hidden = false;
                return;
            }

            upcoming.sort(function (a, b) {
                return new Date(a.start) - new Date(b.start);
            });

            upcoming.slice(0, PREVIEW_COUNT).forEach(function (event) {
                var li = document.createElement('li');
                var card = document.createElement('div');
                card.className = 'event-card';

                var a = document.createElement('a');
                a.href = event.href || '#';
                a.target = '_blank';
                a.rel = 'noopener';

                var dateSpan = document.createElement('span');
                dateSpan.className = 'date';
                dateSpan.textContent = (event.dateTentative && event.dateLabel)
                    ? event.dateLabel
                    : formatDateTime(event.start);

                var h2 = document.createElement('h2');
                h2.textContent = event.title;

                a.appendChild(dateSpan);
                a.appendChild(h2);

                if (event.venue) {
                    var venue = document.createElement('p');
                    venue.className = 'venue';
                    venue.textContent = event.venue;
                    a.appendChild(venue);
                }
                if (event.excerpt) {
                    var excerpt = document.createElement('p');
                    excerpt.className = 'excerpt';
                    excerpt.textContent = event.excerpt;
                    a.appendChild(excerpt);
                }

                var readMore = document.createElement('span');
                readMore.className = 'read-more';
                readMore.textContent = '詳細を見る →';
                a.appendChild(readMore);

                card.appendChild(a);
                li.appendChild(card);
                eventList.appendChild(li);
            });
        })
        .catch(function (err) {
            eventEmpty.hidden = false;
            eventEmpty.textContent = 'イベント情報の読み込みに失敗しました。';
            console.error(err);
        });
})();