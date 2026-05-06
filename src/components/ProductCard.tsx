type ProductCardProps = {
  image: string;
  name: string;
};

export default function ProductCard({
  image,
  name,
}: ProductCardProps) {
  return (
    <article className="group space-y-4">
      <div className="overflow-hidden rounded-sm border border-secondary-300/10 bg-secondary-200 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
        <img
          src={image}
          alt={name}
          className="h-52 w-full object-contain transition duration-300 group-hover:scale-[1.03] sm:h-60"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-secondary-100">{name}</h3>
      </div>
    </article>
  );
}
