import Link from "next/link";
import Image from "next/image";

import PlayStore from "@/assets/images/playstore.svg";
import AppStore from "@/assets/images/appstore.svg";

export default function DownloadAppBtn({ platform }: { platform: string }) {
  return (
    <Link
      href={
        platform === "playstore"
          ? "https://play.google.com/store/apps/details?id=com.analogueShifts.app"
          : ""
      }
    >
      <Image src={platform === "playstore" ? PlayStore : AppStore} alt="" />
    </Link>
  );
}
