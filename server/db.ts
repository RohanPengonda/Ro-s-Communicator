import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'communication_agent.db');
export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. User Profile Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      current_overall_score REAL NOT NULL,
      starting_score REAL NOT NULL,
      strongest_skill TEXT NOT NULL,
      biggest_improvement TEXT NOT NULL,
      current_weakness TEXT NOT NULL,
      recurring_pattern TEXT NOT NULL,
      natural_strength TEXT NOT NULL,
      developing_skill TEXT NOT NULL,
      current_focus TEXT NOT NULL,
      recommended_next_step TEXT NOT NULL,
      streak_days INTEGER NOT NULL,
      total_sessions INTEGER NOT NULL,
      total_practice_minutes INTEGER NOT NULL,
      total_stories_practiced INTEGER NOT NULL,
      practice_consistency_pct INTEGER NOT NULL
    );
  `);

  // 2. Daily Activity (Heatmap) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_activity (
      date TEXT PRIMARY KEY,
      minutes_practiced INTEGER NOT NULL,
      sessions_count INTEGER NOT NULL,
      exercises_count INTEGER NOT NULL,
      daily_score REAL NOT NULL,
      best_moment TEXT NOT NULL,
      focus_area TEXT NOT NULL
    );
  `);

  // 3. Monthly Progress Reports Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS monthly_reports (
      year_month TEXT PRIMARY KEY,
      month_name TEXT NOT NULL,
      overall_score REAL NOT NULL,
      score_change REAL NOT NULL,
      category_scores_json TEXT NOT NULL,
      biggest_improvement TEXT NOT NULL,
      biggest_weakness TEXT NOT NULL,
      recurring_habit TEXT NOT NULL,
      next_month_focus TEXT NOT NULL
    );
  `);

  // 4. Story Bank Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS story_bank (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      raw_version TEXT NOT NULL,
      polished_version TEXT NOT NULL,
      core_conflict TEXT NOT NULL,
      turning_point TEXT NOT NULL,
      lesson TEXT NOT NULL,
      themes_json TEXT NOT NULL,
      emotions_json TEXT NOT NULL,
      interview_use_cases_json TEXT NOT NULL,
      practice_count INTEGER NOT NULL,
      last_practiced_at TEXT NOT NULL
    );
  `);

  // 5. Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      mode TEXT NOT NULL,
      mode_label TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      context_prompt TEXT NOT NULL,
      target_audience TEXT,
      transcript TEXT NOT NULL,
      score REAL NOT NULL,
      utterances_json TEXT NOT NULL,
      metrics_json TEXT NOT NULL,
      replays_json TEXT NOT NULL,
      why_coaching_json TEXT NOT NULL,
      attempt_number INTEGER DEFAULT 1,
      previous_attempt_id TEXT,
      deltas_json TEXT,
      one_thing_to_practice TEXT NOT NULL
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // Check if profile exists
  const existingProfile = db.prepare('SELECT id FROM user_profile WHERE id = 1').get();
  if (!existingProfile) {
    db.prepare(`
      INSERT INTO user_profile (
        id, name, current_overall_score, starting_score, strongest_skill,
        biggest_improvement, current_weakness, recurring_pattern, natural_strength,
        developing_skill, current_focus, recommended_next_step, streak_days,
        total_sessions, total_practice_minutes, total_stories_practiced, practice_consistency_pct
      ) VALUES (
        1, 'Rohan', 7.6, 5.4, 'Explaining Technical Ideas',
        'Storytelling Hooks', 'Memorable Openings', 'Over-explaining context before creating curiosity',
        'Vivid Analogies', 'Spontaneous Wit', 'Audience Engagement & Hooks',
        'Practice 30-second high-curiosity openings', 18, 47, 872, 31, 86
      )
    `).run();
  }

  // Seed Monthly Reports if empty
  const monthlyCount = db.prepare('SELECT COUNT(*) as count FROM monthly_reports').get() as { count: number };
  if (monthlyCount.count === 0) {
    const insertMonthly = db.prepare(`
      INSERT INTO monthly_reports (
        year_month, month_name, overall_score, score_change, category_scores_json,
        biggest_improvement, biggest_weakness, recurring_habit, next_month_focus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMonthly.run(
      '2026-05', 'May 2026', 5.4, 0.0,
      JSON.stringify([
        { category: 'Storytelling', score: 4.8, change: 0.0 },
        { category: 'Clarity', score: 6.2, change: 0.0 },
        { category: 'Wit', score: 3.8, change: 0.0 },
        { category: 'Engagement', score: 4.7, change: 0.0 },
        { category: 'Confidence', score: 5.2, change: 0.0 }
      ]),
      'Technical clarity', 'Rambling setups', 'Starting with low energy', 'Conciseness & Structure'
    );

    insertMonthly.run(
      '2026-06', 'June 2026', 6.1, 0.7,
      JSON.stringify([
        { category: 'Storytelling', score: 5.5, change: 0.7 },
        { category: 'Clarity', score: 6.8, change: 0.6 },
        { category: 'Wit', score: 4.3, change: 0.5 },
        { category: 'Engagement', score: 5.6, change: 0.9 },
        { category: 'Confidence', score: 5.9, change: 0.7 }
      ]),
      'Reducing filler words', 'Weak story conflicts', 'Over-explaining technical details', 'Storytelling Tension'
    );

    insertMonthly.run(
      '2026-07', 'July 2026', 6.8, 0.7,
      JSON.stringify([
        { category: 'Storytelling', score: 6.4, change: 0.9 },
        { category: 'Clarity', score: 7.2, change: 0.4 },
        { category: 'Wit', score: 4.9, change: 0.6 },
        { category: 'Engagement', score: 6.5, change: 0.9 },
        { category: 'Confidence', score: 6.5, change: 0.6 }
      ]),
      'Creating emotional tension', 'Monotone pitch', 'Apologetic phrasing', 'Audience Adaptation'
    );

    insertMonthly.run(
      '2026-08', 'August 2026', 7.2, 0.4,
      JSON.stringify([
        { category: 'Storytelling', score: 7.0, change: 0.6 },
        { category: 'Clarity', score: 7.7, change: 0.5 },
        { category: 'Wit', score: 5.5, change: 0.6 },
        { category: 'Engagement', score: 7.1, change: 0.6 },
        { category: 'Confidence', score: 7.0, change: 0.5 }
      ]),
      'Vivid analogies', 'Slow start to answers', 'Dropping energy at endings', 'Spontaneous Responses'
    );

    insertMonthly.run(
      '2026-09', 'September 2026', 7.6, 0.4,
      JSON.stringify([
        { category: 'Storytelling', score: 7.6, change: 0.6 },
        { category: 'Clarity', score: 8.1, change: 0.4 },
        { category: 'Wit', score: 6.2, change: 0.7 },
        { category: 'Engagement', score: 7.8, change: 0.7 },
        { category: 'Confidence', score: 7.5, change: 0.5 }
      ]),
      'High-curiosity openings', 'Delayed punchlines', 'Rushing during Q&A', 'Natural Wit & Audience Engagement'
    );
  }

  // Seed 90 days of daily heatmap data if empty
  const dailyCount = db.prepare('SELECT COUNT(*) as count FROM daily_activity').get() as { count: number };
  if (dailyCount.count === 0) {
    const insertDaily = db.prepare(`
      INSERT INTO daily_activity (date, minutes_practiced, sessions_count, exercises_count, daily_score, best_moment, focus_area)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const today = new Date('2026-09-27');
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Randomize activity to look natural (streak active for last 18 days)
      const isStreak = i <= 18;
      const hasActivity = isStreak || Math.random() > 0.35;
      
      if (hasActivity) {
        const mins = Math.floor(Math.random() * 18) + 8;
        const sessions = Math.floor(Math.random() * 2) + 1;
        const exercises = Math.floor(Math.random() * 3) + 1;
        const score = parseFloat((6.2 + Math.random() * 2.2).toFixed(1));
        const bestMoments = [
          'High curiosity opening hook',
          'Smooth analogy explaining vector search',
          'Sharp spontaneous answer under 30s',
          'Playful callback wit line',
          'Clean resolution to personal failure story'
        ];
        const focusAreas = [
          'Trim setup context by 15s',
          'Pause 2 seconds before key reveal',
          'Vary pitch during story climax',
          'Eliminate "basically" filler'
        ];
        
        insertDaily.run(
          dateStr,
          mins,
          sessions,
          exercises,
          score,
          bestMoments[i % bestMoments.length],
          focusAreas[i % focusAreas.length]
        );
      }
    }
  }

  // Seed Story Bank items if empty
  const storyCount = db.prepare('SELECT COUNT(*) as count FROM story_bank').get() as { count: number };
  if (storyCount.count === 0) {
    const insertStory = db.prepare(`
      INSERT INTO story_bank (
        id, title, raw_version, polished_version, core_conflict, turning_point,
        lesson, themes_json, emotions_json, interview_use_cases_json, practice_count, last_practiced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStory.run(
      'story-1',
      'The 3 AM Production Outage',
      'I was working on a deployment late at night and ran a script that dropped the secondary cache database. I panicked, but called the lead architect, rolled back the migration, and restored from snapshot within 22 minutes.',
      'At 3:14 AM on a Tuesday, my monitor flashed bright red. A rogue cache flush script I had executed had just knocked out real-time session storage for 40,000 active users. Instead of trying to cover it up, I immediately paged the team, initiated emergency snapshot restoration, and brought the service back online in 22 minutes. That night taught me that leadership in technical crises isn’t about perfection—it’s about radical transparency and rapid action.',
      'Accidentally taking down secondary cache storage for 40,000 active users during a solo midnight release.',
      'Deciding to immediately page the senior lead instead of attempting a quiet solo fix.',
      'Transparency and rapid calm communication outperform panic fixing every time.',
      JSON.stringify(['Crisis Management', 'Technical Failure', 'Ownership', 'Accountability']),
      JSON.stringify(['Panic', 'Calm', 'Relief', 'Pride']),
      JSON.stringify([
        'Tell me about a time you made a mistake.',
        'How do you perform under intense pressure?',
        'Describe a time you had to handle a critical outage.'
      ]),
      8,
      '2026-09-26'
    );

    insertStory.run(
      'story-2',
      'Explaining RAG to a Skeptical CFO',
      'Our CFO thought AI was an expensive gimmick. I brought a laptop into her office, uploaded our 300-page SEC filing, and showed her how the AI answered complex financial audit questions in 2 seconds with exact page citations.',
      'Our CFO looked at our AI proposal and said: "I am not spending $50k on a chatbot that hallucinates math." So instead of giving a 20-slide PowerPoint deck, I sat next to her, dragged our 400-page tax code compliance filing into our prototype, and asked: "What was our non-operating expenditure variance in Q3?" Two seconds later, it gave the exact line item with a hyperlink to page 142. Her jaw dropped. That’s when I realized: don’t explain value—demonstrate proof in their world.',
      'Overcoming deep executive skepticism regarding corporate AI budget allocation.',
      'Replacing a slide presentation with a 5-second live file interrogation.',
      'Show, don’t tell. Interactive proof beats 20 slides of abstract theory.',
      JSON.stringify(['Persuasion', 'Executive Communication', 'AI Adoption', 'Demonstration']),
      JSON.stringify(['Skepticism', 'Astonishment', 'Conviction']),
      JSON.stringify([
        'How do you convince stakeholders who disagree with you?',
        'Describe how you communicate complex tech to non-technical executives.',
        'Tell me about a successful project proposal.'
      ]),
      5,
      '2026-09-24'
    );
  }

  // Seed sample completed sessions if empty
  const sessionCount = db.prepare('SELECT COUNT(*) as count FROM sessions').get() as { count: number };
  if (sessionCount.count === 0) {
    const insertSession = db.prepare(`
      INSERT INTO sessions (
        id, timestamp, mode, mode_label, duration_seconds, context_prompt, target_audience,
        transcript, score, utterances_json, metrics_json, replays_json, why_coaching_json,
        attempt_number, previous_attempt_id, deltas_json, one_thing_to_practice
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSession.run(
      'sess-demo-1',
      '2026-09-27T18:30:00Z',
      'STORYTELLING',
      'Storytelling Challenge',
      112,
      'Tell me about a time you failed at something in 90 seconds.',
      'General Audience',
      'So, um, basically back in 2024 I was leading a small team launching a project. We worked really hard for three months. But when launch day came, nobody actually signed up. I felt terrible. What happened was we spent all our time building features and zero time talking to customers. It taught me to build with users early.',
      7.6,
      JSON.stringify([
        {
          id: 'u1',
          speaker: 'AI',
          timestamp: '00:00',
          text: 'Tell me about a time you failed at something in 90 seconds.'
        },
        {
          id: 'u2',
          speaker: 'USER',
          timestamp: '00:05',
          text: 'So, um, basically back in 2024 I was leading a small team launching a project. We worked really hard for three months. But when launch day came, nobody signed up.',
          metrics: { paceWPM: 142, fillerCount: 2, clarityScore: 7.5 }
        }
      ]),
      JSON.stringify({
        overall: 7.6,
        storytelling: 7.8,
        clarity: 8.0,
        engagement: 7.4,
        confidence: 7.2,
        wit: 6.0,
        spontaneity: 7.5,
        conciseness: 7.8,
        structure: 8.2,
        audienceAdaptation: 7.5,
        explanationQuality: 8.0,
        fillerWordsCount: 2,
        speakingPaceWPM: 145,
        responseRelevance: 9.0
      }),
      JSON.stringify([
        {
          id: 'm1',
          timestampSeconds: 5,
          label: 'Filler Word Spike',
          type: 'FILLER_SPIKE',
          textSnippet: 'So, um, basically back in 2024...',
          advice: 'Pause silently before opening instead of defaulting to filler setup words.'
        },
        {
          id: 'm2',
          timestampSeconds: 42,
          label: 'Turning Point Impact',
          type: 'STRONG_OPENING',
          textSnippet: 'When launch day came, zero people signed up.',
          advice: 'Great moment of stark vulnerability. High curiosity payload.'
        },
        {
          id: 'm3',
          timestampSeconds: 85,
          label: 'Strong Resolution',
          type: 'STRONG_ENDING',
          textSnippet: 'It taught me to build with users early.',
          advice: 'Clear takeaway. Next time, add 1 sensory detail about the launch room reaction.'
        }
      ]),
      JSON.stringify([
        {
          id: 'w1',
          category: 'STORYTELLING',
          observation: 'You revealed that no one signed up before building the stakes of launch morning.',
          impact: 'The audience missed out on feeling your anticipation right before opening the analytics dashboard.',
          principle: 'Uncertainty creates investment. Describe the moment right BEFORE the drop.',
          exemplarReframing: 'Instead of "nobody signed up", say: "I logged into Google Analytics at 9:01 AM expecting 1,000 visitors. The active user counter said: 1. And that was my mom."'
        },
        {
          id: 'w2',
          category: 'WIT',
          observation: 'Missed opportunity for light self-aware irony during the failure climax.',
          impact: 'Adding a quick humorous contrast keeps heavy failure stories engaging without losing credibility.',
          principle: 'Self-aware humor builds high confidence because it proves you have transcended the pain of the mistake.',
          exemplarReframing: 'Mentioning that your only user was your mom creates immediate audience rapport.'
        }
      ]),
      1,
      null,
      null,
      'Build tension right before the failure reveal by describing your high expectations.'
    );
  }
}
