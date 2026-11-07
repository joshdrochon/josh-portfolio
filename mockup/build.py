#!/usr/bin/env python3
"""Generates project/Main.dc.html for the portfolio mockup. Content lives here as data."""
import json, html

M = "'JetBrains Mono', monospace"
PHOTO = "/_blob/963d0dcec9c7db1ffd110b6d10c8481a"
DARK = "#16161E"

def esc(s): return html.escape(s, quote=True)

# Flex-basis "albatross": 4/2/1 columns for the windows, 3/2/1 for cards, no media queries needed.
WIN_BASIS = "max(calc(25% - 22px), min(calc(50% - 15px), calc((1100px - 100%) * 999)), min(100%, calc((560px - 100%) * 999)))"
CARD_BASIS = "max(calc(33.333% - 23px), min(calc(50% - 17px), calc((1000px - 100%) * 999)), min(100%, calc((620px - 100%) * 999)))"
CASE_BASIS = "max(calc(50% - 17px), min(100%, calc((620px - 100%) * 999)))"

TAG = f'<span style="font-family: {M}; font-size: 11px; color: #4B5563; border: 1px solid #D1D5DB; border-radius: 999px; padding: 4px 10px;">{{}}</span>'
BTN = f"min-height: 44px; display: flex; align-items: center; gap: 6px; padding: 0 16px; border-radius: 999px; border: 1px solid #9CA3AF; background: #FFFFFF; color: #1F2937; text-decoration: none; font-family: {M}; font-size: 12px; cursor: pointer;"
PLAY = f"min-height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 18px; border-radius: 999px; background: #111111; color: #FFFFFF; border: 0; text-decoration: none; font-family: {M}; font-size: 13px; font-weight: 700;"
PLAYSVG = '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"></path></svg>'
ARROW = '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M7 17 17 7"></path><path d="M8 7h9v9"></path></svg>'
CAP = "font-size: 12px; color: #A9B1D6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
DOTS = '''<span style="width: 11px; height: 11px; border-radius: 50%; background: #FF5F57;"></span>
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #FEBC2E;"></span>
            <span style="width: 11px; height: 11px; border-radius: 50%; background: #28C840;"></span>'''

def titlebar(t, indent="          "):
    return f'''{indent}<div style="display: flex; align-items: center; gap: 6px; padding: 10px 12px; background: #1F2030; border-bottom: 1px solid #2A2B3D; flex-shrink: 0;">
            {DOTS}
            <span style="flex: 1; text-align: center; margin-right: 40px; font-family: {M}; font-size: 11px; color: #A9B1D6;">{t}</span>
{indent}</div>'''

PROMPT = '<span style="color: #9ECE6A;">josh</span> <span style="color: #7AA2F7;">~</span> $ '
def cursor(X): return f'<span aria-hidden="true" style="display: inline-block; width: 7px; height: 14px; margin-left: 2px; vertical-align: -2px; background: {{{{ {X}.cursorBg }}}}; box-shadow: inset 0 0 0 1px #8089B3; opacity: {{{{ {X}.cursorOpacity }}}};"></span>'

LBL = f"flex-shrink: 0; height: 52px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 100%; padding: 0 0 8px; margin: 0; font-family: {M}; font-size: 20px; font-weight: 700; letter-spacing: 1px; color: #FFFFFF; text-decoration: none; background: none; border: 0; cursor: pointer;"
LINK = f"color: #7AA2F7; text-decoration: underline; text-underline-offset: 3px; min-height: 24px; display: flex; align-items: center; background: none; border: 0; padding: 0; font: inherit; cursor: pointer; text-align: left;"

def window(X, title, output, label):
    return f'''      <div ref="{{{{ {X}.ref }}}}" onMouseEnter="{{{{ {X}.enter }}}}" onMouseLeave="{{{{ {X}.leave }}}}" onFocus="{{{{ {X}.enter }}}}" onBlur="{{{{ {X}.leave }}}}" style="flex: 0 1 {WIN_BASIS}; min-width: 0;">
        <div style="height: 236px; display: flex; flex-direction: column; box-sizing: border-box; color: #C0CAF5; background: {DARK}; border: 1px solid #2A2B3D; border-radius: 10px; overflow: hidden; box-shadow: {{{{ {X}.shadow }}}}; transform: {{{{ {X}.lift }}}}; transition: transform 200ms ease, box-shadow 200ms ease;">
{titlebar(title)}
          <div style="flex: 1; min-height: 0; overflow: hidden; padding: 12px 14px; box-sizing: border-box; font-family: {M}; font-size: 12.5px; line-height: 1.65;">
            <div>{PROMPT}{{{{ {X}.cmd }}}}<sc-if value="{{{{ {X}.cursorOnCmd }}}}" hint-placeholder-val="{{{{ false }}}}">{cursor(X)}</sc-if></div>
{output}
            <sc-if value="{{{{ {X}.done }}}}" hint-placeholder-val="{{{{ true }}}}"><div>{PROMPT}{cursor(X)}</div></sc-if>
          </div>
{label}
        </div>
      </div>
'''

def lines(X):
    return f'            <sc-for list="{{{{ {X}.lines }}}}" as="line" hint-placeholder-count="3"><div style="color: {{{{ line.color }}}}; white-space: pre;">{{{{ line.text }}}}</div></sc-for>'

contact_out = f'''            <sc-if value="{{{{ C.l1 }}}}" hint-placeholder-val="{{{{ true }}}}"><a href="https://www.linkedin.com/in/josh-rochon" style="{LINK}">&gt; linkedin</a></sc-if>
            <sc-if value="{{{{ C.l2 }}}}" hint-placeholder-val="{{{{ true }}}}"><a href="https://github.com/joshdrochon" style="{LINK}">&gt; github</a></sc-if>
            <sc-if value="{{{{ C.l3 }}}}" hint-placeholder-val="{{{{ true }}}}"><button onClick="{{{{ copyEmail }}}}" style="{LINK}">{{{{ emailLabel }}}}</button></sc-if>'''

def card(pid, cmd, big, cap, tags, title, desc, play=None, code=None, readmore=True, body_extra="", big_html=None, code_label="Code", full=False):
    t = ("\n" + " " * 12).join(TAG.format(esc(x)) for x in tags)
    btns = []
    if play: btns.append(f'            <a href="{play[0]}" style="{PLAY}">{PLAYSVG}{play[1]}</a>')
    if readmore: btns.append(f'            <button onClick="{{{{ open.{pid} }}}}" style="{BTN}">Read more</button>')
    if code: btns.append(f'            <a href="{code}" style="{BTN}">{code_label}</a>')
    bigline = big_html if big_html else f'<div style="font-size: 30px; font-weight: 700; color: #9ECE6A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{esc(big)}</div>'
    basis = "100%" if full else CARD_BASIS
    return f'''      <article style="flex: 1 1 {basis}; min-width: 0; display: flex; flex-direction: column; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
        <div style="height: 180px; box-sizing: border-box; padding: 18px 20px; background: {DARK}; display: flex; flex-direction: column; justify-content: space-between; font-family: {M};">
          <div style="{CAP}">{esc(cmd)}</div>
          {bigline}
          <div style="{CAP}">{esc(cap)}</div>
        </div>
        <div style="padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            {t}
          </div>
          <h3 style="margin: 0; font-family: {M}; font-weight: 700; font-size: 20px; line-height: 1.2;">{esc(title)}</h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.55; color: #4B5563;">{esc(desc)}</p>
{body_extra}          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-top: 4px;">
{chr(10).join(btns)}
          </div>
        </div>
      </article>
'''

def beforeafter(a, b, unit=""):
    return f'<div style="font-size: 28px; font-weight: 700; white-space: nowrap;"><span style="color: #F7768E; text-decoration: line-through;">{a}</span> <span style="color: #A9B1D6;">→</span> <span style="color: #9ECE6A;">{b}{unit}</span></div>'

redact = f'''<div aria-label="Redacted text" role="img" style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px;"><span style="width: 90px; height: 14px; background: #3B3F5C; border-radius: 2px;"></span><span style="width: 140px; height: 14px; background: #3B3F5C; border-radius: 2px;"></span></div>
            <div style="display: flex; gap: 8px;"><span style="width: 170px; height: 14px; background: #3B3F5C; border-radius: 2px;"></span><span style="width: 50px; height: 14px; background: #3B3F5C; border-radius: 2px;"></span></div>
          </div>'''

first = (
 card("keyblaster", "$ npm test -- src/engine", "4,500+ tests", "95% coverage gate on the game engine",
      ["Desktop only", "TypeScript", "Phaser 3", "Claude API"], "KeyBlaster",
      "A typing game for kids in grades 2–5: fly from Earth to Pluto by typing the words on falling asteroids. Every AI-written sentence passes 7 checks before a child sees it.",
      play=("https://keyblaster.vercel.app", "Play now"), code="https://github.com/joshdrochon/keyblaster")
 + card("silentflow", "$ python eval.py --adapter josh", "", "word error rate · p = 0.014",
      ["#1 capstone", "Python", "PyTorch", "LoRA", "FastAPI"], "Silent Flow",
      "Reads words mouthed silently at a webcam and turns them into text. A 0.4 MB personal adapter, trained on under 3 minutes of my own video, cut word errors by about a fifth. My Gauntlet AI capstone, voted #1 by the cohort and staff.",
      big_html=beforeafter("23.3%", "18.9%"))
 + card("ship", "$ diff p95_before p95_after", "", "p95 API latency",
      ["TypeScript", "AWS", "Terraform", "OAuth", "Webhooks"], "Ship",
      "Turned a fork of the U.S. Treasury's open-source project tracker into a public developer platform with OAuth, signed webhooks and an SDK. Rebuilt all 82 AWS resources from Terraform in a drill.",
      code="https://github.com/joshdrochon/ship", big_html=beforeafter("1,276", "103", " ms"))
 + card("copilot", "$ git push   # runs the eval gate", "96/96 passed", "pass/fail rubrics across 69 eval cases",
      ["TypeScript", "LangGraph", "Claude API", "FHIR", "OpenEMR"], "Clinical Co-pilot",
      "A co-pilot for primary care physicians inside the OpenEMR health records system. It blocked any statement it couldn't trace back to the patient's record, and turned uploaded lab and intake PDFs into records a doctor reviews before filing.")
 + card("diagnostic", "$ eval --arm adversarial --n 200", "", "held the rule vs Claude Sonnet · p < 0.001",
      ["Python", "Qwen3-1.7B", "QLoRA", "Hugging Face", "Modal"], "Diagnostic Tutor",
      "A 1.7B model fine-tuned to diagnose code bugs without fixing them, so the student still does the fixing. Under adversarial pressure it held that rule 86% of the time, against 71.5% for Claude Sonnet.",
      play=("https://joshdrochon--diagnostic-tutor-ui-web.modal.run/", "Try it"),
      code="https://huggingface.co/all-the-smiles/diagnostic-tutor-qwen3-1.7b", code_label="Model",
      big_html='<div style="font-size: 28px; font-weight: 700; white-space: nowrap;"><span style="color: #9ECE6A;">86%</span> <span style="color: #A9B1D6;">vs</span> <span style="color: #F7768E;">71.5%</span></div>')
 + card("coach", "$ npm run eval:golden", "97.9%", "grader agreement on 570 checked verdicts",
      ["Next.js", "Postgres", "Claude API", "ElevenLabs"], "Coach Study",
      "A hands-free iPad study app for a fitness coach in training. It drills the training manual with spaced repetition and grades spoken practice against the required checklist. It only deploys after live evals pass in CI.")

)
lazy = (
card("whiteout", "$ npm run serve", "No engine", "Three.js · raw GLSL · hand-written physics",
      ["Game", "JavaScript", "Three.js", "GLSL"], "Whiteout Ultima",
      "An arcade snowboarding game that runs in the browser: carve, grab, grind rails and land tricks. Rendering, snow shaders and physics are all written by hand.",
      play=("https://whiteout-ultima.pages.dev", "Play now"))
 + card("labelproof", "$ pytest tests/accuracy", "", "Tier A accuracy · 175 rows",
      ["Python", "Claude API", "OCR", "Fly.io"], "LabelProof",
      "Checks alcohol label artwork against federal TTB rules and returns a per-field checklist with evidence. It recommends; the human reviewer decides. Backed by 3,585 offline tests.",
      play=("https://labelproof.fly.dev", "Try it"), code="https://github.com/joshdrochon/labelproof",
      big_html='<div style="font-size: 30px; font-weight: 700; color: #9ECE6A;">100%</div>')
 + card("oneramp", "$ attach --receipt", "1 click", "Gmail receipt → Ramp card charge",
      ["Chrome extension", "JavaScript", "Gmail API", "OAuth"], "One Ramp",
      "A Chrome extension that finds the matching receipt in Gmail for a Ramp card charge, attaches it and drafts the memo. Nothing is written to Ramp until you click. Built for my Gauntlet cohort.",
      code="https://github.com/joshdrochon/one-ramp-extension")
 + card("portfolio", "$ open josh-rochon.vercel.app", "", "Maximum call stack size exceeded",
      ["Next.js", "TypeScript", "Vitest", "Playwright"], "This Portfolio",
      "You're looking at it. Built tests-first from a written PRD, with every color and spacing value a design token. Opening it from here opens it again, which opens it again, which…",
      play=("#home", "Open it"), code="https://github.com/joshdrochon/josh-portfolio",
      big_html='<div style="font-size: 30px; font-weight: 700; color: #F7768E;">RangeError</div>')
 + card("takavay", "$ cat takavay/README.md", "", "status: building",
      ["In progress", "Nov 2026"], "Takavay",
      "Something new is in the works at Takavay. The details stay under wraps for now.",
      readmore=False, big_html=redact,
      body_extra=f'''          <div style="padding: 10px 12px; background: {DARK}; border-radius: 6px; font-family: {M}; font-size: 12px; line-height: 1.7; color: #C0CAF5;">
            <div>{PROMPT}ls takavay/</div>
            <div style="color: #F7768E;">ls: takavay/: Permission denied</div>
          </div>
''')

)

# ---- Experience: a git graph with a continuous trunk and a merged Aim branch
def commit(color, dates, org, role, note, branch=False):
    d = f'<span style="color: #E0AF68;">{esc(dates)}</span>' if dates else ''
    return f'''          <div style="position: relative; padding: 9px 0 9px 22px;">
            <span aria-hidden="true" style="position: absolute; left: -7px; top: 15px; width: 12px; height: 12px; border-radius: 50%; background: {color}; box-shadow: 0 0 0 3px {DARK};"></span>
            <div style="display: flex; flex-wrap: wrap; gap: 2px 14px; align-items: baseline;">
              {d}
              <span style="color: #FFFFFF; font-weight: 700;">{esc(org)}</span>
              <span style="color: #7AA2F7;">{esc(role)}</span>
              <span style="flex-basis: 100%; color: #A9B1D6;">{esc(note)}</span>
            </div>
          </div>
'''
experience = f'''  <!-- Experience -->
  <section id="experience" ref="{{{{ secRef.experience }}}}" style="max-width: 1240px; margin: 0 auto; padding: 0 24px 72px; box-sizing: border-box;">
    <h2 style="margin: 0 0 40px; text-align: center; font-family: {M}; font-weight: 700; font-size: clamp(28px, 4cqw, 40px); letter-spacing: -0.5px;">Experience</h2>
    <div style="max-width: 920px; margin: 0 auto; background: {DARK}; border: 1px solid #2A2B3D; border-radius: 10px; overflow: hidden; box-shadow: 3px 6px 18px rgba(0,0,0,0.22);">
{titlebar("~/career", "      ")}
      <div style="padding: 18px 22px 22px; font-family: {M}; font-size: 13px; line-height: 1.55; color: #C0CAF5;">
        <div style="margin-bottom: 12px;">{PROMPT}git log --graph --career</div>
        <div style="margin-left: 6px; border-left: 2px solid #3B3F5C;">
{commit("#9ECE6A", "Jul 2026 – Sep 2026", "Gauntlet AI", "AI Engineering Fellow", "Shipped a deployed project every week. Capstone voted #1 by the cohort and staff.")}
{commit("#7AA2F7", "Aug 2021 – Apr 2026", "Aim Consulting", "Senior Consultant, Solutions", "Senior engineer on client teams. Mentored junior consultants and wrote runbooks for live systems.")}
          <div style="position: relative; margin: 0 0 6px 22px; border-left: 2px solid #7AA2F7; border-radius: 0 0 0 10px;">
            <div aria-hidden="true" style="position: absolute; left: -24px; top: -8px; width: 22px; height: 12px; border-top: 2px solid #7AA2F7; border-right: 2px solid #7AA2F7; border-radius: 0 10px 0 0;"></div>
{commit("#7AA2F7", "Aug 2024 – Jan 2026", "Starbucks", "Senior React Engineer", "Staffing app that replaced Excel across 10,000+ stores, 100% manager adoption.")}
{commit("#7AA2F7", "Aug 2023 – Jul 2024", "Microsoft", ".NET Developer", "Moved 22+ projects off retired auth to clear a security SLA; added 100+ unit tests.")}
{commit("#7AA2F7", "Jul 2022 – Aug 2023", "BECU", "Full-Stack ASP.NET MVC Developer", "Online banking APIs and features for tens of thousands of members; on call for a major launch.")}
{commit("#7AA2F7", "Oct 2021 – May 2022", "Purple", "Frontend Developer", "Ran 5+ sale-promotion releases; co-led the Presidents' Day Sale site.")}
          </div>
{commit("#BB9AF7", "Nov 2020 – Apr 2021", "Coding Dojo", "Full-stack Python/Django certificate", "Added Python and Django to a React and .NET background.")}
{commit("#BB9AF7", "Jan 2019 – Mar 2020", "RedAwning", "Software Developer", "Owned the bookings calendar in the property manager portal; cut click lag by about a second.")}
{commit("#BB9AF7", "Jun 2018 – Dec 2018", "GIVE Volunteers", "Junior Software Developer", "Built and deployed a full-stack volunteer portal with a team of four.")}
        </div>
        <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 10px;">
          <a href="/resume.pdf" style="min-height: 44px; display: flex; align-items: center; padding: 0 16px; border-radius: 999px; border: 1px solid #565F89; color: #C0CAF5; text-decoration: none; font-size: 12px;">open resume.pdf</a>
        </div>
      </div>
    </div>
  </section>
'''

def case(cmd, big, cap, tags, title, desc, href):
    t = ("\n" + " " * 12).join(TAG.format(esc(x)) for x in tags)
    return f'''      <article style="flex: 1 1 {CASE_BASIS}; min-width: 0; display: flex; flex-direction: column; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
        <div style="height: 150px; box-sizing: border-box; padding: 18px 20px; background: {DARK}; display: flex; flex-direction: column; justify-content: space-between; font-family: {M};">
          <div style="{CAP}">{esc(cmd)}</div>
          <div style="font-size: 30px; font-weight: 700; color: #9ECE6A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{esc(big)}</div>
          <div style="{CAP}">{esc(cap)}</div>
        </div>
        <div style="padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            {t}
          </div>
          <h3 style="margin: 0; font-family: {M}; font-weight: 700; font-size: 20px; line-height: 1.2;">{esc(title)}</h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.55; color: #4B5563;">{esc(desc)}</p>
          <a href="{href}" style="align-self: flex-start; margin-top: auto; {BTN}">Read case study {ARROW}</a>
        </div>
      </article>
'''

cases = case("$ grep sessions analytics.log", "43,000+ sessions", "after rollout to 10,000+ stores",
             ["React", "GraphQL", "2025"], "Modernizing Staff Planning with React",
             "Replaced store managers' Excel staffing process for a national beverage retailer, from a 400-store pilot to full rollout.",
             "https://aimconsulting.com/insights/modernizing-staff-planning-with-react-case-study/") \
      + case("$ git diff --stat auth/", "ADAL → MSAL", "retired auth replaced to clear a security SLA",
             [".NET", "Azure.Identity", "2024"], "Compliance and Technical Debt Resolved",
             "Took over 22 legacy .NET projects nobody had maintained, rebuilt their toolchains and moved them off deprecated packages to meet a security deadline.",
             "https://aimconsulting.com/insights/compliance-technical-debt-resolved-case-study/")

# ---- Man pages (Read more). Facts only from resume + repos; see PRD.
def page(name, title, meta, tiles, sections):
    return {"name": name, "title": title, "meta": meta,
            "tiles": [{"k": k, "v": v} for k, v in tiles], "sections": sections}
def P(t, *ps): return {"title": t, "paras": [{"text": p} for p in ps], "bullets": [], "links": [], "mono": ""}
def B(t, *bs): return {"title": t, "paras": [], "bullets": [{"text": b} for b in bs], "links": [], "mono": ""}
def S(t, s): return {"title": t, "paras": [], "bullets": [], "links": [], "mono": s}
def L(t, *ls): return {"title": t, "paras": [], "bullets": [], "links": [{"label": a, "href": b} for a, b in ls], "mono": ""}

MAN = {
 "about": page("josh", "josh — senior software engineer, Seattle", "Seattle, WA · open to senior SWE roles",
   [("years shipping", "7"), ("stores on my staffing app", "10,000+"), ("legacy projects rescued", "22"), ("Gauntlet capstone", "#1")],
   [P("DESCRIPTION",
      "I build and run production web apps, APIs and cloud infrastructure. Through Aim Consulting I worked as a senior engineer on client teams at Starbucks, Microsoft, BECU and Purple.",
      "I recently completed the Gauntlet AI fellowship: a developer platform on AWS with Terraform, LLM agents gated by evals in CI, and a fine-tuned 1.7B model that beat Claude Sonnet on its target behavior, 86% to 71.5%.",
      "I use Claude Code, Cursor and Copilot every day."),
    B("HOW I WORK",
      "Measure before and after, and report the lower number when a re-measure disagrees.",
      "Gate AI work on evals in CI, the same way code is gated on tests.",
      "Mentor the next engineer and write the runbook."),
    S("STACK", "TypeScript · React · C#/.NET · Python · PostgreSQL · AWS · Terraform"),
    L("SEE ALSO", ("resume.pdf", "/resume.pdf"), ("linkedin", "https://www.linkedin.com/in/josh-rochon"), ("github", "https://github.com/joshdrochon"))]),
 "keyblaster": page("keyblaster", "keyblaster — a typing game for kids in grades 2–5", "Nerdy AI Hackathon · Sep–Oct 2026",
   [("unit tests", "4,500+"), ("engine coverage gate", "95%"), ("target success rate", "~85%"), ("AI call timeout", "1.5 s")],
   [P("DESCRIPTION",
      "Fly from Earth to Pluto by typing the words on falling asteroids. Built in TypeScript and Phaser 3 and deployed on Vercel.",
      "Difficulty adapts to hold each player's success rate near 85%: hard enough to learn from, easy enough to keep going."),
    B("DESIGN DECISIONS",
      "The model is never in the game loop. Claude writes practice sentences through a serverless function, ahead of play.",
      "Every AI sentence passes 7 checks (allowlist, shape, length, word pool, banned content, reuse, absence) before a child sees it.",
      "If a check fails or the call takes over 1.5 s, a shipped sentence is used instead, so the screen looks the same either way."),
    S("STACK", "TypeScript · Phaser 3 · Vite · Vitest · Playwright · Claude API · Vercel"),
    L("SEE ALSO", ("play it", "https://keyblaster.vercel.app"), ("code", "https://github.com/joshdrochon/keyblaster"))]),
 "silentflow": page("silent-flow", "silent-flow — turns words mouthed silently at a webcam into text", "Gauntlet AI capstone · voted #1 · Aug–Sep 2026",
   [("word error rate", "23.3% → 18.9%"), ("perfect transcripts", "31.9% → 44.9%"), ("adapter size per user", "0.4 MB"), ("training video needed", "< 3 min")],
   [P("DESCRIPTION",
      "A research prototype built on a pretrained lip-reading model. Generic lip reading varies a lot between speakers: one model's error rate ranged 2.8× across speakers. The bet was that a small adapter tuned to one person closes that gap.",
      "I trained a LoRA adapter on under 3 minutes of my own video and tested it on 69 held-out clips (p = 0.014)."),
    B("DESIGN DECISIONS",
      "Per-user LoRA adapters instead of retraining the model: 0.4 MB each, swapped in at load time.",
      "An idea only counted once it beat the baseline on held-out clips with a significance test."),
    B("BUGS",
      "Two other personalisation ideas didn't work. They're marked dead in the experiment log, with their p-values.",
      "It isn't real-time yet.",
      "My baseline error rate (6.88%) doesn't match the published 4.8%, and the README says so."),
    S("STACK", "Python · PyTorch · LoRA · MediaPipe · FastAPI · React"),
    L("SEE ALSO")]),
 "ship": page("ship", "ship — a fork of the U.S. Treasury's project tracker, made fast and opened up as a developer platform", "Gauntlet AI · Weeks 5–6 · Jul–Aug 2026",
   [("p95 API latency", "1,276 → 103 ms"), ("initial bundle", "−82%"), ("accessibility issues", "69 → 10"), ("clean container → webhook", "56 s · 20/20")],
   [P("DESCRIPTION",
      "Week 5 was a performance audit. I measured the app under 50 concurrent connections, fixed the slow queries and split the bundle, then measured again.",
      "Week 6 turned it into a public platform: an OAuth 2.0 server, HMAC-signed webhooks with retries, a dead-letter queue and replay, a rate-limited API with generated OpenAPI docs, and a TypeScript SDK.",
      "The AWS infrastructure (Elastic Beanstalk, Aurora PostgreSQL, S3, CloudFront, VPC, SSM) lives in Terraform with encrypted remote state and a monthly cost alarm."),
    B("DESIGN DECISIONS",
      "Cut the server's IAM role from full admin to least privilege, tested against the live account.",
      "Re-measured every gain and checked an untouched endpoint for drift, so the numbers aren't noise.",
      "Tore down and rebuilt all 82 AWS resources from code to prove Terraform was the real source of truth."),
    B("BUGS",
      "The rebuild drill found three defects in my own Terraform.",
      "My first accessibility number was −89.9%. On re-measure it was −85.5%, so that's the one I report."),
    S("STACK", "TypeScript · React · Express · PostgreSQL · AWS · Terraform"),
    L("SEE ALSO", ("code", "https://github.com/joshdrochon/ship"))]),
 "copilot": page("clinical-copilot", "clinical-copilot — an AI assistant in the OpenEMR chart for primary care physicians", "Gauntlet AI · Jul 2026",
   [("eval rubrics passing", "96/96"), ("eval cases", "69"), ("errors at 50 users", "0%"), ("retrieval p95", "0.34 s")],
   [P("DESCRIPTION",
      "Answers questions about the open patient chart with a citation for every claim, and turns uploaded lab PDFs and intake forms into records a doctor reviews before they're filed.",
      "A supervisor agent hands documents to two worker agents, with a strict schema and a source citation on every extracted field."),
    B("DESIGN DECISIONS",
      "A blocking check refuses any answer it can't back with a citation from the patient's record.",
      "Auth is per physician over FHIR, so the assistant only sees what that doctor can see.",
      "The eval gate runs as a git pre-push hook and also checks that no patient data reaches the logs.",
      "I red-teamed it with a separate four-agent platform: 20+ attacks across seven OWASP categories. It held against every behavioral attack."),
    S("STACK", "TypeScript · PHP · LangGraph · Claude API · Cohere RAG · FHIR · Railway"),
    L("SEE ALSO")]),
 "diagnostic": page("diagnostic-tutor", "diagnostic-tutor — a 1.7B model that diagnoses code bugs without fixing them", "Gauntlet AI · Week 7 · Aug–Oct 2026",
   [("held the rule", "86.0%"), ("Claude Sonnet 4.6", "71.5%"), ("unseen scenarios", "400"), ("model size", "1.7B")],
   [P("DESCRIPTION",
      "A Qwen3-1.7B QLoRA fine-tune built around one tutoring rule: diagnose the bug, don't repair it, so the student still does the fixing.",
      "On 200 adversarial scenarios (out of 400 unseen) it held the rule 86.0% of the time, against 71.5% for claude-sonnet-4-6 (p < 0.001) and 69.7% for gemini-3.1-pro-preview."),
    B("DESIGN DECISIONS",
      "Three versions of the weights (MVP, v3, v4), each driven by a failure found in the previous version's eval.",
      "Every comparison reports a 95% Wilson interval and a significance test, reproducible with one command and no GPU."),
    B("BUGS",
      "It ties gemini-3.7-flash (84.9%, p = 0.76). Claiming a win there wouldn't survive the arithmetic.",
      "An exchange partner found v3 only held the rule in English: 17 attacks in Chinese and Japanese broke it. v4 added 166 Chinese and Japanese training rows and repaired 96 bad English turns."),
    S("STACK", "Python · Qwen3-1.7B · QLoRA · Hugging Face · Modal"),
    L("SEE ALSO", ("try it", "https://joshdrochon--diagnostic-tutor-ui-web.modal.run/"), ("model on Hugging Face", "https://huggingface.co/all-the-smiles/diagnostic-tutor-qwen3-1.7b"))]),
 "coach": page("coach-study", "coach-study — a hands-free iPad study app for a fitness coach in training", "Oct 2026",
   [("grader agreement", "97.9%"), ("checked verdicts", "570"), ("card grading p95", "1.7 s"), ("commits in a month", "1,316")],
   [P("DESCRIPTION",
      "Drills the training manual with spaced repetition, and grades spoken practice against the required checklist, citing the manual page for each miss. Voice comes from ElevenLabs."),
    B("DESIGN DECISIONS",
      "Production only deploys from CI after paid live evals pass.",
      "A held-out eval set is sealed so only CI can open it.",
      "Failed smoke checks roll back automatically."),
    B("BUGS",
      "One run hit 97.9% agreement but had a single false pass, so the gate failed it. A false pass tells a trainee she's ready when she isn't, so one is too many."),
    S("STACK", "Next.js · React · Postgres (Neon) · Drizzle · Claude API · ElevenLabs · Vercel"),
    L("SEE ALSO")]),
 "portfolio": page("josh-portfolio", "josh-portfolio — this website, which lists itself as a project", "Nov 2026 · in build",
   [("base case", "missing"), ("call stack", "exceeded"), ("you are here", "yes")],
   [P("DESCRIPTION",
      "The site you're reading. It shows my projects as terminal windows and manual pages, and it's also one of the projects, so this page describes the page you're on.",
      "It was planned before any code: a PRD, a component map, a test plan written before each component, and a style guide where every value is a design token."),
    B("DESIGN DECISIONS",
      "Every repeated pattern is one component fed by data. One Card renders every project card, including this one.",
      "Lint blocks raw colors and sizes, and CI blocks duplicated code, so the codebase stays small."),
    B("BUGS",
      "No base case. Opening this project from this card opens this project.",
      "The base case is you closing the tab."),
    S("STACK", "Next.js · React · TypeScript · Tailwind · Vitest · Playwright · Vercel"),
    L("SEE ALSO", ("code", "https://github.com/joshdrochon/josh-portfolio"), ("josh-portfolio(1)", "#man/josh-portfolio"))]),
 "whiteout": page("whiteout-ultima", "whiteout-ultima — an arcade snowboarding game in the browser", "Gauntlet AI · 2026",
   [("game engine", "none"), ("uber tricks", "6"), ("build size", "~21 MB"), ("frame-rate target", "60 fps")],
   [P("DESCRIPTION",
      "Carve, tuck, boost, grab, grind rails and land uber tricks. Three.js renders it, the snow is raw GLSL, and the physics are written by hand.",
      "A built-in pose editor (press F) freezes the game so any object can be placed and rotated by hand."),
    B("BUGS",
      "Twice I chased a 'bug' that was really a stale cached module. The fix was a dev server that can't serve stale code.",
      "Deriving the rider's facing from mesh geometry gave numbers that passed their own checks and still looked wrong. The pose editor exists so a human eye can settle it."),
    S("STACK", "JavaScript · Three.js · GLSL · Cloudflare Pages"),
    L("SEE ALSO", ("play it", "https://whiteout-ultima.pages.dev"))]),
 "labelproof": page("labelproof", "labelproof — checks alcohol labels against federal TTB rules", "Aug 2026",
   [("Tier A accuracy", "100% · 175"), ("Tier B accuracy", "71.4% · 21"), ("cost per check", "$0.031"), ("offline tests", "3,585")],
   [P("DESCRIPTION",
      "A reviewer uploads the label artwork and the application data. LabelProof returns a per-field checklist with evidence and a recommendation. It recommends; the human decides.",
      "Built against a written PRD: 332 tickets, each traced to a requirement ID, with the regulations checked against the official CFR text."),
    B("DESIGN DECISIONS",
      "Batch mode cuts the cost to $0.018 a check.",
      "Every miss in the accuracy report is explained, with confusion matrices."),
    B("BUGS",
      "Tier B (harder labels) is 71.4% on 21 rows.",
      "The brief asked for 5 s per label. Measured p95 on the deployed site is 9.6 s, and the README says it misses the target."),
    S("STACK", "Python · Claude API · OCR · Fly.io"),
    L("SEE ALSO", ("try it", "https://labelproof.fly.dev"), ("code", "https://github.com/joshdrochon/labelproof"))]),
 "oneramp": page("one-ramp", "one-ramp — attaches Gmail receipts to Ramp card charges in one click", "Gauntlet AI cohort tool · 2026",
   [("clicks per receipt", "1"), ("Gmail access", "read-only"), ("writes without a click", "0")],
   [P("DESCRIPTION",
      "When a Ramp charge needs a receipt, One Ramp finds the matching email in Gmail, attaches it and drafts a one-line memo.",
      "Deterministic matching (vendor, exact amount, date) handles routine charges; an AI judge handles the ambiguous ones."),
    B("DESIGN DECISIONS",
      "Reads Ramp's own on-page text to find unverified charges, so cosmetic redesigns don't break it.",
      "Nothing is written to Ramp until you click Attach, and it never touches reimbursements."),
    B("BUGS",
      "Google shows an 'unverified app' screen during the pilot, so each tester has to be added by hand."),
    S("STACK", "JavaScript · Chrome Extensions · Gmail API · OAuth"),
    L("SEE ALSO", ("code", "https://github.com/joshdrochon/one-ramp-extension"))]),
}
for p in MAN.values():
    for s in p["sections"]:
        s["hasParas"] = bool(s["paras"]); s["hasBullets"] = bool(s["bullets"])
        s["hasMono"] = bool(s["mono"]); s["isLinks"] = s["title"] == "SEE ALSO"
        s["hasLinks"] = bool(s["links"]); s["noLinks"] = s["isLinks"] and not s["links"]

man_overlay = f'''  <!-- Read more: man page overlay -->
  <sc-if value="{{{{ manOpen }}}}" hint-placeholder-val="{{{{ false }}}}">
    <div onClick="{{{{ closeMan }}}}" style="position: fixed; inset: 0; z-index: 50; background: rgba(17,17,17,0.55); display: flex; justify-content: center; align-items: flex-start; padding: 48px 16px; box-sizing: border-box; overflow: hidden;">
      <div ref="{{{{ manRef }}}}" role="dialog" aria-modal="true" aria-labelledby="man-title" tabIndex="-1" onClick="{{{{ stop }}}}" onKeyDown="{{{{ manKey }}}}" style="width: 100%; max-width: 860px; max-height: calc(100vh - 96px); display: flex; flex-direction: column; background: {DARK}; border: 1px solid #2A2B3D; border-radius: 10px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.45); color: #C0CAF5; font-family: {M}; outline: none;">
        <div style="display: flex; align-items: center; gap: 6px; padding: 10px 12px; background: #1F2030; border-bottom: 1px solid #2A2B3D; flex-shrink: 0;">
          {DOTS}
          <span style="flex: 1; text-align: center; font-size: 11px; color: #A9B1D6;">man {{{{ man.name }}}}</span>
          <button onClick="{{{{ closeMan }}}}" style="min-height: 32px; padding: 0 10px; border: 1px solid #3B3F5C; border-radius: 6px; background: none; color: #C0CAF5; font: inherit; font-size: 11px; cursor: pointer;">q · close</button>
        </div>
        <div ref="{{{{ manScrollRef }}}}" onScroll="{{{{ manScroll }}}}" style="flex: 1; min-height: 0; overflow-y: auto; padding: 22px 28px 8px; font-size: 13.5px; line-height: 1.7;">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 16px; color: #A9B1D6; font-size: 12px; margin-bottom: 18px;"><span>{{{{ man.upper }}}}(1)</span><span>{{{{ man.meta }}}}</span><span>{{{{ man.upper }}}}(1)</span></div>
          <h2 style="margin: 0; font-size: 13.5px; font-weight: 700; color: #FFFFFF;">NAME</h2>
          <p id="man-title" style="margin: 2px 0 18px 28px;">{{{{ man.title }}}}</p>
          <h3 style="margin: 0; font-size: 13.5px; font-weight: 700; color: #FFFFFF;">SYNOPSIS</h3>
          <div style="margin: 6px 0 18px 28px; display: flex; flex-wrap: wrap; gap: 10px;">
            <sc-for list="{{{{ man.tiles }}}}" as="tile" hint-placeholder-count="4"><div style="padding: 10px 14px; border: 1px solid #2A2B3D; border-radius: 6px;"><div style="font-size: 11px; color: #A9B1D6;">{{{{ tile.k }}}}</div><div style="font-size: 18px; font-weight: 700; color: #9ECE6A;">{{{{ tile.v }}}}</div></div></sc-for>
          </div>
          <sc-for list="{{{{ man.sections }}}}" as="sec" hint-placeholder-count="4">
            <h3 style="margin: 0; font-size: 13.5px; font-weight: 700; color: #FFFFFF;">{{{{ sec.title }}}}</h3>
            <div style="margin: 4px 0 18px 28px;">
              <sc-if value="{{{{ sec.hasParas }}}}" hint-placeholder-val="{{{{ true }}}}"><sc-for list="{{{{ sec.paras }}}}" as="p" hint-placeholder-count="2"><p style="margin: 0 0 10px; font-family: Inter, system-ui, sans-serif; font-size: 14.5px; line-height: 1.6;">{{{{ p.text }}}}</p></sc-for></sc-if>
              <sc-if value="{{{{ sec.hasBullets }}}}" hint-placeholder-val="{{{{ false }}}}"><ul style="margin: 0; padding-left: 18px; font-family: Inter, system-ui, sans-serif; font-size: 14.5px; line-height: 1.6;"><sc-for list="{{{{ sec.bullets }}}}" as="b" hint-placeholder-count="2"><li style="margin-bottom: 6px;">{{{{ b.text }}}}</li></sc-for></ul></sc-if>
              <sc-if value="{{{{ sec.hasMono }}}}" hint-placeholder-val="{{{{ false }}}}"><p style="margin: 0; color: #E0AF68;">{{{{ sec.mono }}}}</p></sc-if>
              <sc-if value="{{{{ sec.hasLinks }}}}" hint-placeholder-val="{{{{ false }}}}"><div style="display: flex; flex-wrap: wrap; gap: 10px;"><sc-for list="{{{{ sec.links }}}}" as="l" hint-placeholder-count="2"><a href="{{{{ l.href }}}}" style="min-height: 44px; display: flex; align-items: center; padding: 0 16px; border-radius: 999px; border: 1px solid #565F89; color: #C0CAF5; text-decoration: none; font-size: 12px;">{{{{ l.label }}}}</a></sc-for></div></sc-if>
              <sc-if value="{{{{ sec.noLinks }}}}" hint-placeholder-val="{{{{ false }}}}"><p style="margin: 0; color: #A9B1D6;">private repo · walkthrough on request</p></sc-if>
            </div>
          </sc-for>
        </div>
        <div style="flex-shrink: 0; padding: 8px 28px; background: #C0CAF5; color: {DARK}; font-size: 12px;">Manual page {{{{ man.name }}}}(1) · {{{{ manPct }}}}% · j/k scroll · q quit</div>
      </div>
    </div>
  </sc-if>
'''

SOUNDBTN = f"min-height: 44px; display: flex; align-items: center; gap: 8px; padding: 0 14px; border: 1px solid #D1D5DB; border-radius: 999px; background: #FFFFFF; font-family: {M}; font-size: 12px; color: #1F2937; cursor: pointer;"
LBLA = f'          <a href="#projects" style="{LBL}">Projects</a>'
LBLB = f'          <button onClick="{{{{ open.about }}}}" style="{LBL}">About Me</button>'
LBLC = f'          <button onClick="{{{{ copyEmail }}}}" style="{LBL}">Contact</button>'
LBLR = f'          <a href="/resume.pdf" style="{LBL}">Resume</a>'

hire_lines = f'''        <sc-if value="{{{{ hire.l1 }}}}" hint-placeholder-val="{{{{ true }}}}"><button onClick="{{{{ copyEmail }}}}" style="{LINK}">&gt; {{{{ emailLabelLong }}}}</button></sc-if>
        <sc-if value="{{{{ hire.l2 }}}}" hint-placeholder-val="{{{{ true }}}}"><a href="https://www.linkedin.com/in/josh-rochon" style="{LINK}">&gt; linkedin.com/in/josh-rochon</a></sc-if>
        <sc-if value="{{{{ hire.l3 }}}}" hint-placeholder-val="{{{{ true }}}}"><a href="/resume.pdf" style="{LINK}">&gt; resume.pdf</a></sc-if>
        <sc-if value="{{{{ hire.l4 }}}}" hint-placeholder-val="{{{{ true }}}}"><div style="color: #9ECE6A;">open to senior software engineering roles</div></sc-if>'''

page_html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Josh Rochon portfolio, desktop</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0}}
</style>
</helmet>
<div style="container-type: inline-size; position: relative; width: 100%; background: #FFFFFF; color: #111111; font-family: Inter, system-ui, sans-serif;">

  <!-- Sound controls -->
  <div style="position: absolute; top: 16px; right: 16px; z-index: 10; display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
    <button onClick="{{{{ toggleClicks }}}}" aria-pressed="{{{{ clicksPressed }}}}" style="{SOUNDBTN}">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"></path><path d="M15.5 8.5a5 5 0 0 1 0 7"></path><path d="M19 5a10 10 0 0 1 0 14"></path></svg>
      <span>{{{{ clicksLabel }}}}</span>
    </button>
    <button onClick="{{{{ toggleMusic }}}}" aria-pressed="{{{{ musicPressed }}}}" style="{SOUNDBTN}">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
      <span>{{{{ musicLabel }}}}</span>
    </button>
  </div>

  <!-- Hero -->
  <section id="home" ref="{{{{ secRef.home }}}}" style="display: flex; flex-direction: column; align-items: center; padding: 88px 24px 16px; text-align: center;">
    <p style="margin: 0 0 28px; font-family: {M}; font-size: clamp(28px, 6cqw, 72px); font-weight: 700; line-height: 1.1; letter-spacing: -1px;">Senior Software Engineer</p>
    <img src="{PHOTO}" alt="Josh Rochon" style="width: clamp(180px, 22cqw, 288px); aspect-ratio: 1; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block;">
    <h1 style="margin: 22px 0 6px; font-family: {M}; font-size: 22px; font-weight: 700;">Josh Rochon</h1>
    <p style="margin: 0; font-family: {M}; font-size: 14px; color: #374151;"><span style="color: #15803D;">$</span> shipping reliable software from Seattle<span aria-hidden="true" style="display: inline-block; width: 8px; height: 16px; margin-left: 4px; vertical-align: -3px; background: #111111;"></span></p>
    <p style="margin: 8px 0 0; font-family: {M}; font-size: 13px; color: #4B5563;">Senior SWE · 7 yrs · Starbucks · Microsoft · BECU · Gauntlet AI</p>
  </section>

  <!-- Terminal row: windows type when they scroll into view, and again on hover -->
  <section aria-label="Sections" style="max-width: 1280px; margin: 0 auto; padding: 24px 24px 72px; box-sizing: border-box;">
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 28px;">

{window("P", "~/projects", lines("P"), LBLA)}{window("A", "about.md", lines("A"), LBLB)}{window("C", "contact.sh", contact_out, LBLC)}{window("R", "resume.pdf", lines("R"), LBLR)}
    </div>
  </section>

  <!-- Projects -->
  <section id="projects" ref="{{{{ secRef.projects }}}}" style="max-width: 1240px; margin: 0 auto; padding: 0 24px 72px; box-sizing: border-box;">
    <h2 style="margin: 0 0 40px; text-align: center; font-family: {M}; font-weight: 700; font-size: clamp(28px, 4cqw, 40px); letter-spacing: -0.5px;">Projects</h2>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 32px;">
{first}
      <!-- Lazy-loaded: these mount only when the visitor scrolls near them -->
      <sc-if value="{{{{ more }}}}" hint-placeholder-val="{{{{ true }}}}">
{lazy}      </sc-if>
    </div>
    <sc-if value="{{{{ notMore }}}}" hint-placeholder-val="{{{{ false }}}}">
      <div ref="{{{{ sentinelRef }}}}" style="margin: 32px auto 0; max-width: 380px; padding: 14px 18px; background: {DARK}; border-radius: 8px; font-family: {M}; font-size: 13px; color: #C0CAF5;">{PROMPT}loading 5 more projects<span aria-hidden="true" style="display: inline-block; width: 7px; height: 14px; margin-left: 4px; vertical-align: -2px; background: #C0CAF5;"></span></div>
    </sc-if>
  </section>

{experience}
  <!-- Case studies -->
  <section id="case-studies" ref="{{{{ secRef.cases }}}}" style="max-width: 1240px; margin: 0 auto; padding: 0 24px 80px; box-sizing: border-box;">
    <h2 style="margin: 0 0 8px; text-align: center; font-family: {M}; font-weight: 700; font-size: clamp(28px, 4cqw, 40px); letter-spacing: -0.5px;">Case Studies</h2>
    <p style="margin: 0 0 36px; text-align: center; font-family: {M}; font-size: 13px; color: #4B5563;">written by me, published by Aim Consulting</p>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 32px;">
{cases}    </div>
  </section>

  <!-- Footer: ./hire.sh types itself out when it scrolls into view -->
  <footer id="contact" ref="{{{{ secRef.contact }}}}" style="background: {DARK}; color: #C0CAF5; padding: 40px 24px 72px;">
    <div ref="{{{{ hireRef }}}}" style="max-width: 920px; margin: 0 auto; font-family: {M}; font-size: 14px; line-height: 1.8;">
      <div>{PROMPT}{{{{ hire.cmd }}}}<sc-if value="{{{{ hire.typing }}}}" hint-placeholder-val="{{{{ false }}}}"><span aria-hidden="true" style="display: inline-block; width: 8px; height: 15px; margin-left: 2px; vertical-align: -2px; background: #C0CAF5;"></span></sc-if></div>
{hire_lines}
      <div style="margin-top: 24px; font-size: 12px; color: #A9B1D6;">© 2026 Josh Rochon · built with Next.js</div>
    </div>
  </footer>

  <!-- tmux status bar: sticks to the bottom, tracks the section in view, doubles as navigation -->
  <nav aria-label="Sections" style="position: sticky; bottom: 0; z-index: 40; display: flex; flex-wrap: wrap; align-items: center; gap: 2px 16px; padding: 6px 14px; background: {DARK}; border-top: 1px solid #2A2B3D; font-family: {M}; font-size: 12px; color: #A9B1D6;">
    <span style="color: {DARK}; background: #9ECE6A; padding: 0 6px;">[josh]</span>
    <sc-for list="{{{{ tabs }}}}" as="tab" hint-placeholder-count="5"><a href="{{{{ tab.href }}}}" aria-current="{{{{ tab.current }}}}" style="color: {{{{ tab.color }}}}; text-decoration: none; min-height: 28px; display: flex; align-items: center;">{{{{ tab.label }}}}</a></sc-for>
    <span style="margin-left: auto;">seattle {{{{ clock }}}} · {{{{ soundStatus }}}}</span>
  </nav>

{man_overlay}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":5600}}}}'>
const MAN = {json.dumps(MAN, ensure_ascii=False).replace("'", "\\u0027")};
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    const t = {{}};
    Object.keys(this.win()).forEach((id) => {{ t[id] = 0; }});
    this.state = {{ clicks: false, music: false, hover: null, blink: true, t: t, more: false, man: null, manPct: 0,
      copied: false, hireN: 0, section: 'home', clock: this.now() }};
    this.timers = {{}};
    this.lastRun = {{}};
    this.seen = {{}};
    this.winEls = {{}};
    this.secEls = {{}};
    this.winRef = {{}};
    ['projects', 'about', 'contact', 'resume'].forEach((id) => {{ this.winRef[id] = (el) => this.observeWindow(id, el); }});
    this.secRef = {{}};
    ['home', 'projects', 'experience', 'cases', 'contact'].forEach((id) => {{ this.secRef[id] = (el) => this.observeSection(id, el); }});
    this.sentinelRef = (el) => this.observeOnce('more', el, () => {{ this.moreTimer = setTimeout(() => this.setState({{ more: true }}), 500); }});
    this.hireRef = (el) => this.observeOnce('hire', el, () => this.typeHire());
    this.manRef = (el) => {{ if (el && el !== this.manEl) {{ this.manEl = el; el.focus(); }} }};
    this.manScrollRef = (el) => {{ this.manScrollEl = el; }};
    this.opens = {{}};
    Object.keys(MAN).forEach((id) => {{ this.opens[id] = (e) => this.openMan(id, e); }});
  }}
  win() {{
    return {{
      projects: {{ cmd: 'ls projects/', out: [['keyblaster/  silent-flow/', '#E0AF68'], ['ship/  clinical-copilot/', '#E0AF68'], ['+ 7 more', '#A9B1D6']] }},
      about: {{ cmd: 'cat about.md', out: [['# Josh Rochon', '#7AA2F7'], ['Senior Software Engineer', '#C0CAF5'], ['Seattle · 7 years', '#A9B1D6']] }},
      contact: {{ cmd: './contact.sh', out: [['linkedin', ''], ['github', ''], ['email', '']] }},
      resume: {{ cmd: 'open resume.pdf', out: [['opening resume.pdf ...', '#9ECE6A'], ['2 pages · updated Nov 2026', '#A9B1D6']] }}
    }};
  }}
  now() {{
    try {{ return new Date().toLocaleTimeString('en-US', {{ hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' }}); }} catch (e) {{ return ''; }}
  }}
  total(id) {{ const w = this.win()[id]; return w.cmd.length + w.out.length * 4; }}
  componentDidMount() {{
    try {{ this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }} catch (e) {{ this.reduce = false; }}
    if (this.reduce) {{
      const t = {{}}; Object.keys(this.win()).forEach((id) => {{ t[id] = this.total(id); }});
      this.setState({{ t: t, hireN: 99 }});
    }}
    this.clockTimer = setInterval(() => this.setState({{ clock: this.now() }}), 30000);
  }}
  componentWillUnmount() {{
    [this.io, this.winIO, this.secIO].forEach((o) => o && o.disconnect());
    Object.keys(this.timers).forEach((k) => clearTimeout(this.timers[k]));
    clearTimeout(this.moreTimer); clearTimeout(this.hireTimer);
    clearInterval(this.blinkTimer); clearInterval(this.clockTimer);
    this.stopMusic();
  }}
  // ---- observers
  observeOnce(key, el, fn) {{
    if (!el || this.seen[key]) return;
    if (typeof IntersectionObserver === 'undefined') {{ this.seen[key] = true; fn(); return; }}
    const io = new IntersectionObserver((entries) => {{
      if (!entries.some((e) => e.isIntersecting) || this.seen[key]) return;
      this.seen[key] = true; io.disconnect(); fn();
    }}, {{ rootMargin: '200px' }});
    io.observe(el);
  }}
  observeWindow(id, el) {{
    if (!el || this.winEls[id] === el) return;
    this.winEls[id] = el;
    if (typeof IntersectionObserver === 'undefined') {{ this.setT(id, this.total(id)); return; }}
    if (!this.winIO) {{
      this.winIO = new IntersectionObserver((entries) => {{
        entries.forEach((e) => {{
          if (!e.isIntersecting) return;
          const wid = Object.keys(this.winEls).find((k) => this.winEls[k] === e.target);
          if (!wid) return;
          // Type when a window comes into view (phones have no hover); not more than once every 5 s.
          if (Date.now() - (this.lastRun[wid] || 0) < 5000) return;
          const order = ['projects', 'about', 'contact', 'resume'].indexOf(wid);
          this.timers['view-' + wid] = setTimeout(() => this.type(wid), 150 + Math.max(0, order) * 250);
        }});
      }}, {{ threshold: 0.6 }});
    }}
    this.winIO.observe(el);
  }}
  observeSection(id, el) {{
    if (!el || this.secEls[id] === el || typeof IntersectionObserver === 'undefined') return;
    this.secEls[id] = el;
    if (!this.secIO) {{
      this.secIO = new IntersectionObserver((entries) => {{
        entries.forEach((e) => {{
          if (!e.isIntersecting) return;
          const sid = Object.keys(this.secEls).find((k) => this.secEls[k] === e.target);
          if (sid) this.setState({{ section: sid }});
        }});
      }}, {{ rootMargin: '-45% 0px -50% 0px' }});
    }}
    this.secIO.observe(el);
  }}
  // ---- audio (placeholders; production uses ElevenLabs files)
  audio() {{
    if (!this.ctx) {{
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }}
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }}
  click() {{
    if (!this.state.clicks || !this.ctx) return;
    const C = this.ctx;
    const len = Math.floor(C.sampleRate * 0.035);
    const buf = C.createBuffer(1, len, C.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = C.createBufferSource(); src.buffer = buf;
    const f = C.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 1600; f.Q.value = 1.2;
    const g = C.createGain(); g.gain.value = 0.15;
    src.connect(f); f.connect(g); g.connect(C.destination); src.start();
  }}
  startMusic() {{
    const C = this.audio(); if (!C) return;
    const master = C.createGain(); master.gain.value = 0; master.gain.linearRampToValueAtTime(0.04, C.currentTime + 1.5);
    const lp = C.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    lp.connect(master); master.connect(C.destination);
    this.music = {{ master, oscs: [220, 261.63, 329.63, 392].map((hz, i) => {{
      const o = C.createOscillator(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = hz;
      o.detune.value = (Math.random() - 0.5) * 8; o.connect(lp); o.start(); return o;
    }}) }};
  }}
  stopMusic() {{
    if (!this.music || !this.ctx) return;
    const {{ master, oscs }} = this.music;
    master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    oscs.forEach((o) => o.stop(this.ctx.currentTime + 0.7));
    this.music = null;
  }}
  // ---- typing
  setT(id, n) {{ this.setState({{ t: Object.assign({{}}, this.state.t, {{ [id]: n }}) }}); }}
  startBlink() {{ clearInterval(this.blinkTimer); this.blinkTimer = setInterval(() => this.setState({{ blink: !this.state.blink }}), 530); }}
  enter(id) {{
    if (this.state.hover === id) return;
    this.setState({{ hover: id, blink: true }});
    this.startBlink();
    if (this.reduce || this.typing === id || Date.now() - (this.lastRun[id] || 0) < 3000) return;
    this.type(id);
  }}
  leave(id) {{
    if (this.state.hover !== id) return;
    clearInterval(this.blinkTimer);
    this.setState({{ hover: null, blink: true }});
  }}
  type(id) {{
    if (this.reduce) {{ this.setT(id, this.total(id)); return; }}
    const w = this.win()[id];
    const L = w.cmd.length;
    const total = this.total(id);
    clearTimeout(this.timers[id]);
    this.lastRun[id] = Date.now();
    this.typing = id;
    let n = 0;
    this.setT(id, 0);
    const step = () => {{
      n += 1;
      if (n <= L) this.click();
      this.setT(id, n);
      if (n < total) this.timers[id] = setTimeout(step, n < L ? 45 + Math.random() * 75 : 55);
      else if (this.typing === id) this.typing = null;
    }};
    this.timers[id] = setTimeout(step, 120);
  }}
  typeHire() {{
    if (this.reduce) {{ this.setState({{ hireN: 99 }}); return; }}
    let n = 0;
    const step = () => {{
      n += 1;
      if (n <= 9) this.click();
      this.setState({{ hireN: n }});
      if (n < 9 + 4 * 4) this.hireTimer = setTimeout(step, n < 9 ? 60 + Math.random() * 60 : 70);
    }};
    this.hireTimer = setTimeout(step, 300);
  }}
  view(id) {{
    const w = this.win()[id];
    const n = this.state.t[id];
    const L = w.cmd.length;
    const total = this.total(id);
    const typing = n > 0 && n < total;
    // Before a window has ever typed, show its finished output so nothing is empty (no layout jump).
    const fresh = !this.lastRun[id] && n === 0;
    const shown = fresh ? w.out.length : (n > L ? Math.min(w.out.length, Math.ceil((n - L) / 4)) : 0);
    const active = this.state.hover === id;
    return {{
      cmd: fresh ? w.cmd : w.cmd.slice(0, Math.min(n, L)),
      lines: w.out.slice(0, shown).map((o) => ({{ text: o[0], color: o[1] }})),
      l1: shown >= 1, l2: shown >= 2, l3: shown >= 3,
      done: fresh || n >= total,
      cursorOnCmd: !fresh && n < total,
      cursorOpacity: !active || typing || this.state.blink ? 1 : 0,
      cursorBg: active ? '#C0CAF5' : 'transparent',
      lift: active ? 'translateY(-6px)' : 'none',
      shadow: active ? '6px 14px 32px rgba(0,0,0,0.28)' : '3px 6px 18px rgba(0,0,0,0.22)',
      ref: this.winRef[id],
      enter: () => this.enter(id),
      leave: () => this.leave(id)
    }};
  }}
  // ---- man pages
  openMan(id, e) {{
    try {{ this.opener = document.activeElement; }} catch (err) {{ this.opener = null; }}
    this.manEl = null;
    this.setState({{ man: id, manPct: 0 }});
  }}
  closeMan() {{
    this.setState({{ man: null }});
    const o = this.opener; this.opener = null;
    if (o && o.focus) setTimeout(() => o.focus(), 0);
  }}
  manKey(e) {{
    const el = this.manScrollEl;
    if (e.key === 'q' || e.key === 'Escape') {{ e.preventDefault(); this.closeMan(); }}
    else if (el && (e.key === 'j' || e.key === 'ArrowDown')) {{ e.preventDefault(); el.scrollTop += 48; }}
    else if (el && (e.key === 'k' || e.key === 'ArrowUp')) {{ e.preventDefault(); el.scrollTop -= 48; }}
    else if (el && e.key === ' ') {{ e.preventDefault(); el.scrollTop += el.clientHeight - 40; }}
  }}
  manScroll(e) {{
    const el = e.currentTarget || e.target;
    const max = el.scrollHeight - el.clientHeight;
    this.setState({{ manPct: max > 0 ? Math.round(el.scrollTop / max * 100) : 100 }});
  }}
  copyEmail() {{
    const done = () => {{ this.setState({{ copied: true }}); clearTimeout(this.copyTimer); this.copyTimer = setTimeout(() => this.setState({{ copied: false }}), 2500); }};
    try {{ navigator.clipboard.writeText('joshdrochon@gmail.com').then(done, () => {{ window.location.href = 'mailto:joshdrochon@gmail.com'; }}); }}
    catch (e) {{ window.location.href = 'mailto:joshdrochon@gmail.com'; }}
  }}
  renderVals() {{
    const s = this.state;
    const m = s.man ? MAN[s.man] : null;
    const hc = './hire.sh';
    const hn = s.hireN;
    const tabs = [['home', '0:home', '#home'], ['projects', '1:projects', '#projects'], ['experience', '2:experience', '#experience'], ['cases', '3:case-studies', '#case-studies'], ['contact', '4:contact', '#contact']];
    return {{
      P: this.view('projects'), A: this.view('about'), C: this.view('contact'), R: this.view('resume'),
      more: s.more, notMore: !s.more, sentinelRef: this.sentinelRef, hireRef: this.hireRef, secRef: this.secRef,
      open: this.opens, manOpen: !!m, man: m ? Object.assign({{ upper: m.name.toUpperCase() }}, m) : {{ name: '', upper: '', meta: '', title: '', tiles: [], sections: [] }},
      manPct: s.manPct, manRef: this.manRef, manScrollRef: this.manScrollRef,
      closeMan: () => this.closeMan(), stop: (e) => e.stopPropagation(), manKey: (e) => this.manKey(e), manScroll: (e) => this.manScroll(e),
      copyEmail: () => this.copyEmail(),
      emailLabel: s.copied ? '✓ copied' : '> email',
      emailLabelLong: s.copied ? '✓ copied joshdrochon@gmail.com' : 'joshdrochon@gmail.com',
      hire: {{ cmd: hc.slice(0, Math.min(hn, hc.length)), typing: hn < hc.length + 16, l1: hn >= 11, l2: hn >= 15, l3: hn >= 19, l4: hn >= 23 }},
      tabs: tabs.map((t) => ({{ label: t[1] + (s.section === t[0] ? '*' : ''), href: t[2], color: s.section === t[0] ? '#9ECE6A' : '#A9B1D6', current: s.section === t[0] ? 'location' : 'false' }})),
      clock: s.clock,
      clicksLabel: s.clicks ? 'clicks: on' : 'clicks: off',
      musicLabel: s.music ? 'music: on' : 'music: off',
      clicksPressed: s.clicks ? 'true' : 'false',
      musicPressed: s.music ? 'true' : 'false',
      soundStatus: s.clicks || s.music ? 'sound on' : 'sound off',
      toggleClicks: () => {{ const on = !s.clicks; if (on) this.audio(); this.setState({{ clicks: on }}, () => {{ if (on) this.click(); }}); }},
      toggleMusic: () => {{ const on = !s.music; if (on) this.startMusic(); else this.stopMusic(); this.setState({{ music: on }}); }}
    }};
  }}
}}
</script>
</body>
</html>
'''
open(__import__("os").path.join(__import__("os").path.dirname(__file__), "project/Main.dc.html"), "w").write(page_html)
print("wrote", len(page_html))
