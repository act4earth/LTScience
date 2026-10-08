# EcoSphere 3.14.1: first systems-check pass

October 7, 2026

This release continues the 3.13.1 branch and incorporates the already-existing 3.14 audit work. The 3.13.1 habitat toolbar layout is retained. The focus of this pass is internal consistency: chemical transport, food and energy pathways, glass compartments, reproduction, movement, oxygen recovery, and time advancement.

**Result: 26/26 automated checks passed.** This is a mechanism and numerical regression result. It does not establish ecological calibration or complete the browser acceptance checks.

## Changes in this build

| System | Confirmed issue | Correction |
| --- | --- | --- |
| Diffusion | Neighbor averaging changed total dissolved material near edges and barriers. A corner pulse of 10 became 9.7 after one diffusion operation. | Adjacent equal-volume zones exchange equal and opposite fluxes. Glass still blocks exchange. |
| Photosynthesis | A minimum carbon factor allowed oxygen production even at zero dissolved CO2. | Carbon limitation reaches zero and photosynthetic output is capped by available CO2. |
| Algae | The 3.14 recruitment term created algae in initially algae-free water. | Growth requires an existing algal population. No implicit seed bank is assumed. |
| Plant effects | Plant photosynthesis and respiration could affect water across continuous glass. | Plant chemistry is restricted to the plant's connected compartment. |
| Food placement | A patch placed beside glass also added food to adjacent cells across the divider. | Patch cells are restricted to the clicked compartment. |
| Predation | Two minnows could receive food energy from one prey item during the same update. | Dead and already-consumed prey are excluded immediately; the local prey reserve also updates after feeding. |
| Consumer resources and reproduction | Food, carrying capacity, crowding, and mates were evaluated across the whole tank. Separated fish or snails could reproduce using conditions on the other side. | These calculations use each connected compartment. Daphnia carrying capacity scales with modeled compartment volume. Fish spawning requires mature local fish and local prey. |
| Newborn placement | Averaging parental positions could put a newborn inside an obstacle. | Newborn fish begin at a parent's open-water location. |
| Movement | An animal's endpoint could jump over a thin glass wall during a large direct update. | Collision checks sample the entire movement path. Carcass horizontal drift also respects walls. |
| Refuge and probes | Vegetation on the other side could add refuge or appear in a local probe's nearby-organism context. | Refuge vegetation, shelter targets, and nearby organisms/carcasses respect compartments. |
| Low-oxygen behavior | Scud foraging/depth rules could overwrite the oxygen-seeking behavior label. | Oxygen seeking is applied after ordinary foraging and predator responses. |
| Time advancement | Zero duration advanced 0.1 hour; durations over 2 hours were truncated. | Nonpositive requests do nothing. Positive requests advance their full duration in steps of at most 0.25 hour. |

The existing model still represents biomass and energy using instructional scales. These changes do not turn it into a complete stoichiometric carbon, nitrogen, or energy budget.

## Controlled mechanism checks

The tests execute the actual engine extracted from the standalone HTML. Test-only process access is added by the harness, not by the delivered application. Scenarios use controlled initial fields, barriers, animals, and deterministic random choices where necessary. The suite includes both failure cases and positive controls, including valid fish spawning within one compartment.

| 1 | Diffusion conserves total solute in an open tank | PASS |
| 2 | Diffusion conserves solute beside a glass divider | PASS |
| 3 | Glass divider isolates chemical diffusion | PASS |
| 4 | Erasing a divider reconnects chemistry cache | PASS |
| 5 | Submerged glass compartment has no direct atmospheric exchange | PASS |
| 6 | Photosynthesis stops at zero dissolved carbon | PASS |
| 7 | Plants do not change chemistry across glass | PASS |
| 8 | Added food patches remain inside glass compartment | PASS |
| 9 | A prey item cannot feed two fish in one step | PASS |
| 10 | Separated fish cannot spawn together | PASS |
| 11 | Mature fish in one compartment can still spawn | PASS |
| 12 | Separated snails cannot borrow a mate or distant food | PASS |
| 13 | Shelter searches stay within glass compartment | PASS |
| 14 | Hypoxic grazers retain oxygen-seeking behavior | PASS |
| 15 | Clean inert substrate has no intrinsic oxygen demand | PASS |
| 16 | A 12-hour engine request matches 48 quarter-hour steps | PASS |
| 17 | Algae cannot appear spontaneously in sterile water | PASS |
| 18 | Animal movement cannot tunnel through thin glass | PASS |
| 19 | Step honors short and zero durations | PASS |
| 20 | Carcasses settle and finish decomposing | PASS |
| 21 | Detritus loading consumes O2 and declines | PASS |
| 22 | Refuge scores do not borrow vegetation across glass | PASS |
| 23 | Probe nearby-organism descriptions respect glass | PASS |
| 24 | Carcass drift cannot cross a vertical glass wall | PASS |
| 25 | Producer-rich tank recovers from low O2 as detritus declines | PASS |
| 26 | Seeded starter runs stay finite and bounded for 30 days | PASS |

## Thirty-day starter regressions

Each starter ecosystem ran for 720 elapsed hours with 0.25-hour updates. Fields were checked for finite values and declared bounds at every update; animal positions and energy were checked for finite, bounded positions.

| Seed | Final mean O2, mg/L | Minnows | Daphnia | Snails | Scuds |
| --- | ---: | ---: | ---: | ---: | ---: |
| 42 | 7.77 | 4 | 6 | 5 | 3 |
| 84 | 7.77 | 4 | 6 | 5 | 3 |
| 2606 | 7.79 | 4 | 6 | 5 | 3 |

All four consumer groups remained present in these runs. This is three seeded starter scenarios, not a claim that every constructed ecosystem will persist.

## Oxygen-recovery scenario

An animal-free tank began at 1 mg/L dissolved O2, with high detritus (0.6 relative biomass), bacteria (0.6), algae (0.8), nine ribbon plants, nitrate 15 mg/L as N, CO2 10 mg/L, 18 degrees C, maximum light, clear water, and normal surface exchange. After 14 elapsed days, mean O2 reached 9.15 mg/L and mean detritus declined to 0.0189. This demonstrates recovery in this producer-rich scenario as the organic load is consumed. It is not a prediction for all die-offs.

## Six-month reference-preset observation

The test reconstructs the actual hidden * initializer from the UI source and runs its existing seed, 2606, for 180 elapsed days. Scuds remain intentionally absent. This benchmark is separate from the 26 pass/fail checks.

| Elapsed days | Mean O2, mg/L | Minnows | Daphnia | Snails | Scuds | Plants |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 30 | 12.43 | 2 | 11 | 2 | 0 | 10 |
| 90 | 13.10 | 2 | 8 | 4 | 0 | 16 |
| 180 | 13.08 | 2 | 6 | 0 | 0 | 18 |

Mean O2 ranged from 9.04 to 13.32 mg/L. Minnows persisted throughout the run. Three findings need further work:

1. **Snail persistence:** snails were present at day 90 but absent at day 180. The model's reference preset is not demonstrated to preserve every original consumer group for six months.
2. **Bacterial persistence:** mean bacterial biomass reached zero by the first 30-day sample. Constant bacterial loss can exhaust the modeled population, after which nitrification and decomposition cannot restart without adding bacteria. The bacterial growth and loss model should be reviewed before tuning population survival.
3. **High oxygen:** late mean O2 remained near 13 mg/L. Supersaturation is possible in producer-rich water, but the magnitude, duration, mixing rate, and degassing response need review. The present run establishes bounded behavior, not physiological realism.

The displayed Stability value remains 100 even when snails disappear and bacterial biomass is zero because that score evaluates selected chemistry and abiotic conditions. Its meaning and label should be clarified in the next pass.

## Interface validation and remaining acceptance work

Both JavaScript blocks compile. Compared with 3.14, the CSS and UI JavaScript are unchanged, there are no duplicate HTML IDs or missing literal UI element references, and the build has no external script dependencies. The 3.13.1 toolbar fixes are present.

A browser runtime could not be installed in this execution environment, so responsive layout, actual canvas rendering, interactions, downloaded CSV contents, trial recording, and native fullscreen/Escape behavior were **not tested in a browser during this pass**. Source preservation is not a substitute for those checks.

The next acceptance run should cover:

- 1440 x 900 and 1366 x 768: rock drawing, toolbar scrolling, placement controls, Undo/Clear, Probe/Inspect, and workspace switching.
- Every investigation preset, the hidden * preset, Reset, Clear, Run/Pause, one-hour steps, speed changes, and all four teaching levels.
- Graph variables and comparison axes, probe readings, CSV export, trial snapshots, and stored trial data.
- Tank Focus, actual browser fullscreen, Escape, and return to the original layout.
- Performance with dense drawn habitat, many plants, and larger populations.

Then repeat the six-month reference run with multiple stochastic replicates, and review bacterial dynamics, sustained supersaturation, snail food access, and the chemistry-only stability indicator. Arbitrary diagonal or off-grid glass designs also need geometry checks: chemistry still uses the existing coarse 18 x 10 compartment grid and boundary-coverage approximation.

## Reproducibility and handoff

The source archive includes the unchanged 3.13.1 and 3.14 baselines, the revised standalone HTML, automated check scripts, raw results, and this report.

From the extracted archive's parent directory:

```bash
node ecosphere/systems_check.cjs ecosphere/ecosphere_lab_3_14_1_systems_check.html
node ecosphere/reference_check.cjs ecosphere/ecosphere_lab_3_14_1_systems_check.html
```

No third-party packages are needed for these engine checks. They do not provide browser testing.

Release HTML SHA-256: `2c1077285211acc12e20976be77dd7f32cda6d65603daa75b863bbc2c6da84ac`.
