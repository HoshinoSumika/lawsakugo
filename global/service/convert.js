export function convert(xmlStr) {
    return transformDocument(xmlStr);
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function transformDocument(xmlStr) {
    let temp = xmlStr;

    temp = transformXmlToHtml(temp);

    if (!(temp instanceof Node)) {
        return null;
    }

    temp = removeIgnorableSpaces(temp);

    temp = extractLaw(temp); // 一定の情報を保持しつつ、本体を抽出

    temp = moveRemarksAfterTableStruct(temp); // 「（備考）」や「（注）」を表の後に置く
    temp = moveArticleTitlesIntoFirstParagraphStrict(temp); // 条数（span）をArticleの内部に置く
    temp = addOldParagraphCircledNums(temp); // 番号のない項に丸数字の番号を追加
    temp = addSupplProvisionAmendLawNum(temp); // 附則の法令番号を追加
    temp = addSupplProvisionExtractLabel(temp); // 「抄」を追加
    temp = extractParagraphCaptionBeforeParagraph(temp); // 段落見出しを抽出しないと、段落（span）のインデントが困難
    temp = tagParagraphBlankNum(temp); // 番号のない段落にタグを追加

    temp = addZenkakuSpaceAfterClass(temp, 'ArticleTitle');
    temp = addZenkakuSpaceAfterClass(temp, 'ParagraphNum');
    temp = addZenkakuSpaceAfterClass(temp, 'ItemTitle');
    temp = addZenkakuSpaceAfterClass(temp, 'Subitem1Title');
    temp = addZenkakuSpaceAfterClass(temp, 'Subitem2Title');
    temp = addZenkakuSpaceAfterClass(temp, 'Subitem3Title');
    temp = addZenkakuSpaceAfterClass(temp, 'Subitem4Title');
    temp = addZenkakuSpaceAfterClass(temp, 'Subitem5Title');
    temp = addZenkakuSpaceAfterClass(temp, 'Column');

    return temp.outerHTML;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function transformXmlToHtml(xmlStr) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length) {
        Debug.error('Invalid XML');
        return null;
    }

    const tagMap = {
        TOC: 'section', MainProvision: 'section', SupplProvision: 'section', AppdxTable: 'section',
        Part: 'section', Chapter: 'section', Section: 'section', Subsection: 'section', Division: 'section',
        Article: 'section',

        PartTitle: 'span', ChapterTitle: 'span', SectionTitle: 'span', SubsectionTitle: 'span', DivisionTitle: 'span',
        SupplProvisionLabel: 'span',
        ArticleRange: 'span',

        ArticleTitle: 'span', ParagraphNum: 'span',
        ParagraphSentence: 'span', Sentence: 'span',
        ItemTitle: 'span', ItemSentence: 'span',
        Subitem1Title: 'span', Subitem1Sentence: 'span',
        Subitem2Title: 'span', Subitem2Sentence: 'span',
        Subitem3Title: 'span', Subitem3Sentence: 'span',
        Subitem4Title: 'span', Subitem4Sentence: 'span',
        Subitem5Title: 'span', Subitem5Sentence: 'span',
        Column: 'span',
        ListSentence: 'span', Sublist1Sentence: 'span', Sublist2Sentence: 'span', Sublist3Sentence: 'span',

        SupplProvisionAppdxTableTitle: 'span', AppdxTableTitle: 'span', AppdxNoteTitle: 'span', RelatedArticleNum: 'span',

        TableStruct: 'table', Table: 'tbody',
        TableRow: 'tr', TableColumn: 'td',

        Ruby: 'ruby', Rt: 'rt',
    };

    function convertNode(xmlNode, htmlDoc) {
        if (xmlNode.nodeType === Node.ELEMENT_NODE) {
            const origName = xmlNode.localName || xmlNode.nodeName;
            const tagName = tagMap[origName] || 'div';
            const element = htmlDoc.createElement(tagName);
            element.className = origName;

            if (xmlNode.attributes && xmlNode.attributes.length) {
                for (let i = 0; i < xmlNode.attributes.length; i++) {
                    const attr = xmlNode.attributes[i];
                    const nameLower = attr.name.toLowerCase();

                    if (tagName === 'td' && (nameLower === 'rowspan' || nameLower === 'colspan')) {
                        element.setAttribute(nameLower, attr.value);
                        continue;
                    }

                    const prefix = attr.prefix ? attr.prefix + '-' : '';
                    const safeLocal = (attr.localName || attr.name).replace(/[^a-zA-Z0-9_\-]+/g, '-');
                    const dataName = 'data-xml-' + prefix + safeLocal;
                    element.setAttribute(dataName, attr.value);
                }
            }

            for (let child = xmlNode.firstChild; child; child = child.nextSibling) {
                const convertedChild = convertNode(child, htmlDoc);
                if (convertedChild) {
                    element.appendChild(convertedChild);
                }
            }
            return element;
        }

        if (xmlNode.nodeType === Node.TEXT_NODE) {
            return xmlNode.nodeValue.length ? htmlDoc.createTextNode(xmlNode.nodeValue) : null;
        }

        return null;
    }

    const htmlDoc = document.implementation.createHTMLDocument('');
    return convertNode(xmlDoc.documentElement, htmlDoc);
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function removeIgnorableSpaces(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const removeList = [];
    let node;
    while ((node = walker.nextNode())) {
        if (/^[\x20\t\r\n]*$/.test(node.nodeValue)) {
            removeList.push(node);
        }
    }
    removeList.forEach(n => {
        if (n.parentNode) {
            n.parentNode.removeChild(n);
        }
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function extractLaw(el) {
    const container = el.querySelector('.law_full_text');
    if (!container) {
        return el.ownerDocument.createElement('div');
    }

    const law = container.querySelector('.Law');
    if (!law) {
        return el.ownerDocument.createElement('div');
    }

    const revisionInfo = el.querySelector('.revision_info');
    if (revisionInfo) {
        const titleElem = revisionInfo.querySelector('.amendment_law_title');
        const numElem = revisionInfo.querySelector('.amendment_law_num');
        const dateElem = revisionInfo.querySelector('.amendment_enforcement_date');

        const titleText = titleElem ? titleElem.textContent.trim() : '';
        const numText = numElem ? numElem.textContent.trim() : '';
        const dateText = dateElem ? dateElem.textContent.trim() : '';

        const infoDiv = el.ownerDocument.createElement('div');
        infoDiv.className = 'Info';

        if (dateText) {
            const elDate = el.ownerDocument.createElement('div');
            elDate.className = 'AmendmentEnforcementDate';
            const date = wareki(dateText);
            elDate.textContent = `${date} 施行`;
            infoDiv.appendChild(elDate);
        }
        if (titleText) {
            const elTitle = el.ownerDocument.createElement('span');
            elTitle.className = 'AmendmentLawTitle';
            elTitle.textContent = `${titleText}`;
            infoDiv.appendChild(elTitle);
        }
        if (numText) {
            const elNum = el.ownerDocument.createElement('span');
            elNum.className = 'AmendmentLawNum';
            elNum.textContent = `（${numText}）`;
            infoDiv.appendChild(elNum);
        }

        law.insertBefore(infoDiv, law.firstChild);
    }

    return law;
}

function wareki(dateStr) {
    const [yearStr, monthStr, dayStr] = dateStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (year >= 2019) {
        const reiwaYear = year - 2018;
        const reiwaLabel = reiwaYear === 1 ? '令和元年' : `令和${reiwaYear}年`;
        return `${reiwaLabel}${month}月${day}日`;
    } else if (year >= 1989) {
        const heiseiYear = year - 1988;
        const heiseiLabel = heiseiYear === 1 ? '平成元年' : `平成${heiseiYear}年`;
        return `${heiseiLabel}${month}月${day}日`;
    } else if (year >= 1926) {
        const showaYear = year - 1925;
        const showaLabel = showaYear === 1 ? '昭和元年' : `昭和${showaYear}年`;
        return `${showaLabel}${month}月${day}日`;
    } else if (year >= 1912) {
        const taishoYear = year - 1911;
        const taishoLabel = taishoYear === 1 ? '大正元年' : `大正${taishoYear}年`;
        return `${taishoLabel}${month}月${day}日`;
    } else {
        return `${year}年${month}月${day}日`;
    }
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function moveRemarksAfterTableStruct(el) {
    const tableStructs = el.querySelectorAll('.TableStruct');
    tableStructs.forEach(table => {
        const parent = table.parentNode;
        if (!parent) return;

        let prev = table.previousElementSibling;
        while (prev && prev.classList.contains('Remarks')) {
            const current = prev;
            prev = current.previousElementSibling;

            parent.removeChild(current);
            if (table.nextSibling) {
                parent.insertBefore(current, table.nextSibling);
            } else {
                parent.appendChild(current);
            }
        }
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function moveArticleTitlesIntoFirstParagraphStrict(el) {
    const articles = el.querySelectorAll('.Article');
    articles.forEach(article => {
        const title = article.querySelector(':scope > .ArticleTitle');
        if (!title) {
            return;
        }
        const sib = title.nextElementSibling;
        if (!sib || !sib.classList.contains('Paragraph')) {
            return;
        }
        sib.insertBefore(title, sib.firstChild);
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function addOldParagraphCircledNums(el) {
    const oldParas = el.querySelectorAll('.Paragraph[data-xml-oldnum]');
    oldParas.forEach(p => {
        const oldVal = p.getAttribute('data-xml-oldnum');
        if (!oldVal || oldVal.trim().toLowerCase() !== 'true') {
            return;
        }

        const numAttr = p.getAttribute('data-xml-num');
        const n = numAttr ? parseInt(numAttr, 10) : NaN;
        if (!Number.isInteger(n) || n <= 0) {
            return;
        }

        const pn = p.querySelector(':scope > .ParagraphNum');
        if (!pn) {
            return;
        }

        if (pn.textContent.trim().length > 0) {
            return;
        }

        pn.textContent = formatCircledNumber(n);
    });

    return el;
}

function formatCircledNumber(n) {
    if (n >= 1 && n <= 20) {
        return String.fromCharCode(0x2460 + (n - 1));
    }
    return '(' + n + ')';
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function addSupplProvisionAmendLawNum(el) {
    const sections = el.querySelectorAll('.SupplProvision[data-xml-amendlawnum]');
    sections.forEach(sec => {
        const lawnum = sec.getAttribute('data-xml-amendlawnum');
        if (!lawnum || lawnum.trim() === '') {
            return;
        }
        const label = sec.querySelector(':scope > .SupplProvisionLabel');
        if (!label) {
            return;
        }
        const suffix = '　' + '（' + lawnum + '）';
        const currentText = label.textContent || '';
        if (currentText.includes(suffix)) {
            return;
        }
        label.appendChild(document.createTextNode(suffix));
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function addSupplProvisionExtractLabel(el) {
    const sections = el.querySelectorAll('.SupplProvision[data-xml-extract="true"]');
    sections.forEach(sec => {
        const label = sec.querySelector(':scope > .SupplProvisionLabel');
        if (!label) {
            return;
        }
        const suffix = '　' + '抄';
        const currentText = label.textContent || '';
        if (currentText.includes(suffix)) {
            return;
        }
        label.appendChild(document.createTextNode(suffix));
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function extractParagraphCaptionBeforeParagraph(el) {
    const paras = el.querySelectorAll('.Paragraph');
    paras.forEach(p => {
        const cap = p.querySelector(':scope > .ParagraphCaption');
        if (!cap) {
            return;
        }

        const parent = p.parentNode;
        if (!parent) {
            return;
        }

        parent.insertBefore(cap, p);
    });

    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function tagParagraphBlankNum(el) {
    el.querySelectorAll('.MainProvision > .Paragraph, .SupplProvision > .Paragraph').forEach(p => {
        const pn = p.querySelector(':scope > .ParagraphNum');
        if (!pn || pn.textContent.trim()) return;
        p.classList.add('ParagraphBlankNum');
    });
    return el;
}

// ----------------------------------------------------------------------------------------------------
// COMMENT
// ----------------------------------------------------------------------------------------------------

function addZenkakuSpaceAfterClass(el, targetClass) {
    const targets = el.querySelectorAll('.' + CSS.escape(targetClass));
    const zenkaku = '\u3000';

    targets.forEach(node => {
        if (node.textContent.trim().length === 0) {
            return;
        }
        const parent = node.parentElement;
        if (!parent) {
            return;
        }
        if (parent.lastElementChild === node) {
            return;
        }
        const nextNode = node.nextSibling;
        if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
            if (!nextNode.data.startsWith(zenkaku)) {
                nextNode.data = zenkaku + nextNode.data;
            }
        } else {
            parent.insertBefore(document.createTextNode(zenkaku), nextNode || node.nextSibling);
        }
    });

    return el;
}
