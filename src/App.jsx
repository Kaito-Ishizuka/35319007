import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  Bookmark, BookmarkCheck, MapPin, ExternalLink, Search, Waves,
  Fish, Cake, Laptop, Train, Lightbulb, CalendarDays, Compass, Home
} from "lucide-react";

const C = {
  ink: "#0E1D28", ink2: "#16303F", panel: "#1B3A4B", line: "#2C5468",
  mist: "#E6EDF0", mist2: "#A9C0CB", lamp: "#E8A33D", shako: "#C8503F",
  algae: "#5E9E8A", paper: "#F3F1EA",
};
const FD = '"Hiragino Mincho ProN","Yu Mincho",YuMincho,"Noto Serif JP",serif';
const FB = '"Hiragino Kaku Gothic ProN","Yu Gothic",YuGothic,"Noto Sans JP",sans-serif';
const FM = 'ui-monospace,SFMono-Regular,Menlo,"Courier New",monospace';
const gmap = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const STAY_MONTHS = [8, 9, 10, 11, 12, 1, 2, 3];
const SHUN = [
  { n: "エゾバフンウニ（積丹）", m: [8], note: "積丹の口開けは6/1〜8/31。夏を逃すと生は難しい", hot: true },
  { n: "スルメイカ（真イカ）", m: [8, 9], note: "刺身も塩辛も。市場が一番安い" },
  { n: "秋鮭・いくら", m: [9, 10, 11], note: "9月は筋子が柔らかい。自家製いくらが最安" },
  { n: "サンマ", m: [9, 10], note: "根室・釧路もの。刺身で食べられるのは道内の特権" },
  { n: "ホッケ（真ほっけ）", m: [9, 10, 11], note: "居酒屋の開きより、市場の生ホッケが別物" },
  { n: "秋シャコ（小樽）", m: [10, 11, 12], note: "卵持ちのメス。小樽のシャコは1尾50gの別格サイズ", hot: true },
  { n: "宗八カレイ", m: [11, 12], note: "干物にすると異次元。市場で干し上がりを買う" },
  { n: "ボタンエビ", m: [11, 12, 1], note: "頭の味噌まで。高いが価値あり" },
  { n: "真ダラ・白子（たち）", m: [11, 12, 1, 2], note: "「たちポン」は北海道の冬そのもの", hot: true },
  { n: "牡蠣（厚岸・仙鳳趾）", m: [10, 11, 12, 1, 2, 3], note: "冬が本番。厚岸は通年だが寒い時期が濃い" },
  { n: "毛ガニ", m: [12, 1, 2, 3], note: "冬の道央もの。1杯まるごと買って自宅で" },
  { n: "ナマコ・真ツブ", m: [12, 1, 2], note: "ツブの刺身はコリコリ。唾液腺だけ要処理" },
  { n: "ニシン（群来）", m: [1, 2, 3], note: "2〜3月に祝津の海が白くなる「群来（くき）」は必見", hot: true },
  { n: "ヤリイカ", m: [2, 3], note: "スルメイカより繊細。透明なうちに" },
  { n: "ホタテ（おタテ）", m: [8, 9, 10, 11, 12, 1, 2, 3], note: "小樽産は通年。刺身・貝焼きどちらも" },
];

const MONTHS = [
  { m: 8, label: "8月", sub: "夏の最終コーナー", lead: "ウニと花火が同時に終わる月。8/31で積丹のウニが閉じるので、生ウニだけは何を置いても先に潰す。", events: [
    { t: "小樽高島花火（8/8・土）｜ペア座敷 購入済み", d: "開場15:00・打ち上げ20:00〜21:00・約1万発。座敷席は2名分の指定ブルーシートが配布されるのでレジャーシートは不要。座布団は縦横60cm・厚さ5cm以内を1人1つまで持ち込み可。椅子・テーブル・クーラーボックス・大型テント・パラソルは持ち込み禁止。18時以降が混むので、17時台の入場を狙うと動きやすい。", url: "https://takashima-hanabi.com/rules/", map: "小樽市公設水産地方卸売市場 小樽市高島1丁目2-5", flag: "確定" },
    { t: "花火当日：フードチケットと足", d: "会場内の飲食・物販は専用フードチケット（1冊2,000円）のみ。事前購入か当日現金で買える。余っても8/14〜16の高島越後盆踊りで使えるので、使い切ろうとしなくていい。シャトルバスは付きチケット限定なので、なければ中央バス「日粉前」バス停（番号2 小樽市内本線／番号10 おたる水族館線・片道240円）。帰りは路線バスが終わっている想定で、シャトル利用者は21:15〜21:30から順次運行。", url: "https://takashima-hanabi.com/faqs/", map: "日粉前 バス停 小樽市高島", flag: "当日" },
    { t: "高島越後盆踊り（8/14〜16）", d: "花火の翌週、高島児童公園で3日間。小樽市指定無形民俗文化財。浴衣を借りたら/買ったらここでもう一度着られる。", url: "https://takashima-hanabi.com/", map: "高島児童公園 小樽市高島" },
    { t: "MARINA FIREWORKS（8/22・25・29）", d: "小樽港マリーナのレストランで食事しながら約3分の花火。人混みゼロで花火を見たい日に。", url: "https://visit-kitashiri.com/della-marina/", map: "Trattoria Della Marina Otaru 小樽市築港5-7" },
  ], todo: ["積丹へ日帰り（島武意海岸・神威岬）でウニ丼。8/31が期限", "余市のニッカ余市蒸溜所（JR南小樽から約35分）", "天狗山ロープウェイで夜景。日没が遅い夏のうちに一度", "祝津：おたる水族館＋パノラマ展望台"] },
  { m: 9, label: "9月", sub: "いくらを仕込む月", lead: "秋鮭が入り出す。9月の生筋子は皮が柔らかくてほぐしやすいので、自家製いくらの作り時。外食より圧倒的に安く上がる。", events: [
    { t: "さっぽろオータムフェスト", d: "大通公園で9月上旬〜下旬。北海道中の食が丁目ごとに並ぶ。夕方から行けるので妻の勤務後でも間に合う。", url: "https://www.sapporo-autumnfest.jp/", map: "大通公園 札幌市中央区" },
    { t: "市立小樽図書館 創立110周年イベント（9/26〜27）", d: "作業拠点として通う場所のお祭り。顔を出しておくと居心地が変わる。", url: "https://www.otaru-lib.jp/", map: "市立小樽図書館 小樽市花園5-1-1" },
  ], todo: ["南樽市場か新南樽市場で生筋子を買い、自宅でいくら醤油漬け", "余市・仁木のぶどう狩り／ワイナリー巡り（9月まで）", "サンマの刺身。道内でしか食べられない", "紅葉前の朝里川温泉で日帰り湯"] },
  { m: 10, label: "10月", sub: "秋シャコ解禁", lead: "小樽が一年で一番「小樽らしい」味になる月。秋シャコは卵持ちのメスで、市場の茹でたてを買うのが正解。紅葉も重なる。", events: [
    { t: "紅葉（天狗山・朝里ダム・定山渓）", d: "10月中旬が小樽周辺のピーク。定山渓は札幌からバスで、朝里ダムはJR朝里駅から。", url: "https://jozankei.jp/", map: "朝里ダム 小樽市朝里川温泉" },
  ], todo: ["市場の茹でたて秋シャコ。むき身より殻付きのほうが安くて旨い", "新そば（余市・仁木・小樽の蕎麦屋）", "厚岸／仙鳳趾の生牡蠣が本気を出し始める", "冬タイヤ・冬靴・滑り止めの調達（10月中に済ませると混まない）"] },
  { m: 11, label: "11月", sub: "冬の入り口", lead: "初雪が降る。観光客が一気に減って店が空くので、実は小樽が一番落ち着いて美味しい月。天狗山は整備運休期間があるので事前確認を。", events: [
    { t: "小樽しゃこ祭", d: "例年11月に運河近くで開催。浜茹での実演販売。ただし中止の年もあるので小樽市漁協の告知を要確認。", url: "http://jf-otaru.jp/event/", map: "小樽港第3号ふ頭 小樽市港町" },
    { t: "さっぽろホワイトイルミネーション", d: "11月下旬〜。大通公園から駅前通りまで。ミュンヘン・クリスマス市も同時期に始まる。", url: "https://white-illumination.jp/", map: "大通公園 札幌市中央区" },
    { t: "小樽ゆき物語（11月上旬〜2月）", d: "運河の「青の運河」と浮き玉のツリー。夜型向けの通年イベント。", url: "https://otaru.gr.jp/", map: "小樽運河 小樽市港町" },
  ], todo: ["ボタンエビ・宗八カレイの干物を市場で", "灯油／暖房費の確認（Airbnbが光熱費別なら冬は跳ね上がる）", "スキー場のシーズン券・回数券の早割チェック（キロロ・朝里川温泉）"] },
  { m: 12, label: "12月", sub: "たちポンの季節", lead: "真ダラの白子（たち）が出る。ポン酢で食べるだけで完成する、北海道の冬でいちばんコスパのいい贅沢。ワカサギ釣りツアーも下旬から動き出す。", events: [
    { t: "ワカサギ釣り開幕（12月下旬〜）", d: "茨戸川の氷上ワカサギは札幌駅送迎付きツアーがある。車なしでも行ける唯一に近い選択肢。予約は早めに。", url: "https://www.dolphins.gr.jp/sapporo-wakasagi/", map: "茨戸川 札幌市北区", flag: "やりたい" },
    { t: "小樽ロングクリスマス／運河イルミ", d: "運河沿いと堺町通りが灯る。夜が主役なので生活リズムに合う。", url: "https://otaru.gr.jp/", map: "堺町通り 小樽市堺町" },
  ], todo: ["たちポン。市場で真ダラの白子を買って自宅で", "年末の南樽市場（29〜31日は戦場。ただし活気は年間最高）", "毛ガニを1杯まるごと買ってみる", "スキー／スノボ初日（天狗山は市内、バスで行ける）"] },
  { m: 1, label: "1月", sub: "本気の冬", lead: "寒さのピーク。ただし海は一番いい。徒歩圏の住吉神社で初詣ができるのは住吉町に住む特権。", events: [
    { t: "ワカサギ釣りベストシーズン（1月〜3月上旬）", d: "氷が安定するのは1月以降。茨戸川、しのつ湖（道の駅しんしのつ、温泉併設）など。", url: "https://www.dolphins.gr.jp/sapporo-wakasagi/", map: "茨戸川 札幌市北区", flag: "やりたい" },
    { t: "定山渓 雪灯路", d: "1月下旬〜2月上旬。2000個のスノーキャンドルが神社の参道を埋める。札幌からバス。", url: "https://jozankei.jp/", map: "定山渓神社 札幌市南区定山渓温泉東3丁目" },
    { t: "初詣（住吉神社）", d: "自宅の目の前。小樽総鎮守。三が日を外せば静か。", url: "https://otaru.gr.jp/", map: "住吉神社 小樽市住ノ江2丁目5-1" },
  ], todo: ["真ツブ・ソイ・寒ヒラメ。冬の白身がいちばん締まる", "天狗山の夜景（冬のほうが空気が澄んで圧倒的）", "銭湯温泉（神仏湯温泉が住吉神社前で徒歩圏）"] },
  { m: 2, label: "2月", sub: "イベントの月", lead: "雪まつりと雪あかりの路が重なる、北海道の冬の本丸。どちらも夜のイベントなので夜型にはむしろ有利。", events: [
    { t: "第29回 小樽雪あかりの路（2/6〜13）", d: "運河・旧手宮線・芸術村など市内約20か所。次回から運河の浮き玉がロウソクから電灯に変わる。地元開催なので何度でも行ける。", url: "http://yukiakarinomichi.org/", map: "小樽運河 浅草橋街園 小樽市港町", flag: "必見" },
    { t: "2027 さっぽろ雪まつり（2/4〜11）", d: "大通・すすきの・つどーむの3会場。すすきの会場は23時までライトアップで夜型向き。", url: "https://www.snowfes.com/", map: "大通公園 札幌市中央区" },
    { t: "ニシンの群来（2〜3月）", d: "産卵で海が乳白色に染まる現象。祝津・張碓の海岸で運が良ければ。SNSで速報が出る。", url: "https://otaru.gr.jp/", map: "祝津パノラマ展望台 小樽市祝津3丁目" },
  ], todo: ["雪あかりの路のボランティア参加（地元に混ざる一番早い方法）", "ヤリイカの刺身", "バレンタイン：ルタオ本店のチョコレート"] },
  { m: 3, label: "3月", sub: "締めくくり", lead: "雪が緩んで歩きやすくなる。ニシンと毛ガニ、そして春シャコの手前。滞在を延ばすならここで判断。", events: [
    { t: "ニシン群来の最終盤", d: "3月上旬まで。まだ見ていなければここが最後のチャンス。", url: "https://otaru.gr.jp/", map: "祝津前浜 小樽市祝津" },
  ], todo: ["毛ガニ・桜鱒", "雪解けの運河（人がいない小樽が撮れる時期）", "延長するか離れるかの判断。4月に入ると宿の相場が上がる"] },
];

const FOOD = [
  { g: "市場（最優先）", items: [
    { n: "南樽市場", a: "新富町12-1 / 南小樽駅 徒歩10〜15分", why: "昭和24年創業、小樽市民の台所。観光客向けではないので値付けが正直。日曜定休、9:00〜18:30。まずここを生活のベースにする。", map: "南樽市場 小樽市新富町12-1", url: "http://www.nantaruichiba.or.jp/", tags: ["徒歩圏", "自炊", "日曜休"] },
    { n: "新南樽市場", a: "築港8-11 / ウイングベイ小樽隣", why: "南樽より店数が多く広い。水曜定休、9:00〜18:00。南樽が休みの日曜はこちらへ、という使い分けが効く。", map: "新南樽市場 小樽市築港8-11", url: "https://www.shin-nantaru.com/", tags: ["徒歩圏", "自炊", "水曜休"] },
    { n: "三角市場", a: "稲穂3丁目10-16 / 小樽駅 徒歩1分", why: "観光市場だが海鮮丼の食堂が固まっている。朝7時台から開くので、早起きできた日の切り札。", map: "三角市場 小樽市稲穂3丁目10-16", tags: ["観光価格", "朝"] },
    { n: "鱗友朝市", a: "色内3丁目10-15", why: "早朝4〜5時台から動く漁師寄りの市場。朝が苦手なら無理はしなくていいが、一度だけは価値がある。", map: "鱗友朝市 小樽市色内3丁目10-15", tags: ["早朝", "上級"] },
  ]},
  { g: "寿司（地元価格）", items: [
    { n: "聖徳太子 飛鳥店", a: "花園 / 寿司屋通りから少し外れ", why: "小樽で最強クラスのコスパと言われる一軒。完全に地元客向けの値付けで、ランチは驚く価格。海鮮の一品料理も充実していて夜の居酒屋使いもできる。", map: "聖徳太子 飛鳥店 小樽市花園", tags: ["コスパ", "地元", "昼夜"] },
    { n: "魚真", a: "小樽駅〜運河の裏手", why: "魚屋直営でネタが大きい。15貫の「魚真にぎり」に土瓶蒸しまで付いて3千円前後。地元タクシー運転手の定番。", map: "魚真 小樽市稲穂", tags: ["コスパ", "地元"] },
    { n: "おたる政寿司 本店", a: "花園1丁目 / 寿司屋通り", why: "昭和13年創業、食べログ百名店。ここは「高くても本物」枠。滞在中に一度、記念日に。", map: "おたる政寿司 本店 小樽市花園1丁目1-1", url: "https://www.masazushi.co.jp/", tags: ["名店", "記念日"] },
    { n: "伊勢鮨 駅中店", a: "JR小樽駅構内", why: "立ち食いスタイルで本店の江戸前が食べられる。1貫から注文可。札幌へ出る前の10分で寿司が食える構造がずるい。", map: "伊勢鮨 駅中店 小樽市稲穂2丁目 JR小樽駅", tags: ["手軽", "駅"] },
    { n: "おたる 鮨玄", a: "小樽市内", why: "こぢんまりした地元人気店。接客が温かくリーズナブル。常連になれる規模の店。", map: "おたる 鮨玄 小樽市", tags: ["地元", "常連向き"] },
    { n: "すし処 わさび（南樽市場内）", a: "南樽市場内", why: "市場の中の寿司屋。買い物ついでに座れる。徒歩圏の日常使いとして最強の立地。", map: "すし処 わさび 南樽市場 小樽市新富町", tags: ["徒歩圏", "日常"] },
  ]},
  { g: "北海道グルメ", items: [
    { n: "なると本店（若鶏半身揚げ）", a: "稲穂3丁目16-13", why: "小樽名物の若鶏半身揚げ。観光名物だが地元も食べる本物。テイクアウトして家で食べるのもあり。", map: "なると本店 小樽市稲穂3丁目16-13", tags: ["名物", "テイクアウト"] },
    { n: "小樽出抜小路", a: "色内1丁目1 / 運河前", why: "屋台村形式で数軒はしごできる。夜型の第一歩に。火の見櫓から運河が見下ろせる。", map: "小樽出抜小路 小樽市色内1丁目1", tags: ["夜", "はしご"] },
    { n: "Cotton Cloth（コットンクロス）", a: "花園4丁目18-3", why: "地元民が通う穴場の洋食店。オムハヤシ。月火休、日曜は12:00〜20:00。", map: "Cotton Cloth 小樽市花園4丁目18-3", tags: ["洋食", "地元"] },
    { n: "小樽ビール 小樽倉庫No.1", a: "港町5-4 / 運河沿い", why: "ドイツ人ブラウマイスターの本格醸造。醸造設備を見ながら飲める。ヴァイス推奨。", map: "小樽倉庫No.1 小樽市港町5-4", url: "https://otarubeer.com/", tags: ["ビール", "運河"] },
    { n: "ニッカウヰスキー 余市蒸溜所", a: "余市町黒川町7-6 / JR余市駅 徒歩3分", why: "南小樽から約35分。見学は無料、有料テイスティングあり。雨でも寒くても成立する、車なしで行ける最良の遠足。", map: "ニッカウヰスキー 余市蒸溜所 余市町黒川町7-6", url: "https://www.nikka.com/distilleries/yoichi/", tags: ["電車", "通年", "雨OK"] },
  ]},
  { g: "札幌に出た日", items: [
    { n: "だるま（ジンギスカン）", a: "すすきの", why: "札幌のジンギスカンの基準点。カウンターのみ、行列必至だが回転は速い。夜遅くまで開いている。", map: "成吉思汗 だるま 本店 札幌市中央区南5条西4丁目", tags: ["夜", "ジンギスカン"] },
    { n: "二条市場", a: "中央区南3条東1〜2", why: "札幌の台所。小樽の市場と比べると観光寄りだが、品揃えの幅は上。", map: "二条市場 札幌市中央区南3条東1丁目", tags: ["市場"] },
    { n: "サッポロビール博物館", a: "東区北7条東9丁目1-1", why: "見学無料、有料テイスティングあり。隣のジンギスカンホールとセットで半日。", map: "サッポロビール博物館 札幌市東区北7条東9丁目1-1", url: "https://www.sapporobeer.jp/brewery/s_museum/", tags: ["雨OK"] },
  ]},
];

const SWEETS = [
  { n: "プリン専門店 アンデリス", a: "住ノ江 / 自宅から徒歩圏", why: "浜中町の乳製品と余市産の卵で作る純白カスタードプリン。カスタード好きなら最初に行くべき店。プリンどら焼き・プリン大福もある。10:00〜18:00、水曜定休。", map: "プリン専門店 アンデリス 小樽市住ノ江", tags: ["カスタード", "徒歩圏", "水曜休"], star: true },
  { n: "北菓楼 小樽本館", a: "堺町7-22 / 南小樽駅 徒歩6分", why: "シュークリーム「北の夢ドーム」と「夢不思議」。生クリームとカスタードのWクリームが甘さ控えめでとろける。イートインなしなので店先で。", map: "北菓楼 小樽本館 小樽市堺町7-22", url: "https://www.kitakaro.com/", tags: ["カスタード", "シュー"], star: true },
  { n: "ルタオ 本店", a: "堺町7-16 / メルヘン交差点", why: "ドゥーブルフロマージュの本拠地。2階のカフェは限定メニューあり。小樽駅の「エキモルタオ」には駅限定シュークリームがある。", map: "ルタオ 本店 小樽市堺町7-16", url: "https://www.letao.jp/", tags: ["定番", "カフェ"] },
  { n: "あまとう 本店", a: "稲穂2丁目16-18", why: "昭和4年創業。2階が昭和の純喫茶そのままで、クリームぜんざいと「顔パフ」が名物。マロンコロンは土産の定番。デート向きの空気。", map: "あまとう 本店 小樽市稲穂2丁目16-18", tags: ["純喫茶", "デート"], star: true },
  { n: "アイスクリームパーラー美園", a: "稲穂2丁目12-15", why: "大正時代創業、北海道で初めてアイスクリームを売った店。自家製プリンを使うプリンパフェは数量限定で卵の風味が強い。", map: "アイスクリームパーラー美園 小樽市稲穂2丁目12-15", tags: ["レトロ", "プリン"] },
  { n: "六花亭 小樽運河店", a: "堺町 / 運河近く", why: "2階の喫茶室が無料のコーヒー付きで異常に居心地がいい。サクサクパイはその場でしか食べられない。", map: "六花亭 小樽運河店 小樽市堺町", url: "https://www.rokkatei.co.jp/", tags: ["喫茶", "コスパ"] },
  { n: "桑田屋（ぱんじゅう）", a: "色内1丁目 / 運河プラザ内ほか", why: "小樽の下町おやつ。あんこ入りの小さな焼き菓子で1個から買える。散歩のお供に。", map: "桑田屋 本店 小樽市色内1丁目", tags: ["安い", "食べ歩き"] },
];

const WORK = [
  { n: "市立小樽図書館", a: "花園5-1-1 / 小樽駅 徒歩11分", why: "2024年に館内Wi-Fiが導入され、長時間の調べ物が可能に。2階に学習室と休憩コーナー。無料で一番安定した選択肢。夏はクーリングシェルターにもなる。", map: "市立小樽図書館 小樽市花園5-1-1", url: "https://www.otaru-lib.jp/", tags: ["無料", "Wi-Fi", "静か"], cost: "無料" },
  { n: "湯の花 朝里殿 コワーキング", a: "小樽市朝里川温泉", why: "2時間500円／3時間700円でフリーWi-Fi＋ワンドリンク付き、全17席。温泉施設併設なので作業後にそのまま風呂。小樽で一番「わざわざ行く価値がある」作業場所。", map: "湯の花 朝里殿 小樽市朝里川温泉", url: "https://www.yunohana.org/asari/", tags: ["温泉", "安い", "ドリンク付"], cost: "2h 500円〜", star: true },
  { n: "ウイングベイ小樽", a: "築港11 / 小樽築港駅直結", why: "フードコートとベンチが大量にあり、電源席も点在。自宅から徒歩＋一駅圏内で、雪の日でも屋内だけで完結する。映画館・イオン・書店も同じ建物。", map: "ウイングベイ小樽 小樽市築港11", url: "https://www.wingbay-otaru.co.jp/", tags: ["徒歩圏", "冬に強い", "無料"], cost: "無料（要飲食）" },
  { n: "CozyInn OTARU（時間貸し個室）", a: "小樽駅 徒歩8分", why: "インスタベース／スペースマーケットで時間貸しされている個室。オンライン会議や、どうしても集中したい日の駆け込み先。飲食持込可。", map: "CozyInn OTARU 小樽市", url: "https://www.instabase.jp/hokkaido-w1203-self-desk", tags: ["個室", "会議可"], cost: "時間貸し" },
  { n: "PRESS CAFE（北運河）", a: "色内3丁目 / 北運河沿い", why: "石造倉庫を改装した広いカフェ。観光客が少ない北運河側で、席の間隔が広く長居しやすい。電源の有無は席によるので要確認。", map: "PRESS CAFE 小樽市色内3丁目3-21", tags: ["カフェ", "広い"], cost: "ドリンク代" },
  { n: "小樽百貨UNGA↑", a: "色内2丁目1-20 / 旧渋沢倉庫", why: "併設カフェが静かで天井が高い。作業というより「考えごとをする日」向け。", map: "小樽百貨UNGA 小樽市色内2丁目1-20", tags: ["カフェ", "静か"], cost: "ドリンク代" },
  { n: "札幌市中央図書館", a: "札幌市中央区南22条西13丁目", why: "小樽で行き詰まった週の逃げ場。蔵書量と席数が桁違い。札幌に出る日にセットで。", map: "札幌市中央図書館 札幌市中央区南22条西13丁目1-1", tags: ["札幌", "無料"], cost: "無料" },
];

const TRIPS = [
  { n: "祝津：おたる水族館＋パノラマ展望台", d: "半日", start: "11:30出発でOK", season: "通年（水族館は冬季短縮）", why: "小樽駅からバス25分。イルカとトドのショー、そして展望台からの日本海。冬は「冬期水族館」になって空いている。ニシンの群来もここから見える。", map: "おたる水族館 小樽市祝津3丁目303", url: "https://otaru-aq.jp/", tags: ["小樽内", "夫婦向き"] },
  { n: "天狗山ロープウェイ（夜景）", d: "3〜4時間", start: "16時以降で成立", season: "通年（11月に整備運休あり）", why: "北海道三大夜景。バスで山麓まで行ける。夜型の二人には最も相性がいい定番で、季節を変えて何度行っても違う。冬はスキー場としても使える。", map: "小樽天狗山ロープウェイ 小樽市最上2丁目16-15", url: "https://tenguyama.ckk.chuo-bus.co.jp/", tags: ["小樽内", "夜", "デート"], star: true },
  { n: "余市：ニッカ蒸溜所＋ワイナリー", d: "1日", start: "11時出発で足りる", season: "通年", why: "JR南小樽から約35分。蒸溜所見学は無料、ワイナリーは秋がいい。電車で完結し、体力をほぼ使わない。雨でも寒くても計画が壊れない。", map: "ニッカウヰスキー 余市蒸溜所 余市町黒川町7-6", url: "https://www.nikka.com/distilleries/yoichi/", tags: ["電車", "雨OK", "1日"] },
  { n: "積丹：島武意海岸・神威岬・ウニ丼", d: "1日", start: "早めの出発が必要", season: "6〜8月（ウニは8/31まで）", why: "積丹ブルーとウニ丼。車なしだと中央バスで時間がかかるので、8月中に一度だけ気合いを入れて行く枠。移動が長いので体力に余裕がある日に。", map: "島武意海岸 積丹町入舸町", tags: ["夏限定", "移動長い"] },
  { n: "朝里川温泉で日帰り湯", d: "半日", start: "何時からでも", season: "通年（紅葉は10月）", why: "JR朝里駅かバス。温泉宿の日帰り入浴、湯の花朝里殿のコワーキング＋温泉、冬はスキー場。自宅から一番近い「観光地」。", map: "朝里川温泉 小樽市朝里川温泉", tags: ["近い", "温泉", "通年"] },
  { n: "小樽芸術村", d: "2〜3時間", start: "午後で足りる", season: "通年", why: "旧銀行・倉庫を使ったステンドグラスと工芸の美術館群。文化観光の優先度が低くても、雨と雪の日の避難先として持っておく価値がある。", map: "小樽芸術村 小樽市色内1丁目3-1", tags: ["雨OK", "小樽内"] },
  { n: "札幌：オータムフェスト／雪まつり／ライブ", d: "1日", start: "夕方出発でも可", season: "季節による", why: "高速おたる号かJRで約1時間。大和ハウス プレミストドーム（旧・札幌ドーム）のライブは狙い目。夜のイベントが多いので生活リズムと噛み合う。", map: "大和ハウス プレミストドーム 札幌市豊平区羊ケ丘1", tags: ["札幌", "夜"] },
  { n: "ワカサギ釣り（茨戸川ほか）", d: "半日", start: "午前集合が多い", season: "12月下旬〜3月上旬", why: "札幌駅発の送迎付きツアーなら車なしで成立し、道具も全部貸出。釣ったその場で天ぷらにしてくれる。集合が朝寄りなのが唯一のハードル。", map: "茨戸川 札幌市北区", url: "https://www.dolphins.gr.jp/sapporo-wakasagi/", tags: ["冬限定", "要予約"], star: true },
  { n: "定山渓（温泉＋雪灯路）", d: "1日", start: "11時出発でOK", season: "通年（雪灯路は1月下旬〜2月上旬）", why: "札幌からバス。紅葉と雪の両方で見どころがある温泉地。日帰り入浴の選択肢が多い。", map: "定山渓温泉 札幌市南区定山渓温泉", url: "https://jozankei.jp/", tags: ["温泉", "1日"] },
  { n: "支笏湖 氷濤まつり", d: "1日", start: "夕方着でも成立", season: "1月末〜2月中旬", why: "湖水を吹き付けて作る氷のオブジェが日没後にライトアップされる。札幌から直行バスあり。寒さは覚悟がいるが夜が本番。", map: "支笏湖温泉 千歳市支笏湖温泉", tags: ["冬限定", "夜"] },
  { n: "ウイングベイ小樽で映画＋買い物", d: "半日", start: "何時からでも", season: "通年", why: "徒歩＋一駅。吹雪いた日、体力がない日、何も決まらない日の答え。映画館・イオン・新南樽市場が一か所にある。", map: "ウイングベイ小樽 小樽市築港11", url: "https://www.wingbay-otaru.co.jp/", tags: ["徒歩圏", "雨雪OK"] },
];

const MOVE = [
  { n: "JR（南小樽駅が最寄り）", why: "住吉町からは南小樽駅が徒歩圏。札幌まで快速で約35〜45分、余市まで約35分、朝里まで数分。冬は雪で遅延・運休があるので予定に余白を。", map: "南小樽駅 小樽市住ノ江1丁目", tags: ["基本"] },
  { n: "高速おたる号（中央バス／JR北海道バス）", why: "札幌駅まで約1時間。JRより安いことが多く、ICカードとクレジットカードのタッチ決済が使える。区間指定回数券をスマホアプリ「バスモ」で買えるので、札幌に月4回以上出るなら回数券が効く。", map: "小樽駅前バスターミナル 小樽市稲穂2丁目", url: "https://www.chuo-bus.co.jp/highway/?t=21&ope=list&o=1", tags: ["安い", "回数券"], star: true },
  { n: "中央バス 小樽市内線", why: "市内均一区間は片道240円。祝津・天狗山・高島・朝里はバスが基本で、坂を歩かずに済む。ICカード利用可。「番号2 小樽市内本線」と「番号10 おたる水族館線」が海側の主要2本。", map: "小樽駅前バスターミナル 小樽市稲穂2丁目", url: "https://www.chuo-bus.co.jp/", tags: ["市内", "240円均一"] },
  { n: "レンタサイクル（観光振興公社）", why: "2時間まで500円、1日2000円。ヘルメット貸出と賠償責任保険付き。まず1日借りて坂の勾配を体で確かめるのがおすすめ。", map: "小樽市観光駐車場 小樽市色内3丁目", url: "https://otaru-kankousen.jp/bicycle-rental/", tags: ["お試し"] },
  { n: "きたりん（小樽駅前）", why: "JR小樽駅から徒歩0分。電動アシストあり。2時間600円前後で、早朝・夕暮れプランもある。", map: "小樽レンタル自転車きたりん 小樽市稲穂2丁目", url: "https://kitarin.info/", tags: ["駅前", "電動"] },
  { n: "COTARU（電動アシスト専門）", why: "Web予約で全プラン20%OFF、支払いは当日店頭。1泊2日プランがあり翌17時返却。荷物1点無料預かりは宿の移動日に効く。", map: "COTARU レンタサイクル 小樽市", url: "https://www.rentalcycle.cotaru.co/", tags: ["電動", "宿泊プラン"] },
  { n: "【本命】中古自転車を買う", why: "2か月以上滞在するなら、レンタルより中古購入のほうが確実に安い。ジモティー小樽、サイクルベースあさひ小樽店、ホーマックなどで1〜2万円台。ただし小樽は坂が急なので電動アシストでなければ用途は平坦部に限られ、11月下旬〜4月は雪で実質使えない。8〜11月の3か月をどう見るかで判断。", map: "サイクルベースあさひ 小樽店", url: "https://jmty.jp/hokkaido/sale-bic/g-all/a-3-otaru", tags: ["長期滞在", "コスパ"], star: true },
];

const TIPS = [
  { t: "市場の定休日を1セットで覚える", d: "南樽市場は日曜休、新南樽市場は水曜休。この2つを組み合わせると週7日どこかは開いている。どちらも自宅から徒歩・一駅圏内なので、外食より自炊のほうが海鮮の総量は増える。", tag: "食" },
  { t: "観光価格と地元価格の境界線は「堺町通り」", d: "堺町通り・運河沿い・寿司屋通りは観光価格帯。花園・稲穂の裏通り、南小樽・住ノ江エリアは地元価格。同じ小樽で倍近く違う。長期滞在では後者を日常、前者をハレの日に使い分ける。", tag: "食" },
  { t: "生シャコは殻付きの茹でたてを買う", d: "むき身は手間賃が乗って割高。市場で殻付きの浜茹でを買い、家でハサミで開くほうが安くて旨い。小樽のシャコは1尾50gあり他の産地と別物。旬は秋（10〜12月・卵持ちのメス）と春（4〜5月・オス）。", tag: "食" },
  { t: "ウニは6/1〜8/31が本番", d: "積丹のエゾバフンウニの口開けはこの期間。それ以外の時期に出回る「生ウニ」の多くは道外産・輸入・冷凍。今が2026年8月なので、生ウニだけは今月中に決着をつける。", tag: "食" },
  { t: "浴衣は借りるより買ったほうが安い", d: "小樽のレンタル最安帯は1時間4,980円／3時間6,980円／1日9,980円（着付け・小物・下駄込み）。8/8の花火と8/14〜16の高島越後盆踊りで2回着るなら、2人でレンタルすると2万円を超える。イオンやドン・キホーテの浴衣セット（3,000〜6,000円／人）を買えば半額以下で、着付けだけ別途頼む手もある。高島花火の公式LINE登録で対象店の着付けが10%OFFになる。花火は20時打ち上げなので、1日レンタルでないと時間が足りない点も購入が有利に働く理由。", tag: "8月" },
  { t: "座敷席の持ち物は「座布団だけ」", d: "ペア座敷は2名分の指定ブルーシートが配布されるので、レジャーシートを買う必要はない。持ち込めるのは縦横60cm・厚さ5cm以内の座布団を1人1つまで。椅子・テーブル・クーラーボックス・大型テント・パラソルは禁止。岸壁は日が落ちると海風で冷えるので、8月でも羽織るものを1枚。会場は全席禁煙（喫煙スペースあり）。", tag: "8月" },
  { t: "フードチケットは使い切らなくていい", d: "会場内の飲食は専用フードチケット（1冊2,000円）でしか買えないが、余った分は8/14〜16の高島越後盆踊り・高島子供盆踊りで使える。同じ高島地区での開催なので、花火で無理に消費せず盆踊りに持ち越すほうが、浴衣を2回着る計画とも噛み合う。", tag: "8月" },
  { t: "冬の靴は「滑り止め」が本体", d: "小樽は坂の街で、住吉町から南小樽駅・堺町方面はどこへ行っても坂。1〜2月の圧雪路面はスケートリンクになる。スパイク付きスノーブーツか、後付けの滑り止めを11月までに用意する。転倒事故は北海道の冬の最大リスク。", tag: "冬" },
  { t: "冬は日没が16時前", d: "12〜1月の小樽は16時前後に暗くなる。夜型でも活動できるのは実質13時〜16時の3時間。屋外の予定は昼寄りに、夜はイルミネーション・雪あかり・夜景といった「暗いほうがいい」ものに寄せると生活リズムと矛盾しない。", tag: "冬" },
  { t: "Airbnbは光熱費の扱いを必ず確認", d: "北海道の冬は灯油・電気代が跳ね上がる。光熱費別の物件だと12〜2月は月2〜4万円上振れすることがある。次の物件を決める前に「光熱費込みか」「暖房は灯油かガスか電気か」を必ず確認。月15万の予算に一番効く。", tag: "生活" },
  { t: "徒歩圏に銭湯温泉がある", d: "住吉神社前の神仏湯温泉は明治中頃からの銭湯。ほかに中央湯、大正湯、少し足を伸ばして小樽温泉オスパ。銭湯価格で温泉に入れるので、冬の生活コストとして優秀。", tag: "生活" },
  { t: "冬のJRと高速バスは止まる前提で", d: "暴風雪の日はJRが運休し、高速道路も通行止めになる。札幌のイベントに行く日は「帰れなくなる可能性」を織り込むか、当日朝に運行情報を確認する。1〜2月は特に。", tag: "冬" },
  { t: "スーパーの値引きは20時以降", d: "マックスバリュ、ラルズ、生鮮市場、長崎屋小樽店。夜型の生活はここで有利に働く。刺身の柵は20時台に半額になることが多い。", tag: "生活" },
  { t: "ゴミは小樽市指定袋", d: "物件を移るたびに分別ルールを確認する。小樽市指定のごみ袋が必要で、スーパー・コンビニで買える。回収日は地区ごとに違うので、新居に入ったら最初に確認する。", tag: "生活" },
  { t: "天狗山ロープウェイは11月に整備運休がある", d: "紅葉が終わってスキーが始まるまでの間に整備期間が入る。11月に夜景を目当てに行くなら事前に運行状況を確認。", tag: "注意" },
  { t: "しゃこ祭は中止の年がある", d: "例年11月開催だが、近年は中止になった年もある。小樽市漁協または小樽観光協会の告知で確認してから予定を組む。", tag: "注意" },
];

const BUDGET = [
  { k: "外食（海鮮・寿司・居酒屋）", v: 55000, note: "週2〜3回の外食＋月1回の名店枠" },
  { k: "自炊の食材（市場・スーパー）", v: 38000, note: "市場を主戦場にすると海鮮の量が最大化する" },
  { k: "スイーツ・カフェ・デート", v: 14000, note: "週2回のカフェ＋スイーツ" },
  { k: "交通（JR・バス・札幌往復）", v: 16000, note: "札幌往復を月4回想定。回数券で圧縮可" },
  { k: "体験・入場・イベント", v: 18000, note: "ワカサギ釣り・雪まつり・蒸溜所など" },
  { k: "作業場所・雑費", v: 9000, note: "コワーキング／温泉／予備" },
];

function Chip({ children, tone = "line" }) {
  const map = { line: { bg: "rgba(169,192,203,0.10)", fg: C.mist2, bd: C.line }, lamp: { bg: "rgba(232,163,61,0.14)", fg: C.lamp, bd: "rgba(232,163,61,0.4)" }, shako: { bg: "rgba(200,80,63,0.16)", fg: "#EE8E7C", bd: "rgba(200,80,63,0.45)" } }[tone];
  return <span className="inline-block px-2 py-0.5 rounded-full text-xs whitespace-nowrap" style={{ background: map.bg, color: map.fg, border: `1px solid ${map.bd}`, fontFamily: FM, fontSize: "10.5px", letterSpacing: "0.04em" }}>{children}</span>;
}

function LinkRow({ mapQuery, url, id, saved, onToggle }) {
  return <div className="flex flex-wrap items-center gap-2 mt-3">
    {mapQuery && <a href={gmap(mapQuery)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-opacity hover:opacity-80" style={{ background: "rgba(94,158,138,0.16)", color: "#8FCBB6", border: "1px solid rgba(94,158,138,0.4)", fontFamily: FM }}><MapPin size={12}/> 地図</a>}
    {url && <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-opacity hover:opacity-80" style={{ background: "rgba(232,163,61,0.14)", color: C.lamp, border: "1px solid rgba(232,163,61,0.4)", fontFamily: FM }}><ExternalLink size={12}/> 公式</a>}
    {id && <button onClick={() => onToggle(id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-opacity hover:opacity-80 ml-auto" style={{ background: saved ? "rgba(232,163,61,0.2)" : "transparent", color: saved ? C.lamp : C.mist2, border: `1px solid ${saved ? "rgba(232,163,61,0.5)" : C.line}`, fontFamily: FM }} aria-label={saved ? "行きたいリストから外す" : "行きたいリストに入れる"}>{saved ? <BookmarkCheck size={12}/> : <Bookmark size={12}/>} {saved ? "保存済" : "保存"}</button>}
  </div>;
}

function Card({ id, title, meta, body, tags = [], mapQuery, url, star, saved, onToggle }) {
  return <article className="rounded-lg p-4 sm:p-5 transition-transform" style={{ background: star ? "rgba(232,163,61,0.06)" : "rgba(169,192,203,0.045)", border: `1px solid ${star ? "rgba(232,163,61,0.32)" : C.line}` }}>
    <div className="flex items-start gap-2">{star && <span style={{ color: C.lamp, fontSize: 13, lineHeight: "1.5rem" }}>◆</span>}<h3 style={{ fontFamily: FD, color: C.mist, fontSize: "1.06rem", fontWeight: 600, letterSpacing: "0.01em", lineHeight: 1.45 }}>{title}</h3></div>
    {meta && <p className="mt-1" style={{ fontFamily: FM, color: C.mist2, fontSize: "11px", letterSpacing: "0.02em" }}>{meta}</p>}
    {body && <p className="mt-2.5" style={{ color: "#C6D6DE", fontSize: "13.5px", lineHeight: 1.85 }}>{body}</p>}
    {tags.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{tags.map(t => <Chip key={t}>{t}</Chip>)}</div>}
    {(mapQuery || url || id) && <LinkRow mapQuery={mapQuery} url={url} id={id} saved={saved} onToggle={onToggle}/>} 
  </article>;
}

function SectionTitle({ eyebrow, title, lead }) {
  return <header className="mb-6">{eyebrow && <p style={{ fontFamily: FM, color: C.lamp, fontSize: "10.5px", letterSpacing: "0.18em" }}>{eyebrow}</p>}<h2 className="mt-1.5" style={{ fontFamily: FD, color: C.mist, fontSize: "1.6rem", fontWeight: 600, letterSpacing: "0.02em" }}>{title}</h2>{lead && <p className="mt-2.5 max-w-2xl" style={{ color: "#B9CCD5", fontSize: "13.5px", lineHeight: 1.9 }}>{lead}</p>}</header>;
}

function ShunChart({ current }) {
  return <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.line}`, background: "rgba(169,192,203,0.04)" }}>
    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.line}` }}><p style={{ fontFamily: FM, color: C.lamp, fontSize: "10.5px", letterSpacing: "0.16em" }}>SEASONALITY</p><h3 className="mt-1" style={{ fontFamily: FD, color: C.mist, fontSize: "1.15rem", fontWeight: 600 }}>滞在期間の潮目</h3><p className="mt-1" style={{ color: C.mist2, fontSize: "12px", lineHeight: 1.7 }}>8月から3月まで、何が旨い時期かを一枚に。◆は特に逃したくないもの。</p></div>
    <div className="overflow-x-auto"><div style={{ minWidth: 560 }}><div className="flex items-center px-4 py-2" style={{ borderBottom: `1px solid ${C.line}` }}><div style={{ width: 150, flexShrink: 0 }}/><div className="flex-1 flex">{STAY_MONTHS.map(m => <div key={m} className="flex-1 text-center"><span style={{ fontFamily: FM, fontSize: "11px", color: m === current ? C.lamp : C.mist2, fontWeight: m === current ? 700 : 400 }}>{m}</span></div>)}</div></div>
      {SHUN.map((s,i) => <div key={s.n} className="flex items-center px-4 py-1.5" style={{ borderBottom: i === SHUN.length - 1 ? "none" : "1px solid rgba(44,84,104,0.35)" }}><div style={{ width: 150, flexShrink: 0, paddingRight: 8 }}><span style={{ color: s.hot ? C.lamp : "#C6D6DE", fontSize: "11.5px", lineHeight: 1.4 }}>{s.hot && "◆"}{s.n}</span></div><div className="flex-1 flex items-center gap-px" style={{ height: 20 }}>{STAY_MONTHS.map(m => { const on=s.m.includes(m); return <div key={m} className="flex-1" style={{height:"100%",padding:"3px 1px"}}><div style={{height:"100%",borderRadius:2,background:on?(s.hot?"rgba(232,163,61,0.75)":"rgba(94,158,138,0.6)"):"rgba(169,192,203,0.06)",outline:m===current?"1px solid rgba(232,163,61,0.45)":"none"}}/></div>})}</div></div>)}
    </div></div>
    <div className="px-4 py-3" style={{ borderTop: `1px solid ${C.line}` }}>{SHUN.filter(s=>s.hot).map(s => <p key={s.n} style={{ color:C.mist2,fontSize:"11.5px",lineHeight:1.7 }}><span style={{color:C.lamp}}>◆ {s.n}</span> — {s.note}</p>)}</div>
  </div>;
}

function OtaruGuide() {
  const [tab,setTab]=useState("base");
  const [openMonth,setOpenMonth]=useState(8);
  const [saved,setSaved]=useState([]);
  const [q,setQ]=useState("");
  const [storageOk,setStorageOk]=useState(true);
  const currentMonth=8;
  const topRef=useRef(null);

  useEffect(()=>{ const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches; const behavior=reduce?"auto":"smooth"; try{ window.scrollTo({top:0,behavior}); }catch{ window.scrollTo(0,0); } topRef.current?.scrollIntoView({behavior,block:"start"}); },[tab]);
  useEffect(()=>{ try{ const value=localStorage.getItem("otaru-saved-v1"); if(value) setSaved(JSON.parse(value)); }catch{} },[]);
  const toggle=(id)=>{ const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]; setSaved(next); try{ localStorage.setItem("otaru-saved-v1",JSON.stringify(next)); setStorageOk(true); }catch{ setStorageOk(false); } };

  const TABS=[
    {k:"base",label:"拠点と予算",icon:Home},{k:"months",label:"月別",icon:CalendarDays},{k:"food",label:"海鮮・グルメ",icon:Fish},{k:"sweets",label:"甘いもの",icon:Cake},{k:"work",label:"作業場所",icon:Laptop},{k:"trips",label:"おでかけ",icon:Compass},{k:"move",label:"交通・自転車",icon:Train},{k:"tips",label:"地元Tips",icon:Lightbulb},{k:"saved",label:`保存 ${saved.length?`(${saved.length})`:""}`,icon:Bookmark},
  ];
  const allSpots=useMemo(()=>{ const out=[]; FOOD.forEach(g=>g.items.forEach(i=>out.push({...i,cat:g.g,id:`food:${i.n}`}))); SWEETS.forEach(i=>out.push({...i,cat:"スイーツ",id:`sweet:${i.n}`})); WORK.forEach(i=>out.push({...i,cat:"作業場所",id:`work:${i.n}`})); TRIPS.forEach(i=>out.push({...i,cat:"おでかけ",a:`${i.d} / ${i.season}`,id:`trip:${i.n}`})); MOVE.forEach(i=>out.push({...i,cat:"交通",a:"",id:`move:${i.n}`})); MONTHS.forEach(m=>m.events.forEach(e=>out.push({n:e.t,why:e.d,cat:`${m.label}イベント`,a:"",map:e.map,url:e.url,tags:e.flag?[e.flag]:[],id:`ev:${e.t}`}))); return out; },[]);
  const results=useMemo(()=>{ if(!q.trim()) return []; const k=q.trim().toLowerCase(); return allSpots.filter(s=>[s.n,s.why,s.cat,...(s.tags||[])].join(" ").toLowerCase().includes(k)); },[q,allSpots]);
  const savedSpots=allSpots.filter(s=>saved.includes(s.id));

  return <div ref={topRef} style={{background:C.ink,minHeight:"100vh",fontFamily:FB,color:C.mist}}>
    <div style={{borderBottom:`1px solid ${C.line}`,background:`linear-gradient(180deg, ${C.ink2} 0%, ${C.ink} 100%)`}}><div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6"><div className="flex items-center gap-2"><Waves size={14} style={{color:C.lamp}}/><p style={{fontFamily:FM,color:C.lamp,fontSize:"10.5px",letterSpacing:"0.22em"}}>OTARU · 2026 AUG — 2027 MAR</p></div><h1 className="mt-3" style={{fontFamily:FD,fontSize:"2.1rem",fontWeight:600,letterSpacing:"0.04em",lineHeight:1.3}}>小樽で暮らすように、<br className="sm:hidden"/>北海道を食べ尽くす</h1><p className="mt-3 max-w-2xl" style={{color:"#B9CCD5",fontSize:"13.5px",lineHeight:1.9}}>住吉町を拠点にした、夫婦二人・車なし・夜型・海鮮最優先の長期滞在ガイド。旅行ではなく生活として組み立てているので、観光名所より「今月何が旨いか」と「妻の休みの日にどこへ行けるか」を軸にしています。</p><div className="mt-5 relative max-w-md"><Search size={14} style={{position:"absolute",left:12,top:12,color:C.mist2}}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="店名・キーワードで探す（例：シャコ、温泉、電源）" className="w-full rounded-md py-2.5 pl-9 pr-3 outline-none" style={{background:"rgba(169,192,203,0.07)",border:`1px solid ${C.line}`,color:C.mist,fontSize:"13px"}}/></div></div></div>
    <nav className="sticky top-0 z-10" style={{background:"rgba(14,29,40,0.94)",backdropFilter:"blur(8px)",borderBottom:`1px solid ${C.line}`}}><div className="max-w-5xl mx-auto px-2 sm:px-6 overflow-x-auto"><div className="flex gap-1 py-2" style={{minWidth:"max-content"}}>{TABS.map(t=>{const Icon=t.icon,on=tab===t.k;return <button key={t.k} onClick={()=>{setTab(t.k);setQ("")}} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md whitespace-nowrap transition-colors" style={{background:on?"rgba(232,163,61,0.16)":"transparent",color:on?C.lamp:C.mist2,border:`1px solid ${on?"rgba(232,163,61,0.4)":"transparent"}`,fontSize:"12.5px",fontWeight:on?600:400}}><Icon size={13}/> {t.label}</button>})}</div></div></nav>
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
      {q.trim() && <section className="mb-10"><SectionTitle eyebrow="SEARCH" title={`「${q}」の検索結果 ${results.length}件`}/><div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{results.map(s=><Card key={s.id} id={s.id} title={s.n} meta={`${s.cat}${s.a?" / "+s.a:""}`} body={s.why} tags={s.tags} mapQuery={s.map} url={s.url} saved={saved.includes(s.id)} onToggle={toggle}/>)}{results.length===0&&<p style={{color:C.mist2,fontSize:"13px"}}>該当なし。別の言葉で試すか、上のタブから探してください。</p>}</div></section>}
      {!q.trim() && <>
        {tab==="base" && <section><SectionTitle eyebrow="BASE CAMP" title="住吉町という拠点" lead="16日から入る住吉町14-29は、小樽の観光エリアではなく生活エリアの側。これは長期滞在にとって明確に有利です。"/><div className="grid gap-3 mb-10" style={{gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))"}}><Card title="南小樽駅" meta="徒歩圏 / JR" body="札幌へ約35〜45分、余市へ約35分。小樽駅より空いていて、快速も停まる。生活の入口はここ。" mapQuery="南小樽駅 小樽市住ノ江1丁目"/><Card title="住吉神社" meta="徒歩数分" body="小樽総鎮守。初詣が徒歩で済む。すぐそばに銭湯の神仏湯温泉もある。" mapQuery="住吉神社 小樽市住ノ江2丁目5-1"/><Card title="南樽市場" meta="徒歩10〜15分 / 日曜休" body="小樽市民の台所。ここが徒歩圏にあることが、この物件の最大の価値。" mapQuery="南樽市場 小樽市新富町12-1" url="http://www.nantaruichiba.or.jp/" star/><Card title="プリン専門店 アンデリス" meta="住ノ江 / 徒歩圏 / 水曜休" body="純白カスタードプリン。カスタード好きにとっては、この立地が引きの強さ。" mapQuery="プリン専門店 アンデリス 小樽市住ノ江" star/><Card title="ウイングベイ小樽 / 新南樽市場" meta="築港 / 徒歩20分〜一駅" body="映画館・イオン・フードコート・市場が全部屋内。吹雪いた日の避難先。" mapQuery="ウイングベイ小樽 小樽市築港11" url="https://www.wingbay-otaru.co.jp/"/><Card title="堺町通り・メルヘン交差点" meta="徒歩15〜20分" body="ルタオ本店、北菓楼小樽本館。観光価格帯だがスイーツの本丸で、歩いて行ける。" mapQuery="メルヘン交差点 小樽市堺町"/></div><SectionTitle eyebrow="RHYTHM" title="二人の時間割から逆算する"/><div className="rounded-lg p-5 mb-10" style={{background:"rgba(169,192,203,0.045)",border:`1px solid ${C.line}`}}>{[
          {k:"妻の勤務日（4日）",v:"11時前後〜17時前後が拘束。動けるのは17:30以降。夜が主戦場なので、夜景・イルミネーション・居酒屋・出抜小路・雪あかりの路といった「暗いほうがいい」ものをここに寄せる。"},{k:"妻の休日（2日）",v:"11時出発を前提にすると、余市・札幌・朝里川温泉・定山渓は無理なく日帰りできる。積丹だけは移動が長いので体力に余裕がある日限定。"},{k:"カイトの平日昼",v:"妻の勤務時間帯が、そのまま集中作業の時間帯になる。図書館（無料）と湯の花朝里殿（2h500円＋温泉）の二択を基本形に。"},{k:"苦手な早朝",v:"鱗友朝市とワカサギ釣りツアーだけが早朝を要求してくる。ワカサギは「やりたい」ので、シーズン中に1日だけ気合いを入れる枠として確保する。"}
        ].map(r=><div key={r.k} className="py-3" style={{borderBottom:"1px solid rgba(44,84,104,0.4)"}}><p style={{fontFamily:FM,color:C.lamp,fontSize:"11px",letterSpacing:"0.08em"}}>{r.k}</p><p className="mt-1.5" style={{color:"#C6D6DE",fontSize:"13px",lineHeight:1.85}}>{r.v}</p></div>)}</div><SectionTitle eyebrow="BUDGET" title="月15万円の内訳（宿泊費別）" lead="Airbnbの家賃を除いた、生活費＋遊び予算としての配分案です。宿泊費込みで15万なら、外食枠を圧縮して市場での自炊に振るのが現実解になります。"/><div className="rounded-lg overflow-hidden mb-6" style={{border:`1px solid ${C.line}`}}>{BUDGET.map((b,i)=><div key={b.k} className="flex items-start gap-3 px-4 py-3" style={{background:i%2?"rgba(169,192,203,0.03)":"transparent",borderBottom:i===BUDGET.length-1?"none":"1px solid rgba(44,84,104,0.4)"}}><div className="flex-1"><p style={{color:C.mist,fontSize:"13px"}}>{b.k}</p><p className="mt-0.5" style={{color:C.mist2,fontSize:"11.5px",lineHeight:1.6}}>{b.note}</p></div><span style={{fontFamily:FM,color:C.lamp,fontSize:"13px",whiteSpace:"nowrap"}}>¥{b.v.toLocaleString()}</span></div>)}<div className="flex items-center gap-3 px-4 py-3" style={{background:"rgba(232,163,61,0.08)"}}><span className="flex-1" style={{fontFamily:FD,fontSize:"14px"}}>合計</span><span style={{fontFamily:FM,color:C.lamp,fontSize:"15px",fontWeight:700}}>¥{BUDGET.reduce((a,b)=>a+b.v,0).toLocaleString()}</span></div></div><div className="rounded-lg p-4" style={{background:"rgba(200,80,63,0.08)",border:"1px solid rgba(200,80,63,0.3)"}}><p style={{color:"#EE9E8E",fontSize:"12.5px",lineHeight:1.85}}>予算に一番効くのは食費ではなく<strong>冬の光熱費</strong>です。12〜2月は灯油・電気で月2〜4万円上振れすることがあるので、次のAirbnbを決める前に「光熱費込みか」を必ず確認してください。ここを外すと外食を我慢しても追いつきません。</p></div></section>}
        {tab==="months" && <section><SectionTitle eyebrow="MONTH BY MONTH" title="月別のおすすめ" lead="小樽の一年は漁の暦で動いています。まず旬の表で全体を掴んでから、各月を開いてください。"/><div className="mb-10"><ShunChart current={currentMonth}/></div><div className="flex flex-wrap gap-2 mb-6">{MONTHS.map(mo=><button key={mo.m} onClick={()=>setOpenMonth(mo.m)} className="px-4 py-2 rounded-md transition-colors" style={{background:openMonth===mo.m?"rgba(232,163,61,0.18)":"rgba(169,192,203,0.05)",border:`1px solid ${openMonth===mo.m?"rgba(232,163,61,0.45)":C.line}`,color:openMonth===mo.m?C.lamp:C.mist2,fontFamily:FD,fontSize:"14px"}}>{mo.label}</button>)}</div>{MONTHS.filter(mo=>mo.m===openMonth).map(mo=><div key={mo.m}><div className="mb-6"><p style={{fontFamily:FM,color:C.lamp,fontSize:"10.5px",letterSpacing:"0.18em"}}>{mo.label} — {mo.sub}</p><p className="mt-2 max-w-2xl" style={{color:"#C6D6DE",fontSize:"14px",lineHeight:1.9}}>{mo.lead}</p></div><h4 className="mb-3" style={{fontFamily:FD,color:C.mist,fontSize:"1.05rem"}}>季節のイベント</h4><div className="grid gap-3 mb-8" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{mo.events.map(e=><Card key={e.t} id={`ev:${e.t}`} title={e.t} body={e.d} tags={e.flag?[e.flag]:[]} mapQuery={e.map} url={e.url} star={!!e.flag} saved={saved.includes(`ev:${e.t}`)} onToggle={toggle}/>)}</div><h4 className="mb-3" style={{fontFamily:FD,color:C.mist,fontSize:"1.05rem"}}>この月にやること</h4><ul className="rounded-lg overflow-hidden" style={{border:`1px solid ${C.line}`}}>{mo.todo.map((t,i)=><li key={t} className="flex gap-3 px-4 py-3" style={{background:i%2?"rgba(169,192,203,0.03)":"transparent",borderBottom:i===mo.todo.length-1?"none":"1px solid rgba(44,84,104,0.4)"}}><span style={{fontFamily:FM,color:C.lamp,fontSize:"11px",paddingTop:2}}>—</span><span style={{color:"#C6D6DE",fontSize:"13px",lineHeight:1.8}}>{t}</span></li>)}</ul></div>)}</section>}
        {tab==="food" && <section><SectionTitle eyebrow="SEAFOOD FIRST" title="海鮮とグルメ" lead="長期滞在で海鮮の総量を最大化する方法は、外食を増やすことではなく市場を日常にすることです。まず市場、次に地元価格の寿司、そして月に一度の名店。この順番で組んでいます。"/>{FOOD.map(g=><div key={g.g} className="mb-10"><h3 className="mb-3 pb-2" style={{fontFamily:FD,color:C.lamp,fontSize:"1.05rem",borderBottom:`1px solid ${C.line}`}}>{g.g}</h3><div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{g.items.map(i=><Card key={i.n} id={`food:${i.n}`} title={i.n} meta={i.a} body={i.why} tags={i.tags} mapQuery={i.map} url={i.url} saved={saved.includes(`food:${i.n}`)} onToggle={toggle}/>)}</div></div>)}</section>}
        {tab==="sweets" && <section><SectionTitle eyebrow="SWEETS & DATE" title="甘いものとデート" lead="◆はカスタード枠。アンデリスが徒歩圏にあるのは相当な当たりです。あまとうの2階と六花亭の喫茶室は、勤務後の17時台からでも間に合う夜デート候補。"/><div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{SWEETS.map(s=><Card key={s.n} id={`sweet:${s.n}`} title={s.n} meta={s.a} body={s.why} tags={s.tags} mapQuery={s.map} url={s.url} star={s.star} saved={saved.includes(`sweet:${s.n}`)} onToggle={toggle}/>)}</div></section>}
        {tab==="work" && <section><SectionTitle eyebrow="WORKSPACE" title="作業できる場所" lead="小樽は作業カフェが手薄で、これは事実です。ただ図書館と温泉施設のコワーキングという、都市部にはない選択肢があります。無料・安い・冬に強い、の3軸で並べました。"/><div className="grid gap-3 mb-8" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{WORK.map(w=><Card key={w.n} id={`work:${w.n}`} title={w.n} meta={`${w.a} / ${w.cost}`} body={w.why} tags={w.tags} mapQuery={w.map} url={w.url} star={w.star} saved={saved.includes(`work:${w.n}`)} onToggle={toggle}/>)}</div><div className="rounded-lg p-4" style={{background:"rgba(94,158,138,0.08)",border:"1px solid rgba(94,158,138,0.3)"}}><p style={{color:"#8FCBB6",fontSize:"12.5px",lineHeight:1.85}}>実運用の提案：<strong>平日は図書館、週1〜2回は朝里殿</strong>を基本形にして、オンライン会議がある日だけ時間貸し個室を取る。冬に外へ出るのが厳しくなったらウイングベイに切り替える。この3段構えなら月の作業場所コストは5,000円以内に収まります。</p></div></section>}
        {tab==="trips" && <section><SectionTitle eyebrow="DAY OUT" title="妻の休みの日の選択肢" lead="所要時間と出発時刻の目安を入れています。11時出発でも成立するものを優先しました。保存しておけば、当日に見返すだけで決められます。"/><div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{TRIPS.map(t=><Card key={t.n} id={`trip:${t.n}`} title={t.n} meta={`${t.d} / ${t.start} / ${t.season}`} body={t.why} tags={t.tags} mapQuery={t.map} url={t.url} star={t.star} saved={saved.includes(`trip:${t.n}`)} onToggle={toggle}/>)}</div></section>}
        {tab==="move" && <section><SectionTitle eyebrow="GETTING AROUND" title="交通と自転車" lead="小樽は坂の街で、住吉町から出るとどの方向も坂です。自転車の判断はここが分かれ目になります。"/><div className="grid gap-3 mb-8" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{MOVE.map(m=><Card key={m.n} id={`move:${m.n}`} title={m.n} body={m.why} tags={m.tags} mapQuery={m.map} url={m.url} star={m.star} saved={saved.includes(`move:${m.n}`)} onToggle={toggle}/>)}</div><div className="rounded-lg p-4" style={{background:"rgba(232,163,61,0.08)",border:"1px solid rgba(232,163,61,0.32)"}}><p style={{color:C.lamp,fontSize:"12.5px",lineHeight:1.85}}>自転車の結論：まず<strong>1日レンタル（500〜2,000円）で坂を体験</strong>してから買うか決めてください。小樽の勾配は写真では伝わりません。「平坦部だけで十分」と判断できたら中古購入、「電動でないと無理」となったら、使える期間が3か月しかない以上レンタルの都度払いのほうが安く済む可能性が高いです。</p></div></section>}
        {tab==="tips" && <section><SectionTitle eyebrow="LOCAL KNOWLEDGE" title="知っておくと得すること" lead="旅行者向けの情報には出てこない、2か月以上住む人にだけ効く話をまとめました。"/><div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))"}}>{TIPS.map(t=><div key={t.t} className="rounded-lg p-4" style={{background:"rgba(169,192,203,0.045)",border:`1px solid ${C.line}`}}><Chip tone={t.tag==="注意"?"shako":"lamp"}>{t.tag}</Chip><h3 className="mt-2.5" style={{fontFamily:FD,color:C.mist,fontSize:"1rem",fontWeight:600,lineHeight:1.5}}>{t.t}</h3><p className="mt-2" style={{color:"#C6D6DE",fontSize:"13px",lineHeight:1.85}}>{t.d}</p></div>)}</div></section>}
        {tab==="saved" && <section><SectionTitle eyebrow="SAVED" title="行きたいリスト" lead={savedSpots.length?"保存した場所です。地図ボタンからそのまま経路を出せます。":"各ページの「保存」ボタンで、行きたい場所をここに集められます。"}/>{!storageOk&&<p className="mb-4" style={{color:"#EE9E8E",fontSize:"12.5px"}}>保存に失敗しました。この画面を開いている間のリストは残ります。</p>}<div className="grid gap-3" style={{gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"}}>{savedSpots.map(s=><Card key={s.id} id={s.id} title={s.n} meta={s.cat} body={s.why} tags={s.tags} mapQuery={s.map} url={s.url} saved onToggle={toggle}/>)}</div>{savedSpots.length===0&&<div className="rounded-lg p-6 text-center" style={{border:`1px dashed ${C.line}`}}><p style={{color:C.mist2,fontSize:"13px",lineHeight:1.8}}>まだ何も保存されていません。<br/>「月別」や「おでかけ」から気になったものを保存しておくと、妻の休みの日に迷わなくなります。</p></div>}</section>}
      </>}
    </main>
    <footer style={{borderTop:`1px solid ${C.line}`}}><div className="max-w-5xl mx-auto px-4 sm:px-6 py-6"><p style={{color:C.mist2,fontSize:"11.5px",lineHeight:1.8}}>営業時間・定休日・イベント日程・料金は変更されます。お出かけ前に公式サイトか電話で確認してください。とくに冬季（12〜3月）は短縮営業と臨時休業が増えます。公式サイトが確認できなかった店舗は地図リンクのみを載せています。</p></div></footer>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><OtaruGuide/></React.StrictMode>);
