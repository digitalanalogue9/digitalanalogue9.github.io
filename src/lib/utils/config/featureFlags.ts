// Vite exposes this build-time flag to the client; only an explicit `true` enables the tool.
export function isBehaviourReflectionEnabled() {
  return import.meta.env.VITE_ENABLE_BEHAVIOUR_REFLECTION === 'true';
}
