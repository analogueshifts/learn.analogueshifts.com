import Link from "next/link";

interface Params {
  active: boolean;
  href: string;
  children: any;
}

const NavLink = ({ active = false, href, children, ...props }: Params) => (
  <Link
    href={href}
    {...props}
    className={`large:text-base text-[13px] h-6 leading-5  relative font-medium text-primary-boulder950`}
  >
    {children}
    {active && (
      <div className="absolute bottom-0 translate-y-[100%] w-full h-1 rounded-sm bg-background-darkYellow"></div>
    )}
  </Link>
);

export default NavLink;
