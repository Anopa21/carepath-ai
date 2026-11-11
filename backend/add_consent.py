import sqlite3

con = sqlite3.connect("carepath.db")
cols = [r[1] for r in con.execute("PRAGMA table_info(cases)")]
add = {
    "consent_status": "TEXT DEFAULT 'not_recorded'",
    "preferred_language": "TEXT DEFAULT 'ar'",
    "preferred_channel": "TEXT DEFAULT 'none'",
    "consent_updated_by": "TEXT",
    "consent_updated_at": "TEXT",
}
for name, ddl in add.items():
    if name not in cols:
        con.execute(f"ALTER TABLE cases ADD COLUMN {name} {ddl}")
        print("column added:", name)

SEED = {
    "SYN-C-0001": ("consented", "ar", "sms"),
    "SYN-C-0002": ("not_recorded", "ar", "none"),
    "SYN-C-0003": ("declined", "ar", "none"),
    "SYN-A-0001": ("consented", "en", "email"),
    "SYN-A-0002": ("not_recorded", "ar", "none"),
    "SYN-A-0003": ("consented", "ar", "phone"),
}
for ref, (s, l, ch) in SEED.items():
    con.execute(
        "UPDATE cases SET consent_status=?, preferred_language=?, preferred_channel=? WHERE person_ref=?",
        (s, l, ch, ref),
    )
con.commit()
print("rows seeded:", con.execute("SELECT COUNT(*) FROM cases WHERE consent_status IS NOT NULL").fetchone()[0])
con.close()
