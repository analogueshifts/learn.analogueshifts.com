import Image from "next/image";

// GroupImages
import PersonOne from "@/assets/images/group/1.png";
import PersonTwo from "@/assets/images/group/2.png";
import PersonThree from "@/assets/images/group/3.png";

const PeopleStack = () => {
  return (
    <div
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 20px 0px" }}
      className="w-[140px] h-[67px] p-3 relative rounded-full bg-white flex"
    >
      <div className="w-11 absolute left-3 border border-white flex items-center justify-center h-11 bg-groupPersonOne rounded-full">
        <Image
          src={PersonThree}
          alt="Image of a Student"
          className="w-max h-[90%]"
        />
      </div>
      <div className="w-11 absolute left-12 border border-white flex items-center justify-center h-11 bg-groupPersonTwo rounded-full">
        <Image
          src={PersonTwo}
          alt="Image of a Student"
          className="w-max h-[90%]"
        />
      </div>
      <div className="w-11 absolute left-[84px] border border-white flex items-center justify-center h-11 bg-groupPersonThree rounded-full">
        <Image
          src={PersonOne}
          alt="Image of a Student"
          className="w-max h-[90%]"
        />
      </div>
    </div>
  );
};

export default PeopleStack;
