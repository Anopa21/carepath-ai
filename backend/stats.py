import os
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from models import Case

THRESHOLD = int(os.getenv("SMALL_CELL_THRESHOLD", "10"))
DEMO_ORIGINS = {"synthetic", "simulated"}
FIELDS = ["population_group", "flag_type", "priority", "status"]

router = APIRouter()


def make_cell(key, items):
    n = len(items)
    strict = any((i.data_origin or "synthetic") not in DEMO_ORIGINS for i in items)
    small = 0 < n < THRESHOLD
    suppressed = strict and small
    return {
        "key": key,
        "value": None if suppressed else n,
        "suppressed": suppressed,
        "secondary": False,
        "demo_below_threshold": (not strict) and small,
        "origin": "measured" if strict else "synthetic",
    }


@router.get("/stats/counts")
def counts(by: str, db: Session = Depends(get_db)):
    if by not in FIELDS:
        raise HTTPException(status_code=400, detail=f"'by' must be one of {FIELDS}.")
    rows = db.query(Case).all()
    groups = defaultdict(list)
    for r in rows:
        groups[getattr(r, by)].append(r)

    cells = [make_cell(k, v) for k, v in groups.items()]
    sizes = {k: len(v) for k, v in groups.items()}
    total = make_cell("total", rows)

    # Complementary suppression: one hidden cell plus a visible total would
    # let someone subtract the other cells to recover it, so hide one more.
    hidden = [c for c in cells if c["suppressed"]]
    if len(hidden) == 1 and not total["suppressed"]:
        candidates = [
            c for c in cells
            if not c["suppressed"] and c["origin"] == "measured" and sizes[c["key"]] > 0
        ]
        if candidates:
            nxt = min(candidates, key=lambda c: sizes[c["key"]])
            nxt["value"] = None
            nxt["suppressed"] = True
            nxt["secondary"] = True

    return {"by": by, "threshold": THRESHOLD, "total": total, "cells": cells}


@router.get("/stats/crosstab")
def crosstab(rows: str, cols: str, db: Session = Depends(get_db)):
    if rows not in FIELDS or cols not in FIELDS or rows == cols:
        raise HTTPException(status_code=400, detail=f"'rows' and 'cols' must be two different fields from {FIELDS}.")
    data = db.query(Case).all()
    grid = defaultdict(lambda: defaultdict(list))
    row_keys, col_keys = [], []
    for r in data:
        rk, ck = getattr(r, rows), getattr(r, cols)
        if rk not in row_keys:
            row_keys.append(rk)
        if ck not in col_keys:
            col_keys.append(ck)
        grid[rk][ck].append(r)

    out = []
    for rk in row_keys:
        cells = [make_cell(ck, grid[rk].get(ck, [])) for ck in col_keys]
        sizes = {ck: len(grid[rk].get(ck, [])) for ck in col_keys}
        # Complementary suppression within the row.
        if len([c for c in cells if c["suppressed"]]) == 1:
            cands = [
                c for c in cells
                if not c["suppressed"] and c["origin"] == "measured" and sizes[c["key"]] > 0
            ]
            if cands:
                nxt = min(cands, key=lambda c: sizes[c["key"]])
                nxt["value"] = None
                nxt["suppressed"] = True
                nxt["secondary"] = True
        out.append({"key": rk, "cells": cells})
    return {"threshold": THRESHOLD, "col_keys": col_keys, "data": out}
