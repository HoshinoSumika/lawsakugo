export const Search = {
    init,
};

let searchInput;
let searchIcon;
let searchExec;
let searchResult;

function init() {
    searchInput = document.querySelector('#search-input');
    searchInput.value = '';
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (document.activeElement === searchInput) {
                searchInput.blur();
            }
        }
    });
    searchInput.addEventListener('input', () => {
        updateResult();
    });
    searchInput.addEventListener('focus', () => {
        if (searchInput.value) {
            searchResult.style.display = '';
        }
    });
    searchInput.addEventListener('blur', () => {
        searchResult.style.display = 'none';
    });

    searchIcon = document.querySelector('#search-icon');

    searchExec = document.querySelector('#search-exec');
    searchExec.addEventListener('click', () => {
        if (searchInput.value) {
            const url = new URL('./search.html', window.location);
            url.searchParams.set('q', searchInput.value);
            window.location.href = url;
        }
    });

    searchResult = document.querySelector('#search-result');
    searchResult.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
    searchResult.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
}

const QUICK_SEARCH_DATA = [
    { id: '321CONSTITUTION', title: '日本国憲法', title_kana: 'にほんこくけんぽう', title_alphabet: 'nihonkokukenpou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '129AC0000000089', title: '民法', title_kana: 'みんぽう', title_alphabet: 'minpou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '132AC0000000048', title: '商法', title_kana: 'しょうほう', title_alphabet: 'shouhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '417AC0000000086', title: '会社法', title_kana: 'かいしゃほう', title_alphabet: 'kaishahou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '408AC0000000109', title: '民事訴訟法', title_kana: 'みんじそしょうほう', title_alphabet: 'minjisoshouhou', abbrev: '民訴法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '140AC0000000045', title: '刑法', title_kana: 'けいほう', title_alphabet: 'keihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000131', title: '刑事訴訟法', title_kana: 'けいじそしょうほう', title_alphabet: 'keijisoshouhou', abbrev: '刑訴法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '405AC0000000088', title: '行政手続法', title_kana: 'ぎょうせいてつづきほう', title_alphabet: 'gyouseitetsuzukihou', abbrev: '行手法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '426AC0000000068', title: '行政不服審査法', title_kana: 'ぎょうせいふふくしんさほう', title_alphabet: 'gyouseifufukushinsahou', abbrev: '行服法,行審法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '337AC0000000139', title: '行政事件訴訟法', title_kana: 'ぎょうせいじけんそしょうほう', title_alphabet: 'gyouseijikensoshouhou', abbrev: '行訴法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000125', title: '国家賠償法', title_kana: 'こっかばいしょうほう', title_alphabet: 'kokkabaishouhou', abbrev: '国賠法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000043', title: '行政代執行法', title_kana: 'ぎょうせいだいしっこうほう', title_alphabet: 'gyouseidaishikkouhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000067', title: '地方自治法', title_kana: 'ちほうじちほう', title_alphabet: 'chihoujichihou', abbrev: '地自法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '322AC1000000079', title: '国会法', title_kana: 'こっかいほう', title_alphabet: 'kokkaihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000005', title: '内閣法', title_kana: 'ないかくほう', title_alphabet: 'naikakuhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000059', title: '裁判所法', title_kana: 'さいばんしょほう', title_alphabet: 'saibanshohou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '324AC1000000205', title: '弁護士法', title_kana: 'べんごしほう', title_alphabet: 'bengoshihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '324AC0000000140', title: '司法試験法', title_kana: 'しほうしけんほう', title_alphabet: 'shihoushikenhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '329AC0000000162', title: '警察法', title_kana: 'けいさつほう', title_alphabet: 'keisatsuhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000136', title: '警察官職務執行法', title_kana: 'けいさつかんしょくむしっこうほう', title_alphabet: 'keisatsukanshokumushikkouhou', abbrev: '警職法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '325AC0000000147', title: '国籍法', title_kana: 'こくせきほう', title_alphabet: 'kokusekihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000034', title: '財政法', title_kana: 'ざいせいほう', title_alphabet: 'zaiseihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '325AC1000000100', title: '公職選挙法', title_kana: 'こうしょくせんきょほう', title_alphabet: 'koushokusenkyohou', abbrev: '公選法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '326CO0000000319', title: '出入国管理及び難民認定法', title_kana: 'しゅつにゅうこくかんりおよびなんみんにんていほう', title_alphabet: 'shutsunyuukokukanrioyobinanminninteihou', abbrev: '入管法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '415AC0000000057', title: '個人情報の保護に関する法律', title_kana: 'こじんじょうほうのほごにかんするほうりつ', title_alphabet: 'kojinjouhounohogonikansuruhouritsu', abbrev: '個人情報保護法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '335AC0000000105', title: '道路交通法', title_kana: 'どうろこうつうほう', title_alphabet: 'dourokoutsuuhou', abbrev: '道交法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '326AC0100000219', title: '土地収用法', title_kana: 'とちしゅうようほう', title_alphabet: 'tochishuuyouhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '343AC0000000100', title: '都市計画法', title_kana: 'としけいかくほう', title_alphabet: 'toshikeikakuhou', abbrev: '都計法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '325AC0000000201', title: '建築基準法', title_kana: 'けんちくきじゅんほう', title_alphabet: 'kenchikukijunhou', abbrev: '建基法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '405AC0000000091', title: '環境基本法', title_kana: 'かんきょうきほんほう', title_alphabet: 'kankyoukihonhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '418AC0000000120', title: '教育基本法', title_kana: 'きょういくきほんほう', title_alphabet: 'kyouikukihonhou', abbrev: '教基法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000026', title: '学校教育法', title_kana: 'がっこうきょういくほう', title_alphabet: 'gakkoukyouikuhou', abbrev: '学教法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '403AC0000000090', title: '借地借家法', title_kana: 'しゃくちしゃくやほう', title_alphabet: 'shakuchishakuyahou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '416AC0000000123', title: '不動産登記法', title_kana: 'ふどうさんとうきほう', title_alphabet: 'fudousantoukihou', abbrev: '新不動産登記法,不登法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '406AC0000000085', title: '製造物責任法', title_kana: 'せいぞうぶつせきにんほう', title_alphabet: 'seizoubutsusekininhou', abbrev: 'ＰＬ法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '412AC0000000061', title: '消費者契約法', title_kana: 'しょうひしゃけいやくほう', title_alphabet: 'shouhishakeiyakuhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '410AC0000000104', title: '動産及び債権の譲渡の対抗要件に関する民法の特例等に関する法律', title_kana: 'どうさんおよびさいけんのじょうとのたいこうようけんにかんするみんぽうのとくれいとうにかんするほうりつ', title_alphabet: 'dousanoyobisaikennojoutonotaikouyoukennikansuruminpounotokureitounikansuruhouritsu', abbrev: '動産・債権譲渡特例法,動産・債権譲渡対抗要件特例法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '507AC0000000056', title: '譲渡担保契約及び所有権留保契約に関する法律', title_kana: 'じょうとたんぽけいやくおよびしょゆうけんりゅうほけいやくにかんするほうりつ', title_alphabet: 'joutotanpokeiyakuoyobishoyuukenryuuhokeiyakunikansuruhouritsu', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '337AC0000000069', title: '建物の区分所有等に関する法律', title_kana: 'たてもののくぶんしょゆうとうにかんするほうりつ', title_alphabet: 'tatemononokubunshoyuutounikansuruhouritsu', abbrev: 'マンション法,区分所有法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '418AC0000000048', title: '一般社団法人及び一般財団法人に関する法律', title_kana: 'いっぱんしゃだんほうじんおよびいっぱんざいだんほうじんにかんするほうりつ', title_alphabet: 'ippanshadanhoujinoyobiippanzaidanhoujinnikansuruhouritsu', abbrev: '一般法人法,一般社団・財団法,一般社団・財団法人法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '419AC0000000102', title: '電子記録債権法', title_kana: 'でんしきろくさいけんほう', title_alphabet: 'denshikirokusaikenhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '329AC0000000100', title: '利息制限法', title_kana: 'りそくせいげんほう', title_alphabet: 'risokuseigenhou', abbrev: '利限法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '418AC0000000108', title: '信託法', title_kana: 'しんたくほう', title_alphabet: 'shintakuhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000224', title: '戸籍法', title_kana: 'こせきほう', title_alphabet: 'kosekihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '420AC0000000056', title: '保険法', title_kana: 'ほけんほう', title_alphabet: 'hokenhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000025', title: '金融商品取引法', title_kana: 'きんゆうしょうひんとりひきほう', title_alphabet: 'kinyuushouhintorihikihou', abbrev: '金商法,証取法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '307AC0000000020', title: '手形法', title_kana: 'てがたほう', title_alphabet: 'tegatahou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '308AC0000000057', title: '小切手法', title_kana: 'こぎってほう', title_alphabet: 'kogittehou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '354AC0000000004', title: '民事執行法', title_kana: 'みんじしっこうほう', title_alphabet: 'minjishikkouhou', abbrev: '民執法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '401AC0000000091', title: '民事保全法', title_kana: 'みんじほぜんほう', title_alphabet: 'minjihozenhou', abbrev: '民保法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '415AC0000000109', title: '人事訴訟法', title_kana: 'じんじそしょうほう', title_alphabet: 'jinjisoshouhou', abbrev: '人訴法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '423AC0000000052', title: '家事事件手続法', title_kana: 'かじじけんてつづきほう', title_alphabet: 'kajijikentetsuzukihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '425AC0000000086', title: '自動車の運転により人を死傷させる行為等の処罰に関する法律', title_kana: 'じどうしゃのうんてんによりひとをししょうさせるこういとうのしょばつにかんするほうりつ', title_alphabet: 'jidoushanountenniyorihitooshishousaserukouitounoshobatsunikansuruhouritsu', abbrev: '自動車運転死傷行為処罰法,悪質運転厳罰法,自動車運転死傷処罰法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000039', title: '軽犯罪法', title_kana: 'けいはんざいほう', title_alphabet: 'keihanzaihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '411AC0000000137', title: '犯罪捜査のための通信傍受に関する法律', title_kana: 'はんざいそうさのためのつうしんぼうじゅにかんするほうりつ', title_alphabet: 'hanzaisousanotamenotsuushinboujunikansuruhouritsu', abbrev: '盗聴法,通信傍受法,組織犯罪対策三法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '323AC0000000168', title: '少年法', title_kana: 'しょうねんほう', title_alphabet: 'shounenhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '417AC0000000050', title: '刑事収容施設及び被収容者等の処遇に関する法律', title_kana: 'けいじしゅうようしせつおよびひしゅうようしゃとうのしょぐうにかんするほうりつ', title_alphabet: 'keijishuuyoushisetsuoyobihishuuyoushatounoshoguunikansuruhouritsu', abbrev: '刑事施設法,刑事収容施設法,刑事被収容者処遇法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '416AC0000000063', title: '裁判員の参加する刑事裁判に関する法律', title_kana: 'さいばんいんのさんかするけいじさいばんにかんするほうりつ', title_alphabet: 'saibaninnosankasurukeijisaibannikansuruhouritsu', abbrev: '裁判員法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '419AC0000000128', title: '労働契約法', title_kana: 'ろうどうけいやくほう', title_alphabet: 'roudoukeiyakuhou', abbrev: '労契法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000049', title: '労働基準法', title_kana: 'ろうどうきじゅんほう', title_alphabet: 'roudoukijunhou', abbrev: '労基法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '324AC0000000174', title: '労働組合法', title_kana: 'ろうどうくみあいほう', title_alphabet: 'roudoukumiaihou', abbrev: '労組法,労働三法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '347AC0000000113', title: '雇用の分野における男女の均等な機会及び待遇の確保等に関する法律', title_kana: 'こようのぶんやにおけるだんじょのきんとうなきかいおよびたいぐうのかくほとうにかんするほうりつ', title_alphabet: 'koyounobunyaniokerudanjonokintounakikaioyobitaiguunokakuhotounikansuruhouritsu', abbrev: '男女雇用機会均等法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '416AC0000000045', title: '労働審判法', title_kana: 'ろうどうしんぱんほう', title_alphabet: 'roudoushinpanhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '412AC0000000103', title: '会社分割に伴う労働契約の承継等に関する法律', title_kana: 'かいしゃぶんかつにともなうろうどうけいやくのしょうけいとうにかんするほうりつ', title_alphabet: 'kaishabunkatsunitomonauroudoukeiyakunoshoukeitounikansuruhouritsu', abbrev: '労働契約承継法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '416AC0000000122', title: '公益通報者保護法', title_kana: 'こうえきつうほうしゃほごほう', title_alphabet: 'kouekitsuuhoushahogohou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '403AC0000000076', title: '育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律', title_kana: 'いくじきゅうぎょうかいごきゅうぎょうとういくじまたはかぞくかいごをおこなうろうどうしゃのふくしにかんするほうりつ', title_alphabet: 'ikujikyuugyoukaigokyuugyoutouikujimatahakazokukaigoookonauroudoushanofukushinikansuruhouritsu', abbrev: '育児介護休業法,育児・介護休業法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '405AC0000000076', title: '短時間労働者及び有期雇用労働者の雇用管理の改善等に関する法律', title_kana: 'たんじかんろうどうしゃおよびゆうきこようろうどうしゃのこようかんりのかいぜんとうにかんするほうりつ', title_alphabet: 'tanjikanroudoushaoyobiyuukikoyouroudoushanokoyoukanrinokaizentounikansuruhouritsu', abbrev: 'パートタイム法,パート労働法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '334AC0000000137', title: '最低賃金法', title_kana: 'さいていちんぎんほう', title_alphabet: 'saiteichinginhou', abbrev: '最賃法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000050', title: '労働者災害補償保険法', title_kana: 'ろうどうしゃさいがいほしょうほけんほう', title_alphabet: 'roudoushasaigaihoshouhokenhou', abbrev: '労災法,労災保険法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '413AC0000000112', title: '個別労働関係紛争の解決の促進に関する法律', title_kana: 'こべつろうどうふんそうのかいけつのそくしんにかんするほうりつ', title_alphabet: 'kobetsuroudoufunsounokaiketsunosokushinnikansuruhouritsu', abbrev: '個別労働関係紛争解決促進法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '321AC0000000025', title: '労働関係調整法', title_kana: 'ろうどうかんけいちょうせいほう', title_alphabet: 'roudoukankeichouseihou', abbrev: '労働三法,労調法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '322AC0000000141', title: '職業安定法', title_kana: 'しょくぎょうあんていほう', title_alphabet: 'shokugyouanteihou', abbrev: '職安法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '360AC0000000088', title: '労働者派遣事業の適正な運営の確保及び派遣労働者の保護等に関する法律', title_kana: 'ろうどうしゃはけんじぎょうのてきせいなうんえいのかくほおよびはけんろうどうしゃのほごとうにかんするほうりつ', title_alphabet: 'roudoushahakenjigyounotekiseinauneinokakuhooyobihakenroudoushanohogotounikansuruhouritsu', abbrev: '労働者派遣法,人材派遣法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '346AC0000000068', title: '高年齢者等の雇用の安定等に関する法律', title_kana: 'こうねんれいしゃとうのこようのあんていとうにかんするほうりつ', title_alphabet: 'kounenreishatounokoyounoanteitounikansuruhouritsu', abbrev: '高年齢者雇用安定法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '335AC0000000123', title: '障害者の雇用の促進等に関する法律', title_kana: 'しょうがいしゃのこようのそくしんとうにかんするほうりつ', title_alphabet: 'shougaishanokoyounosokushintounikansuruhouritsu', abbrev: '障害者雇用促進法', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '325AC0000000144', title: '生活保護法', title_kana: 'せいかつほごほう', title_alphabet: 'seikatsuhogohou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '322AC0000000054', title: '昭和二十二年法律第五十四号（私的独占の禁止及び公正取引の確保に関する法律）', title_kana: 'してきどくせんのきんしおよびこうせいとりひきのかくほにかんするほうりつ', title_alphabet: 'shitekidokusennokinshioyobikouseitorihikinokakuhonikansuruhouritsu', abbrev: '独禁法,独占禁止法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '416AC0000000075', title: '破産法', title_kana: 'はさんほう', title_alphabet: 'hasanhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '411AC0000000225', title: '民事再生法', title_kana: 'みんじさいせいほう', title_alphabet: 'minjisaiseihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '334AC0000000121', title: '特許法', title_kana: 'とっきょほう', title_alphabet: 'tokkyohou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '345AC0000000048', title: '著作権法', title_kana: 'ちょさくけんほう', title_alphabet: 'chosakukenhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '334AC0000000123', title: '実用新案法', title_kana: 'じつようしんあんほう', title_alphabet: 'jitsuyoushinanhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '334AC0000000125', title: '意匠法', title_kana: 'いしょうほう', title_alphabet: 'ishouhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '334AC0000000127', title: '商標法', title_kana: 'しょうひょうほう', title_alphabet: 'shouhyouhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '405AC0000000047', title: '不正競争防止法', title_kana: 'ふせいきょうそうぼうしほう', title_alphabet: 'fuseikyousouboushihou', abbrev: '不競法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '418AC0000000078', title: '法の適用に関する通則法', title_kana: 'ほうのてきようにかんするつうそくほう', title_alphabet: 'hounotekiyounikansurutsuusokuhou', abbrev: '法適用通則法', abbrev_kana: '', abbrev_alphabet: '', },

    { id: '337AC0000000066', title: '国税通則法', title_kana: 'こくぜいつうそくほう', title_alphabet: 'kokuzeitsuusokuhou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '340AC0000000033', title: '所得税法', title_kana: 'しょとくぜいほう', title_alphabet: 'shotokuzeihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
    { id: '340AC0000000034', title: '法人税法', title_kana: 'ほうじんぜいほう', title_alphabet: 'houjinzeihou', abbrev: '', abbrev_kana: '', abbrev_alphabet: '', },
];

function normalizeInput(input) {
    let normalized = input.toLowerCase();

    normalized = normalized.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });

    normalized = normalized.replace(/sya/g, 'sha');
    normalized = normalized.replace(/syu/g, 'shu');
    normalized = normalized.replace(/syo/g, 'sho');

    normalized = normalized.replace(/zya/g, 'ja');
    normalized = normalized.replace(/zyu/g, 'ju');
    normalized = normalized.replace(/zyo/g, 'jo');

    normalized = normalized.replace(/jya/g, 'ja');
    normalized = normalized.replace(/jyu/g, 'ju');
    normalized = normalized.replace(/jyo/g, 'jo');

    normalized = normalized.replace(/tya/g, 'cha');
    normalized = normalized.replace(/tyu/g, 'chu');
    normalized = normalized.replace(/tyo/g, 'cho');

    normalized = normalized.replace(/cya/g, 'cha');
    normalized = normalized.replace(/cyu/g, 'chu');
    normalized = normalized.replace(/cyo/g, 'cho');

    normalized = normalized.replace(/si/g, 'shi');
    normalized = normalized.replace(/zi/g, 'ji');
    normalized = normalized.replace(/ti/g, 'chi');
    normalized = normalized.replace(/tu/g, 'tsu');
    normalized = normalized.replace(/hu/g, 'fu');

    return normalized;
}

function updateResult() {
    searchResult.innerHTML = '';
    const value = normalizeInput(searchInput.value.trim().toLowerCase());
    if (!value) {
        searchResult.style.display = 'none';
        searchExec.style.display = 'none';
        return;
    } else {
        searchResult.style.display = '';
        searchExec.style.display = '';
    }

    const icon = searchIcon.innerHTML;

    let matched = QUICK_SEARCH_DATA.filter(data => {
        const titleMatch = data.title.toLowerCase().includes(value);
        const titleKanaMatch = data.title_kana.toLowerCase().includes(value);
        const titleAlphabetMatch = data.title_alphabet.toLowerCase().includes(value);
        const abbrevMatch = data.abbrev.split(',').some(ab => ab.toLowerCase().includes(value));
        const abbrevKanaMatch = data.abbrev_kana.split(',').some(ab => ab.toLowerCase().includes(value));
        const abbrevAlphabetMatch = data.abbrev_alphabet.split(',').some(ab => ab.toLowerCase().includes(value));
        return titleMatch || titleKanaMatch || titleAlphabetMatch || abbrevMatch || abbrevKanaMatch || abbrevAlphabetMatch;
    });
    matched = matched.sort((a, b) => {
        const aTitleStartsWith = a.title.toLowerCase().startsWith(value);
        const aKanaStartsWith = a.title_kana.toLowerCase().startsWith(value);
        const aAlphabetStartsWith = a.title_alphabet.toLowerCase().startsWith(value);
        const aStartsWith = aTitleStartsWith || aKanaStartsWith || aAlphabetStartsWith;
        const bTitleStartsWith = b.title.toLowerCase().startsWith(value);
        const bKanaStartsWith = b.title_kana.toLowerCase().startsWith(value);
        const bAlphabetStartsWith = b.title_alphabet.toLowerCase().startsWith(value);
        const bStartsWith = bTitleStartsWith || bKanaStartsWith || bAlphabetStartsWith;
        if (aStartsWith && !bStartsWith) {
            return -1;
        }
        if (!aStartsWith && bStartsWith) {
            return 1;
        }
        return 0;
    });

    if (matched.length > 0) {
        matched.slice(0, 5).forEach(data => {
            const iconEl = document.createElement('div');
            iconEl.innerHTML = icon;
            const textEl = document.createElement('div');
            textEl.textContent = data.title;
            const url = new URL('./law.html', window.location);
            url.searchParams.set('id', data.id);
            const itemEl = document.createElement('a');
            itemEl.href = url;
            itemEl.appendChild(iconEl);
            itemEl.appendChild(textEl);
            searchResult.appendChild(itemEl);
        });
    } else {
        const iconEl = document.createElement('div');
        iconEl.innerHTML = icon;
        const textEl = document.createElement('div');
        textEl.textContent = searchInput.value + 'を検索';
        const url = new URL('./search.html', window.location);
        url.searchParams.set('q', searchInput.value);
        const itemEl = document.createElement('a');
        itemEl.href = url;
        itemEl.appendChild(iconEl);
        itemEl.appendChild(textEl);
        searchResult.appendChild(itemEl);
    }
}
