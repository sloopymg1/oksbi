import { a as api } from './api-GJQTpCzq.mjs';
import { u as useApiResource, S as StatePanel_default } from './useApiResource-CTH05IVH.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './AppIcon-CzcdSF-4.mjs';
import '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import 'unhead/utils';

//#region src/pages/support.vue?vue&type=script&setup=true&lang.ts
var support_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "support",
	__ssrInlineRender: true,
	setup(__props) {
		const supportResource = useApiResource(() => api.listSupportCases());
		const rows = computed(() => supportResource.data.value ?? []);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(StatePanel_default, mergeProps({
				data: unref(rows),
				loading: unref(supportResource).loading.value,
				error: unref(supportResource).error.value,
				empty: unref(rows).length === 0,
				"empty-title": "No open support or takedown cases",
				"empty-body": "Queue assignments, provider escalations, and SLA risk will appear once cases enter operations.",
				"action-label": "Open support case",
				onRetry: ($event) => unref(supportResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="workspace-copy"${_scopeId}><div class="support-grid"${_scopeId}><article class="surface content-span-4 workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Support desk</span><h2 class="section-title"${_scopeId}>Cases are grouped by operational queue with takedown urgency kept visible.</h2><p class="helper-text"${_scopeId}>Support, copyright, and payout incidents stay attached to ownership and creator context.</p><div class="detail-card"${_scopeId}><span class="metric-label"${_scopeId}>SLA warning</span><strong class="metric-value"${_scopeId}>4</strong><span class="helper-text"${_scopeId}>Critical catalog integrity cases must be reviewed within six hours.</span></div></article><article class="table-shell content-span-8"${_scopeId}><div class="table-toolbar"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "6px" })}"${_scopeId}><strong${_scopeId}>Queue and escalation view</strong><span class="helper-text"${_scopeId}>Owner, queue, and provider involvement at a glance.</span></div><button class="secondary-button" type="button"${_scopeId}>Escalation board</button></div><table class="data-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Case</th><th${_scopeId}>Queue</th><th${_scopeId}>Priority</th><th${_scopeId}>Owner</th><th${_scopeId}>Updated</th><th${_scopeId}>Status</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(unref(rows), (row) => {
							_push(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(row.subject)}</td><td${_scopeId}>${ssrInterpolate(row.queue)}</td><td${_scopeId}>${ssrInterpolate(row.priority)}</td><td${_scopeId}>${ssrInterpolate(row.owner)}</td><td${_scopeId}>${ssrInterpolate(row.updatedAt)}</td><td${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(row.status)}</span></td></tr>`);
						});
						_push(`<!--]--></tbody></table></article></div></section>`);
					} else return [createVNode("section", { class: "workspace-copy" }, [createVNode("div", { class: "support-grid" }, [createVNode("article", { class: "surface content-span-4 workspace-copy" }, [
						createVNode("span", { class: "eyebrow" }, "Support desk"),
						createVNode("h2", { class: "section-title" }, "Cases are grouped by operational queue with takedown urgency kept visible."),
						createVNode("p", { class: "helper-text" }, "Support, copyright, and payout incidents stay attached to ownership and creator context."),
						createVNode("div", { class: "detail-card" }, [
							createVNode("span", { class: "metric-label" }, "SLA warning"),
							createVNode("strong", { class: "metric-value" }, "4"),
							createVNode("span", { class: "helper-text" }, "Critical catalog integrity cases must be reviewed within six hours.")
						])
					]), createVNode("article", { class: "table-shell content-span-8" }, [createVNode("div", { class: "table-toolbar" }, [createVNode("div", {
						class: "workspace-copy",
						style: { "gap": "6px" }
					}, [createVNode("strong", null, "Queue and escalation view"), createVNode("span", { class: "helper-text" }, "Owner, queue, and provider involvement at a glance.")]), createVNode("button", {
						class: "secondary-button",
						type: "button"
					}, "Escalation board")]), createVNode("table", { class: "data-table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, "Case"),
						createVNode("th", null, "Queue"),
						createVNode("th", null, "Priority"),
						createVNode("th", null, "Owner"),
						createVNode("th", null, "Updated"),
						createVNode("th", null, "Status")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (row) => {
						return openBlock(), createBlock("tr", { key: row.id }, [
							createVNode("td", null, toDisplayString(row.subject), 1),
							createVNode("td", null, toDisplayString(row.queue), 1),
							createVNode("td", null, toDisplayString(row.priority), 1),
							createVNode("td", null, toDisplayString(row.owner), 1),
							createVNode("td", null, toDisplayString(row.updatedAt), 1),
							createVNode("td", null, [createVNode("span", { class: "pill" }, toDisplayString(row.status), 1)])
						]);
					}), 128))])])])])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/support.vue
var _sfc_setup = support_vue_vue_type_script_setup_true_lang_default.setup;
support_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/support.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var support_default = support_vue_vue_type_script_setup_true_lang_default;

export { support_default as default };
//# sourceMappingURL=support-DmsjUeNs.mjs.map
