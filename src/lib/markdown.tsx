import React from "react";

/**
 * Robust, lightweight Markdown-to-HTML parser tailored for clinical pet care guides.
 * Supports:
 * - H2 (##) and H3 (###) with anchor IDs
 * - Bold (**text**) and Italics (*text*)
 * - Bullet lists (- item) with styled checkmark/bullet icons
 * - Numbered lists (1. item) with styled badges
 * - Markdown tables (| header | header |)
 * - Blockquotes (> note)
 * - Paragraphs with comfortable line height and high contrast
 */
export function renderArticleMarkdown(content: string): string {
  if (!content) return "";

  const lines = content.trim().split("\n");
  const htmlParts: string[] = [];

  let inList: "ul" | "ol" | null = null;
  let inTable = false;
  let tableHeaderParsed = false;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    let tableHtml = '<div class="overflow-x-auto my-6 border-3 border-black rounded-2xl bg-white dark:bg-slate-900 pop-shadow-sm"><table class="w-full text-left text-sm border-collapse">';
    
    // Header row
    const headerCols = tableBuffer[0]
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);

    tableHtml += '<thead class="bg-[#FFE600] text-black border-b-2 border-black"><tr>';
    headerCols.forEach((col) => {
      tableHtml += `<th class="p-3 font-display font-black text-xs uppercase">${col}</th>`;
    });
    tableHtml += '</tr></thead><tbody class="divide-y-2 divide-slate-100 dark:divide-slate-800 font-semibold">';

    // Rows
    for (let i = 2; i < tableBuffer.length; i++) {
      const rowCols = tableBuffer[i]
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (rowCols.length > 0) {
        tableHtml += '<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60">';
        rowCols.forEach((col) => {
          tableHtml += `<td class="p-3 text-slate-800 dark:text-slate-200">${col}</td>`;
        });
        tableHtml += '</tr>';
      }
    }

    tableHtml += '</tbody></table></div>';
    htmlParts.push(tableHtml);
    tableBuffer = [];
    inTable = false;
    tableHeaderParsed = false;
  };

  const closeList = () => {
    if (inList === "ul") {
      htmlParts.push("</ul>");
      inList = null;
    } else if (inList === "ol") {
      htmlParts.push("</ol>");
      inList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check table line
    if (line.startsWith("|") && line.endsWith("|")) {
      closeList();
      tableBuffer.push(line);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blank line
    if (!line) {
      closeList();
      continue;
    }

    // Heading 3: ### Title
    if (line.startsWith("### ")) {
      closeList();
      const text = line.replace(/^###\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      htmlParts.push(
        `<h3 id="${id}" class="font-display font-black text-xl sm:text-2xl mt-6 mb-3 text-slate-900 dark:text-white flex items-center gap-2">` +
        `<span class="w-2.5 h-2.5 rounded-full bg-[#00F5D4] inline-block border border-black"></span>` +
        `${formatInline(text)}</h3>`
      );
      continue;
    }

    // Heading 2: ## Title
    if (line.startsWith("## ")) {
      closeList();
      const text = line.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      htmlParts.push(
        `<h2 id="${id}" class="font-display font-black text-2xl sm:text-3xl mt-10 mb-4 text-[#181126] dark:text-white pb-2 border-b-2 border-black/10">` +
        `${formatInline(text)}</h2>`
      );
      continue;
    }

    // Blockquote: > text
    if (line.startsWith("> ")) {
      closeList();
      const quote = line.replace(/^>\s+/, "");
      htmlParts.push(
        `<blockquote class="my-5 border-l-4 border-[#FF4D6D] bg-[#FFF0F3] dark:bg-purple-950/40 p-4 rounded-r-2xl text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base pop-shadow-sm">` +
        `${formatInline(quote)}</blockquote>`
      );
      continue;
    }

    // Unordered List: - or *
    if (/^[-*]\s+/.test(line)) {
      if (inList !== "ul") {
        closeList();
        htmlParts.push('<ul class="my-4 space-y-2.5 pl-1">');
        inList = "ul";
      }
      const itemText = line.replace(/^[-*]\s+/, "");
      htmlParts.push(
        `<li class="flex items-start gap-2.5 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold">` +
        `<span class="text-[#FF4D6D] font-bold text-base mt-0.5 shrink-0">🐾</span>` +
        `<span>${formatInline(itemText)}</span></li>`
      );
      continue;
    }

    // Ordered List: 1. Item
    if (/^\d+\.\s+/.test(line)) {
      if (inList !== "ol") {
        closeList();
        htmlParts.push('<ol class="my-4 space-y-2.5 pl-1">');
        inList = "ol";
      }
      const match = line.match(/^(\d+)\.\s+(.*)/);
      const num = match ? match[1] : "•";
      const itemText = match ? match[2] : line;
      htmlParts.push(
        `<li class="flex items-start gap-2.5 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold">` +
        `<span class="w-6 h-6 rounded-full bg-[#FFE600] border-2 border-black text-black font-display font-black text-xs flex items-center justify-center shrink-0 mt-0.5">${num}</span>` +
        `<span>${formatInline(itemText)}</span></li>`
      );
      continue;
    }

    // Normal Paragraph
    closeList();
    htmlParts.push(
      `<p class="mb-4 text-slate-800 dark:text-slate-200 leading-relaxed font-medium text-base sm:text-lg">` +
      `${formatInline(line)}</p>`
    );
  }

  closeList();
  if (inTable) flushTable();

  return htmlParts.join("\n");
}

function formatInline(str: string): string {
  return str
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-[#181126] dark:text-white">$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em class="italic font-bold">$1</em>')
    // Code snippet: `code`
    .replace(/`([^`]+)`/g, '<code class="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-black/20 text-[#FF4D6D]">$1</code>');
}
