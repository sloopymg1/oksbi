import { s as stateDiagnostics, b as useNuxtApp } from '../virtual/entry.mjs';
import { a as api } from './api-GJQTpCzq.mjs';
import { readonly, toRef, isRef } from 'vue';

//#region node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return initialValue;
		}
		state.value = initialValue;
	}
	return state;
}
//#endregion
//#region src/composables/useAuth.ts
function useAuth() {
	const user = useState("auth-user", () => null);
	const token = useState("auth-token", () => null);
	const ready = useState("auth-ready", () => false);
	const pending = useState("auth-pending", () => false);
	const error = useState("auth-error", () => null);
	async function applyAuth(response) {
		user.value = response.user;
		token.value = response.token;
	}
	async function ensureSession() {
		if (ready.value || pending.value) return;
		pending.value = true;
		error.value = null;
		try {
			const currentUser = await api.getCurrentUser();
			if (currentUser) await applyAuth({
				user: currentUser,
				token: ""
			});
		} catch (caughtError) {
			error.value = caughtError instanceof Error ? caughtError.message : "Unable to initialize your session.";
		} finally {
			pending.value = false;
			ready.value = true;
		}
	}
	async function login(input) {
		pending.value = true;
		error.value = null;
		try {
			const response = await api.login(input);
			await applyAuth(response);
			ready.value = true;
			return response;
		} catch (caughtError) {
			error.value = caughtError instanceof Error ? caughtError.message : "Login failed.";
			throw caughtError;
		} finally {
			pending.value = false;
		}
	}
	async function createAccount(input) {
		pending.value = true;
		error.value = null;
		try {
			const response = await api.createAccount(input);
			await applyAuth(response);
			ready.value = true;
			return response;
		} catch (caughtError) {
			error.value = caughtError instanceof Error ? caughtError.message : "Account creation failed.";
			throw caughtError;
		} finally {
			pending.value = false;
		}
	}
	async function logout() {
		pending.value = true;
		error.value = null;
		try {
			await api.logout();
			user.value = null;
			token.value = null;
		} finally {
			pending.value = false;
			ready.value = true;
		}
	}
	return {
		user: readonly(user),
		token: readonly(token),
		ready: readonly(ready),
		pending: readonly(pending),
		error: readonly(error),
		ensureSession,
		login,
		createAccount,
		logout
	};
}

export { useAuth as u };
//# sourceMappingURL=useAuth-iNi8ciI3.mjs.map
