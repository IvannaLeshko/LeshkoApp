let lastPathname = null;
let hasNavigated = false;

/** Викликається з Layout: запам'ятовує, що користувач уже переходив між сторінками. */
export function trackNavigation(pathname) {
  if (lastPathname !== null && lastPathname !== pathname) hasNavigated = true;
  lastPathname = pathname;
}

/** Фокус на заголовок ставимо лише після переходу, а не при першому відкритті сторінки. */
export function userHasNavigated() {
  return hasNavigated;
}
