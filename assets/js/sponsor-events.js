/* ============================================================
   スポンサー募集ページ（sponsor/index.html）専用スクリプト
   ============================================================
   assets/data/events.json のうち seekingSponsor: true かつ
   終了していないイベントを「スポンサー募集中のイベント」として
   一覧表示する。
   ============================================================ */

(function () {
    var list = document.getElementById('sponsor-event-list');
    var empty = document.getElementById('sponsor-event-empty');
    if (!list || !empty) return;

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

    function buildCard(event) {
        var li = document.createElement('li');

        var card = document.createElement('div');
        card.className = 'event-card';

        var a = document.createElement('a');
        if (event.href) {
            a.href = event.href;
            a.target = '_blank';
            a.rel = 'noopener';
        } else {
            a.href = '../event/index.html';
        }

        var dateSpan = document.createElement('span');
        dateSpan.className = 'date';
        dateSpan.textContent = (event.dateTentative && event.dateLabel)
            ? event.dateLabel
            : formatDateTime(event.start);
        a.appendChild(dateSpan);

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
        readMore.textContent = event.href ? '詳細を見る →' : 'イベント情報を見る →';
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
            var targets = events.filter(function (event) {
                if (!event.seekingSponsor) return false;
                var endTime = new Date(event.end || event.start);
                return isNaN(endTime.getTime()) || endTime >= now;
            });

            targets.sort(function (a, b) {
                return new Date(a.start) - new Date(b.start);
            });

            if (targets.length === 0) {
                empty.hidden = false;
            } else {
                targets.forEach(function (event) {
                    list.appendChild(buildCard(event));
                });
            }
        })
        .catch(function (err) {
            empty.hidden = false;
            empty.textContent = 'イベント情報の読み込みに失敗しました。';
            console.error(err);
        });
})();
