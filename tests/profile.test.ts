import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';

describe('profile content contract', () => {
  it('uses the approved identity and introduction', () => {
    expect(profile.name).toBe('Sheng');
    expect(profile.role).toBe('AI TRAINER IN PROGRESS');
    expect(profile.heroStatement).toBe('保持好奇，奔赴未知。');
    expect(profile.introduction).toBe(
      '正在探索 AI 世界的新手训练师。我喜欢拆解问题、打磨表达，也在一次次实践中学习如何让回答更准确、更好用。',
    );
  });

  it('contains honest learning and roadmap content', () => {
    expect(profile.learning.map((item) => item.title)).toEqual([
      '数据标注',
      '提示词设计',
      '回答评估',
    ]);
    expect(profile.roadmap.map((item) => item.title)).toEqual([
      '了解行业',
      '基础练习',
      '建立作品',
      '寻找实践机会',
    ]);
    expect(profile.links).toEqual([]);
  });

  it('uses unique local anchor navigation', () => {
    const hrefs = profile.nav.map((item) => item.href);
    expect(hrefs).toEqual(['#top', '#learning', '#roadmap']);
  });
});
