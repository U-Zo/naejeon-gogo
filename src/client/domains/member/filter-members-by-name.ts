import { canBeChoseong, getChoseong } from 'es-hangul';

import type { Member } from '#/client/domains/member/model';

function isAllChoseong(str: string): boolean {
  return str.length > 0 && [...str].every((ch) => canBeChoseong(ch));
}

export function filterMembersByName(members: Member[], search: string): Member[] {
  const trimmed = search.trim();
  if (trimmed === '') return members;

  if (isAllChoseong(trimmed)) {
    return members.filter((m) => getChoseong(m.name).includes(trimmed));
  }

  return members.filter((m) => m.name.toLowerCase().includes(trimmed.toLowerCase()));
}
