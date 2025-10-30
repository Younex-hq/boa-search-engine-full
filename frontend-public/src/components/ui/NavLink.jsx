export default function NavLink({ href, children }) {
  return (
    <a
      className="hover:text-boa-blue active:text-boa-gold z-10 flex w-fit cursor-pointer items-center gap-1 p-2"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
