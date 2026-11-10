import pathlib
import sqlite3

# 1. Add the new column to the model (only if it is not there yet)
p = pathlib.Path("models.py")
s = p.read_text(encoding="utf-8")
if "flag_reason_ar" not in s:
    s = s.replace(
        "    flag_reason = Column(Text)\n",
        "    flag_reason = Column(Text)\n    flag_reason_ar = Column(Text)\n",
    )
    p.write_text(s, encoding="utf-8")
    print("models.py updated")
else:
    print("models.py already has flag_reason_ar")

# 2. Add the column to the existing database table
con = sqlite3.connect("carepath.db")
cols = [r[1] for r in con.execute("PRAGMA table_info(cases)")]
if "flag_reason_ar" not in cols:
    con.execute("ALTER TABLE cases ADD COLUMN flag_reason_ar TEXT")
    print("database column added")

# 3. Fill in the Arabic text (synthetic demo wording)
AR = {
    "SYN-C-0001": "قاعدة تجريبية: لا توجد زيارة صحة طفل مسجّلة ضمن الفترة المتوقعة.",
    "SYN-C-0002": "قاعدة تجريبية: مؤشر النمو خارج النطاق المتوقع (قيمة اصطناعية).",
    "SYN-C-0003": "قاعدة تجريبية: زيارة صحة الطفل متأخرة.",
    "SYN-A-0001": "قاعدة تجريبية: قراءة ضغط الدم أعلى من الحد المحدد (قيمة اصطناعية).",
    "SYN-A-0002": "قاعدة تجريبية: مؤهل للفحص الشامل ولا يوجد فحص مسجّل.",
    "SYN-A-0003": "قاعدة تجريبية: مؤشرا كتلة الجسم والسكر أعلى من الحد المحدد (قيم اصطناعية).",
}
for ref, text in AR.items():
    con.execute("UPDATE cases SET flag_reason_ar=? WHERE person_ref=?", (text, ref))
con.commit()
n = con.execute("SELECT COUNT(*) FROM cases WHERE flag_reason_ar IS NOT NULL").fetchone()[0]
print(f"Arabic reasons stored for {n} cases")
con.close()