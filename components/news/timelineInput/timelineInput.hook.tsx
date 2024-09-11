import { Timeline } from '@interface/news';
import { changeItemsOrder, clone } from '@utils';

export const useTimelineArr = (
  timeline: Timeline[],
  setTimeline: (timeline: Timeline[]) => void,
) => {
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
  };

  const moveTimelineLeft = (idx: number) => {
    if (idx === 0) return;

    const newTimeline = changeItemsOrder(timeline, idx, idx - 1);
    setTimeline(newTimeline);
  };

  const moveTimelineRight = (idx: number) => {
    if (idx === timeline.length - 1) return;

    const newTimline = changeItemsOrder(timeline, idx, idx + 1);
    setTimeline(newTimline);
  };

  return {
    addTimeline,
    deleteTimeline,
    moveTimelineLeft,
    moveTimelineRight,
  };
};
