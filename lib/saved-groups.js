const KEY = "tabshare.groups.v1";
export function readSavedGroups() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data)
      ? data
          .filter((item) => item && /^g-[A-Za-z0-9_-]{32}$/.test(item.slug))
          .slice(0, 30)
      : [];
  } catch {
    return [];
  }
}
export function rememberGroup(group, memberId) {
  try {
    const old = readSavedGroups();
    const previous = old.find((item) => item.slug === group.slug);
    localStorage.setItem(
      KEY,
      JSON.stringify(
        [
          {
            slug: group.slug,
            name: group.name,
            memberId: memberId || previous?.memberId || "",
          },
          ...old.filter((item) => item.slug !== group.slug),
        ].slice(0, 30),
      ),
    );
    return true;
  } catch {
    return false;
  }
}
export function forgetGroup(slug) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(readSavedGroups().filter((group) => group.slug !== slug)),
    );
    return true;
  } catch {
    return false;
  }
}
