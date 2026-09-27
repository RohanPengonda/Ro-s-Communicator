import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDatabase } from './db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB schema & seed data
initDatabase();

// ----------------------------------------------------
// 1. PROFILE ROUTES
// ----------------------------------------------------
app.get('/api/profile', (req, res) => {
  try {
    const profile = db.prepare('SELECT * FROM user_profile WHERE id = 1').get();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    // Map db columns to camelCase object
    const formatted = {
      name: profile.name,
      currentOverallScore: profile.current_overall_score,
      startingScore: profile.starting_score,
      strongestSkill: profile.strongest_skill,
      biggestImprovement: profile.biggest_improvement,
      currentWeakness: profile.current_weakness,
      recurringPattern: profile.recurring_pattern,
      naturalStrength: profile.natural_strength,
      developingSkill: profile.developing_skill,
      currentFocus: profile.current_focus,
      recommendedNextStep: profile.recommended_next_step,
      streakDays: profile.streak_days,
      totalSessions: profile.total_sessions,
      totalPracticeMinutes: profile.total_practice_minutes,
      totalStoriesPracticed: profile.total_stories_practiced,
      practiceConsistencyPct: profile.practice_consistency_pct
    };

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ----------------------------------------------------
// 2. ANALYTICS & HEATMAP ROUTES
// ----------------------------------------------------
app.get('/api/analytics/daily-activity', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM daily_activity ORDER BY date ASC').all();
    const formatted = rows.map((r: any) => ({
      date: r.date,
      minutesPracticed: r.minutes_practiced,
      sessionsCount: r.sessions_count,
      exercisesCount: r.exercises_count,
      dailyScore: r.daily_score,
      bestMoment: r.best_moment,
      focusArea: r.focus_area
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/analytics/monthly-reports', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM monthly_reports ORDER BY year_month ASC').all();
    const formatted = rows.map((r: any) => ({
      yearMonth: r.year_month,
      monthName: r.month_name,
      overallScore: r.overall_score,
      scoreChange: r.score_change,
      categoryScores: JSON.parse(r.category_scores_json),
      biggestImprovement: r.biggest_improvement,
      biggestWeakness: r.biggest_weakness,
      recurringHabit: r.recurring_habit,
      nextMonthFocus: r.next_month_focus
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ----------------------------------------------------
// 3. STORY BANK ROUTES
// ----------------------------------------------------
app.get('/api/stories', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM story_bank ORDER BY last_practiced_at DESC').all();
    const formatted = rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      rawVersion: r.raw_version,
      polishedVersion: r.polished_version,
      coreConflict: r.core_conflict,
      turningPoint: r.turning_point,
      lesson: r.lesson,
      themes: JSON.parse(r.themes_json),
      emotions: JSON.parse(r.emotions_json),
      interviewUseCases: JSON.parse(r.interview_use_cases_json),
      practiceCount: r.practice_count,
      lastPracticedAt: r.last_practiced_at
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/stories', (req, res) => {
  try {
    const s = req.body;
    const id = s.id || `story-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];

    const stmt = db.prepare(`
      INSERT INTO story_bank (
        id, title, raw_version, polished_version, core_conflict, turning_point,
        lesson, themes_json, emotions_json, interview_use_cases_json, practice_count, last_practiced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        raw_version = excluded.raw_version,
        polished_version = excluded.polished_version,
        core_conflict = excluded.core_conflict,
        turning_point = excluded.turning_point,
        lesson = excluded.lesson,
        themes_json = excluded.themes_json,
        emotions_json = excluded.emotions_json,
        interview_use_cases_json = excluded.interview_use_cases_json,
        practice_count = excluded.practice_count,
        last_practiced_at = excluded.last_practiced_at
    `);

    stmt.run(
      id,
      s.title,
      s.rawVersion,
      s.polishedVersion || s.rawVersion,
      s.coreConflict || '',
      s.turningPoint || '',
      s.lesson || '',
      JSON.stringify(s.themes || ['Personal']),
      JSON.stringify(s.emotions || ['Determination']),
      JSON.stringify(s.interviewUseCases || ['Tell me about a challenge']),
      s.practiceCount || 1,
      s.lastPracticedAt || now
    );

    // Update profile story count
    db.prepare('UPDATE user_profile SET total_stories_practiced = total_stories_practiced + 1 WHERE id = 1').run();

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/stories/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM story_bank WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ----------------------------------------------------
// 4. SESSIONS ROUTES
// ----------------------------------------------------
app.get('/api/sessions', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM sessions ORDER BY timestamp DESC LIMIT 20').all();
    const formatted = rows.map((r: any) => ({
      id: r.id,
      timestamp: r.timestamp,
      mode: r.mode,
      modeLabel: r.mode_label,
      durationSeconds: r.duration_seconds,
      contextPrompt: r.context_prompt,
      targetAudience: r.target_audience,
      transcript: r.transcript,
      score: r.score,
      utterances: JSON.parse(r.utterances_json),
      metrics: JSON.parse(r.metrics_json),
      replays: JSON.parse(r.replays_json),
      whyCoaching: JSON.parse(r.why_coaching_json),
      attemptNumber: r.attempt_number,
      previousAttemptId: r.previous_attempt_id,
      deltas: r.deltas_json ? JSON.parse(r.deltas_json) : null,
      oneThingToPractice: r.one_thing_to_practice
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/sessions/:id', (req, res) => {
  try {
    const r: any = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
    if (!r) return res.status(404).json({ error: 'Session not found' });
    
    const formatted = {
      id: r.id,
      timestamp: r.timestamp,
      mode: r.mode,
      modeLabel: r.mode_label,
      durationSeconds: r.duration_seconds,
      contextPrompt: r.context_prompt,
      targetAudience: r.target_audience,
      transcript: r.transcript,
      score: r.score,
      utterances: JSON.parse(r.utterances_json),
      metrics: JSON.parse(r.metrics_json),
      replays: JSON.parse(r.replays_json),
      whyCoaching: JSON.parse(r.why_coaching_json),
      attemptNumber: r.attempt_number,
      previousAttemptId: r.previous_attempt_id,
      deltas: r.deltas_json ? JSON.parse(r.deltas_json) : null,
      oneThingToPractice: r.one_thing_to_practice
    };
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/sessions', (req, res) => {
  try {
    const s = req.body;
    const id = s.id || `sess-${Date.now()}`;
    const timestamp = s.timestamp || new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO sessions (
        id, timestamp, mode, mode_label, duration_seconds, context_prompt, target_audience,
        transcript, score, utterances_json, metrics_json, replays_json, why_coaching_json,
        attempt_number, previous_attempt_id, deltas_json, one_thing_to_practice
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      timestamp,
      s.mode,
      s.modeLabel || s.mode,
      s.durationSeconds || 60,
      s.contextPrompt || '',
      s.targetAudience || 'General',
      s.transcript || '',
      s.score || 7.0,
      JSON.stringify(s.utterances || []),
      JSON.stringify(s.metrics || {}),
      JSON.stringify(s.replays || []),
      JSON.stringify(s.whyCoaching || []),
      s.attemptNumber || 1,
      s.previousAttemptId || null,
      s.deltas ? JSON.stringify(s.deltas) : null,
      s.oneThingToPractice || 'Keep practice consistent'
    );

    // Update user profile total practice stats & daily activity
    const durationMins = Math.max(1, Math.round(s.durationSeconds / 60));
    db.prepare(`
      UPDATE user_profile 
      SET total_sessions = total_sessions + 1,
          total_practice_minutes = total_practice_minutes + ?,
          current_overall_score = ROUND((current_overall_score * 0.9) + (? * 0.1), 1)
      WHERE id = 1
    `).run(durationMins, s.score || 7.0);

    // Update or insert daily activity for today
    const dateToday = new Date().toISOString().split('T')[0];
    db.prepare(`
      INSERT INTO daily_activity (date, minutes_practiced, sessions_count, exercises_count, daily_score, best_moment, focus_area)
      VALUES (?, ?, 1, 1, ?, 'Completed training session', ?)
      ON CONFLICT(date) DO UPDATE SET
        minutes_practiced = minutes_practiced + excluded.minutes_practiced,
        sessions_count = sessions_count + 1,
        exercises_count = exercises_count + 1,
        daily_score = ROUND((daily_score + excluded.daily_score) / 2.0, 1)
    `).run(dateToday, durationMins, s.score || 7.0, s.oneThingToPractice || 'Practice');

    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ----------------------------------------------------
// 5. PRIVACY & DATA CONTROLS
// ----------------------------------------------------
app.delete('/api/sessions/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/profile/clear-history', (req, res) => {
  try {
    db.prepare('DELETE FROM sessions').run();
    db.prepare(`
      UPDATE user_profile 
      SET total_sessions = 0, total_practice_minutes = 0, total_stories_practiced = 0 
      WHERE id = 1
    `).run();
    res.json({ success: true, message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Personal AI Communication Agent Backend] Running on http://localhost:${PORT}`);
});
