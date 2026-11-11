import { useLang } from "@/components/LanguageProvider";
import { useT7 } from "@/lib/i18n7";

const extra: Record<"en" | "ar", Record<string, string>> = {
  en: {
    "auth.title": "Demo sign-in",
    "auth.username": "Username",
    "auth.password": "Password",
    "auth.signin": "Sign in",
    "auth.signout": "Sign out",
    "auth.signed_as": "Signed in as",
    "auth.role.clinician": "Clinician (can change statuses)",
    "auth.role.viewer": "Viewer (read-only)",
    "auth.hint": "Demo: clinician / demo-clinician, viewer / demo-viewer",
    "auth.demo_note": "Demo accounts only. Not real authentication.",
    "auth.bad": "Incorrect username or password.",
    "auth.need_login": "Sign in as the demo clinician (sidebar) to change statuses.",
    "auth.readonly": "Your demo role is read-only. Only the demo clinician can change statuses.",
    "auth.expired": "Session expired. Please sign in again.",
  },
  ar: {
    "auth.title": "تسجيل دخول تجريبي",
    "auth.username": "اسم المستخدم",
    "auth.password": "كلمة المرور",
    "auth.signin": "تسجيل الدخول",
    "auth.signout": "تسجيل الخروج",
    "auth.signed_as": "تم تسجيل الدخول باسم",
    "auth.role.clinician": "طبيب (يمكنه تغيير الحالات)",
    "auth.role.viewer": "مشاهد (للقراءة فقط)",
    "auth.hint": "تجريبي: clinician / demo-clinician و viewer / demo-viewer",
    "auth.demo_note": "حسابات تجريبية فقط. وليست مصادقة حقيقية.",
    "auth.bad": "اسم المستخدم أو كلمة المرور غير صحيحة.",
    "auth.need_login": "سجّل الدخول بحساب الطبيب التجريبي (في الشريط الجانبي) لتغيير الحالات.",
    "auth.readonly": "دورك التجريبي للقراءة فقط. لا يمكن إلا للطبيب التجريبي تغيير الحالات.",
    "auth.expired": "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
  },
};

export function useT8() {
  const { lang } = useLang();
  const base = useT7();
  return (key: string) => extra[lang][key] ?? base(key);
}
