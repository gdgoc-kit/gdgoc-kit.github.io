/* ============================================================
   イベント情報ページ（event/index.html）専用スクリプト
   ============================================================
   assets/data/events.json を読み込み、終了時刻(end)と現在時刻を
   比較して「予定しているイベント」「終了したイベント」に自動で
   振り分けて描画する。
   ============================================================ */

(function () {
    var upcomingList = document.getElementById('upcoming-list');
    var endedList = document.getElementById('ended-list');
    var upcomingEmpty = document.getElementById('upcoming-empty');
    var endedEmpty = document.getElementById('ended-empty');

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

    function buildCard(event, isEnded) {
        var li = document.createElement('li');

        var card = document.createElement('div');
        card.className = 'event-card' + (isEnded ? ' is-ended' : '');

        var linkHref = (isEnded && event.reportHref) ? event.reportHref : event.href;
        var linkLabel = (isEnded && event.reportHref) ? 'レポートを見る →' : '詳細を見る →';

        var a = document.createElement('a');
        a.href = linkHref || '#';
        if (!(isEnded && event.reportHref)) {
            a.target = '_blank';
            a.rel = 'noopener';
        }

        var dateSpan = document.createElement('span');
        dateSpan.className = 'date';
        dateSpan.textContent = (event.dateTentative && event.dateLabel)
            ? event.dateLabel
            : formatDateTime(event.start);
        a.appendChild(dateSpan);

        // 終了したイベントで、まだレポートが無い場合は「レポート作成中」バッジを表示する
        if (isEnded && !event.reportHref) {
            var badge = document.createElement('span');
            badge.className = 'status-badge';
            badge.textContent = 'レポート作成中';
            a.appendChild(badge);
        }

        var h2 = document.createElement('h2');
        h2.textContent = event.title;
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
        readMore.textContent = linkLabel;
        a.appendChild(readMore);

        card.appendChild(a);
        li.appendChild(card);
        return li;
    }

    fetch('../assets/data/events.json')
        .then(function (res) {
            if (!res.ok) throw new Error('events.json の取得に失敗しました');
            return res.json();
        })
        .then(function (events) {
            if (!Array.isArray(events)) events = [];

            var now = new Date();
            var upcoming = [];
            var ended = [];

            events.forEach(function (event) {
                var endTime = new Date(event.end || event.start);
                if (!isNaN(endTime.getTime()) && endTime < now) {
                    ended.push(event);
                } else {
                    upcoming.push(event);
                }
            });

            // 予定しているイベント: 開催が近い順
            upcoming.sort(function (a, b) {
                return new Date(a.start) - new Date(b.start);
            });
            // 終了したイベント: 新しい開催順
            ended.sort(function (a, b) {
                return new Date(b.start) - new Date(a.start);
            });

            if (upcoming.length === 0) {
                upcomingEmpty.hidden = false;
            } else {
                upcoming.forEach(function (event) {
                    upcomingList.appendChild(buildCard(event, false));
                });
            }

            if (ended.length === 0) {
                endedEmpty.hidden = false;
            } else {
                ended.forEach(function (event) {
                    endedList.appendChild(buildCard(event, true));
                });
            }
        })
        .catch(function (err) {
            upcomingEmpty.hidden = false;
            upcomingEmpty.textContent = 'イベント情報の読み込みに失敗しました。';
            endedEmpty.hidden = true;
            console.error(err);
        });
})();