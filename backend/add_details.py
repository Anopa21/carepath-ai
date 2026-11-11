import json, sqlite3

def f(en, ar):
    return {"en": en, "ar": ar}

D = {
 "SYN-C-0001": dict(completeness=70,
   indicators=[dict(k="age_group", v="3-4", u="years"), dict(k="sex", v="female")],
   factors=[f("No Well-Child Visit recorded in the expected window (synthetic).", "لا توجد زيارة صحة طفل مسجّلة ضمن الفترة المتوقعة (بيانات اصطناعية).")]),
 "SYN-C-0002": dict(completeness=85,
   indicators=[dict(k="age_group", v="5-9", u="years"), dict(k="sex", v="male"), dict(k="bmi_pct", v=96, u="percentile", hi=True)],
   factors=[f("BMI-for-age percentile above the demo threshold (synthetic value).", "مؤشر كتلة الجسم للعمر أعلى من الحد التجريبي (قيمة اصطناعية).")]),
 "SYN-C-0003": dict(completeness=60,
   indicators=[dict(k="age_group", v="1-2", u="years"), dict(k="sex", v="female"), dict(k="overdue", v=4, u="months", hi=True)],
   factors=[f("Well-Child Visit overdue beyond the demo window (synthetic).", "زيارة صحة الطفل متأخرة عن الفترة التجريبية (بيانات اصطناعية).")]),
 "SYN-A-0001": dict(completeness=83,
   indicators=[dict(k="age", v=52, u="years"), dict(k="sex", v="male"), dict(k="bmi", v=27.4, u="kg/m2"), dict(k="bp", v="152/94", u="mmHg", hi=True), dict(k="hba1c", v=5.6, u="%"), dict(k="chol", v=None)],
   factors=[f("Blood pressure above the demo threshold (synthetic value).", "ضغط الدم أعلى من الحد التجريبي (قيمة اصطناعية).")]),
 "SYN-A-0002": dict(completeness=50,
   indicators=[dict(k="age", v=47, u="years"), dict(k="sex", v="female"), dict(k="bmi", v=24.1, u="kg/m2"), dict(k="bp", v="118/76", u="mmHg"), dict(k="hba1c", v=None), dict(k="chol", v=None)],
   factors=[f("Eligible for comprehensive screening, none on record (synthetic).", "مؤهل للفحص الشامل ولا يوجد فحص مسجّل (بيانات اصطناعية).")]),
 "SYN-A-0003": dict(completeness=100,
   indicators=[dict(k="age", v=58, u="years"), dict(k="sex", v="male"), dict(k="bmi", v=33.8, u="kg/m2", hi=True), dict(k="bp", v="132/84", u="mmHg"), dict(k="hba1c", v=6.9, u="%", hi=True), dict(k="glucose", v=7.4, u="mmol/L", hi=True), dict(k="chol", v=5.9, u="mmol/L")],
   factors=[f("BMI above the demo threshold (synthetic value).", "مؤشر كتلة الجسم أعلى من الحد التجريبي (قيمة اصطناعية)."), f("Blood glucose indicators above the demo threshold (synthetic values).", "مؤشرات سكر الدم أعلى من الحد التجريبي (قيم اصطناعية).")]),
}

con = sqlite3.connect("carepath.db")
cols = [r[1] for r in con.execute("PRAGMA table_info(cases)")]
if "details_json" not in cols:
    con.execute("ALTER TABLE cases ADD COLUMN details_json TEXT")
    print("column added")
for ref, data in D.items():
    con.execute("UPDATE cases SET details_json=? WHERE person_ref=?", (json.dumps(data, ensure_ascii=False), ref))
con.commit()
print("rows with details:", con.execute("SELECT COUNT(*) FROM cases WHERE details_json IS NOT NULL").fetchone()[0])
con.close()
