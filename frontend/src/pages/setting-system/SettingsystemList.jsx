import React, { useState } from "react";

/**
 * SystemSettings.jsx
 * ---------------------------------------------------
 * ✔ School Profile Settings
 * ✔ Academic Year & Terms
 * ✔ Grading System
 * ✔ Attendance Rules
 * ✔ Notification Settings
 * ✔ Security Settings
 * ✔ All buttons & toggles working
 */

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global school & system preferences</p>
        </div>

        <div className="flex gap-6">
          {/* LEFT MENU */}
          <div className="w-64 bg-white rounded shadow p-4">
            <MenuItem label="School Profile" tab="school" activeTab={activeTab} setActiveTab={setActiveTab} />
            <MenuItem label="Academic Settings" tab="academic" activeTab={activeTab} setActiveTab={setActiveTab} />
            <MenuItem label="Grading System" tab="grading" activeTab={activeTab} setActiveTab={setActiveTab} />
            <MenuItem label="Attendance Rules" tab="attendance" activeTab={activeTab} setActiveTab={setActiveTab} />
            <MenuItem label="Notifications" tab="notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
            <MenuItem label="Security" tab="security" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* CONTENT */}
          <div className="flex-1 bg-white rounded shadow p-6">
            {activeTab === "school" && <SchoolProfile />}
            {activeTab === "academic" && <AcademicSettings />}
            {activeTab === "grading" && <GradingSystem />}
            {activeTab === "attendance" && <AttendanceRules />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- LEFT MENU ITEM ---------------- */
function MenuItem({ label, tab, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full text-left px-3 py-2 rounded mb-2 ${activeTab === tab ? "bg-indigo-600 text-white" : "hover:bg-gray-100"}`}
    >
      {label}
    </button>
  );
}

/* ---------------- SCHOOL PROFILE ---------------- */
function SchoolProfile() {
  const [form, setForm] = useState({ name: "ShikshaOne Public School", code: "SCH-101", phone: "9876543210", email: "info@school.com" });

  return (
    <Section title="School Profile">
      <Input label="School Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Input label="School Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
      <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
      <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      <SaveButton />
    </Section>
  );
}

/* ---------------- ACADEMIC SETTINGS ---------------- */
function AcademicSettings() {
  const [year, setYear] = useState("2025-26");
  const [terms, setTerms] = useState(["Term 1", "Term 2"]);

  return (
    <Section title="Academic Settings">
      <Input label="Academic Year" value={year} onChange={setYear} />
      <div className="mb-3">
        <label className="text-sm">Terms</label>
        {terms.map((t, i) => (
          <input key={i} value={t} onChange={(e) => {
            const updated = [...terms];
            updated[i] = e.target.value;
            setTerms(updated);
          }} className="border p-2 w-full mb-2" />
        ))}
      </div>
      <SaveButton />
    </Section>
  );
}

/* ---------------- GRADING SYSTEM ---------------- */
function GradingSystem() {
  const [grading, setGrading] = useState([
    { grade: "A", min: 90 },
    { grade: "B", min: 75 },
    { grade: "C", min: 60 },
  ]);

  return (
    <Section title="Grading System">
      {grading.map((g, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 mb-2">
          <input value={g.grade} onChange={(e) => {
            const updated = [...grading]; updated[i].grade = e.target.value; setGrading(updated);
          }} className="border p-2" />
          <input type="number" value={g.min} onChange={(e) => {
            const updated = [...grading]; updated[i].min = e.target.value; setGrading(updated);
          }} className="border p-2" />
        </div>
      ))}
      <SaveButton />
    </Section>
  );
}

/* ---------------- ATTENDANCE RULES ---------------- */
function AttendanceRules() {
  const [rules, setRules] = useState({ minPercentage: 75, allowLate: true });

  return (
    <Section title="Attendance Rules">
      <Input label="Minimum Attendance (%)" value={rules.minPercentage} onChange={(v) => setRules({ ...rules, minPercentage: v })} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={rules.allowLate} onChange={() => setRules({ ...rules, allowLate: !rules.allowLate })} /> Allow Late Marking
      </label>
      <SaveButton />
    </Section>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */
function NotificationSettings() {
  const [settings, setSettings] = useState({ sms: true, email: true, push: false });

  return (
    <Section title="Notification Settings">
      <Toggle label="SMS Notifications" checked={settings.sms} onChange={() => setSettings({ ...settings, sms: !settings.sms })} />
      <Toggle label="Email Notifications" checked={settings.email} onChange={() => setSettings({ ...settings, email: !settings.email })} />
      <Toggle label="Push Notifications" checked={settings.push} onChange={() => setSettings({ ...settings, push: !settings.push })} />
      <SaveButton />
    </Section>
  );
}

/* ---------------- SECURITY ---------------- */
function SecuritySettings() {
  const [security, setSecurity] = useState({ twoFA: false, sessionTimeout: 30 });

  return (
    <Section title="Security Settings">
      <Toggle label="Enable Two-Factor Authentication" checked={security.twoFA} onChange={() => setSecurity({ ...security, twoFA: !security.twoFA })} />
      <Input label="Session Timeout (minutes)" value={security.sessionTimeout} onChange={(v) => setSecurity({ ...security, sessionTimeout: v })} />
      <SaveButton />
    </Section>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="border p-2 w-full" />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between border p-3 rounded">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
}

function SaveButton() {
  return (
    <div className="flex justify-end">
      <button onClick={() => alert("Settings saved successfully") } className="bg-indigo-600 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  );
}
