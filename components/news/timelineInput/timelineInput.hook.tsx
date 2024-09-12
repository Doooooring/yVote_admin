import { Timeline } from '@interface/news';
import { changeItemsOrder, clone } from '@utils';
import { useState } from 'react';

export const useTimelineArr = (
  timeline: Timeline[],
  setTimeline: (timeline: Timeline[]) => void,
) => {
  const [curFocus, setCurFocus] = useState<number | null>(null);

  const addTimeline = (idx: number) => {
    const curTimeline = clone(timeline);
    const newData = { date: '', title: '' };
    curTimeline.splice(idx + 1, 0, newData);
    setTimeline(curTimeline);
  };

  const deleteTimeline = (idx: number) => {
    const curTimeline = clone(timeline);
    curTimeline.splice(idx, 1);
    setTimeline(curTimeline);
    setCurFocus(null);
  };

  const moveTimelineLeft = (idx: number) => {
    if (idx === 0) return;

    const newTimeline = changeItemsOrder(timeline, idx, idx - 1);
    setTimeline(newTimeline);
    setCurFocus(curFocus! - 1);
  };

  const moveTimelineRight = (idx: number) => {
    if (idx === timeline.length - 1) return;

    const newTimline = changeItemsOrder(timeline, idx, idx + 1);
    setTimeline(newTimline);
    setCurFocus(curFocus! + 1);
  };

  return {
    curFocus,
    setCurFocus,
    addTimeline,
    deleteTimeline,
    moveTimelineLeft,
    moveTimelineRight,
  };
};
