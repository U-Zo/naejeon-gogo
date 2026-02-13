import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMembers } from '#/client/domains/member';
import { useCreateMatch } from '#/client/domains/match/use-create-match';
import { openErrorDialog } from '#/client/components/error-dialog';
import { SelectPhase } from '#/client/components/select-phase';
import * as common from '#/client/styles/common.css';
import type { RaceResult } from './engine/types';
import { RaceCanvas } from './components/race-canvas';
import { RaceResultPhase } from './components/race-result-phase';

type Phase = 'select' | 'race' | 'result';

export function RacePage() {
  const { data: members } = useMembers();
  const { execute: createMatch, isPending: isCreating } = useCreateMatch();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>('select');
  const [results, setResults] = useState<RaceResult[]>([]);
  const [raceKey, setRaceKey] = useState(0);

  const memberMap = new Map(members.map((m) => [m.id, m]));

  const selectedMembers = [...selectedIds]
    .map((id) => memberMap.get(id))
    .filter((m): m is NonNullable<typeof m> => m != null)
    .map((m) => ({ id: m.id, name: m.name }));

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 10) {
        next.add(id);
      }
      return next;
    });
  };

  const handleStart = () => {
    if (selectedIds.size !== 10) {
      openErrorDialog(`참가자 10명을 선택해주세요.\n(현재 ${selectedIds.size}명)`);
      return;
    }
    setResults([]);
    setRaceKey((k) => k + 1);
    setPhase('race');
  };

  const handleRaceComplete = useCallback((raceResults: RaceResult[]) => {
    setResults(raceResults);
    setPhase('result');
  }, []);

  const handleConfirm = async () => {
    if (isCreating) return;
    try {
      const teamA = results
        .filter((r) => r.finishOrder <= 5)
        .map((r) => {
          const member = memberMap.get(r.memberId);
          return { memberId: r.memberId, position: member?.mainPosition ?? 'mid' as const };
        });
      const teamB = results
        .filter((r) => r.finishOrder > 5)
        .map((r) => {
          const member = memberMap.get(r.memberId);
          return { memberId: r.memberId, position: member?.mainPosition ?? 'mid' as const };
        });
      await createMatch({ teamA, teamB });
      navigate({ to: '/history' });
    } catch (e) {
      openErrorDialog(e instanceof Error ? e.message : '매치 생성에 실패했습니다.');
    }
  };

  const handleRerun = () => {
    setResults([]);
    setRaceKey((k) => k + 1);
    setPhase('race');
  };

  const handleBack = () => {
    setPhase('select');
    setResults([]);
  };

  return (
    <>
      <h2 className={common.pageTitle}>룰렛 (Beta)</h2>

      {phase === 'select' && (
        <SelectPhase
          members={members}
          selectedIds={selectedIds}
          onToggle={toggleMember}
          onSubmit={handleStart}
          submitLabel="룰렛 시작"
          disabled={selectedIds.size !== 10}
        />
      )}

      {phase === 'race' && (
        <RaceCanvas
          key={raceKey}
          members={selectedMembers}
          onComplete={handleRaceComplete}
        />
      )}

      {phase === 'result' && (
        <RaceResultPhase
          results={results}
          onConfirm={handleConfirm}
          onRerun={handleRerun}
          onBack={handleBack}
          loading={isCreating}
        />
      )}
    </>
  );
}
