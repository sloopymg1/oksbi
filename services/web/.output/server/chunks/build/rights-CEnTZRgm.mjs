import { a as api } from './api-GJQTpCzq.mjs';
import { u as useApiResource, S as StatePanel_default } from './useApiResource-CTH05IVH.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
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

//#region src/pages/rights.vue?vue&type=script&setup=true&lang.ts
var rights_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "rights",
	__ssrInlineRender: true,
	setup(__props) {
		const rightsResource = useApiResource(() => api.listRights());
		const rows = computed(() => rightsResource.data.value ?? []);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(StatePanel_default, mergeProps({
				data: unref(rows),
				loading: unref(rightsResource).loading.value,
				error: unref(rightsResource).error.value,
				empty: unref(rows).length === 0,
				"empty-title": "No rights conflicts need attention",
				"empty-body": "Claims, agreements, and split versions will appear here when there is a rights review queue.",
				"action-label": "Create split review",
				onRetry: ($event) => unref(rightsResource).reload()
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<section class="workspace-copy"${_scopeId}><div class="detail-grid"${_scopeId}><article class="surface content-span-4 workspace-copy"${_scopeId}><span class="eyebrow"${_scopeId}>Rights review</span><h2 class="section-title"${_scopeId}>Effective dates and approval state stay visible before any publishing changes ship.</h2><p class="helper-text"${_scopeId}>Use this board to prevent overlapping claims, invalid ownership totals, or unapproved amendments from reaching finance.</p><div class="note-card"${_scopeId}><strong${_scopeId}>Validation note</strong><label class="form-label"${_scopeId}> Split amendment summary <input class="form-field" value="Two writers exceed 100.00% combined on Midnight Export"${_scopeId}><span class="validation-note"${_scopeId}>Total ownership must equal 100.00% before approval can proceed.</span></label></div></article><article class="table-shell content-span-8"${_scopeId}><div class="table-toolbar"${_scopeId}><div class="workspace-copy" style="${ssrRenderStyle({ "gap": "6px" })}"${_scopeId}><strong${_scopeId}>Current claims and split reviews</strong><span class="helper-text"${_scopeId}>Publishing operations with audit context and blockers.</span></div><button class="secondary-button" type="button"${_scopeId}>Open approval log</button></div><table class="data-table"${_scopeId}><thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Work</th><th${_scopeId}>Writer</th><th${_scopeId}>Society</th><th${_scopeId}>Split status</th><th${_scopeId}>Issue</th><th${_scopeId}>Effective date</th></tr></thead><tbody${_scopeId}><!--[-->`);
						ssrRenderList(unref(rows), (row) => {
							_push(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(row.work)}</td><td${_scopeId}>${ssrInterpolate(row.writer)}</td><td${_scopeId}>${ssrInterpolate(row.society)}</td><td${_scopeId}><span class="pill"${_scopeId}>${ssrInterpolate(row.splitStatus)}</span></td><td${_scopeId}>${ssrInterpolate(row.issue)}</td><td${_scopeId}>${ssrInterpolate(row.effectiveDate)}</td></tr>`);
						});
						_push(`<!--]--></tbody></table></article></div></section>`);
					} else return [createVNode("section", { class: "workspace-copy" }, [createVNode("div", { class: "detail-grid" }, [createVNode("article", { class: "surface content-span-4 workspace-copy" }, [
						createVNode("span", { class: "eyebrow" }, "Rights review"),
						createVNode("h2", { class: "section-title" }, "Effective dates and approval state stay visible before any publishing changes ship."),
						createVNode("p", { class: "helper-text" }, "Use this board to prevent overlapping claims, invalid ownership totals, or unapproved amendments from reaching finance."),
						createVNode("div", { class: "note-card" }, [createVNode("strong", null, "Validation note"), createVNode("label", { class: "form-label" }, [
							createTextVNode(" Split amendment summary "),
							createVNode("input", {
								class: "form-field",
								value: "Two writers exceed 100.00% combined on Midnight Export"
							}),
							createVNode("span", { class: "validation-note" }, "Total ownership must equal 100.00% before approval can proceed.")
						])])
					]), createVNode("article", { class: "table-shell content-span-8" }, [createVNode("div", { class: "table-toolbar" }, [createVNode("div", {
						class: "workspace-copy",
						style: { "gap": "6px" }
					}, [createVNode("strong", null, "Current claims and split reviews"), createVNode("span", { class: "helper-text" }, "Publishing operations with audit context and blockers.")]), createVNode("button", {
						class: "secondary-button",
						type: "button"
					}, "Open approval log")]), createVNode("table", { class: "data-table" }, [createVNode("thead", null, [createVNode("tr", null, [
						createVNode("th", null, "Work"),
						createVNode("th", null, "Writer"),
						createVNode("th", null, "Society"),
						createVNode("th", null, "Split status"),
						createVNode("th", null, "Issue"),
						createVNode("th", null, "Effective date")
					])]), createVNode("tbody", null, [(openBlock(true), createBlock(Fragment, null, renderList(unref(rows), (row) => {
						return openBlock(), createBlock("tr", { key: row.id }, [
							createVNode("td", null, toDisplayString(row.work), 1),
							createVNode("td", null, toDisplayString(row.writer), 1),
							createVNode("td", null, toDisplayString(row.society), 1),
							createVNode("td", null, [createVNode("span", { class: "pill" }, toDisplayString(row.splitStatus), 1)]),
							createVNode("td", null, toDisplayString(row.issue), 1),
							createVNode("td", null, toDisplayString(row.effectiveDate), 1)
						]);
					}), 128))])])])])])];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region src/pages/rights.vue
var _sfc_setup = rights_vue_vue_type_script_setup_true_lang_default.setup;
rights_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rights.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var rights_default = rights_vue_vue_type_script_setup_true_lang_default;

export { rights_default as default };
//# sourceMappingURL=rights-CEnTZRgm.mjs.map
