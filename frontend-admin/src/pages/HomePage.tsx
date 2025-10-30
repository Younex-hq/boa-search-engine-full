import SectionCards from "@/components/SectionCards";

export default function HomePage() {
  return (
    <div className="mt-[5%] grid w-[100vw] gap-10 px-10 pb-10 md:w-[100%]">
      <div className="text-boa-blue m-auto flex w-fit flex-col items-center gap-2 font-bold md:flex-row md:text-xl">
        <span className="">Bienvenue dans </span>
        <div className="from-boa-blue to-boa-sky inline-block rounded-2xl bg-gradient-to-l p-2 text-white md:px-5 md:py-2">
          Banque of Algeria{" "}
          <span className="whitespace-nowrap sm:whitespace-normal">
            Document Search
          </span>
        </div>
        <span> panneau d’administration</span>
      </div>
      <SectionCards />
    </div>
  );
}
