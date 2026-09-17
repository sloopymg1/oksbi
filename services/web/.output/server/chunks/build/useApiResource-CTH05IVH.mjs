import { A as AppIcon_default } from './AppIcon-CzcdSF-4.mjs';
import { ref, defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

//#region src/components/StatePanel.vue?vue&type=script&setup=true&lang.ts
var StatePanel_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StatePanel",
	__ssrInlineRender: true,
	props: {
		data: {},
		loading: { type: Boolean },
		error: {},
		empty: { type: Boolean },
		emptyTitle: {},
		emptyBody: {},
		actionLabel: {}
	},
	emits: ["retry", "action"],
	setup(__props, { emit: __emit }) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AppIcon = AppIcon_default;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			if (__props.loading) _push(`<div class="surface"><div class="workspace-copy"><div class="skeleton-line" style="${ssrRenderStyle({ "width": "30%" })}"></div><div class="skeleton-line" style="${ssrRenderStyle({ "width": "62%" })}"></div><div class="stat-grid"><div class="skeleton-tile"></div><div class="skeleton-tile"></div><div class="skeleton-tile"></div><div class="skeleton-tile"></div></div></div></div>`);
			else if (__props.error) {
				_push(`<div class="error-shell workspace-copy"><div class="topline"><span class="status-pill warning">`);
				_push(ssrRenderComponent(_component_AppIcon, {
					name: "warning",
					style: {
						"width": "14px",
						"height": "14px"
					}
				}, null, _parent));
				_push(` Error </span></div><h2 class="section-title">The operational feed could not be loaded.</h2><p class="helper-text">${ssrInterpolate(__props.error)}</p><div class="button-row"><button class="primary-button" type="button">Retry request</button></div></div>`);
			} else if (__props.empty) {
				_push(`<div class="empty-shell workspace-copy"><span class="pill">`);
				_push(ssrRenderComponent(_component_AppIcon, {
					name: "spark",
					style: {
						"width": "14px",
						"height": "14px"
					}
				}, null, _parent));
				_push(` Empty state </span><h2 class="section-title">${ssrInterpolate(__props.emptyTitle)}</h2><p class="helper-text">${ssrInterpolate(__props.emptyBody)}</p>`);
				if (__props.actionLabel) _push(`<div class="button-row"><button class="primary-button" type="button">${ssrInterpolate(__props.actionLabel)}</button></div>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region src/components/StatePanel.vue
var _sfc_setup = StatePanel_vue_vue_type_script_setup_true_lang_default.setup;
StatePanel_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatePanel.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var StatePanel_default = Object.assign(StatePanel_vue_vue_type_script_setup_true_lang_default, { __name: "StatePanel" });
//#endregion
//#region src/composables/useApiResource.ts
function useApiResource(loader) {
	const data = ref(null);
	const loading = ref(true);
	const error = ref(null);
	const load = async () => {
		loading.value = true;
		error.value = null;
		try {
			data.value = await loader();
		} catch (caughtError) {
			error.value = caughtError instanceof Error ? caughtError.message : "Unable to load data.";
			data.value = null;
		} finally {
			loading.value = false;
		}
	};
	return {
		data,
		loading,
		error,
		reload: load
	};
}

export { StatePanel_default as S, useApiResource as u };
//# sourceMappingURL=useApiResource-CTH05IVH.mjs.map
