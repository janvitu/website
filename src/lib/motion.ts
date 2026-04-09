import { animate as motionAnimate } from "motion";

type Target = Element | Element[] | NodeListOf<Element> | string;
type Keyframes = Record<string, unknown>;
type Options = Record<string, unknown>;

// The runtime return is thenable and exposes `cancel`/`stop`; Motion's
// public types don't model this completely, so we widen here.
export interface AnimationHandle extends PromiseLike<void> {
	cancel(): void;
	stop(): void;
}

// Thin wrapper that centralises the cast needed to satisfy Motion's
// strict keyframe generics without polluting call sites.
export function animate(
	target: Target,
	keyframes: Keyframes,
	options?: Options,
): AnimationHandle {
	return (motionAnimate as any)(target, keyframes, options);
}

export { stagger } from "motion";
