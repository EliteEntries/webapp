
"use client";
import LoadinWheel from "../ui/LoadinWheel";
import Backdrop from "../ui/Backdrop";

export default function Loading() {
  return (
    <>
      <Backdrop show={true} onClicked={() => {}} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center">
        <LoadinWheel />
      </div>
    </>
  );
}
