- panning mode vs. wheel history navigation
  - analysis:
    - panning mode does scroll reset
    - locked & unexpanded
    - no scroll
    - horizontal wheel => history navigation (at least on Safari)
  - resolution:
    - during lock, activate null handler (instead of wheeleventmask == no handler)
    - null handler does only prevent-default