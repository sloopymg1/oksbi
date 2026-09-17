//#region src/api/client.ts
function toWorkspaceUser(user) {
	return {
		id: user.id,
		fullName: user.displayName,
		role: user.roles[0] ?? "Creator",
		organization: user.organizationId ?? "Independent workspace",
		email: user.email,
		avatarUrl: ""
	};
}
async function request(path, options = {}) {
	const headers = new Headers(options.headers);
	headers.set("Accept", "application/json");
	if (options.body) headers.set("Content-Type", "application/json");
	const response = await fetch(`/api${path}`, {
		...options,
		headers,
		credentials: "include"
	});
	const body = response.status === 204 ? null : await response.json();
	if (!response.ok) {
		const message = body?.error?.message ?? `Request failed with status ${response.status}.`;
		throw new Error(message);
	}
	return body;
}
function releaseRecord(release) {
	return {
		id: release.id,
		title: release.title,
		artist: "Workspace catalog",
		artworkUrl: release.artworkBlobPath ?? "",
		upc: "Not assigned",
		stage: release.status,
		deliveryWindow: release.releaseDate,
		territories: 0,
		revenueAtRisk: "$0"
	};
}
//#endregion
//#region src/api/index.ts
var api = {
	async getCurrentUser() {
		try {
			return toWorkspaceUser((await request("/auth/me")).user);
		} catch {
			return null;
		}
	},
	async login(input) {
		const response = await request("/auth/login", {
			method: "POST",
			body: JSON.stringify(input)
		});
		return {
			user: toWorkspaceUser(response.user),
			token: response.accessToken
		};
	},
	async logout() {
		await request("/auth/logout", { method: "POST" });
	},
	async createAccount(input) {
		const response = await request("/auth/register", {
			method: "POST",
			body: JSON.stringify({
				displayName: input.fullName,
				email: input.email,
				password: input.password
			})
		});
		return {
			user: toWorkspaceUser(response.user),
			token: response.accessToken
		};
	},
	async getDashboardSnapshot() {
		const [catalog, royalties] = await Promise.all([this.listCatalog(), this.listRoyalties()]);
		return {
			metrics: [{
				id: "releases",
				label: "Releases",
				value: String(catalog.length),
				trend: "Live catalog",
				tone: "ok"
			}, {
				id: "royalties",
				label: "Net royalties",
				value: royalties[0]?.net ?? "$0",
				trend: "Latest statement",
				tone: "ok"
			}],
			notices: catalog.length === 0 ? [{
				id: "catalog-empty",
				title: "Catalog is empty",
				detail: "Create a release to begin distribution.",
				tone: "muted"
			}] : [],
			activity: [],
			spotlightReleases: catalog.slice(0, 3),
			royaltyHealth: royalties.length === 0 ? [{
				id: "royalties-empty",
				title: "No statements yet",
				detail: "Statements will appear after ingestion.",
				tone: "muted"
			}] : []
		};
	},
	async listCatalog() {
		return (await request("/releases")).items.map(releaseRecord);
	},
	async listRights() {
		const [splits, compositions] = await Promise.all([request("/rights/splits"), request("/compositions")]);
		const compositionById = new Map(compositions.items.map((composition) => [composition.id, composition]));
		return splits.items.map((split) => {
			const composition = compositionById.get(split.compositionId);
			return {
				id: split.id,
				work: composition?.title ?? split.versionName,
				writer: split.interests[0]?.partyName ?? "Unassigned",
				society: composition?.publisherName ?? "Unassigned",
				splitStatus: split.status,
				issue: split.interests.length === 0 ? "Add ownership interests" : "No open issue",
				effectiveDate: "Not set"
			};
		});
	},
	async listRoyalties() {
		return (await request("/royalties/statements")).items.map((statement) => ({
			id: statement.id,
			statementMonth: statement.statementMonth,
			source: "Royalty statement",
			gross: `${statement.currencyCode} ${statement.grossAmount}`,
			reserves: "Not reported",
			net: `${statement.currencyCode} ${statement.netAmount}`,
			status: statement.status
		}));
	},
	async listPayouts() {
		return (await request("/payouts")).items.map((payout) => ({
			id: payout.id,
			creator: "Current workspace",
			amount: `${payout.currencyCode} ${payout.amount}`,
			method: payout.destinationLabel,
			taxStatus: "Not reported",
			scheduledFor: payout.createdAt,
			status: payout.status
		}));
	},
	async listSupportCases() {
		return (await request("/support/cases")).items.map((supportCase) => ({
			id: supportCase.id,
			subject: supportCase.subject,
			queue: supportCase.category,
			priority: "Normal",
			owner: "Support team",
			updatedAt: supportCase.updatedAt,
			status: supportCase.status
		}));
	}
};

export { api as a };
//# sourceMappingURL=api-GJQTpCzq.mjs.map
