#!/usr/bin/env node

/**
 * Version synchronization script for Tauri project
 * Syncs version from package.json to tauri.conf.json and Cargo.toml
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Read JSON file
 */
function readJson(filePath) {
	try {
		const content = readFileSync(filePath, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		console.error(`Error reading ${filePath}:`, error.message);
		process.exit(1);
	}
}

/**
 * Write JSON file with proper formatting
 */
function writeJson(filePath, data) {
	try {
		const content = JSON.stringify(data, null, 2) + '\n';
		writeFileSync(filePath, content, 'utf-8');
	} catch (error) {
		console.error(`Error writing ${filePath}:`, error.message);
		process.exit(1);
	}
}

/**
 * Update Cargo.toml version
 */
function updateCargoToml(version) {
	const cargoPath = join(rootDir, 'src-tauri', 'Cargo.toml');
	let content = readFileSync(cargoPath, 'utf-8');

	// Replace version in [package] section
	content = content.replace(
		/^version\s*=\s*"[^"]+"/m,
		`version = "${version}"`,
	);

	writeFileSync(cargoPath, content, 'utf-8');
	console.log(`✓ Updated Cargo.toml to version ${version}`);
}

/**
 * Update tauri.conf.json version
 */
function updateTauriConfig(version) {
	const tauriPath = join(rootDir, 'src-tauri', 'tauri.conf.json');
	const config = readJson(tauriPath);
	config.version = version;
	writeJson(tauriPath, config);
	console.log(`✓ Updated tauri.conf.json to version ${version}`);
}

/**
 * Main function
 */
function syncVersion() {
	const packageJsonPath = join(rootDir, 'package.json');
	const packageJson = readJson(packageJsonPath);
	const version = packageJson.version;

	if (!version) {
		console.error('Error: version not found in package.json');
		process.exit(1);
	}

	console.log(`Syncing version ${version}...`);

	updateTauriConfig(version);
	updateCargoToml(version);

	console.log(`\n✓ Version ${version} synchronized successfully!`);
}

syncVersion();
