type StatCardProps = {
  label: string;
  value: string;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-secondary-300/20 bg-primary-700/50 p-5">
      <p className="text-3xl font-semibold text-secondary-200 sm:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs tracking-[0.18em] text-secondary-400 uppercase">
        {label}
      </p>
    </div>
  );
}
