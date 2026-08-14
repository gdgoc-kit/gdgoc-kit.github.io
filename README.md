# GDGoC KIT 公式サイト

GDGoC KIT（Google Developer Groups on Campus KIT / GDG on Campus Kanazawa Institute of Technology）のイベントレポートや開催予定イベントを公開するサイトです。

- 公開URL: [https://gdgoc-kit.github.io/](https://gdgoc-kit.github.io/)
- 公式X: [https://x.com/kit_gdsc](https://x.com/kit_gdsc)
- 公式サイト（GDGコミュニティページ）: [https://gdg.community.dev/gdg-on-campus-kanazawa-institute-of-technology-ishikawa-japan/](https://gdg.community.dev/gdg-on-campus-kanazawa-institute-of-technology-ishikawa-japan/)

## ディレクトリ構成

```plaintext
├── index.html              # トップページ
├── about/
│   └── index.html          # 団体紹介ページ
├── report/                 # イベントレポート
│   ├── index.html          # レポート一覧
│   ├── _template.html      # レポート作成用テンプレート
│   ├── 20260421.html       # 個別レポート（ファイル名 = イベント実施日）
│   └── 20260509.html
├── event/
│   └── index.html          # 開催予定イベント一覧
├── assets/
│   ├── css/
│   │   ├── base.css        # 全ページ共通スタイル
│   │   ├── top.css         # トップページ専用スタイル
│   │   ├── about.css       # 団体紹介ページ専用スタイル
│   │   ├── report.css      # 個別レポートページ専用スタイル
│   │   ├── report-list.css # レポート一覧ページ専用スタイル
│   │   └── event-list.css  # イベント一覧ページ専用スタイル
│   ├── data/
│   │   ├── reports.json    # レポートメタデータ一覧
│   │   └── events.json     # イベント情報一覧
│   ├── js/
│   │   ├── top.js          # トップページ用スクリプト
│   │   ├── report.js       # 個別レポートページ用スクリプト
│   │   ├── report-list.js  # レポート一覧ページ用スクリプト
│   │   └── event-list.js   # イベント一覧ページ用スクリプト
│   └── images/
│       ├── branding/
│       │   └── logo.png    # チャプターロゴ
│       └── 20260421/       # レポートに対応した画像フォルダ
├── feed.xml                # RSSフィード（自動生成）
├── scripts/
│   └── generate-feed.js    # feed.xml 生成スクリプト
├── docs/
│   └── about_pages.md      # ページ追加・運用手順
└── README.md
```

## コンテンツの追加方法

[docs/about_pages.md](docs/about_pages.md) を参照してください。

## ブランチ運用ルール

| プレフィックス | 用途 | 命名例 |
|---|---|---|
| `main` | 本番反映用（GitHub Pagesはここから配信） | `main` |
| `report/` | 個別イベントレポート | `report/20260421` |
| `event/` | イベント情報の追加・更新 | `event/20260815` |
| `top/` | トップページの変更 | `top/faq` |
| `about/` | 団体紹介ページの変更 | `about/new` |
| `feature/` | サイトの機能追加・デザイン変更 | `feature/toc-nav` |
| `fix/` | 不具合修正 | `fix/feed-jst` |
| `chore/` | 軽微な修正・設定変更・README更新など | `chore/readme-update` |

**判断基準**：「これは将来、`report/`のように専用ディレクトリを持つコンテンツになるか？」→ Yesならコンテンツ系の新しいプレフィックスを作る。Noなら`feature`/`fix`/`chore`のいずれかを使う。

- 小文字・ハイフン区切り
- 日付を含む場合は`YYYYMMDD`
- 1ブランチ＝1つの作業。`main`にマージしたらブランチは削除してよい

## 管理者

- GitHubアカウント権限保持者: GDGoC KIT Organizer
- 困ったときの連絡先: Slack
