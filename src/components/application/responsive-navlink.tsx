import Link from "next/link";

interface Params {
  href: string;
  children: any;
  onClick?: any;
}

const ResponsiveNavLink = ({ children, href, ...props }: Params) => (
  <Link
    href={href}
    {...props}
    className={`text-xl text-primary-boulder700 font-bold  focus:outline-none  `}
  >
    <b>{children}</b>
  </Link>
);

export default ResponsiveNavLink;
