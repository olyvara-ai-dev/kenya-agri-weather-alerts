export function AssistantEmbed() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-soft sm:p-3">
      <iframe
        src="https://udify.app/chatbot/VYJPvVRoXcgWfi03"
        title="AgriShield AI farming assistant"
        className="w-full rounded-2xl border-0"
        style={{ height: '700px', minHeight: '700px' }}
        allow="microphone; clipboard-write"
        loading="lazy"
      />
    </div>
  );
}
