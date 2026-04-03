import { Plugin } from "obsidian";
import { applySvoMarker, type SvoRole } from "./marking";

interface SvoCommand {
	id: string;
	name: string;
	role: SvoRole;
}

const SVO_COMMANDS: SvoCommand[] = [
	{ id: "mark-svo-subj", name: "标记主", role: "subj" },
	{ id: "mark-svo-pred", name: "标记谓", role: "pred" },
	{ id: "mark-svo-obj", name: "标记宾", role: "obj" },
];

export default class SvoMarkerPlugin extends Plugin {
	async onload(): Promise<void> {
		for (const command of SVO_COMMANDS) {
			this.addCommand({
				id: command.id,
				name: command.name,
				callback: () => applySvoMarker(this.app, command.role),
			});
		}
	}
}
