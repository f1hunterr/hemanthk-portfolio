# Print extras (not linked from the site)

For printed copies handed over in person. HR downloads stay the plain 2-page `Hemanth-K-Resume.pdf`.

| File | What |
|---|---|
| `fig03-back-page.html` | Source of "Fig. 03 — The studio, as a system", the creative A4 back page (self-contained, QR to the portfolio) |
| `Hemanth-K-Fig03-back-page.pdf` | That page as A4 PDF |
| `Hemanth-K-Resume-PRINT-double-sided.pdf` | Print set: resume p1 · blank · resume p2 · Fig. 03, so double-sided printing puts the drawing on the back of page 2 |

Print double-sided, flip on long edge, actual size (100%).

The print set is built from the current resume PDF. After changing the resume (`npm run resume:pdf`), rebuild it: open `fig03-back-page.html` in Edge, print to PDF (A4, margins none, background graphics on), then merge resume p1, a blank page, resume p2 and that PDF in this order.
