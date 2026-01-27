/**
 * Editorial Summary Generator
 *
 * Translates technical analysis results into clear, actionable
 * editorial feedback that helps writers improve their content.
 */

import type { AnalysisResult, DetectedCamp, SkewReport, MirrorReport, BrakeReport } from './types';

export interface EditorialInsight {
  type: 'strength' | 'gap' | 'suggestion';
  message: string;
}

export interface EditorialSummary {
  headline: string;
  insights: EditorialInsight[];
  actionItems: string[];
}

// Map camp concepts to plain-English descriptions
const CAMP_PLAIN_LANGUAGE: Record<string, { focus: string; perspective: string; missing: string }> = {
  'Scaling Will Deliver': {
    focus: 'AI capabilities and technical progress',
    perspective: 'optimism about AI advancement through scale',
    missing: 'the case for continued AI investment and capability growth'
  },
  'Needs New Approaches': {
    focus: 'limitations of current AI methods',
    perspective: 'skepticism about whether scale alone is enough',
    missing: 'critical analysis of where current AI falls short'
  },
  'Safety First': {
    focus: 'AI risks and alignment concerns',
    perspective: 'caution about AI development pace',
    missing: 'discussion of safety considerations and potential risks'
  },
  'Democratize Fast': {
    focus: 'open access and broad AI distribution',
    perspective: 'enthusiasm for making AI widely available',
    missing: 'arguments for open-source and democratized AI access'
  },
  'Technology Leads': {
    focus: 'tech-driven business transformation',
    perspective: 'belief that technology should drive strategy',
    missing: 'the case for technology-first adoption approaches'
  },
  'Co-Evolution': {
    focus: 'balanced organizational change',
    perspective: 'emphasis on people alongside technology',
    missing: 'how organizations should adapt alongside AI adoption'
  },
  'Business Whisperers': {
    focus: 'business context and strategy',
    perspective: 'priority on business outcomes over technology',
    missing: 'practical business guidance and strategic framing'
  },
  'Tech Builders': {
    focus: 'implementation and engineering',
    perspective: 'hands-on technical building',
    missing: 'practical implementation details and technical guidance'
  },
  'Innovation First': {
    focus: 'freedom to innovate',
    perspective: 'minimal regulation and market-driven progress',
    missing: 'arguments for letting innovation proceed freely'
  },
  'Regulatory Interventionist': {
    focus: 'governance and oversight',
    perspective: 'need for rules and accountability',
    missing: 'discussion of regulatory frameworks and oversight'
  },
  'Adaptive Governance': {
    focus: 'flexible, evolving rules',
    perspective: 'balanced approach to AI governance',
    missing: 'nuanced discussion of adaptive policy approaches'
  },
  'Displacement Realist': {
    focus: 'job disruption and economic change',
    perspective: 'concern about workforce displacement',
    missing: 'honest assessment of job displacement risks'
  },
  'Human–AI Collaboration': {
    focus: 'human-AI teamwork',
    perspective: 'AI as augmentation, not replacement',
    missing: 'vision for how humans and AI work together'
  }
};

/**
 * Generate a headline summary based on alignment score
 */
function generateHeadline(score: number | null, brake: BrakeReport | null): string {
  if (brake?.triggered && brake.severity === 'stop') {
    return "This draft needs rebalancing before it's ready";
  }

  if (brake?.triggered && brake.severity === 'warning') {
    return "Good foundation, but some perspectives are missing";
  }

  if (score === null) {
    return "We couldn't fully assess this draft";
  }

  if (score >= 80) {
    return "Well-balanced draft that represents multiple viewpoints";
  }

  if (score >= 60) {
    return "Solid draft with room for broader perspective";
  }

  if (score >= 40) {
    return "Draft leans heavily in one direction";
  }

  return "Draft may feel one-sided to readers";
}

/**
 * Translate overrepresented camps into editorial insight
 */
function describeOverrepresentation(camps: { camp_name: string }[]): EditorialInsight | null {
  if (camps.length === 0) return null;

  const focuses = camps.map(c => CAMP_PLAIN_LANGUAGE[c.camp_name]?.focus || c.camp_name);

  if (camps.length === 1) {
    return {
      type: 'gap',
      message: `Your writing emphasizes ${focuses[0]}. While this is a valid angle, readers with different views may feel their concerns aren't addressed.`
    };
  }

  return {
    type: 'gap',
    message: `You're spending significant space on ${focuses.slice(0, -1).join(', ')} and ${focuses.slice(-1)}. Consider whether all these points serve your core argument.`
  };
}

/**
 * Translate underrepresented camps into editorial insight
 */
function describeUnderrepresentation(camps: { camp_name: string }[]): EditorialInsight | null {
  if (camps.length === 0) return null;

  const missing = camps.map(c => CAMP_PLAIN_LANGUAGE[c.camp_name]?.missing || c.camp_name);

  if (camps.length === 1) {
    return {
      type: 'suggestion',
      message: `Consider adding ${missing[0]} to give readers a fuller picture.`
    };
  }

  return {
    type: 'suggestion',
    message: `Your draft would benefit from ${missing.slice(0, -1).join(', ')} and ${missing.slice(-1)}.`
  };
}

/**
 * Translate missing camps into editorial insight
 */
function describeMissing(campNames: string[]): EditorialInsight | null {
  if (campNames.length === 0) return null;

  const missing = campNames.map(name => CAMP_PLAIN_LANGUAGE[name]?.missing || name);

  if (campNames.length === 1) {
    return {
      type: 'gap',
      message: `One perspective is completely absent: ${missing[0]}. This omission may be intentional, but be aware readers might notice.`
    };
  }

  if (campNames.length >= 3) {
    return {
      type: 'gap',
      message: `Several important perspectives are missing from your draft. Consider whether you want to acknowledge them, even briefly.`
    };
  }

  return {
    type: 'gap',
    message: `These perspectives aren't represented: ${missing.slice(0, -1).join(', ')} and ${missing.slice(-1)}.`
  };
}

/**
 * Translate mirror gaps into editorial insight
 */
function describeMirrorGaps(mirror: MirrorReport): EditorialInsight | null {
  const { gaps, surprises } = mirror;

  if (gaps.length > 0) {
    if (gaps.length === 1) {
      return {
        type: 'gap',
        message: `You claim to cover "${gaps[0]}" but it doesn't come through in your writing. Either add more on this topic or reconsider your framing.`
      };
    }
    return {
      type: 'gap',
      message: `Some themes you intended to cover aren't coming through: ${gaps.join(', ')}. Your readers may expect these based on your stated focus.`
    };
  }

  if (surprises.length > 0 && surprises.length <= 2) {
    return {
      type: 'strength',
      message: `You're exploring ${surprises.join(' and ')} beyond your usual topics—this adds freshness to your writing.`
    };
  }

  return null;
}

/**
 * Generate actionable items based on analysis
 */
function generateActionItems(result: AnalysisResult): string[] {
  const items: string[] = [];
  const { skew, mirror, detectedCamps } = result;

  // High-confidence dominant perspective
  const dominant = detectedCamps.filter(c => c.confidence > 0.6);
  if (dominant.length === 1) {
    const lang = CAMP_PLAIN_LANGUAGE[dominant[0].camp_name];
    if (lang) {
      items.push(`Add a paragraph acknowledging the counterargument to your main point about ${lang.focus}`);
    }
  }

  // Missing perspectives
  if (skew.missing.length > 0 && skew.missing.length <= 2) {
    const firstMissing = CAMP_PLAIN_LANGUAGE[skew.missing[0]];
    if (firstMissing) {
      items.push(`Consider briefly mentioning ${firstMissing.missing}`);
    }
  }

  // Mirror gaps
  if (mirror.gaps.length > 0) {
    items.push(`Strengthen your coverage of: ${mirror.gaps.slice(0, 2).join(', ')}`);
  }

  // Underrepresented
  if (skew.underrepresented.length > 0) {
    const under = CAMP_PLAIN_LANGUAGE[skew.underrepresented[0].camp_name];
    if (under) {
      items.push(`Expand on ${under.focus} to balance your argument`);
    }
  }

  return items.slice(0, 3); // Max 3 action items
}

/**
 * Generate a complete editorial summary from analysis results
 */
export function generateEditorialSummary(result: AnalysisResult): EditorialSummary {
  const insights: EditorialInsight[] = [];

  // Add strength if well-balanced
  if (result.alignmentScore && result.alignmentScore >= 70) {
    insights.push({
      type: 'strength',
      message: 'Your draft presents a balanced view that acknowledges multiple perspectives.'
    });
  }

  // Add detected focus as context
  const highConfidence = result.detectedCamps.filter(c => c.confidence > 0.5);
  if (highConfidence.length > 0 && highConfidence.length <= 2) {
    const focuses = highConfidence.map(c => CAMP_PLAIN_LANGUAGE[c.camp_name]?.focus || c.camp_name);
    insights.push({
      type: 'strength',
      message: `Your main focus is clear: ${focuses.join(' and ')}.`
    });
  }

  // Add skew insights
  const overInsight = describeOverrepresentation(result.skew.overrepresented);
  if (overInsight) insights.push(overInsight);

  const underInsight = describeUnderrepresentation(result.skew.underrepresented);
  if (underInsight) insights.push(underInsight);

  const missingInsight = describeMissing(result.skew.missing);
  if (missingInsight) insights.push(missingInsight);

  // Add mirror insights
  const mirrorInsight = describeMirrorGaps(result.mirror);
  if (mirrorInsight) insights.push(mirrorInsight);

  return {
    headline: generateHeadline(result.alignmentScore, result.brake),
    insights: insights.slice(0, 4), // Max 4 insights
    actionItems: generateActionItems(result)
  };
}
