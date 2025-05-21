import { HelpSearchIcon } from "@/constants/icons";

export default function Hero() {
  return (
    <div className="bg-[url('/main.png')] bg-cover bg-center">
      <div className="flex justify-center w-full lg:max-w-[980px] xl:max-w-[1300px] mx-auto px-3 lg:px-0 py-[50px] lg:py-[52px]">
        <div className="text-center">
          <p className="text-lg lg:text-[32px] leading-[100%] text-[#555555] font-semibold">
            How Can We Help You?{" "}
          </p>
          <div className="mt-6 w-[310px] lg:w-[500px] flex rounded-lg justify-between items-center border-[1px] border-[#EAEAEA] h-[40px] px-4">
            <input type="text" className=" bg-transparent w-full h-full placeholder-[#555555] text-[14px]  outline-none" placeholder="Search"/>
            <HelpSearchIcon/>
          </div>
        </div>
      </div>
    </div>
  );
}
