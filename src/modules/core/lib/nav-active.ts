export function isNavLinkActive(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  if (pathname === path) return true;
  return pathname.startsWith(`${path}/`);
}

export function isNavGroupActive(pathname: string, pathMatch: string): boolean {
  if (pathMatch === "/") return pathname === "/";
  if (pathname === pathMatch) return true;
  return pathname.startsWith(`${pathMatch}/`);
}
