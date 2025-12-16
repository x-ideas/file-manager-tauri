import {invoke} from "@tauri-apps/api/core";

export class File {
	static async readJson(path: string): Promise<string> {
		const content = await invoke("read_file", {
			path,
			ecoding: "utf-8",
		});

		return JSON.parse(content as string);
	}

	static async writeJson(path: string, content: string) {
		await invoke("write_file", {
			path,
			content,
		});
	}
}
