// Every project, in page order (PRD §5). Copy is ported from the approved mockup; numbers carry their source.
import type { ManPageData, Project } from "./types";

export const projects: Project[] = [
  {
    "slug": "keyblaster",
    "title": "KeyBlaster",
    "card": {
      "cmd": "$ npm test -- src/engine",
      "stat": {
        "text": "4,500+ tests",
        "source": "keyblaster/README.md:89"
      },
      "caption": "95% coverage gate on the game engine",
      "tags": [
        "Desktop only",
        "TypeScript",
        "Phaser 3",
        "Claude API"
      ],
      "desc": "A typing game for kids in grades 2–5: fly from Earth to Pluto by typing the words on falling asteroids. Every AI-written sentence passes 7 checks before a child sees it."
    },
    "links": [
      {
        "kind": "play",
        "href": "https://keyblaster.vercel.app"
      },
      {
        "kind": "code",
        "href": "https://github.com/joshdrochon/keyblaster"
      }
    ],
    "man": {
      "title": "keyblaster — a typing game for kids in grades 2–5",
      "meta": "Nerdy AI Hackathon · Sep–Oct 2026",
      "tiles": [
        {
          "k": "unit tests",
          "v": "4,500+",
          "source": "keyblaster/README.md:89"
        },
        {
          "k": "engine coverage gate",
          "v": "95%",
          "source": "keyblaster/README.md:89"
        },
        {
          "k": "target success rate",
          "v": "~85%",
          "source": "keyblaster/README.md:43"
        },
        {
          "k": "AI call timeout",
          "v": "1.5 s",
          "source": "keyblaster/README.md:59"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "Fly from Earth to Pluto by typing the words on falling asteroids. Built in TypeScript and Phaser 3 and deployed on Vercel.",
            "Difficulty adapts to hold each player's success rate near 85%: hard enough to learn from, easy enough to keep going."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "The model is never in the game loop. Claude writes practice sentences through a serverless function, ahead of play.",
            "Every AI sentence passes 7 checks (allowlist, shape, length, word pool, banned content, reuse, absence) before a child sees it.",
            "If a check fails or the call takes over 1.5 s, a shipped sentence is used instead, so the screen looks the same either way."
          ]
        },
        {
          "title": "STACK",
          "mono": "TypeScript · Phaser 3 · Vite · Vitest · Playwright · Claude API · Vercel"
        }
      ]
    }
  },
  {
    "slug": "silent-flow",
    "title": "Silent Flow",
    "card": {
      "cmd": "$ python eval.py --adapter josh",
      "stat": {
        "from": "23.3%",
        "to": "18.9%",
        "source": "silentflow/EXPERIMENTS.md:16"
      },
      "caption": "word error rate · p = 0.014",
      "tags": [
        "#1 capstone",
        "Python",
        "PyTorch",
        "LoRA",
        "FastAPI"
      ],
      "desc": "Reads words mouthed silently at a webcam and turns them into text. A 0.4 MB personal adapter, trained on under 3 minutes of my own video, cut word errors by about a fifth. My Gauntlet AI capstone, voted #1 by the cohort and staff."
    },
    "links": [],
    "man": {
      "title": "silent-flow — turns words mouthed silently at a webcam into text",
      "meta": "Gauntlet AI capstone · voted #1 · Aug–Sep 2026",
      "tiles": [
        {
          "k": "word error rate",
          "v": "23.3% → 18.9%",
          "source": "silentflow/EXPERIMENTS.md:16"
        },
        {
          "k": "perfect transcripts",
          "v": "31.9% → 44.9%",
          "source": "silentflow/EXPERIMENTS.md:16"
        },
        {
          "k": "adapter size per user",
          "v": "0.4 MB",
          "source": "silentflow/README.md:57"
        },
        {
          "k": "training video needed",
          "v": "< 3 min",
          "source": "silentflow/EXPERIMENTS.md:430"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "A research prototype built on a pretrained lip-reading model. Generic lip reading varies a lot between speakers: one model's error rate ranged 2.8× across speakers. The bet was that a small adapter tuned to one person closes that gap.",
            "I trained a LoRA adapter on under 3 minutes of my own video and tested it on 69 held-out clips (p = 0.014)."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Per-user LoRA adapters instead of retraining the model: 0.4 MB each, swapped in at load time.",
            "An idea only counted once it beat the baseline on held-out clips with a significance test."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "Two other personalisation ideas didn't work. They're marked dead in the experiment log, with their p-values.",
            "It isn't real-time yet.",
            "My baseline error rate (6.88%) doesn't match the published 4.8%, and the README says so."
          ]
        },
        {
          "title": "STACK",
          "mono": "Python · PyTorch · LoRA · MediaPipe · FastAPI · React"
        }
      ]
    }
  },
  {
    "slug": "ship",
    "title": "Ship",
    "card": {
      "cmd": "$ diff p95_before p95_after",
      "stat": {
        "from": "1,276",
        "to": "103",
        "unit": "ms",
        "source": "ship/SUBMISSION.md:29"
      },
      "caption": "p95 API latency",
      "tags": [
        "TypeScript",
        "AWS",
        "Terraform",
        "OAuth",
        "Webhooks"
      ],
      "desc": "Turned a fork of the U.S. Treasury's open-source project tracker into a public developer platform with OAuth, signed webhooks and an SDK. Rebuilt all 82 AWS resources from Terraform in a drill."
    },
    "links": [
      {
        "kind": "code",
        "href": "https://github.com/joshdrochon/ship"
      }
    ],
    "man": {
      "title": "ship — a fork of the U.S. Treasury's project tracker, made fast and opened up as a developer platform",
      "meta": "Gauntlet AI · Weeks 5–6 · Jul–Aug 2026",
      "tiles": [
        {
          "k": "p95 API latency",
          "v": "1,276 → 103 ms",
          "source": "ship/SUBMISSION.md:29"
        },
        {
          "k": "initial bundle",
          "v": "−82%",
          "source": "ship/SUBMISSION.md:28"
        },
        {
          "k": "accessibility issues",
          "v": "69 → 10",
          "source": "ship/SUBMISSION.md:33"
        },
        {
          "k": "clean container → webhook",
          "v": "56 s · 20/20",
          "source": "resume"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "Week 5 was a performance audit. I measured the app under 50 concurrent connections, fixed the slow queries and split the bundle, then measured again.",
            "Week 6 turned it into a public platform: an OAuth 2.0 server, HMAC-signed webhooks with retries, a dead-letter queue and replay, a rate-limited API with generated OpenAPI docs, and a TypeScript SDK.",
            "The AWS infrastructure (Elastic Beanstalk, Aurora PostgreSQL, S3, CloudFront, VPC, SSM) lives in Terraform with encrypted remote state and a monthly cost alarm."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Cut the server's IAM role from full admin to least privilege, tested against the live account.",
            "Re-measured every gain and checked an untouched endpoint for drift, so the numbers aren't noise.",
            "Tore down and rebuilt all 82 AWS resources from code to prove Terraform was the real source of truth."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "The rebuild drill found three defects in my own Terraform.",
            "My first accessibility number was −89.9%. On re-measure it was −85.5%, so that's the one I report."
          ]
        },
        {
          "title": "STACK",
          "mono": "TypeScript · React · Express · PostgreSQL · AWS · Terraform"
        }
      ]
    }
  },
  {
    "slug": "clinical-copilot",
    "title": "Clinical Co-pilot",
    "card": {
      "cmd": "$ git push # runs the eval gate",
      "stat": {
        "text": "96/96 passed",
        "source": "openemr-base-clean/agent/eval-results/w2-latest.md:3"
      },
      "caption": "pass/fail rubrics across 69 eval cases",
      "tags": [
        "TypeScript",
        "LangGraph",
        "Claude API",
        "FHIR",
        "OpenEMR"
      ],
      "desc": "A co-pilot for primary care physicians inside the OpenEMR health records system. It blocked any statement it couldn't trace back to the patient's record, and turned uploaded lab and intake PDFs into records a doctor reviews before filing."
    },
    "links": [],
    "man": {
      "title": "clinical-copilot — an AI assistant in the OpenEMR chart for primary care physicians",
      "meta": "Gauntlet AI · Jul 2026",
      "tiles": [
        {
          "k": "eval rubrics passing",
          "v": "96/96",
          "source": "openemr-base-clean/agent/eval-results/w2-latest.md:3"
        },
        {
          "k": "eval cases",
          "v": "69",
          "source": "resume"
        },
        {
          "k": "errors at 50 users",
          "v": "0%",
          "source": "resume"
        },
        {
          "k": "retrieval p95",
          "v": "0.34 s",
          "source": "openemr-base-clean/agent/COST_AND_LATENCY.md:183"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "Answers questions about the open patient chart with a citation for every claim, and turns uploaded lab PDFs and intake forms into records a doctor reviews before they're filed.",
            "A supervisor agent hands documents to two worker agents, with a strict schema and a source citation on every extracted field."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "A blocking check refuses any answer it can't back with a citation from the patient's record.",
            "Auth is per physician over FHIR, so the assistant only sees what that doctor can see.",
            "The eval gate runs as a git pre-push hook and also checks that no patient data reaches the logs.",
            "I red-teamed it with a separate four-agent platform: 20+ attacks across seven OWASP categories. It held against every behavioral attack."
          ]
        },
        {
          "title": "STACK",
          "mono": "TypeScript · PHP · LangGraph · Claude API · Cohere RAG · FHIR · Railway"
        }
      ]
    }
  },
  {
    "slug": "diagnostic-tutor",
    "title": "Diagnostic Tutor",
    "card": {
      "cmd": "$ eval --arm adversarial --n 200",
      "stat": {
        "ours": "86%",
        "theirs": "71.5%",
        "source": "diagnostic-tutor/README.md:17"
      },
      "caption": "held the rule vs Claude Sonnet · p < 0.001",
      "tags": [
        "Python",
        "Qwen3-1.7B",
        "QLoRA",
        "Hugging Face",
        "Modal"
      ],
      "desc": "A 1.7B model fine-tuned to diagnose code bugs without fixing them, so the student still does the fixing. Under adversarial pressure it held that rule 86% of the time, against 71.5% for Claude Sonnet."
    },
    "links": [
      {
        "kind": "try",
        "href": "https://joshdrochon--diagnostic-tutor-ui-web.modal.run/"
      },
      {
        "kind": "model",
        "href": "https://huggingface.co/all-the-smiles/diagnostic-tutor-qwen3-1.7b"
      }
    ],
    "man": {
      "title": "diagnostic-tutor — a 1.7B model that diagnoses code bugs without fixing them",
      "meta": "Gauntlet AI · Week 7 · Aug–Oct 2026",
      "tiles": [
        {
          "k": "held the rule",
          "v": "86.0%",
          "source": "diagnostic-tutor/README.md:17"
        },
        {
          "k": "Claude Sonnet 4.6",
          "v": "71.5%",
          "source": "diagnostic-tutor/README.md:13"
        },
        {
          "k": "unseen scenarios",
          "v": "400",
          "source": "diagnostic-tutor/README.md:9"
        },
        {
          "k": "model size",
          "v": "1.7B",
          "source": "diagnostic-tutor/README.md:3"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "A Qwen3-1.7B QLoRA fine-tune built around one tutoring rule: diagnose the bug, don't repair it, so the student still does the fixing.",
            "On 200 adversarial scenarios (out of 400 unseen) it held the rule 86.0% of the time, against 71.5% for claude-sonnet-4-6 (p < 0.001) and 69.7% for gemini-3.1-pro-preview."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Three versions of the weights (MVP, v3, v4), each driven by a failure found in the previous version's eval.",
            "Every comparison reports a 95% Wilson interval and a significance test, reproducible with one command and no GPU."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "It ties gemini-3.7-flash (84.9%, p = 0.76). Claiming a win there wouldn't survive the arithmetic.",
            "An exchange partner found v3 only held the rule in English: 17 attacks in Chinese and Japanese broke it. v4 added 166 Chinese and Japanese training rows and repaired 96 bad English turns."
          ]
        },
        {
          "title": "STACK",
          "mono": "Python · Qwen3-1.7B · QLoRA · Hugging Face · Modal"
        }
      ]
    }
  },
  {
    "slug": "coach-study",
    "title": "Coach Study",
    "card": {
      "cmd": "$ npm run eval:golden",
      "stat": {
        "text": "97.9%",
        "source": "coach-study/CHANGES.md:53"
      },
      "caption": "grader agreement on 570 checked verdicts",
      "tags": [
        "Next.js",
        "Postgres",
        "Claude API",
        "ElevenLabs"
      ],
      "desc": "A hands-free iPad study app for a fitness coach in training. It drills the training manual with spaced repetition and grades spoken practice against the required checklist. It only deploys after live evals pass in CI."
    },
    "links": [],
    "man": {
      "title": "coach-study — a hands-free iPad study app for a fitness coach in training",
      "meta": "Oct 2026",
      "tiles": [
        {
          "k": "grader agreement",
          "v": "97.9%",
          "source": "coach-study/CHANGES.md:53"
        },
        {
          "k": "checked verdicts",
          "v": "570",
          "source": "coach-study/CHANGES.md:53"
        },
        {
          "k": "card grading p95",
          "v": "1.7 s",
          "source": "coach-study/docs/COST_AND_LATENCY.md:27"
        },
        {
          "k": "commits in a month",
          "v": "1,316",
          "source": "git log"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "Drills the training manual with spaced repetition, and grades spoken practice against the required checklist, citing the manual page for each miss. Voice comes from ElevenLabs."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Production only deploys from CI after paid live evals pass.",
            "A held-out eval set is sealed so only CI can open it.",
            "Failed smoke checks roll back automatically."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "One run hit 97.9% agreement but had a single false pass, so the gate failed it. A false pass tells a trainee she's ready when she isn't, so one is too many."
          ]
        },
        {
          "title": "STACK",
          "mono": "Next.js · React · Postgres (Neon) · Drizzle · Claude API · ElevenLabs · Vercel"
        }
      ]
    }
  },
  {
    "slug": "whiteout-ultima",
    "title": "Whiteout Ultima",
    "card": {
      "cmd": "$ npm run serve",
      "stat": {
        "text": "No engine",
        "source": "snowboard-gauntlet/README.md:4"
      },
      "caption": "Three.js · raw GLSL · hand-written physics",
      "tags": [
        "Game",
        "JavaScript",
        "Three.js",
        "GLSL"
      ],
      "desc": "An arcade snowboarding game that runs in the browser: carve, grab, grind rails and land tricks. Rendering, snow shaders and physics are all written by hand."
    },
    "links": [],
    "man": {
      "title": "whiteout-ultima — an arcade snowboarding game in the browser",
      "meta": "Gauntlet AI · 2026",
      "tiles": [
        {
          "k": "game engine",
          "v": "none",
          "source": "snowboard-gauntlet/README.md:4"
        },
        {
          "k": "uber tricks",
          "v": "6",
          "source": "snowboard-gauntlet/README.md:45"
        },
        {
          "k": "build size",
          "v": "~21 MB",
          "source": "snowboard-gauntlet/DEPLOY.md:13"
        },
        {
          "k": "frame-rate target",
          "v": "60 fps",
          "source": "snowboard-gauntlet/architecture.md:338 (target)"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "Carve, tuck, boost, grab, grind rails and land uber tricks. Three.js renders it, the snow is raw GLSL, and the physics are written by hand.",
            "A built-in pose editor (press F) freezes the game so any object can be placed and rotated by hand."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "Twice I chased a 'bug' that was really a stale cached module. The fix was a dev server that can't serve stale code.",
            "Deriving the rider's facing from mesh geometry gave numbers that passed their own checks and still looked wrong. The pose editor exists so a human eye can settle it."
          ]
        },
        {
          "title": "STACK",
          "mono": "JavaScript · Three.js · GLSL · Cloudflare Pages"
        }
      ]
    },
    "lazy": true
  },
  {
    "slug": "labelproof",
    "title": "LabelProof",
    "card": {
      "cmd": "$ pytest tests/accuracy",
      "stat": {
        "text": "100%",
        "source": "labelproof/docs/accuracy.md:24"
      },
      "caption": "Tier A accuracy · 175 rows",
      "tags": [
        "Python",
        "Claude API",
        "OCR",
        "Fly.io"
      ],
      "desc": "Checks alcohol label artwork against federal TTB rules and returns a per-field checklist with evidence. It recommends; the human reviewer decides. Backed by 3,585 offline tests."
    },
    "links": [
      {
        "kind": "try",
        "href": "https://labelproof.fly.dev"
      },
      {
        "kind": "code",
        "href": "https://github.com/joshdrochon/labelproof"
      }
    ],
    "man": {
      "title": "labelproof — checks alcohol labels against federal TTB rules",
      "meta": "Aug 2026",
      "tiles": [
        {
          "k": "Tier A accuracy",
          "v": "100% · 175",
          "source": "labelproof/docs/accuracy.md:24"
        },
        {
          "k": "Tier B accuracy",
          "v": "71.4% · 21",
          "source": "labelproof/docs/accuracy.md:24"
        },
        {
          "k": "cost per check",
          "v": "$0.031",
          "source": "labelproof/docs/cost.md:26"
        },
        {
          "k": "offline tests",
          "v": "3,585",
          "source": "labelproof/README.md:48"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "A reviewer uploads the label artwork and the application data. LabelProof returns a per-field checklist with evidence and a recommendation. It recommends; the human decides.",
            "Built against a written PRD: 332 tickets, each traced to a requirement ID, with the regulations checked against the official CFR text."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Batch mode cuts the cost to $0.018 a check.",
            "Every miss in the accuracy report is explained, with confusion matrices."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "Tier B (harder labels) is 71.4% on 21 rows.",
            "The brief asked for 5 s per label. Measured p95 on the deployed site is 9.6 s, and the README says it misses the target."
          ]
        },
        {
          "title": "STACK",
          "mono": "Python · Claude API · OCR · Fly.io"
        }
      ]
    },
    "lazy": true
  },
  {
    "slug": "one-ramp",
    "title": "One Ramp",
    "card": {
      "cmd": "$ attach --receipt",
      "stat": {
        "text": "1 click",
        "source": "one-ramp-extension/README.md:5"
      },
      "caption": "Gmail receipt → Ramp card charge",
      "tags": [
        "Chrome extension",
        "JavaScript",
        "Gmail API",
        "OAuth"
      ],
      "desc": "A Chrome extension that finds the matching receipt in Gmail for a Ramp card charge, attaches it and drafts the memo. Nothing is written to Ramp until you click. Built for my Gauntlet cohort."
    },
    "links": [
      {
        "kind": "code",
        "href": "https://github.com/joshdrochon/one-ramp-extension"
      }
    ],
    "man": {
      "title": "one-ramp — attaches Gmail receipts to Ramp card charges in one click",
      "meta": "Gauntlet AI cohort tool · 2026",
      "tiles": [
        {
          "k": "clicks per receipt",
          "v": "1",
          "source": "one-ramp-extension/README.md:5"
        },
        {
          "k": "Gmail access",
          "v": "read-only",
          "source": "one-ramp-extension/README.md:29"
        },
        {
          "k": "writes without a click",
          "v": "0",
          "source": "one-ramp-extension/README.md:6"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "When a Ramp charge needs a receipt, One Ramp finds the matching email in Gmail, attaches it and drafts a one-line memo.",
            "Deterministic matching (vendor, exact amount, date) handles routine charges; an AI judge handles the ambiguous ones."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Reads Ramp's own on-page text to find unverified charges, so cosmetic redesigns don't break it.",
            "Nothing is written to Ramp until you click Attach, and it never touches reimbursements."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "Google shows an 'unverified app' screen during the pilot, so each tester has to be added by hand."
          ]
        },
        {
          "title": "STACK",
          "mono": "JavaScript · Chrome Extensions · Gmail API · OAuth"
        }
      ]
    },
    "lazy": true
  },
  {
    "slug": "josh-portfolio",
    "title": "This Portfolio",
    "card": {
      "cmd": "$ open josh-rochon.vercel.app",
      "stat": {
        "error": "RangeError",
        "source": "joke"
      },
      "caption": "Maximum call stack size exceeded",
      "tags": [
        "Next.js",
        "TypeScript",
        "Vitest",
        "Playwright"
      ],
      "desc": "You're looking at it. Built tests-first from a written PRD, with every color and spacing value a design token. Opening it from here opens it again, which opens it again, which…"
    },
    "links": [
      {
        "kind": "open",
        "href": "#home"
      },
      {
        "kind": "code",
        "href": "https://github.com/joshdrochon/josh-portfolio"
      }
    ],
    "man": {
      "title": "josh-portfolio — this website, which lists itself as a project",
      "meta": "Nov 2026 · in build",
      "tiles": [
        {
          "k": "base case",
          "v": "missing",
          "source": "joke"
        },
        {
          "k": "call stack",
          "v": "exceeded",
          "source": "joke"
        },
        {
          "k": "you are here",
          "v": "yes",
          "source": "joke"
        }
      ],
      "sections": [
        {
          "title": "DESCRIPTION",
          "paras": [
            "The site you're reading. It shows my projects as terminal windows and manual pages, and it's also one of the projects, so this page describes the page you're on.",
            "It was planned before any code: a PRD, a component map, a test plan written before each component, and a style guide where every value is a design token."
          ]
        },
        {
          "title": "DESIGN DECISIONS",
          "bullets": [
            "Every repeated pattern is one component fed by data. One Card renders every project card, including this one.",
            "Lint blocks raw colors and sizes, and CI blocks duplicated code, so the codebase stays small."
          ]
        },
        {
          "title": "BUGS",
          "bullets": [
            "No base case. Opening this project from this card opens this project.",
            "The base case is you closing the tab."
          ]
        },
        {
          "title": "STACK",
          "mono": "Next.js · React · TypeScript · Tailwind · Vitest · Playwright · Vercel"
        }
      ]
    },
    "lazy": true
  },
  {
    "slug": "takavay",
    "title": "Takavay",
    "card": {
      "cmd": "$ cat takavay/README.md",
      "stat": {
        "redacted": true,
        "source": "n/a"
      },
      "caption": "status: building",
      "tags": [
        "In progress",
        "Nov 2026"
      ],
      "desc": "Something new is in the works at Takavay. The details stay under wraps for now."
    },
    "links": [],
    "lazy": true,
    "teaser": {
      "cmd": "ls takavay/",
      "error": "ls: takavay/: Permission denied"
    }
  }
];

export const aboutPage: ManPageData = {
  "title": "josh — software engineer, snowboarder, retro gamer",
  "meta": "Seattle, WA · open to senior SWE roles",
  "tiles": [
    {
      "k": "years shipping",
      "v": "7",
      "source": "resume (7+ years)"
    },
    {
      "k": "Australian Shepherds",
      "v": "1 (Howl)",
      "source": "Josh, 2026-11-06"
    },
    {
      "k": "favorite run in WA",
      "v": "Hogsback",
      "source": "Josh, 2026-11-06"
    },
    {
      "k": "Gauntlet capstone",
      "v": "#1",
      "source": "resume"
    }
  ],
  "sections": [
    {
      "title": "DESCRIPTION",
      "paras": [
        "I wrote my first line of code because I wanted to make my own video games. I still love games, mostly retro ones, and I still make them: KeyBlaster, up in Projects, is a typing game for kids.",
        "These days I build and run web apps, APIs and cloud infrastructure. Through Aim Consulting I worked on teams at Starbucks, Microsoft, BECU and Purple, and I recently finished the Gauntlet AI fellowship."
      ]
    },
    {
      "title": "OFF THE CLOCK",
      "bullets": [
        "Dog dad to Howl, an Australian Shepherd named after Howl's Moving Castle.",
        "Snowboarding. My favorite run in Washington is Hogsback Express at Stevens Pass.",
        "Reading, writing and traveling.",
        "Movies. The latest one I loved was Wildwood.",
        "A sucker for the light rail."
      ]
    },
    {
      "title": "HOW I WORK",
      "bullets": [
        "Measure before and after, and report the lower number when a re-measure disagrees.",
        "Mentor the next engineer and write the runbook."
      ]
    }
  ],
  "slug": "josh",
  "seeAlso": [
    {
      "label": "Resume",
      "href": "/resume.pdf"
    },
    {
      "label": "LinkedIn",
      "href": "https://www.linkedin.com/in/josh-rochon"
    },
    {
      "label": "GitHub",
      "href": "https://github.com/joshdrochon"
    }
  ]
};
