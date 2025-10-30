export default function ChartGraphique() {
  return (
    <>
      <div className="z-100 m-auto max-w-xl">
        <p className="my-2">TestCostume colors / font :</p>
        <div className="bg-boa-blue h-15 pl-2 text-yellow-300">
          bg-boa-blue #254375
        </div>
        <div className="bg-boa-gold h-15 pl-2 text-yellow-300">
          bg-boa-gold #bc9e6e
        </div>
        <br />
        <div className="bg-boa-sky h-15 pl-2 text-yellow-300">
          bg-boa-sky #4b94cf
        </div>
        <div className="bg-boa-nightSky h-15 pl-2 text-yellow-300">
          bg-boa-nightSky #063765
        </div>

        <div className="from-boa-nightSky to-boa-sky h-15 bg-gradient-to-r pl-2 text-white">
          gradient from boa-nightSky to boa-sky
        </div>

        <h1 className="text-3xl font-light text-black">font-light</h1>
        <p className="font-light text-black">font-light</p>

        <h1 className="text-3xl font-normal text-black">font-normal</h1>
        <p className="font-normal text-black">font-normal</p>
        <h1 className="text-3xl font-medium text-black">
          font-medium (default)
        </h1>
        <p className="font-medium text-black">font-medium (default)</p>

        <h1 className="text-3xl font-bold text-black">font-bold</h1>
        <p className="font-bold text-black">font-bold</p>

        <h1 className="text-3xl font-extrabold text-black">font-extrabold</h1>
        <p className="font-extrabold text-black">font-extrabold</p>

        <h1 className="text-3xl font-black text-black">font-black</h1>
        <p className="font-black text-black">font-black</p>
      </div>

      <hr className="my-10" />
    </>
  );
}
