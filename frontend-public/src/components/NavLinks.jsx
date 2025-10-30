import NavLink from "./ui/NavLink";

export default function NavLinks() {
  return (
    <ul className="flex gap-6">
      <NavLink href={"https://www.bank-of-algeria.dz/"}>
        <img
          src="/images/Logo_of_the_Bank_of_Algeria.png"
          alt="Bank of Algeria"
          className="max-h-10"
        />
      </NavLink>

      {/* <NavLink>other nav links</NavLink> */}
    </ul>
  );
}
