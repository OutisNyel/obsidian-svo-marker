import { App, MarkdownView, Notice } from "obsidian";

export type SvoRole = "subj" | "pred" | "obj";

const ROLE_CLASS: Record<SvoRole, string> = {
	subj: "svo-subj",
	pred: "svo-pred",
	obj: "svo-obj",
};

const KNOWN_CLASSES = new Set(Object.values(ROLE_CLASS));

const LEGACY_DECORATION_TO_CLASS: Record<string, string> = {
	"underline line-through": ROLE_CLASS.subj,
	underline: ROLE_CLASS.pred,
	"underline wavy": ROLE_CLASS.obj,
};

const CLASS_WRAPPER_REGEX =
	/^(\s*)<span\s+class=(['"])(svo-(?:subj|pred|obj))\2\s*>([\s\S]*)<\/span>(\s*)$/i;
const STYLE_WRAPPER_REGEX = /^(\s*)<span\s+style=(['"])([^'"]*)\2\s*>([\s\S]*)<\/span>(\s*)$/i;

function normalizeWhitespace(value: string): string {
	return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getLegacyClassFromStyle(styleText: string): string | null {
	const match = /text-decoration\s*:\s*([^;]+)\s*;?/i.exec(styleText);
	const decoration = match?.[1];
	if (!decoration) {
		return null;
	}

	const normalizedDecoration = normalizeWhitespace(decoration);
	return LEGACY_DECORATION_TO_CLASS[normalizedDecoration] ?? null;
}

function unwrapKnownMarker(text: string): string | null {
	const classMatch = CLASS_WRAPPER_REGEX.exec(text);
	if (classMatch) {
		const leading = classMatch[1];
		const matchedClass = classMatch[3];
		const inner = classMatch[4];
		const trailing = classMatch[5];
		if (!leading || !matchedClass || inner === undefined || trailing === undefined) {
			return null;
		}

		if (KNOWN_CLASSES.has(matchedClass.toLowerCase())) {
			return `${leading}${inner}${trailing}`;
		}
	}

	const styleMatch = STYLE_WRAPPER_REGEX.exec(text);
	if (!styleMatch) {
		return null;
	}

	const leading = styleMatch[1];
	const styleText = styleMatch[3];
	const inner = styleMatch[4];
	const trailing = styleMatch[5];
	if (!leading || !styleText || inner === undefined || trailing === undefined) {
		return null;
	}

	const legacyClass = getLegacyClassFromStyle(styleText);
	if (!legacyClass || !KNOWN_CLASSES.has(legacyClass)) {
		return null;
	}

	return `${leading}${inner}${trailing}`;
}

function normalizeSelectionContent(selection: string): string {
	let current = selection;

	for (;;) {
		const unwrapped = unwrapKnownMarker(current);
		if (!unwrapped) {
			return current;
		}
		current = unwrapped;
	}
}

function getActiveEditor(app: App) {
	return app.workspace.getActiveViewOfType(MarkdownView)?.editor ?? null;
}

export function applySvoMarker(app: App, role: SvoRole): void {
	const editor = getActiveEditor(app);
	if (!editor) {
		new Notice("Open a Markdown editor first");
		return;
	}

	const selectedText = editor.getSelection();
	if (!selectedText) {
		new Notice("Select text to mark first");
		return;
	}

	const normalized = normalizeSelectionContent(selectedText);
	const replacement = `<span class="${ROLE_CLASS[role]}">${normalized}</span>`;

	if (replacement !== selectedText) {
		editor.replaceSelection(replacement);
	}
}
