export interface FunctionHooks {
  original: Function;
  originalHash: string;
  hooks: Array<FunctionHook>;
}

export function getFunctionHash(func: Function) {
  const code = func.toString();
  let h = 0;
  for (let i = 0, h = 0; i < code.length; i++) {
    h = (Math.imul(31, h) + code.charCodeAt(i)) | 0;
  }
  return h.toString(16);
}

export type PrePostHook = (this: Function, ...args: any[]) => any;

export interface FunctionHook {
  pre?: PrePostHook;
  post?: PrePostHook;
  replace?: [string | RegExp, string][] | ((code: string) => string);
}

export const functionHooksMap = new Map<string, FunctionHooks>();

/**
 * Hook a function by name.
 *
 * You can use this function to re-write a function's code, or add pre/post processing.
 */
export function hookFunction(func: string, hook: FunctionHook) {
  const origFunc = window[func];
  if (!origFunc) {
    throw new Error(`Cannot find function ${func}`);
  }

  const hash = getFunctionHash(origFunc);
  const hooks = functionHooksMap.get(func);
  if (hooks) {
    hooks.hooks.push(hook);
  }
  else {
    functionHooksMap.set(func, {
      original: origFunc,
      originalHash: hash,
      hooks: [hook],
    });

    window[func] = function(...args: any[]) {
      const hooks = functionHooksMap.get(func);
      if (!hooks) {
        console.error(`Cannot find hooks for function ${func}`);
        return origFunc.apply(this, args);
      }

      let result: any;
      for (const hook of hooks.hooks) {
        if (hook.pre) {
          args = hook.pre.apply(this, args);
        }
      }

      for (const hook of hooks.hooks) {
        if (hook.replace) {
          let code = hooks.original.toString();
          if (typeof hook.replace === 'function') {
            code = hook.replace(code);
          }
          else {
            for (const [from, to] of hook.replace) {
              code = code.replace(from, to);
            }
          }
          result = new Function(code).apply(this, args);
        }
        else {
          result = hooks.original.apply(this, args);
        }
      }

      result = hooks.original.apply(this, args);

      for (const hook of hooks.hooks) {
        if (hook.post) {
          result = hook.post.apply(this, result);
        }
      }

      return result;
    }
  }
}
